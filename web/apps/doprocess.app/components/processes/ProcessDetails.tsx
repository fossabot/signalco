import { Stack } from '@signalco/ui/dist/Stack';
import { TaskList } from './tasks/TaskList';
import { ProcessDetailsHeader } from './ProcessDetailsHeader';

type ProcessDetailsProps = {
    id: string;
    runId?: string;
    editable: boolean;
};

export function ProcessDetails({ id, runId, editable }: ProcessDetailsProps) {
    return (
        <>
            <Stack spacing={2}>
                <ProcessDetailsHeader
                    processId={id}
                    runId={runId}
                    editable={editable}/>
                <TaskList
                    processId={id}
                    runId={runId}
                    editable={editable} />
            </Stack>
        </>
    );
}
