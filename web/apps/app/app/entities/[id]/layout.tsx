'use client';

import { type PropsWithChildren } from 'react';
import { ExternalLink } from '@signalco/ui-icons';
import { Timeago } from '@signalco/ui/dist/Timeago';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { DisableButton } from '@signalco/ui/dist/DisableButton';
import { Chip } from '@signalco/ui/dist/Chip';
import { camelToSentenceCase } from '@signalco/js';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import useContact from '../../../src/hooks/signalco/useContact';
import useEntity from '../../../src/hooks/signalco/entity/useEntity';
import { entityLastActivity } from '../../../src/entity/EntityHelper';
import { setAsync } from '../../../src/contacts/ContactRepository';
import EntityOptions from '../../../components/views/Entity/EntityOptions';
import BatteryIndicator from '../../../components/indicators/BatteryIndicator';
import ShareEntityChip from '../../../components/entity/ShareEntityChip';
import EntityStatus, { useEntityStatus } from '../../../components/entity/EntityStatus';
import { useEntityBattery } from '../../../components/entity/EntityBattery';

export default function EntityLayout({ children, params }: PropsWithChildren<{ params: { id?: string } }>) {
    const { id } = params;
    const { data: entity } = useEntity(id);
    const [showRawParam, setShowRawParam] = useSearchParam<string>('raw', 'false');
    const showRaw = showRawParam === 'true';
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);
    const { hasBattery, level } = useEntityBattery(entity);

    const disabledContactPointer = entity && { entityId: entity.id, channelName: 'signalco', contactName: 'disabled' };
    const disabledContact = useContact(disabledContactPointer);
    const isDisabled = disabledContact.data?.valueSerialized === 'true';
    const handleDisableToggle = async () => {
        if (disabledContactPointer) {
            await setAsync(disabledContactPointer, (!isDisabled).toString())
        }
    };

    const visitLinks = entity?.contacts
        .filter(c => (c.contactName === 'visit' || c.contactName.startsWith('visit-')) && c.valueSerialized)
        .map(c => ({
            alias: c.contactName.includes('-') ? camelToSentenceCase(c.contactName.substring(c.contactName.indexOf('-') + 1)) : 'Visit',
            href: c.valueSerialized as string
        }));

    return (
        <div className="flex flex-col">
            <Stack className="px-2 py-1" spacing={1}>
                <Row spacing={1} justifyContent="space-between">
                    <Row spacing={1}>
                        {(hasStatus && (isStale || isOffline)) && (
                            <Chip>
                                <EntityStatus entity={entity} />
                                <Timeago date={entityLastActivity(entity)} />
                            </Chip>
                        )}
                        {hasBattery &&
                            <Chip>
                                <BatteryIndicator level={level} size="sm" />
                                {`${level}%`}
                            </Chip>
                        }
                        {(!disabledContact.isLoading && !disabledContact.isError) && (
                            <DisableButton disabled={isDisabled} onClick={handleDisableToggle} />
                        )}
                        <ShareEntityChip entity={entity} entityType={1} />
                        {visitLinks?.map(link => (
                            <Chip key={link.href} href={link.href} startDecorator={<ExternalLink size={16} />}>{link.alias}</Chip>
                        ))}
                    </Row>
                    <EntityOptions
                        id={id}
                        canHideRaw={true}
                        showRaw={showRaw}
                        showRawChanged={(show) => setShowRawParam(show ? 'true' : undefined)} />
                </Row>
            </Stack>
            <div className="px-2">
                {children}
            </div>
        </div>
    );
}