import { ReactNode } from 'react';


export type SectionData = {
    tagline?: string;
    header?: string;
    description?: string;
    asset?: ReactNode;
    features?: SectionData[];
    ctas?: { label: string; href: string; }[];
};
