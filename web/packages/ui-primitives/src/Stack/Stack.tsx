import type { CSSProperties, HTMLAttributes } from 'react';
import { cx } from '../cx';

export type StackProps = HTMLAttributes<HTMLDivElement> & {
    spacing?: number;
    alignItems?: 'start' | 'center' | 'stretch' | undefined;
    justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'stretch' | undefined;
};

export function Stack({ spacing, alignItems, justifyContent, style, className, ...props }: StackProps) {
    return (
        <div
            className={cx(
                'flex flex-col',
                alignItems === 'start' && 'items-start',
                alignItems === 'center' && 'items-center',
                (!alignItems || alignItems === 'stretch') && 'items-stretch',
                Boolean(spacing) && 'gap-[--s-gap]',
                justifyContent === 'start' && 'justify-start',
                justifyContent === 'center' && 'justify-center',
                justifyContent === 'end' && 'justify-end',
                justifyContent === 'space-between' && 'justify-between',
                justifyContent === 'stretch' && 'justify-stretch',
                className)}
            style={{
                '--s-gap': `${(spacing ?? 0) * 8}px`,
                ...style
            } as CSSProperties}
            {...props}
        />
    )
}
