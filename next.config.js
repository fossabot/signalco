const withPWA = require('next-pwa')
const { createSecureHeaders } = require("next-secure-headers")

module.exports = withPWA({
    experimental: { esmExternals: true },
    pwa: {
        dest: 'public',
        disable: process.env.NODE_ENV === 'development'
    },
    async headers() {
        return [{
          source: "/(.*)",
          headers: createSecureHeaders({
            contentSecurityPolicy: {
              directives: {
                defaultSrc: "'self'",
                scriptSrc: "'self'",
                objectSrc: "'self'",
                styleSrc: ["'self'", "https://fonts.googleapis.com", "unsafe-inline"],
                childSrc: "'self'",
                frameSrc: "'self'",
                workerSrc: "'self'",
                imgSrc: "'self'",
                connectSrc: "'self'",
                baseURI: 'https://*.signalco.io'
              },
              reportURI: 'https://o513630.ingest.sentry.io/api/5615895/security/?sentry_key=2a04f9a742e74740952dcebf06313840'
            },
            xssProtection: "block-rendering",
            forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
            referrerPolicy: "same-origin",
            expectCT: [true,{
                reportURI: 'https://o513630.ingest.sentry.io/api/5615895/security/?sentry_key=2a04f9a742e74740952dcebf06313840'
            }]
          })
        }];
      },
});