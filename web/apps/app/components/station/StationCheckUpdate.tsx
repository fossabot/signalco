import { compareVersions } from 'compare-versions';
import { Check, Upload } from '@signalco/ui-icons';
import { Button } from '@signalco/ui/dist/Button';
import { objectWithKey } from '@signalco/js';
import { useLoadAndError } from '@signalco/hooks/dist/useLoadAndError';
import StationsRepository from '../../src/stations/StationsRepository';
import { showNotification } from '../../src/notifications/PageNotificationService';
import useLocale, { localizer, useLocalePlaceholders } from '../../src/hooks/useLocale';

async function loadLatestAvailableVersion() {
    try {
        return await (await fetch('https://api.github.com/repos/signalco-io/station/releases/latest')).json();
    }
    catch (err) {
        console.warn('Failed to retrieve latest available version', err);
        throw err;
    }
}

// TODO: Use generic command dispatch with state and error handling
const stationCommandAsync = async (stationId: string | string[] | undefined, command: (id: string) => Promise<void>, commandDescription: string) => {
    try {
        if (stationId == null ||
            typeof stationId !== 'string')
            throw Error('Station identifier not available. Can\'t ' + commandDescription);

        await command(stationId);
    }
    catch (err) {
        console.error('Station command execution error', err);
        showNotification(localizer('App', 'Stations')('StationCommandError'), 'error');
    }
}

export default function StationCheckUpdate(props: { stationId: string[] | string | undefined, stationVersion: string | undefined }) {
    const { t } = useLocale('App', 'Stations');
    const { t: tPlaceholder } = useLocalePlaceholders();

    const latestAvailableVersion = useLoadAndError(loadLatestAvailableVersion);
    const latestAvailableVersionName = objectWithKey(latestAvailableVersion.item, 'name');
    const canUpdate = (!latestAvailableVersion.isLoading && !latestAvailableVersion.error && props.stationVersion)
        ? compareVersions(latestAvailableVersionName?.name?.toString().replace('v', '') ?? '', props.stationVersion)
        : false;

    const handleUpdate = () => stationCommandAsync(props.stationId, StationsRepository.updateStationAsync, 'update station');

    return (
        <Button
            startDecorator={canUpdate ? <Upload /> : <Check />}
            variant="outlined"
            disabled={!canUpdate}
            onClick={handleUpdate}>
            {canUpdate && latestAvailableVersion
                ? t('UpdateStationVersion', { version: latestAvailableVersionName?.name ?? tPlaceholder('Unknown') })
                : t('UpdateStationUpToDate')}
        </Button>
    );
}

