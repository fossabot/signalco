import { Typography } from '@signalco/ui/Typography';
import { Stack } from '@signalco/ui/Stack';
import { NavigatingButton } from '@signalco/ui/NavigatingButton';
import { Card } from '@signalco/ui/Card';
import { KnownPages } from '../../src/knownPages';

export default function CtaSection() {
    return (
        <Card className="py-8">
            <Stack alignItems="center" spacing={4}>
                <Typography level="h4" component="p">Automate your life</Typography>
                <Typography>Focus on things that matter to you.</Typography>
                <Stack spacing={1}>
                    <NavigatingButton href={KnownPages.App} size="lg">Start now for free</NavigatingButton>
                    <Typography level="body2" textAlign="center">No credit card required</Typography>
                </Stack>
            </Stack>
        </Card>
    );
}
