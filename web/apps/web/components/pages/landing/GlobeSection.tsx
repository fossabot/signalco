'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Fade } from '@signalco/ui/dist/Fade';
import { Container } from '@signalco/ui/dist/Container';
import { useIsServer, useTimeout } from '@signalco/hooks';
const Globe = dynamic(() => import('./Globe'));

function GlobeSection() {
    const [appear, setAppear] = useState(false);
    useTimeout(() => setAppear(true), 100);

    const isServer = useIsServer();

    return (
        <Container>
            <Fade duration={2000} appear={appear}>
                <div className="overflow-hidden">
                    <div className="relative flex min-h-[12vh] justify-center sm:min-h-[20vh] md:min-h-[380px]">
                        <div className="absolute h-[1000px] max-h-[800vw!important] w-[1000px] max-w-[80vw!important]">
                            {!isServer && (
                                <Globe />
                            )}
                        </div>
                    </div>
                </div>
            </Fade>
        </Container>
    );
}

export default GlobeSection;
