import { ReactElement, useState } from 'react';
import { ExpandDown } from '@signalco/ui-icons';
import { ChildrenProps } from '../sharedTypes';
import { ListItem, Tooltip, IconButton, ListItemButton, List } from '@mui/joy';

export type ListTreeItemProps = ChildrenProps & {
    label?: ReactElement | string;
    nodeId: string;
    defaultOpen?: boolean;
    onChange?: (nodeId: string, open: boolean) => void;
    selected?: boolean;
    onSelected?: (nodeId: string) => void;
}

export function ListTreeItem(props: ListTreeItemProps) {
    const { label, children, nodeId, defaultOpen, onChange, selected, onSelected } = props;
    const [open, setOpen] = useState(defaultOpen);

    const handleClick = () => {
        if (onSelected)
            onSelected(nodeId);
    };

    const handleOpenClick = () => {
        setOpen(!open);
        if (onChange)
            onChange(nodeId, !open);
    };

    return (
        <>
            <ListItem nested startAction={children && (
                <Tooltip title="Toggle">
                    <IconButton onClick={handleOpenClick} className={open ? 'expanded' : ''} size="sm" sx={{
                        ['& > *']: {
                            transition: '0.2s',
                            transform: 'rotate(-90deg)',
                        },
                        ['&.expanded > *']: {
                            transform: 'rotate(0deg)',
                        },
                    }}>
                        <ExpandDown />
                    </IconButton>
                </Tooltip>
            )}>
                <ListItemButton onClick={handleClick} selected={selected} disabled={!onSelected}>
                    {label}
                </ListItemButton>
                {open && (
                    <List>
                        {children}
                    </List>
                )}
            </ListItem>
        </>
    )
}
