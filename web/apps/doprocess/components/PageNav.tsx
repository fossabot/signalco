import { Row } from '@signalco/ui-primitives/Row';
import { Link } from '@signalco/ui-primitives/Link';
import { cx } from '@signalco/ui-primitives/cx';
import { Container } from '@signalco/ui-primitives/Container';
import { KnownPages } from '../src/knownPages';
import { NavMenu } from './NavMenu';
import DoProcessLogo from './brand/DoProcessLogo';

export function PageNav({ fullWidth, cta }: { fullWidth?: boolean, cta?: boolean }) {
    return (
        <nav className={cx(
            'backdrop-blur-md fixed top-0 left-0 right-0 z-10 h-16 border-b flex items-center',
            fullWidth ? 'px-4' : 'px-0'
        )}>
            <Container maxWidth="lg">
                <header>
                    <Row justifyContent="space-between">
                        <div className="flex h-full flex-col items-center">
                            <Link href={KnownPages.Landing}>
                                <DoProcessLogo height={36} />
                            </Link>
                        </div>
                        <Row spacing={1}>
                            <NavMenu cta={cta} />
                        </Row>
                    </Row>
                </header>
            </Container>
        </nav>
    );
}
