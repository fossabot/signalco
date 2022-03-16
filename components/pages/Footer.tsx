import { Box, Divider, Container, Grid, Typography, Stack, IconButton, Link } from "@mui/material";
import NextLink from "next/link";
import React from "react";
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import SignalcoLogo from "../icons/SignalcoLogo";
import RedditIcon from "@mui/icons-material/Reddit";

const footerLinks = [
    {
        header: 'Projects',
        links: [
            { name: "Website", href: "https://github.com/signalco-io/signalco" },
            { name: "Cloud", href: "https://github.com/signalco-io/cloud" },
            { name: "Station", href: "https://github.com/signalco-io/station" },
            { name: "Companion", href: "https://github.com/signalco-io/companion" },
        ]
    },
    {
        header: 'Community',
        links: [
            { name: "Coming soon...", href: "#" },
        ]
    },
    {
        header: 'Resources',
        links: [
            { name: "Website", href: "https://status.signalco.io" },
            { name: "API", href: "/docs/api" },
            { name: "Storybook", href: "https://storybook.dev.signalco.io" },
        ]
    },
    {
        header: 'Legal',
        links: [
            { name: "Privacy Policy", href: "/legal/privacy-policy" },
            { name: "Terms of Service", href: "/legal/terms-of-service" },
            { name: "DPA", href: "/legal/dpa" },
            { name: "SLA", href: "/legal/sla" },
        ]
    }
];

function SLink({ href, children }: { href: string; children: React.ReactElement | string; }) {
    return (
        <NextLink href={href} passHref>
            {typeof children === 'string' ? (
                <Link underline="hover">{children}</Link>
            ) : (
                <>
                    {children}
                </>
            )}
        </NextLink>
    );
}

export default function Footer() {
    return (
        <Box sx={{ bgcolor: 'background.paper' }}>
            <Divider />
            <Container maxWidth="lg">
                <Box component="footer" sx={{ padding: "64px 0 32px 0" }}>
                    <Grid container direction="column" spacing={4}>
                        <Grid item>
                            <Grid container justifyContent="space-between" spacing={4}>
                                {footerLinks.map(section => (
                                    <Grid item key={section.header} xs={12} sm={6} md={3} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                        <Typography variant="h4" color="textSecondary" sx={{ pb: 2 }}>{section.header}</Typography>
                                        <Stack spacing={1}>
                                            {section.links.map(link => (
                                                <SLink key={link.name} href={link.href}>{link.name}</SLink>
                                            ))}
                                        </Stack>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Stack alignItems={{ xs: "center", sm: 'stretch' }}>
                                <SignalcoLogo height={68} />
                                <Stack alignItems="center" justifyContent="space-between" direction={{ xs: "column-reverse", sm: "row" }}>
                                    <Typography textAlign={{ xs: 'center', sm: 'left' }} variant="subtitle2" fontWeight={400} component="span" color="textSecondary">Copyright © {new Date().getFullYear()} signalco. All rights reserved.</Typography>
                                    <Stack direction="row" spacing={1} alignItems={{ xs: "center", sm: 'start' }}>
                                        <SLink href="https://twitter.com/signalco_io">
                                            <IconButton size="large" aria-label="Twitter link">
                                                <TwitterIcon />
                                            </IconButton>
                                        </SLink>
                                        <SLink href="https://www.reddit.com/r/signalco/">
                                            <IconButton size="large" aria-label="reddit link">
                                                <RedditIcon />
                                            </IconButton>
                                        </SLink>
                                        <SLink href="https://github.com/signalco-io/signalco">
                                            <IconButton size="large" aria-label="GitHub link">
                                                <GitHubIcon />
                                            </IconButton>
                                        </SLink>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </Box>
    );
}
