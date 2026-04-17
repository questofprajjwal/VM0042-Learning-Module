/**
 * Surface 1 (alternate) - Emission Factors home / brutalist variant.
 *
 * Parallel front-end to `/tools/emission-factors`. Keeps the same
 * downstream sections (stat strip, methodology demo, FAQ) but opens with a
 * brutalist single-number hero and a departure-board section beneath it.
 * Lives side-by-side with the original so design decisions can be compared
 * end to end.
 */

import type { Metadata } from 'next';
import { LightSection } from '@/components/redesign';
import { EFAltHero } from '../_components/EFAltHero';
import { EFDepartureBoard } from '../_components/EFDepartureBoard';
import { EFStatStrip } from '../_components/EFStatStrip';
import { EFMethodologyDemo } from '../_components/EFMethodologyDemo';
import { EFFaqAccordion } from '../_components/EFFaqAccordion';

export const metadata: Metadata = {
  title: 'Emission Factors (alt)',
  description:
    'One number at a time. A reference library of greenhouse-gas emission factors with full provenance, citation formats, and vintage tracking.',
};

export default function EmissionFactorsAltPage() {
  return (
    <>
      <div
        className="relative w-full"
        style={{
          backgroundImage:
            'linear-gradient(180deg, #18181B 0%, #1A201D 55%, #1B2A25 100%)',
        }}
      >
        <EFAltHero />
        <EFDepartureBoard />
      </div>

      <LightSection padding="sm" variant="white">
        <EFStatStrip />
      </LightSection>

      <LightSection padding="lg" variant="pale">
        <EFMethodologyDemo />
      </LightSection>

      <LightSection padding="lg" variant="white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs uppercase tracking-[0.12em] text-gt-text-dim">
            Common questions
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-gt-tight text-gt-text">
            What practitioners ask first.
          </h2>
        </div>
        <div className="mt-12">
          <EFFaqAccordion />
        </div>
      </LightSection>
    </>
  );
}
