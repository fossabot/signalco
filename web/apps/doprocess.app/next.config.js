import { createSecureHeaders } from 'next-secure-headers';
import {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
} from 'next/constants.js';
import { combineSecureHeaders, knownSecureHeadersExternalUrls } from '@signalco/data/node';
import nextBundleAnalyzer from '@next/bundle-analyzer';

const isDevelopment = process.env.NODE_ENV === 'development';

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: 'default-src \'self\'; script-src \'none\'; sandbox;',
        domains: ['doprocess.app']
    },
    eslint: {
        dirs: ['worker', 'tools', 'src', 'app', 'locales', 'components']
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: createSecureHeaders(combineSecureHeaders(
                ['doprocess.app', 'doprocess.signalco.io', 'doprocess.signalco.dev'],
                false,
                isDevelopment,
                [
                    knownSecureHeadersExternalUrls.github,
                    knownSecureHeadersExternalUrls.clarity,
                    knownSecureHeadersExternalUrls.vercel,
                    knownSecureHeadersExternalUrls.clerk,
                    {
                        frameAncestors: '\'self\'' // NOTE: This is required for embedding out app in an iframe
                    }
                ]
            ))
        }];
    },
};

const componsedNextConfig = withBundleAnalyzer(nextConfig);

// NOTE: As documented here - https://ducanh-next-pwa.vercel.app/docs/next-pwa/getting-started
const nextConfigFunction = async (phase) => {
    if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
        const withPWA = (await import('@ducanh2912/next-pwa')).default({
            dest: 'public',
            buildExcludes: [/middleware-manifest.json$/, /chunks\/images\/.*$/],
            dynamicStartUrl: false,
            disable: isDevelopment
        });
        return withPWA(componsedNextConfig);
    }
    return componsedNextConfig;
};

export default nextConfigFunction;
