import { useQuery } from '@tanstack/react-query';
import { ProcessTaskDefinitionDto } from '../../app/api/dtos/dtos';
import { processTaskDefinitionsKey } from './useProcessTaskDefinitions';

export function processTaskDefinitionKey(processId?: string, taskDefinitionId?: string) {
    return [...processTaskDefinitionsKey(processId), taskDefinitionId];
}

async function fetchGetProcessTaskDefinition(processId: string, taskDefinitionId: string) {
    const response = await fetch(`/api/processes/${processId}/task-definitions/${taskDefinitionId}`);
    if (!response.ok)
        return null;
    return await response.json() as ProcessTaskDefinitionDto | undefined;
}

export function useProcessTaskDefinition(processId?: string, taskDefinitionId?: string) {
    return useQuery({
        queryKey: processTaskDefinitionKey(processId, taskDefinitionId),
        queryFn: async () => {
            if (!processId || !taskDefinitionId)
                throw new Error('Process Id and Task Definition Id is required');
            return await fetchGetProcessTaskDefinition(processId, taskDefinitionId);
        },
        enabled: processId != null && taskDefinitionId != null,
    })
}
