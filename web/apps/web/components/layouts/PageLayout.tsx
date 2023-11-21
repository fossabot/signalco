import { PropsWithChildren } from 'react';
import { Stack } from '@signalco/ui/Stack';
import { Container } from '@signalco/ui/Container';
import Footer from '../pages/Footer';
import { PageNav } from '../PageNav';

export function PageLayout({ children }: PropsWithChildren) {
    return (
        <Stack spacing={4}>
            <PageNav />
            <main className="pt-20">
                <Container>
                    {children}
                </Container>
            </main>
            <Footer />
        </Stack>);
}
