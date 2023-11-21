import { useState } from 'react';
import { cx } from '@signalco/ui/cx';
import { Edit } from '@signalco/ui-icons';
import { Typography, TypographyProps, populateTypographyStylesAndClasses } from '../Typography/Typography';

export type TypographyEditableProps = Omit<TypographyProps, 'onChange' | 'children'> & {
    children: string | null | undefined;
    onEditingChanged?: (editing: boolean) => void;
    onChange?: (text: string) => void;
    hideEditIcon?: boolean;
    multiple?: boolean;
};

export function TypographyEditable({ children, className, onChange, onEditingChanged, placeholder, hideEditIcon, multiple, ...rest }: TypographyEditableProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState('');

    const handleEdit = () => {
        setValue(children ?? '');
        setIsEditing(true);
        onEditingChanged?.(true);
    }

    const handleConfirm = () => {
        onChange?.(value);
        setIsEditing(false);
        onEditingChanged?.(false);
    }

    const handleCancel = () => {
        setIsEditing(false);
        onEditingChanged?.(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleConfirm();
        else if (e.key === 'Escape') handleCancel();
    };

    if (isEditing) {
        const { className: inputClassName, ...typographyStyles } = populateTypographyStylesAndClasses({ className, ...rest });
        return (
            <input
                value={value}
                autoFocus
                className={cx('bg-transparent', inputClassName)}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleConfirm}
                onKeyDown={handleKeyDown}
                multiple={multiple}
                {...typographyStyles} />
        )
    }

    return (
        <Typography
            className={cx('group cursor-pointer [word-break:break-word]', !children && 'text-muted-foreground', className)}
            role="button"
            onClick={handleEdit}
            {...rest}>
            {children || placeholder}
            {!hideEditIcon && (
                <Edit size={20} className="ml-2 inline opacity-0 transition-opacity group-hover:opacity-60" />
            )}
        </Typography>
    );
}
