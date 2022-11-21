import { MouseEvent, useState } from 'react';
import { Icon, Box, Row } from '@signalco/ui';
import { SxProps } from '@mui/system';
import { Card, IconButton } from '@mui/joy';
import { ChildrenProps } from '../sharedTypes';

export interface AccordionProps extends ChildrenProps {
    open?: boolean;
    disabled?: boolean;
    sx?: SxProps;
    onChange?: (e: MouseEvent<HTMLAnchorElement>, expanded: boolean) => void,
    unmountOnExit?: boolean;
}

export default function Accordion(props: AccordionProps) {
    const { children, open, sx, disabled, onChange, unmountOnExit } = props;
    const [isOpen, setIsOpen] = useState(open ?? false);

    const handleOpen = (e: MouseEvent<HTMLAnchorElement>) => {
        if (typeof open !== 'undefined' && typeof onChange !== 'undefined') {
            onChange(e, !open);
        } else if (typeof open === 'undefined') {
            setIsOpen(!isOpen);
        }
    };

    const actualOpen = open ?? isOpen;

    return (
        <Card variant="soft" sx={sx}>
            <Row spacing={1} justifyContent="space-between">
                {!!children && Array.isArray(children) ? children[0] : children}
                {!disabled && (
                    <IconButton size="sm" onClick={handleOpen}>
                        <Icon>{actualOpen ? 'expand_less' : 'expand_more'}</Icon>
                    </IconButton>
                )}
            </Row>
            {(!unmountOnExit || actualOpen) && (
                <Box sx={{ height: actualOpen ? 'auto' : 0, overflow: 'hidden' }}>
                    {!!children && Array.isArray(children) && children.filter((_, i) => i !== 0)}
                </Box>
            )}
        </Card>
    )
}
