import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsKey } from './useDocuments';

type DocumentDeleteArgs = {
    id: string;
}

async function fetchDeleteDocumentAsync(id: string) {
    await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
    });
}

export function useDocumentDelete() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: ({ id }: DocumentDeleteArgs) => fetchDeleteDocumentAsync(id),
        onSuccess: () => {
            client.invalidateQueries({ queryKey: documentsKey() });
        }
    });
}
