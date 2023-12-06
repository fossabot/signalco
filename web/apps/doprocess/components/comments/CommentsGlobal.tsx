'use client';
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { getElementSelector } from '@signalco/js';
import { useWindowEvent } from '@signalco/hooks/useWindowEvent';
import { useDocumentEvent } from '@signalco/hooks/useDocumentEvent';
import { useComments } from './useComments';
import { useCommentItemRects } from './useCommentItemRects';
import { CommentToolbar } from './CommentToolbar';
import { CommentSelectionPopover } from './CommentSelectionPopover';
import { CommentSelectionHighlight } from './CommentSelectionHighlight';
import { CommentsGlobalProps, CommentSelection, CommentPoint } from './Comments';
import { CommentPointOverlay } from './CommentPointOverlay';
import { CommentBubble } from './CommentBubble';


export function CommentsGlobal({
    reviewParamKey = 'review'
}: CommentsGlobalProps) {
    const [creatingCommentSelection, setCreatingCommentSelection] = useState<CommentSelection>();

    const { query: commentItems, upsert: commentUpsert } = useComments();

    const [creatingCommentPoint, setCreatingCommentPoint] = useState(false);

    useWindowEvent('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape' && (creatingCommentSelection || creatingCommentPoint)) {
            event.stopPropagation();
            event.preventDefault();
            setCreatingCommentPoint(false);
            setCreatingCommentSelection(undefined);
        }
    }, [creatingCommentSelection, creatingCommentPoint]);

    useDocumentEvent('selectionchange', () => {
        // Ignore if selection is empty or no selection in document
        const selection = window.getSelection();
        const text = selection?.toString();
        if (!selection || !text?.length) {
            setCreatingCommentSelection(undefined);
            return;
        }

        setCreatingCommentSelection({
            text,
            type: 'text',
            startSelector: getElementSelector(selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode?.parentElement),
            startOffset: selection.anchorOffset,
            startType: selection.anchorNode?.nodeType === Node.TEXT_NODE ? 'text' : 'element',
            endSelector: getElementSelector(selection.focusNode instanceof Element ? selection.focusNode : selection.focusNode?.parentElement),
            endOffset: selection.focusOffset,
            endType: selection.focusNode?.nodeType === Node.TEXT_NODE ? 'text' : 'element'
        });
    });

    const creatingSelectionRects = useCommentItemRects(creatingCommentSelection);

    const handleCreateComment = async () => {
        if (!creatingCommentSelection) {
            return;
        }

        setCreatingCommentSelection(undefined);
        await commentUpsert.mutateAsync({
            position: creatingCommentSelection,
            thread: { items: [] }
        });
    };

    const handleCreateCommentPoint = async (commentPoint: CommentPoint) => {
        setCreatingCommentPoint(false);
        await commentUpsert.mutateAsync({
            position: commentPoint,
            thread: { items: [] }
        });
    };

    const handleExitReview = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete(reviewParamKey);
        window.history.replaceState({}, '', url.toString());
    };

    return (
        <>
            {commentItems.data?.map((commentItem) => (
                <CommentBubble
                    key={commentItem.id ?? (`new-commentitem-${nanoid()}`)}
                    commentItem={commentItem} />
            ))}
            {creatingCommentSelection && (
                <CommentSelectionHighlight commentSelection={creatingCommentSelection} />
            )}
            {creatingSelectionRects?.length > 0 && (
                <CommentSelectionPopover
                    rects={creatingSelectionRects}
                    onCreate={handleCreateComment} />
            )}
            {creatingCommentPoint && (
                <CommentPointOverlay onPoint={handleCreateCommentPoint} />
            )}
            <CommentToolbar
                creatingPointComment={creatingCommentPoint}
                onAddPointComment={() => setCreatingCommentPoint((curr) => !curr)}
                onShowSidebar={() => { }}
                onExitReview={handleExitReview} />
        </>
    );
}
