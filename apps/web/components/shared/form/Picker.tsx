import { ChangeEvent, ReactElement } from 'react';
import { Radio, RadioGroup } from '@signalco/ui';

export interface PickerOption {
    value: any;
    label: ReactElement | string;
    disabled?: boolean;
}

export interface PickerProps<TValue> {
    value: TValue | undefined;
    onChange: (event: ChangeEvent<HTMLInputElement>, value: TValue | undefined) => void;
    options: PickerOption[];
    size?: 'sm' | 'md';
}

export default function Picker<TValue>(props: PickerProps<TValue>) {
    const { value, options, size, onChange } = props;
    return (
        <RadioGroup
            row
            name="justify"
            value={value}
            onChange={(e) => onChange(e, e.target.value as (TValue | undefined))}
            sx={{
                alignSelf: 'start',
                minHeight: size === 'sm' ? 32 : 48,
                padding: size === 'sm' ? '2px' : '4px',
                borderRadius: 'md',
                bgcolor: 'neutral.softBg',
                '--RadioGroup-gap': size === 'sm' ? '2px' : '4px',
                '--Radio-action-radius': '8px',
            }}
        >
            {options.map((option) => (
                <Radio
                    key={option.value}
                    color="neutral"
                    disabled={option.disabled}
                    value={option.value}
                    disableIcon
                    label={option.label}
                    variant="plain"
                    sx={{
                        px: 2,
                        alignItems: 'center',
                    }}
                    slotProps={{
                        action: ({ checked }) => ({
                            sx: {
                                ...(checked && {
                                    bgcolor: 'background.surface',
                                    boxShadow: size === 'sm' ? 'sm' : 'md',
                                    '&:hover': {
                                        bgcolor: 'background.surface',
                                    },
                                }),
                            },
                        }),
                    }}
                />
            ))}
        </RadioGroup>
    )
}
