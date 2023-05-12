import { ChangeEvent, ReactNode } from 'react';
import { Checkbox as JoyCheckbox } from '@mui/joy';
import { SxProps } from '@mui/system';

export type CheckboxProps = {
    checked: boolean;
    readonly?: boolean;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    sx?: SxProps | undefined; // TODO: Remove - only used for padding in one place
    label?: ReactNode;
    disableIcon?: boolean;
}

export function Checkbox(props: CheckboxProps) {
    const { checked, readonly, onChange, sx, label, disableIcon } = props;

    return (
        <JoyCheckbox
            label={label}
            sx={{
                ...sx,
                'input': {
                    cursor: readonly ? 'default' : 'pointer'
                },
                '.JoyCheckbox-checkbox:hover': {
                    backgroundColor: readonly ? 'var(--joy-palette-primary-solidBg)' : undefined
                }
            }}
            readOnly={readonly}
            checked={checked}
            disableIcon={disableIcon}
            variant={disableIcon && !checked ? 'plain' : 'solid'}
            onChange={onChange} />
    );
}
