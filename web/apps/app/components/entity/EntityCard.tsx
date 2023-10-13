import { type FormEvent } from 'react';
import Link from 'next/link';
import { cx } from 'classix';
import { Typography } from '@signalco/ui/dist/Typography';
import { Timeago } from '@signalco/ui/dist/Timeago';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Checkbox } from '@signalco/ui/dist/Checkbox';
import { Card } from '@signalco/ui/dist/Card';
import { Avatar } from '@signalco/ui/dist/Avatar';
import EntityIcon from '../shared/entity/EntityIcon';
import BatteryIndicator from '../indicators/BatteryIndicator';
import { KnownPages } from '../../src/knownPages';
import IEntityDetails from '../../src/entity/IEntityDetails';
import { entityLastActivity } from '../../src/entity/EntityHelper';
import ShareEntityChip from './ShareEntityChip';
import EntityStatus, { useEntityStatus } from './EntityStatus';
import { useEntityBattery } from './EntityBattery';

export interface EntityCardProps {
    entity: IEntityDetails;
    spread: boolean;
    selectable?: boolean;
    selected?: boolean;
    onSelection?: (event: FormEvent<HTMLButtonElement>) => void;
}

export default function EntityCard({ entity, spread, selectable, selected, onSelection }: EntityCardProps) {
    const { hasStatus, isOffline, isStale } = useEntityStatus(entity);
    const { hasBattery, level } = useEntityBattery(entity);
    const Icon = EntityIcon(entity);

    const Container = spread ? Row : Stack;

    return (
        <Row spacing={1}>
            {selectable && <Checkbox checked={selected ?? false} onChange={onSelection} />}
            <Link href={`${KnownPages.Entities}/${entity.id}`} className="h-full grow overflow-hidden">
                <Card className={cx('h-full p-1', spread && 'p-0')}>
                    <Container
                        spacing={2}
                        justifyContent="space-between"
                        className="h-full">
                        <Row spacing={1}>
                            <Avatar>
                                <Icon />
                            </Avatar>
                            <Typography noWrap>{entity.alias}</Typography>
                        </Row>
                        <Row
                            justifyContent="space-between"
                            spacing={1}>
                            <ShareEntityChip entityType={2} entity={entity} disableAction hideSingle />
                            <Row spacing={1} className={cx(spread && 'pr-4')}>
                                {hasBattery && <BatteryIndicator level={level} minLevel="low" />}
                                {(hasStatus && (isStale || isOffline)) && (
                                    <div className="text-xs opacity-60">
                                        <Timeago date={entityLastActivity(entity)} />
                                    </div>
                                )}
                                <EntityStatus entity={entity} />
                            </Row>
                        </Row>
                    </Container>
                </Card>
            </Link>
        </Row>
    );
}
