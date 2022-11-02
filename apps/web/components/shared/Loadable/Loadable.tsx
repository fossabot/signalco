import React, { useMemo } from 'react';
import { Box } from '@mui/system';
import LinearProgress from '@mui/joy/LinearProgress';
import { Alert, CircularProgress } from '@mui/joy';
import LoadableProps from './LoadableProps';

export default function Loadable(props: LoadableProps) {
    const {isLoading, placeholder, error, children, contentVisible, sx} = props;

    const indicator = useMemo(() => {
        switch (placeholder) {
            case 'skeletonText':
                // return <Skeleton variant="text" width={width ?? 120} />;
            case 'skeletonRect':
                // return <Skeleton variant="rectangular" width={width ?? 120} height={height ?? 32} />;
            case 'linear':
                return <LinearProgress />
            case 'circular':
            default:
                return <Box textAlign="center"><CircularProgress /></Box>
        }
    }, [placeholder]);

    if (error) {
        console.warn('User presented with error', error, typeof error);

        let errorDisplay = error as any;
        if (typeof error === 'object') {
            const errorAny = error as any;
            if (typeof errorAny.message !== 'undefined') {
                errorDisplay = errorAny.message;
            }
            else {
                errorDisplay = JSON.stringify(error);
            }
        }
        return <Alert variant="solid" color="danger">{errorDisplay}</Alert>
    }

    return (
        <>
            {(contentVisible || isLoading) && (
                <Box visibility={isLoading ? 'visible' : 'hidden'} sx={sx}>
                    {indicator}
                </Box>
            )}
            {(contentVisible || !isLoading) && children}
        </>
    );
}
