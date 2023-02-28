import React from 'react';
import dynamic from 'next/dynamic';
import { Down, Stop, Up } from '@signalco/ui-icons';
import { Stack, Button, Divider, Grid, Typography } from '@signalco/ui';
import { WidgetSharedProps } from '../Widget';
import { DefaultColumns, DefaultLabel } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { showNotification } from '../../../src/notifications/PageNotificationService';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useEntity from '../../../src/hooks/signalco/useEntity';
import useContact from '../../../src/hooks/signalco/useContact';
import IContactPointer from '../../../src/contacts/IContactPointer';
import { StateAction, executeStateActionsAsync } from './WidgetState';

const WindowVisual = dynamic(() => import('../../icons/WindowVisual'));

type ConfigProps = {
    label: string,
    targetUp: StateAction | undefined;
    targetDown: StateAction | undefined;
    targetPosition: Partial<IContactPointer> | undefined;
    stopValueSerialized: string | undefined;
    stopAfter: string | undefined;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    { name: 'targetUp', label: 'Up button', type: 'entityContactValue' },
    { name: 'targetDown', label: 'Down button', type: 'entityContactValue' },
    { name: 'targetPosition', label: 'Position', type: 'entityContact', optional: true },
    { name: 'stopValueSerialized', label: 'Stop value', type: 'string' },
    { name: 'stopAfter', label: 'Stop after', type: 'number', dataUnit: 'seconds', optional: true },
    DefaultColumns(4)
];

function WidgetShades({ config, onOptions }: WidgetSharedProps<ConfigProps>) {
    const upEntity = useEntity(config?.targetUp?.entityId);
    const downEntity = useEntity(config?.targetDown?.entityId);
    const positionContact = useContact(config?.targetPosition)

    const label = config?.label ?? upEntity?.data?.alias ?? downEntity?.data?.alias ?? '';
    const columns = config?.columns ?? 4;
    const stopValueSerialized = config?.stopValueSerialized;

    // Calculate position
    let shadePerc = 0.7;
    if (positionContact.data?.valueSerialized)
        shadePerc = parseFloat(positionContact.data.valueSerialized) / 100;
    if (Number.isNaN(shadePerc))
        shadePerc = 0.7;

    useWidgetOptions(stateOptions, { onOptions });

    const handleStateChangeRequest = (direction: 'up' | 'down' | 'stop') => {
        if (!upEntity || !downEntity) {
            console.warn('State change requested but device is undefined.');
            showNotification('Can\'t execute action, widget is not loaded yet.', 'warning');
            return;
        }

        const stopActions = (delay = 0) => {
            if (config?.targetUp && config?.targetDown) {
                return [
                    { ...config?.targetUp, valueSerialized: stopValueSerialized, delay },
                    { ...config?.targetDown, valueSerialized: stopValueSerialized, delay },
                ];
            }
            return [];
        }

        const actions: StateAction[] = [];
        const stopAfterDelay = config?.stopAfter ? (Number.parseFloat(config.stopAfter) || 0) * 1000 : 0;
        switch (direction) {
        case 'up':
            if (config?.targetUp)
                actions.push(config?.targetUp)
            break;
        case 'down':
            if (config?.targetDown)
                actions.push(config?.targetDown)
            break;
        default:
        case 'stop':
            // eslint-disable-next-line prefer-spread
            actions.push.apply(actions, stopActions());
            break;
        }

        // Trigger stop if requested in fonfig
        if (direction !== 'stop' && config?.stopAfter) {
            // eslint-disable-next-line prefer-spread
            actions.push.apply(actions, stopActions(stopAfterDelay));
        }

        executeStateActionsAsync(actions);
    };

    return (
        <Grid container wrap="nowrap" sx={{ height: '100%' }}>
            {columns > 1 && (
                <>
                    <Grid xs={6}>
                        <Stack style={{ height: '100%', paddingLeft: 2.5 * 8, paddingRight: 1.5 * 8, paddingTop: 16, paddingBottom: 16 }} justifyContent={columns > 2 ? 'space-between' : 'center'}>
                            <WindowVisual shadePerc={1 - shadePerc} size={68} />
                            {columns > 2 && <Typography fontWeight="500" noWrap>{label}</Typography>}
                        </Stack>
                    </Grid>
                    <Divider orientation="vertical" />
                </>
            )}
            <Grid xs={6} sx={{ flexGrow: 1, borderColor: 'divider', borderRadius: '0 8px 8px 0' }}>
                <Stack style={{ height: '100%' }} justifyContent="stretch">
                    <Button variant="outlined" onClick={() => handleStateChangeRequest('up')}
                        sx={{ borderRadius: '0 8px 0 0', flexGrow: 1, border: 0, width: 'calc(100% - 2px)' }}
                        aria-label="Up"><Up /></Button>
                    {stopValueSerialized && <Button variant="outlined" onClick={() => handleStateChangeRequest('stop')} sx={{ borderRadius: 0, flexGrow: 1, border: 0 }} aria-label="Stop">
                        <Stop size={18} /></Button>}
                    <Button variant="outlined" onClick={() => handleStateChangeRequest('down')}
                        sx={{ borderRadius: '0 0 8px 0', flexGrow: 1, border: 0, width: 'calc(100% - 2px)' }}
                        aria-label="Down"><Down /></Button>
                </Stack>
            </Grid>
        </Grid>
    );
}

WidgetShades.columns = 4;

export default WidgetShades;