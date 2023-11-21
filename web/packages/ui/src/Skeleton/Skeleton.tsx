import { cx } from '@signalco/ui/cx';

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cx('animate-pulse rounded-md bg-muted', className)}
            {...props}
        />
    )
}
