import { useQuery } from '@tanstack/react-query';
import { ProcessTaskDefinitionDto } from '../../app/api/dtos/dtos';
import { processKey } from './useProcess';

export function processTaskDefinitionsKey(processId?: string) {
    return [...processKey(processId), 'taskDefinitions'];
}

async function fetchGetProcess(processId: string) {
    const response = await fetch(`/api/processes/${processId}/task-definitions`);
    return await response.json() as ProcessTaskDefinitionDto[] | undefined;
}

export function useProcessTaskDefinitions(processId?: string) {
    return useQuery({
        queryKey: processTaskDefinitionsKey(processId),
        queryFn: async () => {
            if (!processId)
                throw new Error('Process ID is required');
            return await fetchGetProcess(processId);
        },
        enabled: processId != null,
    })
}
