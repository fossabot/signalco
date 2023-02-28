import { CSSProperties } from 'react';
import { ChildrenProps } from '../sharedTypes';

/** @alpha */
export interface IconProps extends ChildrenProps {
    sx?: CSSProperties | undefined;
}

/** @alpha */
export default function Icon(props: IconProps) {
    return (
        <span
            className="material-icons"
            style={{
                ...props.sx
            }}>
            {props.children}
        </span>
    );
}