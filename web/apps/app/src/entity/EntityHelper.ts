import { arrayMax } from '@signalco/js';
import IEntityDetails from './IEntityDetails'

export function entityBatteryLevel(entity: IEntityDetails | null | undefined) {
    return parseFloat(entity?.contacts.find(c => c.contactName === 'battery')?.valueSerialized ?? '');
}

export function entityHasOffline(entity: IEntityDetails | null | undefined) {
    if (entity == null) return false;
    return !!entity.contacts.find(c => c.contactName === 'offline');
}

export function entityInError(entity: IEntityDetails | null | undefined) {
    if (entity == null) return false;
    const contact = entity.contacts.find(c => c.contactName === 'offline');
    if (!contact) return undefined;
    return contact.valueSerialized?.toLocaleLowerCase() === 'true';
}

export function entityLastActivity(entity: IEntityDetails | null | undefined) {
    if (entity == null) return new Date(0);
    const maxTimeStamp = arrayMax<Date | undefined>(entity.contacts.map(c => c.timeStamp), d => d?.getTime());
    if (maxTimeStamp)
        return new Date(maxTimeStamp);
    return undefined;
}
