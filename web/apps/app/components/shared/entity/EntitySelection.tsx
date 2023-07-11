import React, { useMemo, useState } from 'react';
import { Stack } from '@signalco/ui/dist/Stack';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { List } from '@signalco/ui/dist/List';
import { ListItem } from '@signalco/ui/dist/ListItem';
import { Input } from '@signalco/ui/dist/Input';
import useAllEntities from '../../../src/hooks/signalco/entity/useAllEntities';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import IContactPointer from '../../../src/contacts/IContactPointer';

export type EntitySelectionProps = {
    target: Partial<IContactPointer> | undefined;
    onSelected: (target: Partial<IContactPointer> | undefined) => void;
};

export default function EntitySelection({ target, onSelected }: EntitySelectionProps) {
    const entities = useAllEntities();
    const handleEntitySelected = (selectedEntity: IEntityDetails | undefined) => {
        onSelected(selectedEntity ? { entityId: selectedEntity.id } : undefined);
    };

    const [searchTerm, setSearchTerm] = useState<string>('');
    const filteredEntities = useMemo(() => {
        return searchTerm
            ? entities.data?.filter(e => e.alias.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0)
            : entities.data;
    }, [searchTerm, entities.data]);

    return (
        <Loadable isLoading={entities.isLoading} loadingLabel="Loading entity" error={entities.error}>
            <Stack spacing={1}>
                <div className="p-2">
                    <Input
                        autoFocus
                        className="w-full"
                        placeholder="Search..."
                        onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <List>
                    <ListItem
                        nodeId={`entity-contact-selection-${target?.entityId}-none`}
                        onSelected={() => handleEntitySelected(undefined)}
                        selected={!target?.entityId}
                        label="None" />
                    {filteredEntities?.map(entity => (
                        <ListItem
                            key={entity.id}
                            nodeId={`entity-contact-selection-${target?.entityId}-${entity.id}`}
                            label={entity.alias}
                            onSelected={() => handleEntitySelected(entity)}
                            selected={target?.entityId === entity.id} />
                    ))}
                </List>
            </Stack>
        </Loadable>
    );
}
