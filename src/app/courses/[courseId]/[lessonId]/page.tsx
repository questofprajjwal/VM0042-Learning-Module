import { getCourse, getQuiz, getLessonNavContext, getLessonStaticParams, getModuleForLesson } from '@/lib/courses';
import { urlToLessonId, lessonIdToUrl } from '@/lib/url-helpers';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getMDXComponents } from '@/components/content/mdx-components';
import { stripMdx } from '@/lib/reading-time';
import LessonClient from './_components/LessonClient';
import type { Metadata } from 'next';

const siteUrl = 'https://sustainabilityacademy.vercel.app';

interface Props {
  params: { courseId: string; lessonId: string };
}

export async function generateStaticParams() {
  return getLessonStaticParams();
}

/** Extract the first ~155 characters of plain text from MDX content for meta description. */
function getLessonSnippet(courseId: string, lessonId: string): string {
  const contentPath = join(process.cwd(), 'src', 'content', courseId, 'lessons', `${lessonId}.mdx`);
  if (!existsSync(contentPath)) return '';
  const raw = readFileSync(contentPath, 'utf-8');
  const plain = stripMdx(raw);
  if (plain.length <= 155) return plain;
  return plain.slice(0, 152).replace(/\s+\S*$/, '') + '...';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = getCourse(params.courseId);
  const lessonId = urlToLessonId(params.lessonId);
  const navCtx = getLessonNavContext(course, lessonId);
  const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
  const title = lesson?.title ?? lessonId;

  const snippet = getLessonSnippet(params.courseId, lessonId);
  const description = snippet
    || (navCtx
      ? `${course.title}: ${navCtx.moduleTitle}, lesson ${navCtx.lessonIndex} of ${navCtx.moduleLessonCount}. Free sustainability education.`
      : `${course.title}: ${title}. Free sustainability education.`);

  const pageUrl = `${siteUrl}/courses/${params.courseId}/${params.lessonId}`;

  return {
    title: `${title} - ${course.title}`,
    description,
    openGraph: {
      title: `${title} - ${course.title}`,
      description,
      url: pageUrl,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${title} - ${course.title}`,
      description,
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default function LessonPage({ params }: Props) {
  const { courseId, lessonId: urlLessonId } = params;
  const course = getCourse(courseId);
  const lessonId = urlToLessonId(urlLessonId);

  const contentPath = join(process.cwd(), 'src', 'content', courseId, 'lessons', `${lessonId}.mdx`);
  const rawContent = existsSync(contentPath) ? readFileSync(contentPath, 'utf-8') : '';
  // Strip the MDX comment header line
  const mdxSource = rawContent.replace(/^\{\/\*.*?\*\/\}\n\n/, '');

  const quiz = getQuiz(courseId, lessonId);
  const navCtx = getLessonNavContext(course, lessonId);
  const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
  const mod = getModuleForLesson(course, lessonId);

  // ── JSON-LD: LearningResource (Article) ──
  const snippet = getLessonSnippet(courseId, lessonId);
  const pageUrl = `${siteUrl}/courses/${courseId}/${urlLessonId}`;
  const courseUrl = `${siteUrl}/courses/${courseId}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson?.title ?? lessonId,
    description: snippet || `${lesson?.title ?? lessonId} - ${course.title}`,
    url: pageUrl,
    isAccessibleForFree: true,
    inLanguage: 'en',
    learningResourceType: 'lesson',
    timeRequired: lesson?.readingMinutes ? `PT${lesson.readingMinutes}M` : undefined,
    isPartOf: {
      '@type': 'Course',
      name: course.title,
      description: course.description,
      url: courseUrl,
      provider: {
        '@type': 'Organization',
        name: 'Green Tryst - Sustainability Academy',
        url: siteUrl,
      },
    },
    author: {
      '@type': 'Organization',
      name: 'Green Tryst - Sustainability Academy',
      url: siteUrl,
    },
  };

  // ── JSON-LD: BreadcrumbList ──
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: course.title,
        item: courseUrl,
      },
      ...(mod ? [{
        '@type': 'ListItem',
        position: 3,
        name: mod.title,
      }] : []),
      {
        '@type': 'ListItem',
        position: mod ? 4 : 3,
        name: lesson?.title ?? lessonId,
        item: pageUrl,
      },
    ],
  };

  // ── JSON-LD: FAQPage from quiz questions ──
  const faqJsonLd = quiz.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: quiz
      .filter((q): q is typeof q & { explanation: string } => 'explanation' in q && typeof q.explanation === 'string' && q.explanation.length > 0)
      .map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: q.explanation,
        },
      })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && faqJsonLd.mainEntity.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <LessonClient
        courseId={courseId}
        lessonId={lessonId}
        lessonMeta={lesson ?? { id: lessonId, title: lessonId }}
        quiz={quiz}
        navCtx={navCtx}
        courseColor={course.color}
      >
        <MDXRemote source={mdxSource} components={getMDXComponents()} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </LessonClient>
    </>
  );
}
