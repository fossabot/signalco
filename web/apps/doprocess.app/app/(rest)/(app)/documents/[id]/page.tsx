import { Stack } from '@signalco/ui/dist/Stack';
import { TypographyDocumentName } from '../../../../../components/processes/documents/TypographyDocumentName';
import { DocumentEditor } from '../../../../../components/processes/documents/DocumentEditor';

export default function DocumentPage({ params }: { params: { id: string } }) {
    const {id} = params;
    const editable = true;
    return (
        <Stack spacing={2} className="overflow-x-hidden py-4">
            <div className="px-[62px] pb-8 pt-12">
                <TypographyDocumentName id={id} level="h2" editable={editable} />
            </div>
            <DocumentEditor
                id={id}
                editable={editable} />
        </Stack>
    );
}
