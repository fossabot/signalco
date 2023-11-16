'use client';

import { Play } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Tooltip } from '@signalco/ui/dist/Tooltip';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Modal } from '@signalco/ui/dist/Modal';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { ProcessDto } from '../../app/api/dtos/dtos';
import { ProcessRunCreateForm } from './ProcessRunCreateForm';

type ProcessRunCreateModalProps = {
    process: ProcessDto;
};

export function ProcessRunCreateModal({ process }: ProcessRunCreateModalProps) {
    return (
        <Modal trigger={(
            <Tooltip title="Run process">
                <IconButton variant="solid"><Play /></IconButton>
            </Tooltip>
        )}>
            <Stack spacing={4}>
                <Row spacing={2}>
                    <Play />
                    <Typography level="h5">Run process</Typography>
                </Row>
                <ProcessRunCreateForm process={process} />
            </Stack>
        </Modal>
    );
}