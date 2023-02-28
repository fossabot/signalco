import React from 'react';
import { Typography, Stack } from '@signalco/ui';
import style from './PageCenterHeader.module.scss';

export default function PageCenterHeader(props: { header: string; subHeader?: string; secondary?: boolean }) {
    const { header, subHeader, secondary } = props;
    return (
        <header className={style.root}>
            <Stack alignItems="center" spacing={2}>
                <Typography level={secondary ? 'h5' : 'h4'}>{header}</Typography>
                {subHeader && <Typography>{subHeader}</Typography>}
            </Stack>
        </header>
    );
}
