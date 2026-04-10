/**
 * Greentryst Redesign Component Library
 *
 * Barrel export for all redesign components. Import from here:
 *   import { RedesignNav, DarkUICard, SectionHeading } from '@/components/redesign';
 *
 * See stitch-output/GREENTRYST_DESIGN_BIBLE.md for the complete design
 * language specification.
 */

export { cn } from '@/components/redesign/lib/cn';

// Primitives
export { CategoryLabel } from './CategoryLabel';
export type { CategoryLabelProps } from './CategoryLabel';

export { SectionHeading } from './SectionHeading';
export type { SectionHeadingProps } from './SectionHeading';

export { RedesignButton } from './RedesignButton';
export type { RedesignButtonProps } from './RedesignButton';

export { StatBadge } from './StatBadge';
export type { StatBadgeProps } from './StatBadge';

export { Stat } from './Stat';
export type { StatProps } from './Stat';

// Section wrappers
export { DarkSection } from './DarkSection';
export type { DarkSectionProps } from './DarkSection';

export { LightSection } from './LightSection';
export type { LightSectionProps } from './LightSection';

// Signature components
export { RedesignNav } from './RedesignNav';
export type { RedesignNavProps } from './RedesignNav';

export { RedesignFooter } from './RedesignFooter';
export type { RedesignFooterProps } from './RedesignFooter';

export { DarkUICard } from './DarkUICard';
export type { DarkUICardProps } from './DarkUICard';

export { PricingCard } from './PricingCard';
export type { PricingCardProps } from './PricingCard';
