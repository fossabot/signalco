import { Ref, type ReactElement } from 'react';
import { Row } from '../Row';
import { cx } from '../cx';
import { Button } from '../Button';

export type ListItemPropsOptions = {
    href: string | undefined;
    nodeId?: never;
    selected?: boolean | undefined;
    onSelected?: never;
    divRef?: never;
    buttonRef?: Ref<HTMLButtonElement>;
} | {
    href?: never;
    nodeId: string;
    selected?: boolean;
    onSelected: (nodeId: string) => void;
    divRef?: never;
    buttonRef?: Ref<HTMLButtonElement>;
} | {
    href?: never;
    nodeId?: never;
    selected?: never;
    onSelected?: never;
    divRef?: Ref<HTMLDivElement>;
    buttonRef?: never;
};

export type ListItemPropsCommon = {
    label: ReactElement | string | undefined;
    disabled?: boolean;
    startDecorator?: ReactElement;
    endDecorator?: ReactElement;
    className?: string;
    title?: string;
    style?: React.CSSProperties;
};

export type ListItemProps = ListItemPropsCommon & ListItemPropsOptions;

export function ListItem({
    divRef,
    buttonRef,
    nodeId,
    label,
    startDecorator,
    endDecorator,
    selected,
    onSelected,
    disabled,
    href,
    className,
    title,
    style
}: ListItemProps) {
    const handleClick = () => {
        if (onSelected) {
            onSelected(nodeId);
        }
    };

    if (!href && !nodeId && !onSelected) {
        return (
            <Row
                ref={divRef}
                spacing={2}
                className={cx('min-h-[3rem] px-2', className)}
                title={title}
                style={style}>
                {typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator ?? null}
                <div className={cx('grow', disabled && 'opacity-60')}>{label}</div>
                <>
                    {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator ?? null}
                </>
            </Row>
        );
    }

    return (
        <Button
            ref={buttonRef}
            href={href}
            variant={selected ? 'soft' : 'plain'}
            onClick={handleClick}
            disabled={disabled}
            title={title}
            style={style}
            className={cx('text-start h-auto', className)}>
            {typeof startDecorator === 'string' ? <span>{startDecorator}</span> : startDecorator ?? null}
            {Boolean(label) && <div className="grow">{label}</div>}
            {Boolean(endDecorator) && (
                <>
                    {typeof endDecorator === 'string' ? <span>{endDecorator}</span> : endDecorator ?? null}
                </>
            )}
        </Button>
    );
}
