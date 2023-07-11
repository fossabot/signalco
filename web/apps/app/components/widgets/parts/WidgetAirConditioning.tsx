import React, { useMemo } from 'react';
import Link from 'next/link';
import { cx } from 'classix';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Icon } from '@signalco/ui/dist/Icon';
import { Button } from '@signalco/ui/dist/Button';
import { useLoadAndError } from '@signalco/hooks';
import { WidgetSharedProps } from '../Widget';
import Graph from '../../graphs/Graph';
import { DefaultRows, DefaultLabel, DefaultColumns } from '../../../src/widgets/WidgetConfigurationOptions';
import IWidgetConfigurationOption from '../../../src/widgets/IWidgetConfigurationOption';
import { KnownPages } from '../../../src/knownPages';
import useWidgetOptions from '../../../src/hooks/widgets/useWidgetOptions';
import useContact from '../../../src/hooks/signalco/useContact';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import IContactPointer from '../../../src/contacts/IContactPointer';
import { historiesAsync } from '../../../src/contacts/ContactRepository';

type ConfigProps = {
    label?: string;
    targetTemperature: IContactPointer | undefined;
    targetHumidity: IContactPointer | undefined;
    targetHeating: IContactPointer | undefined;
    targetCooling: IContactPointer | undefined;
    rows: number;
    columns: number;
}

const stateOptions: IWidgetConfigurationOption<ConfigProps>[] = [
    DefaultLabel,
    { name: 'targetTemperature', label: 'Temperature', type: 'entityContact', optional: true },
    { name: 'targetHumidity', label: 'Humidity', type: 'entityContact', optional: true },
    { name: 'targetHeating', label: 'Heating', type: 'entityContact', optional: true },
    { name: 'targetCooling', label: 'Cooling', type: 'entityContact', optional: true },
    DefaultColumns(4),
    DefaultRows(4)
];

interface SmallIndicatorProps {
    isActive: boolean;
    icon: string;
    label: string;
    activeBackgroundColor: string;
    href: string;
    small?: boolean | undefined;
}

function SmallIndicator({
    isActive,
    icon,
    label,
    activeBackgroundColor,
    href,
    small = true
}: SmallIndicatorProps) {
    return (
        <Link href={href} passHref>
            <Button variant="plain" fullWidth>
                <div
                    className={cx(
                        'rounded-md',
                        !small && 'min-w-[52px] min-h-[82px]',
                        small && 'min-w-[24px] min-h-[30px]'
                    )}
                    style={{
                        backgroundColor: isActive ? activeBackgroundColor : 'transparent',
                    }}>
                    <Stack alignItems="center" justifyContent="center" style={{ height: '100%', flexDirection: small ? 'row' : 'column' }} spacing={1}>
                        <Icon sx={{ fontSize: small ? 18 : 28, opacity: isActive ? 1 : 0.3, }}>{icon}</Icon>
                        <Typography level="body3">{label}</Typography>
                    </Stack>
                </div>
            </Button>
        </Link>
    );
}

function numberWholeAndDecimal(data: string | undefined) {
    const degrees = typeof data !== 'undefined'
        ? Number.parseFloat(data)
        : undefined;
    const degreesWhole = typeof degrees !== 'undefined'
        ? Math.floor(degrees)
        : undefined;
    return [
        degreesWhole,
        typeof degrees !== 'undefined' && typeof degreesWhole !== 'undefined'
            ? Math.floor((degrees - degreesWhole) * 10)
            : undefined
    ];
}

