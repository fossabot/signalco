import { Typography } from '@signalco/ui-primitives/Typography';
import { slug } from '@signalco/js';
import { SectionData } from './SectionData';


export function Description1({ tagline, header, description }: Pick<SectionData, 'tagline' | 'header' | 'description'>) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Typography level="body1" tertiary component="span" semiBold>{tagline}</Typography>
                <Typography level="h2" id={slug(header)}>{header}</Typography>
            </div>
            <Typography>{description}</Typography>
        </div>
    );
}
