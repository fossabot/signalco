import { useState, Fragment } from 'react';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Card, CardContent, CardTitle } from '@signalco/ui/dist/Card';
import { Button } from '@signalco/ui/dist/Button';
import EntityStatus from '../../entity/EntityStatus';
import { showNotification } from '../../../src/notifications/PageNotificationService';
import useContact from '../../../src/hooks/signalco/useContact';
import type IEntityDetails from '../../../src/entity/IEntityDetails';
import IContactPointer from '../../../src/contacts/IContactPointer';
import ConductsService from '../../../src/conducts/ConductsService';

function ContactButton({ pointer }: { pointer: IContactPointer }) {
    const { data: contact, isLoading, error } = useContact(pointer);
    const [executing, setExecuting] = useState(false);

    const handleContactAction = async () => {
        try {
            setExecuting(true);
            await ConductsService.RequestMultipleConductAsync([
                { pointer, delay: 0 },
            ]);
        } catch (err) {
            console.warn('Failed to execute conduct', err);
            showNotification('Failed to execute conduct', 'error');
        } finally {
            setExecuting(false);
        }
    };

    if (!contact || isLoading || error) {
        return null;
    }

    return (
        <Button onClick={handleContactAction} loading={executing}>{contact.contactName}</Button>
    )
}

function stationPointer(entity: IEntityDetails, contactName: string) {
    return { entityId: entity.id, channelName: 'station', contactName };
}

export default function EntityStationDetails({ entity }: { entity: IEntityDetails }) {
    const infos = [
        { label: 'Status', value: <EntityStatus entity={entity} /> },
        { label: 'Version', value: entity.contacts.find(c => c.channelName === 'signalco' && c.contactName === 'version')?.valueSerialized },
    ];

    return (
        <div className="flex gap-2">
            <Card>
                <CardTitle><Typography className="mb-2">Info</Typography></CardTitle>
                <CardContent>
                    <div className="grid grid-cols-2 gap-1">
                        {infos.map(info => (
                            <Fragment key={info.label}>
                                <label>{info.label}</label>
                                <div>{info.value}</div>
                            </Fragment>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardTitle><Typography className="mb-4">Actions</Typography></CardTitle>
                <CardContent>
                    <Stack>
                        <ContactButton pointer={stationPointer(entity, 'restartStation')} />
                        <ContactButton pointer={stationPointer(entity, 'restartSystem')} />
                        <ContactButton pointer={stationPointer(entity, 'shutdownSystem')} />
                        <ContactButton pointer={stationPointer(entity, 'update')} />
                        <ContactButton pointer={stationPointer(entity, 'updateSystem')} />
                        <ContactButton pointer={stationPointer(entity, 'workerService:start')} />
                        <ContactButton pointer={stationPointer(entity, 'workerService:stop')} />
                    </Stack>
                </CardContent>
            </Card>
        </div>
    );
}
