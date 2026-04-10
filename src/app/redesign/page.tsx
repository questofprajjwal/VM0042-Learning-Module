/**
 * Placeholder homepage for the redesign tree.
 *
 * Temporary Phase 1 landing that links to the component showcase.
 * Replaced in Phase 2 with the full new homepage.
 */

import Link from 'next/link';
import {
  RedesignNav,
  RedesignFooter,
  LightSection,
  DarkSection,
  CategoryLabel,
  SectionHeading,
  RedesignButton,
  Stat,
} from '@/components/redesign';

export const metadata = {
  title: 'Redesign Preview',
};

export default function RedesignHomePlaceholder() {
  return (
    <>
      <RedesignNav />
      <LightSection variant="pale" padding="xl" glow className="min-h-[85vh] flex items-center">
        <div className="pt-20 max-w-3xl">
          <CategoryLabel>Phase 1 Complete</CategoryLabel>
          <SectionHeading size="hero" tone="dark" className="mt-6">
            Design system ready.
          </SectionHeading>
          <p className="mt-8 text-lg text-gt-text-dim leading-relaxed max-w-xl">
            The Greentryst component library is in place, built around
            the brand palette you use for LinkedIn. Visit the component
            showcase to see everything in homepage context.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <RedesignButton href="/redesign/components" variant="primary" size="lg">
              View Component Showcase
            </RedesignButton>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-4 text-sm text-gt-text-dim hover:text-gt-medium transition-colors"
            >
              Back to current site
            </Link>
          </div>

          <div className="mt-20 pt-10 border-t border-gt-medium/10 grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat value="22+" label="Courses" />
            <Stat value="470+" label="Lessons" />
            <Stat value="80+" label="Source Documents" />
            <Stat value="100%" label="Sourced & Verified" />
          </div>
        </div>
      </LightSection>
      <RedesignFooter />
    </>
  );
}
