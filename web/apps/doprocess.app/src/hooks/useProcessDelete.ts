import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processesKey } from './useProcesses';

type ProcessDeleteArgs = {
    processId: string;
}

async function fetchDeleteProcessAsync(id: string) {
    await fetch(`/api/processes/${id}`, {
        method: 'DELETE',
    });
}

export function useProcessDelete() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ processId: id }: ProcessDeleteArgs) => fetchDeleteProcessAsync(id),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: processesKey() });
        }
    });
}
