import IContactPointer from './IContactPointer';
import { requestAsync } from '../services/HttpService';
import { toDuration } from '../services/DateTimeProvider';

export interface ContactHistoryItem {
    timeStamp: Date;
    valueSerialized: string | undefined;
}

interface TimeStampValuePairDto {
    timeStamp: string;
    valueSerialized: string | undefined;
}

interface ContactHistoryResponseDto {
    values: TimeStampValuePairDto[]
}

export async function setAsync(pointer: IContactPointer, valueSerialized: string | undefined, timeStamp?: Date | undefined) {
    await requestAsync('/contact/set', 'post', {
        entityId: pointer.entityId,
        contactName: pointer.contactName,
        channelName: pointer.channelName,
        valueSerialized: valueSerialized,
        timeStamp: timeStamp?.toISOString()
    });
}

export async function historyAsync(pointer: IContactPointer, duration?: Date | string | number | undefined) {
    return (await requestAsync('/contact/history', 'get', {
        entityId: pointer.entityId,
        channelName: pointer.channelName,
        contactName: pointer.contactName,
        duration: typeof duration === 'string' || typeof duration === 'undefined' || typeof duration === 'number'
            ? duration
            : toDuration(duration)
    }) as ContactHistoryResponseDto).values.map(tsvp => ({
        timeStamp: new Date(tsvp.timeStamp),
        valueSerialized: tsvp.valueSerialized
    }) as ContactHistoryItem);
}
