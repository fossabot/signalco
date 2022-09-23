import { arrayMax } from 'src/helpers/ArrayHelpers'
import IEntityDetails from './IEntityDetails'

export function entityInError(entity: IEntityDetails | undefined) {
    if (typeof entity === 'undefined') return false;
    const contact = entity.contacts.find(c => c.contactName === 'offline');
    if (!contact) return undefined;
    return contact.valueSerialized?.toLocaleLowerCase() === 'true';
}

export function entityLastActivity(entity: IEntityDetails | undefined) {
    if (typeof entity === 'undefined') return new Date(0);
    const maxTimeStamp = arrayMax<Date | undefined>(entity.contacts.map(c => c.timeStamp), d => d?.getTime());
    if (maxTimeStamp)
        return new Date(maxTimeStamp);
    return undefined;
}
