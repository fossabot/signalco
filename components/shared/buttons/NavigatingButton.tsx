import Link from 'next/link';
import { Button } from '@mui/joy';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { ChildrenProps } from 'src/sharedTypes';

interface NavigatingButtonProps extends ChildrenProps {
    href: string;
    prefetch?: boolean;
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    hideArrow?: boolean;
}

export default function NavigatingButton(props: NavigatingButtonProps) {
    return (
        <Link href={props.href} passHref prefetch={props.prefetch ?? true}>
            <Button
                color="primary"
                variant={props.hideArrow ? 'plain' : 'solid'}
                disabled={props.disabled}
                size={props.size}
                endDecorator={<KeyboardArrowRightIcon fontSize="small" />}
                sx={{
                    '.JoyButton-endDecorator': {
                        opacity: props.hideArrow ? 0 : 1,
                        transition: 'opacity 0.2s linear'
                    },
                    '&:hover': {
                        '.JoyButton-endDecorator': {
                            opacity: 1
                        }
                    }
                }}>
                {props.children}
            </Button>
        </Link>
    );
}
