import { Typography } from '@signalco/ui/Typography';
import type { ColorPaletteProp } from '@signalco/ui/theme';
import { Stack } from '@signalco/ui/Stack';
import { Chip } from '@signalco/ui/Chip';
import { Card } from '@signalco/ui/Card';
import ChannelLogo from './ChannelLogo';

type ChannelGalleryItemProps = {
    id: string;
    label: string;
    planned?: boolean;
    hrefFunc?: (id: string) => string
}

function ChannelGalleryItemChip(props: { label: string, color: ColorPaletteProp }) {
    return (
        <div style={{ position: 'absolute', right: 8, top: 8 }}>
            <Chip size="sm" variant="solid" color={props.color}>{props.label}</Chip>
        </div>
    );
}

export default function ChannelGalleryItem(props: ChannelGalleryItemProps) {
    const { id, label, planned, hrefFunc } = props;

    return (
        <Card
            className="h-full"
            href={hrefFunc ? hrefFunc(id) : `/channels/${id}`}
        >
            {planned && <ChannelGalleryItemChip label="Soon" color="neutral" />}
            {/* {!planned && <ChannelGalleryItemChip label="New" color="info" />} */}
            <Stack alignItems="center" justifyContent="center" style={{ height: '100%', width: '100%' }} spacing={2}>
                <ChannelLogo channelName={id} label={label} />
                <Typography textAlign="center">{label}</Typography>
            </Stack>
        </Card>
    );
}
