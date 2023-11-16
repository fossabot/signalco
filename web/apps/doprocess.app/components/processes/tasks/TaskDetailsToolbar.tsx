'use client';

import { useState } from 'react';
import { cx } from 'classix';
import { Delete, MoreHorizontal } from '@signalco/ui-icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@signalco/ui/dist/Menu';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Toolbar } from '../../shared/Toolbar';
import { SavingIndicator } from '../../shared/SavingIndicator';
import { useProcessTaskDefinition } from '../../../src/hooks/useProcessTaskDefinition';
import { TaskDeleteModal } from './TaskDeleteModal';

type TaskDetailsToolbarProps = {
    processId: string;
    selectedTaskId: string | undefined;
    saving: boolean;
};

export function TaskDetailsToolbar({ processId, selectedTaskId, saving }: TaskDetailsToolbarProps) {
    const { data: taskDefinition } = useProcessTaskDefinition(processId, selectedTaskId);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <Toolbar className="grow">
                <SavingIndicator saving={saving} />
                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild
                        className={cx('transition-opacity opacity-0', taskDefinition && 'opacity-100')}>
                        <IconButton
                            variant="plain"
                            title="Task options...">
                            <MoreHorizontal />
                        </IconButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem startDecorator={<Delete />} onClick={() => setDeleteOpen(true)}>
                            Delete...
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </Toolbar>
            {taskDefinition && (
                <TaskDeleteModal
                    taskDefinition={taskDefinition}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen} />
            )}
        </>
    );
}
