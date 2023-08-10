'use client';

import React from 'react';
import { cx } from 'classix';
import { Typography } from '@signalco/ui/dist/Typography';
import { Row } from '@signalco/ui/dist/Row';
import { Link } from '@signalco/ui/dist/Link';
import { JsonResponse } from '@signalco/js';
import { useLoadAndError } from '@signalco/hooks/dist/useLoadAndError';

export async function fetchSystemStatus() {
    const response = await fetch('https://api.checklyhq.com/v1/status-page/103507/statuses?page=1&limit=99');
    const responseJson = await response.json();
    return (responseJson as JsonResponse<{ summary: { totalFailing: number, totalDegraded: number } }>)?.summary;
}

export function SystemStatusLabel() {
    const { item } = useLoadAndError(fetchSystemStatus);

    let status: 'operational' | 'major' | 'partial' | 'degraded' = 'operational';
    let statusText = 'All systems operational';
    if (item) {
        if (item?.totalFailing ?? 0 >= 3) {
            status = 'major';
            statusText = 'Major outage';
        } else if (item?.totalFailing ?? 0 > 0) {
            status = 'partial';
            statusText = 'Some systems are experiencing issues';
        } else if (item?.totalDegraded ?? 0 > 0) {
            status = 'degraded';
            statusText = 'Some systems are experiencing issues';
        }
    }

    return (
        <Link href="https://status.signalco.io">
            <Row alignItems="center" spacing={1}>
                <div className={cx(
                    'h-2 w-2 rounded-full bg-green-500',
                    status === 'operational' && 'bg-green-500',
                    status === 'degraded' && 'bg-yellow-500',
                    status === 'partial' && 'bg-yellow-500',
                    status === 'major' && 'bg-red-500'
                )} />
                <Typography level="body2">{statusText}</Typography>
            </Row>
        </Link>
    );
}