function WidgetAirConditioning(props: WidgetSharedProps<ConfigProps>) {
    const { config } = props;
    useWidgetOptions(stateOptions, props);
    const { data: temperatureDevice } = useEntity(config?.targetTemperature?.entityId);
    const { data: heatingDevice } = useEntity(config?.targetHeating?.entityId);
    const { data: coolingDevice } = useEntity(config?.targetCooling?.entityId);

    const { data: temperatureContact } = useContact(temperatureDevice && config?.targetTemperature);
    const { data: humidityContact } = useContact(temperatureDevice && config?.targetHumidity);

    const columns = config?.columns ?? 4;
    const rows = config?.rows ?? 4;

    const [degreesWhole, degreesDecimal] = numberWholeAndDecimal(temperatureContact?.valueSerialized);
    const [humidityWhole] = numberWholeAndDecimal(humidityContact?.valueSerialized);

    const heatingContact = useContact(heatingDevice && config?.targetHeating ? {
        channelName: config?.targetHeating?.channelName,
        contactName: config?.targetHeating?.contactName,
        entityId: heatingDevice.id
    } : undefined)?.data;
    const heatingActive = heatingContact?.valueSerialized === 'true';

    const duration = 24 * 60 * 60 * 1000;
    const loadHistoryCallback = useMemo(() =>
        temperatureContact
            ? (() => historiesAsync([temperatureContact], duration))
            : undefined, [temperatureContact, duration]);
    const historyData = useLoadAndError(loadHistoryCallback);

    return (
        <div className="w-full h-full">
            <Stack alignItems="center" justifyContent="center" style={{ height: '100%' }}>
                <Link href={`${KnownPages.Entities}/${temperatureDevice?.id}`} passHref>
                    <Button variant="plain">
                        <Row alignItems="stretch">
                            <Stack style={{ height: '100%' }} justifyContent="center" alignItems="center">
                                <Typography extraThin fontSize={rows > 2 ? 64 : 42} lineHeight={1}>{degreesWhole}</Typography>
                            </Stack>
                            <Stack justifyContent="space-between">
                                <Typography extraThin fontSize={rows > 2 ? 18 : 12} opacity={0.6}>&#176;C</Typography>
                                <Typography extraThin fontSize={rows > 2 ? 18 : 14} opacity={0.6}>.{degreesDecimal}</Typography>
                            </Stack>
                        </Row>
                    </Button>
                </Link>
                {config?.label && (
                    <Typography
                        thin={rows > 1}
                        fontSize={rows > 1 ? '1rem' : '0.7rem'}
                        opacity={0.5}>
                        {config.label}
                    </Typography>
                )}
                {rows > 1 && (
                    <Row spacing={rows < 4 ? 0 : 1} style={{
                        marginTop: rows > 2 ? (rows < 4 ? 0 : 4 * 8) : 8,
                        flexDirection: rows < 4 ? 'column' : 'row',
                        position: rows < 4 ? 'absolute' : 'unset',
                        right: rows < 4 ? 12 : undefined,
                        top: rows < 4 ? 0 : undefined
                    }} alignItems="stretch">
                        {humidityContact && (
                            <SmallIndicator small={rows < 4} isActive={false} label={`${humidityWhole}%`} icon="water_drop" href={`${KnownPages.Entities}/${humidityContact?.entityId}`} activeBackgroundColor={'#445D79'} />
                        )}
                        {config?.targetCooling &&
                            <SmallIndicator small={rows < 4} isActive={false} label="Cooling" icon="ac_unit" activeBackgroundColor="#445D79" href={`${KnownPages.Entities}/${coolingDevice?.id}`} />
                        }
                        {config?.targetHeating &&
                            <SmallIndicator small={rows < 4} isActive={heatingActive} label="Heating" icon="whatshot" activeBackgroundColor="#A14D4D" href={`${KnownPages.Entities}/${heatingDevice?.id}`} />
                        }
                    </Row>
                )}
            </Stack>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <Graph
                    isLoading={historyData.isLoading}
                    error={historyData.error}
                    data={historyData.item?.at(0)?.history?.map(i => ({
                        id: i.timeStamp.toUTCString(),
                        value: i.valueSerialized ?? ''
                    })) ?? []}
                    durationMs={duration}
                    width={columns * 84 - 2}
                    height={rows * 25}
                    hideLegend
                    adaptiveDomain
                />
            </div>
        </div>
    );
}

WidgetAirConditioning.columns = 4;
WidgetAirConditioning.rows = 4;

export default WidgetAirConditioning;
