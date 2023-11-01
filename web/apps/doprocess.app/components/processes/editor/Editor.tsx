import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';

type EditorProps = {
    editable: boolean;
};

export function Editor({ editable }: EditorProps) {
    const editor = useBlockNote({
        editable
    });

    return (
        <div className="p-2">
            <BlockNoteView editor={editor} theme="light" />
        </div>
    );
}
