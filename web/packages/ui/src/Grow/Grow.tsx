import { ChildrenProps } from "../sharedTypes";

export type GrowProps = ChildrenProps & {
    appear: boolean;
    duration?: number;
    collapsedWhenHidden?: boolean;
}

export function Grow(props: GrowProps) {
    const { appear, collapsedWhenHidden, children } = props;
    const duration = props.duration ?? 100;

    return (
        <div style={{
            display: 'flex',
            transition: `transform ${duration}ms ease-out`,
            transform: !appear ? 'scale(0)' : undefined,
            height: !appear && collapsedWhenHidden ? 0 : 'auto'
        }}>
            {children}
        </div>
    );
}
