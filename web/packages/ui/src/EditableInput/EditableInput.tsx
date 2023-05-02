import React, { useEffect, useState } from 'react';
import { Close, Save, Edit } from '@signalco/ui-icons';
import { Input, IconButton, Theme, Typography } from '@mui/joy';
import { SystemStyleObject, Box } from '@mui/system';
import { Row } from '../Row';

export type EditableInputProps = {
    text: string,
    onChange: (text: string) => void
    sx?: SystemStyleObject<Theme>
    sxInput?: SystemStyleObject<Theme>,
    noWrap?: boolean
}

export function EditableInput(props: EditableInputProps) {
    const {
        text,
        sx,
        sxInput,
        onChange,
        noWrap
    } = props;

    const [isEditing, setIsEditing] = useState(false);
    const [editingText, setEditingText] = useState(text);
    useEffect(() => {
        if (isEditing)
            setEditingText(text);
    }, [isEditing, text, setEditingText])

    const handleConfirm = () => {
        onChange(editingText);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditingText(text);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleConfirm();
        else if (e.key === 'Escape') handleCancel();
    };

    if (isEditing) {
        return (
            <Row spacing={1}>
                <Input
                    sx={{
                        '& input': {
                            ...(sxInput || sx)
                        }
                    }}
                    value={editingText}
                    autoFocus
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Row spacing={1}>
                    <IconButton
                        aria-label="Confirm edit"
                        onClick={handleConfirm}>
                        <Save />
                    </IconButton>
                    <IconButton
                        aria-label="Cancel edit"
                        onClick={handleCancel}>
                        <Close />
                    </IconButton>
                </Row>
            </Row>
        );
    } else {
        return (
            <Box sx={{ py: '4px', cursor: 'pointer' }} onClick={() => setIsEditing(true)}>
                <Typography sx={{
                    '& > .editIndicator': { visibility: 'hidden' },
                    '&:hover': { '& > .editIndicator': { visibility: 'visible' } },
                    ...sx
                }} noWrap={noWrap}>{text}<span className="editIndicator"><Edit /></span></Typography>
            </Box>
        )
    }
}
