import { Share } from '@signalco/ui-icons';
import { IconButtonCopyToClipboard } from '@signalco/ui/dist/IconButtonCopyToClipboard';
import { useIsServer } from '@signalco/hooks/dist/useIsServer';

export default function ShareSocial() {
    const isServer = useIsServer();
    if (isServer)
        return null;

    const value = window.location.href;
    return (
        <IconButtonCopyToClipboard
            title="Copy link to clipboard"
            value={value}
            successMessage={'Copied'}
            errorMessage={'Failed to copy'}>
            <Share />
        </IconButtonCopyToClipboard>
    );
}
