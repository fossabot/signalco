import Link from 'next/link';
import { Navigate } from '@signalco/ui-icons';
import { Button } from '@mui/joy';
import { ChildrenProps } from '../sharedTypes';

export type NavigatingButtonProps = ChildrenProps & {
    href: string;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    hideArrow?: boolean;
}

export function NavigatingButton({
    href,
    size,
    disabled,
    hideArrow,
    children
}: NavigatingButtonProps) {
    return (
        <Link
            href={href}
            passHref
            aria-disabled={disabled}
            prefetch={false}>
            <Button
                color="primary"
                variant={hideArrow ? 'plain' : 'solid'}
                disabled={disabled}
                size={size}
                endDecorator={<Navigate size={16} />}
                sx={{
                    '.MuiButton-endDecorator': {
                        opacity: hideArrow ? 0 : 1,
                        transition: 'opacity 0.1s linear'
                    },
                    '&:hover': {
                        '.MuiButton-endDecorator': {
                            opacity: 1
                        }
                    }
                }}>
                {children}
            </Button>
        </Link>
    );
}
