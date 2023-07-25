import type { AnchorHTMLAttributes } from 'react';
import NextLink from 'next/link';
import type { Url } from 'next/dist/shared/lib/router/router';
import { cx } from 'classix';
import { isAbsoluteUrl } from '@signalco/js';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string | Url;
    className?: string | undefined;
    'aria-label'?: string | undefined;
};

export function Link({ className, href, ...rest }: LinkProps) {
    return (
        <NextLink
            href={href}
            className={cx('no-underline text-muted', className)}
            target={isAbsoluteUrl(href) ? '_blank' : '_self'}
            passHref
            prefetch={false}
            {...rest}>
        </NextLink>
    );
}
