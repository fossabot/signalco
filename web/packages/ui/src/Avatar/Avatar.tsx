import { PropsWithChildren } from "react";

export type AvatarProps = PropsWithChildren<{
    size?: 'sm' | 'md' | 'lg'; // TODO: Implement
    src?: string; // TODO: Implement
    alt?: string; // TODO: Implement
}>;

export function Avatar({ children }: AvatarProps) {
    return <div>{children}</div>;
}
