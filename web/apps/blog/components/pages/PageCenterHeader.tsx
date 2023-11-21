import React from 'react';
import {Typography} from '@signalco/ui/Typography';
import {Stack} from '@signalco/ui/Stack';
import style from './PageCenterHeader.module.scss';

export default function PageCenterHeader(props: { header: string; subHeader?: string; secondary?: boolean }) {
    const { header, subHeader, secondary } = props;
    return (
        <header className={style.root}>
            <Stack alignItems="center" spacing={2}>
                <Typography level={secondary ? 'h5' : 'h4'}>{header}</Typography>
                {subHeader && <Typography textAlign="center">{subHeader}</Typography>}
            </Stack>
        </header>
    );
}
