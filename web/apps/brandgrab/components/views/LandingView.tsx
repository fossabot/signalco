'use client';

import React, { useCallback } from 'react';
import NextImage from 'next/image';
import Stack from '@signalco/ui/dist/Stack';
import { Card, CardContent, CardCover, ChildrenProps, Container, Loadable, Row, Typography } from '@signalco/ui';
import { orderBy } from '@signalco/js';
import { useLoadAndError, useSearchParam } from '@signalco/hooks';
import { ScreenshotResponse } from '../../app/api/screenshot/route';
import { BrandResources } from '../../app/api/quick/route';

function OgPreview({ og }: { og: BrandResources['og'] }) {
    if (!og.title && !og.image && !og.url)
        return <>-</>;

    return (
        <Card style={{ width: 400, minHeight: 209 }}>
            {og.imageBase64 &&
                <>
                    <CardCover>
                        <NextImage
                            src={og.imageBase64}
                            alt="og:image"
                            width={400}
                            height={209} />
                    </CardCover>
                    <CardCover
                        sx={{
                            background:
                                'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 100px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 100px)',
                        }}
                    />
                </>
            }
            <CardContent style={{ justifyContent: 'flex-end' }}>
                <Stack>
                    <Typography textColor="#fff" level="h5" style={{
                        marginTop: 8
                    }}>{og.title}</Typography>
                    <Typography textColor="neutral.300">{og.description}</Typography>
                </Stack>
            </CardContent>
        </Card>
    )
}

function IconPreview({ favicon, icons }: { favicon: BrandResources['favicon'], icons: BrandResources['icons'] }) {
    return (
        <div style={{
            width: 144 + 16 * 2 + 42 + 16 * 2,
            height: 144 + 16 * 2,
            display: 'grid',
            gridTemplateColumns: '176px 74px',
            gridTemplateRows: '74px 48px',
            gap: 16
        }}>
            <NextImage
                style={{
                    width: 144 + 16 * 2,
                    height: 144 + 16 * 2,
                    gridRowEnd: 'span 2',
                    padding: 16,
                    border: '1px solid var(--joy-palette-divider)',
                    borderRadius: 8
                }}
                src={icons.icon512Base64 || icons.icon256Base64 || icons.appleTouchIconBase64 || icons.icon128Base64 || icons.icon64Base64 || icons.icon32Base64 || icons.icon16Base64 || favicon.base64}
                alt="favicon"
                width={144}
                height={144} />
            <NextImage
                style={{
                    width: 42 + 16 * 2,
                    height: 42 + 16 * 2,
                    padding: 16,
                    border: '1px solid var(--joy-palette-divider)',
                    borderRadius: 8
                }}
                src={icons.icon64Base64 || icons.icon32Base64 || icons.icon16Base64 || favicon.base64}
                alt="favicon"
                width={42}
                height={42} />
            <NextImage
                style={{
                    width: 16 * 3,
                    height: 16 * 3,
                    padding: 16,
                    border: '1px solid var(--joy-palette-divider)',
                    borderRadius: 8
                }}
                src={icons.icon16Base64 || favicon.base64}
                alt="favicon"
                width={16}
                height={16} />
        </div>
    )
}

function TextInfo({ title, children }: { title: string } & ChildrenProps) {
    return (
        <Stack spacing={.5}>
            <Typography level="body3">{title}</Typography>
            <div>{children || '-'}</div>
        </Stack>
    )
}

async function getPageScreenshot(domain: string) {
    const res = await fetch(`/api/screenshot?domain=${encodeURIComponent(domain)}`);
    const data = await res.json() as ScreenshotResponse;
    const dimensions = await getImageDimensions(data.data);
    return {
        data: data.data,
        w: dimensions.w,
        h: dimensions.h,
        colors: data.colors
    }
}

function getImageDimensions(file: string) {
    return new Promise<{ w: number, h: number }>(function (resolved) {
        const i = new Image();
        i.onload = function () {
            resolved({ w: i.width, h: i.height })
        };
        i.src = file
    })
}

function PagePreview({ domain }: { domain: string }) {
    const pageScreenshotDomain = useCallback(() => getPageScreenshot(domain), [domain]);
    const pageScreenshot = useLoadAndError(pageScreenshotDomain);

    const width = 400;
    const containerHeight = 300;

    return (
        <Loadable isLoading={pageScreenshot.isLoading} error={pageScreenshot.error} loadingLabel="Loading preview">
            <Stack spacing={3}>
                <TextInfo title="Page preview">
                    <Card style={{
                        width: width,
                        height: containerHeight,
                        overflowY: 'auto',
                        boxSizing: 'content-box'
                    }}>
                        <CardCover style={{
                            height: (width / (pageScreenshot.item?.w ?? 1)) * (pageScreenshot.item?.h ?? 0),
                            borderRadius: 0
                        }}>
                            {/* eslint-disable-next-line @next/next/no-img-element  */}
                            <img
                                src={pageScreenshot.item?.data || ''}
                                alt="Page preview"
                                width={pageScreenshot.item?.w}
                                height={pageScreenshot.item?.h}
                                style={{
                                    objectPosition: '0 0',
                                    borderRadius: 0
                                }} />
                        </CardCover>
                    </Card>
                </TextInfo>
                <TextInfo title="Colors">
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {orderBy(pageScreenshot.item?.colors ?? [], (a, b) => b.area - a.area).map((color) => (
                            <div key={color.hex} style={{
                                width: 64,
                                height: 64,
                                borderRadius: 4,
                                backgroundColor: color.hex,
                                fontSize: '.8em',
                                padding: 4,
                                alignItems: 'end',
                                display: 'flex',
                                color: color.lightness < .5 ? 'rgba(256,256,256, .8)' : 'rgba(0,0,0, .8)',
                                border: '1px solid var(--joy-palette-divider)'
                            }}>
                                {color.hex}
                            </div>
                        ))}
                    </div>
                </TextInfo>
            </Stack>
        </Loadable>
    )
}

function BrandView({ resources }: { resources: BrandResources | undefined }) {
    if (!resources) return null;

    return (
        <Row alignItems="start" spacing={4}>
            <Stack spacing={3}>
                <TextInfo title="Domain">
                    {resources.domain}
                </TextInfo>
                <TextInfo title="Title">
                    {resources.title}
                </TextInfo>
                <TextInfo title="Description">
                    {resources.description}
                </TextInfo>
                <TextInfo title="Favicon & Icons">
                    <IconPreview favicon={resources.favicon} icons={resources.icons} />
                </TextInfo>
                <TextInfo title="Open Graph (og)">
                    <OgPreview og={resources.og} />
                </TextInfo>
            </Stack>
            <Stack>
                <PagePreview domain={resources.domain} />
            </Stack>
        </Row>
    );
}

async function quickLookup(domain: string | undefined): Promise<BrandResources | undefined> {
    if (!domain) {
        return undefined;
    }

    return await fetch('/api/quick?domain=' + encodeURIComponent(domain)).then(res => res.json()).then(res => res as BrandResources);
}

export default function LandingPageView() {
    const [domain] = useSearchParam('domain');
    const quickLookupDomain = useCallback(() => quickLookup(domain), [domain]);
    const domainResources = useLoadAndError(quickLookupDomain);

    return (
        <Stack style={{ overflowX: 'hidden', paddingBottom: 16 }}>
            <Container maxWidth="md">
                <Loadable
                    isLoading={domainResources.isLoading}
                    error={domainResources.error}
                    loadingLabel={'Loading brand'}>
                    <BrandView resources={domainResources.item} />
                </Loadable>
            </Container>
        </Stack>
    );
}
