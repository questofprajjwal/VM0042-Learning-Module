import type { ReactNode } from 'react';

export const metadata = {
  title: 'IFRS S2 Gap Assessment',
  description:
    'Structured self-check against IFRS S2 disclosure clauses. Live gap dashboard and deterministic draft disclosures, authored by the Climate Disclosure Desk.',
  alternates: { canonical: '/tools/ifrs-s2-gap-assessment' },
  openGraph: {
    title: 'IFRS S2 Gap Assessment',
    description:
      'Structured self-check against IFRS S2 disclosure clauses. Live gap dashboard and deterministic draft disclosures.',
    url: '/tools/ifrs-s2-gap-assessment',
  },
};

export default function AssessorLayout({ children }: { children: ReactNode }) {
  return children;
}
