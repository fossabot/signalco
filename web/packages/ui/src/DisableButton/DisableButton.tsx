import { Check, Disabled } from '@signalco/ui-icons';
import { Button } from '@mui/joy';

export type DisableButtonProps = {
    readonly?: boolean;
    disabled: boolean;
    onClick?: () => void;
}

export function DisableButton(props: DisableButtonProps) {
    const { disabled, readonly, onClick } = props;

    return (
        <Button
            disabled={readonly}
            color={disabled ? 'warning' : 'success'}
            variant={disabled ? 'solid' : 'soft'}
            size="sm"
            startDecorator={disabled ? <Disabled /> : <Check />}
            onClick={onClick}>
            {disabled ? 'Disabled' : 'Enabled'}
        </Button>
    );
}
