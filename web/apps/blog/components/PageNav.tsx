import React from 'react';
import { cx } from '@signalco/ui/cx';
import { Row } from '@signalco/ui/Row';
import { Link } from '@signalco/ui/Link';
import { Container } from '@signalco/ui/Container';
import SignalcoLogotype from './icons/SignalcoLogotype';

export const HeaderHeight = 80;

export default function PageNav({ fullWidth }: { fullWidth?: boolean | undefined; }) {
    return (
        <nav className={cx(
            'fixed py-4 left-0 right-0 top-0 h-[80px] z-50 backdrop-blur-md border-current border-b-1',
            fullWidth && 'px-6'
        )}>
            <Container maxWidth={fullWidth ? false : 'lg'}>
                <header>
                    <Row justifyContent="space-between">
                        <div>
                            <Link href="/" aria-label="signalco">
                                <SignalcoLogotype height={42} />
                            </Link>
                        </div>
                    </Row>
                </header>
            </Container>
        </nav>
    );
}
