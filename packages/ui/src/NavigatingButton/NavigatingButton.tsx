import Link from 'next/link';
import { Navigate } from '@signalco/ui-icons';
import { Button } from '@mui/joy';
import { ChildrenProps } from '../sharedTypes';

/** @alpha */
export interface NavigatingButtonProps extends ChildrenProps {
    href: string;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    hideArrow?: boolean;
}

/** @alpha */
export default function NavigatingButton({
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
                    '.JoyButton-endDecorator': {
                        opacity: hideArrow ? 0 : 1,
                        transition: 'opacity 0.2s linear'
                    },
                    '&:hover': {
                        '.JoyButton-endDecorator': {
                            opacity: 1
                        }
                    }
                }}>
                {children}
            </Button>
        </Link>
    );
}
