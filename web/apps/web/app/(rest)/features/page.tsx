import { Stack } from '@signalco/ui/Stack';
import { Link } from '@signalco/ui/Link';

export default function FeaturesPage() {
    return (
        <Stack spacing={1}>
            <Link href="/features/spaces">Spaces</Link>
            <Link href="/features/processes">Processes</Link>
        </Stack>
    );
}
