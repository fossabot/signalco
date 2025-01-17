'use client';

import { Fragment, HTMLAttributes, useEffect, useRef, useState } from 'react';
import { Stack } from '@signalco/ui-primitives/Stack';
import { Row } from '@signalco/ui-primitives/Row';
import { Popper } from '@signalco/ui-primitives/Popper';
import { Input } from '@signalco/ui-primitives/Input';
import { IconButton } from '@signalco/ui-primitives/IconButton';
import { Divider } from '@signalco/ui-primitives/Divider';
import { cx } from '@signalco/ui-primitives/cx';
import { Send } from '@signalco/ui-icons';
import { orderBy } from '@signalco/js';
import { useComments } from '../hooks/useComments';
import { useCommentItemRects } from '../hooks/useCommentItemRects';
import { CommentThreadItem } from './CommentThreadItem';
import { CommentSelectionHighlight } from './CommentSelectionHighlight';
import { CommentItem } from './Comments';
import { CommentIcon } from './CommentIcon';

type CommentBubbleProps = HTMLAttributes<HTMLDivElement> & {
    defaultOpen?: boolean;
    creating?: boolean;
    onCreated?: (commentItemId: string) => void;
    onCanceled?: () => void;
    commentItem: CommentItem;
};

export function CommentBubble({
    defaultOpen, creating, onCreated, onCanceled, commentItem, className, style
}: CommentBubbleProps) {
    const selectionRects = useCommentItemRects(commentItem.position);
    const lastRect = orderBy(selectionRects, r => r.bottom).at(-1);
    const { upsert } = useComments();

    const handleResolveComment = async () => {
        await upsert.mutateAsync({
            ...commentItem,
            resolved: true
        });
    };

    const handleCreateComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        e.currentTarget.reset();
        const commentId = await upsert.mutateAsync({
            ...commentItem,
            thread: {
                ...commentItem.thread,
                items: [
                    ...commentItem.thread.items,
                    {
                        id: Math.random().toString(),
                        text: formData.get('text') as string
                    }
                ]
            }
        });

        if (creating) {
            onCreated?.(commentId);
        }
    };

    const [open, setOpen] = useState(creating ?? defaultOpen);
    const handleOpenChange = (open: boolean) => {
        if (!open && creating) {
            onCanceled?.();
        }
        setOpen(open);
    }

    return (
        <>
            {commentItem.position.type === 'text' && (
                <CommentSelectionHighlight commentSelection={commentItem.position} />
            )}
            <Popper
                trigger={(
                    <div
                        role="button"
                        className={cx(
                            'fixed z-[48] hover:z-[49] cursor-pointer',
                            className
                        )}
                        style={{
                            left: (lastRect?.right ?? 0) + 16,
                            top: (lastRect?.bottom ?? 0) + 16,
                            transform: 'translate(-50%, -50%)',
                            ...style
                        }}>
                        <CommentIcon className="hover:scale-110 hover:brightness-75" />
                        <span
                            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-white">
                            {commentItem.thread.items.length}
                        </span>
                    </div>
                )}
                className="bg-background text-primary"
                sideOffset={-32}
                align="start"
                alignOffset={32}
                open={open}
                onOpenChange={handleOpenChange}
            >
                <div>
                    <Stack>
                        <Stack className="max-h-96 overflow-y-scroll">
                            {commentItem.thread.items.length > 0 && (
                                <>
                                    <Stack spacing={1} className="py-2">
                                        {commentItem.thread.items.map((comment, i) => (
                                            <Fragment key={comment.id}>
                                                <div className="px-4 py-2">
                                                    <CommentThreadItem
                                                        first={i === 0}
                                                        comment={comment}
                                                        onDone={handleResolveComment} />
                                                </div>
                                                {i !== commentItem.thread.items.length - 1 && (
                                                    <Divider />
                                                )}
                                            </Fragment>
                                        ))}
                                    </Stack>
                                    <Divider />
                                </>
                            )}
                        </Stack>
                        <form onSubmit={handleCreateComment}>
                            <Stack className="bg-card px-1 py-4 pt-2">
                                <Input
                                    variant="plain"
                                    name="text"
                                    placeholder="Leave comment..."
                                    autoFocus
                                    autoComplete={'off'} />
                                <Row justifyContent="space-between" className="px-3">
                                    <div></div>
                                    <IconButton variant="solid" size="xs" type="submit">
                                        <Send />
                                    </IconButton>
                                </Row>
                            </Stack>
                        </form>
                    </Stack>
                </div>
            </Popper>
        </>
    );
}
