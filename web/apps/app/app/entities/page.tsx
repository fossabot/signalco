'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Add, Check, LayoutGrid, LayoutList } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { SelectItems } from '@signalco/ui/dist/SelectItems';
import { Row } from '@signalco/ui/dist/Row';
import { Picker } from '@signalco/ui/dist/Picker';
import { Loadable } from '@signalco/ui/dist/Loadable';
import { Button } from '@signalco/ui/dist/Button';
import { Avatar, IconButton, Box, Grid, MuiStack } from '@signalco/ui';
import { useSearchParam } from '@signalco/hooks';
import { KnownPages } from '../../src/knownPages';
import useUserSetting from '../../src/hooks/useUserSetting';
import useLocale from '../../src/hooks/useLocale';
import useAllEntities from '../../src/hooks/signalco/entity/useAllEntities';
import IEntityDetails from '../../src/entity/IEntityDetails';
import { entityDeleteAsync, entityUpsertAsync } from '../../src/entity/EntityRepository';
import SearchInput from '../../components/shared/inputs/SearchInput';
import { EntityIconByType } from '../../components/shared/entity/EntityIcon';
import ConfirmDeleteButton from '../../components/shared/dialog/ConfirmDeleteButton';
import ConfigurationDialog from '../../components/shared/dialog/ConfigurationDialog';
import EntityCard from '../../components/entity/EntityCard';

const entityTypes = [
    { value: '1', label: 'Devices' },
    { value: '2', label: 'Dashboards' },
    { value: '3', label: 'Process' },
    { value: '4', label: 'Stations' },
    { value: '5', label: 'Channels' }
];

const createEntityType = [
    { value: 3, label: 'Process' },
    { value: 4, label: 'Station' },
    { value: 1, label: 'Device' },
    { value: 2, label: 'Dashboard' },
    { value: 5, label: 'Channel' }
];

function EntityCreateForm() {
    const router = useRouter();
    const { t } = useLocale('App', 'Entities', 'NewEntityDialog');
    const { t: tType } = useLocale('Global', 'Entity', 'Types');

    const onType = async (type: { value: number, label: string }) => {
        const id = await entityUpsertAsync(undefined, type.value, 'New ' + tType(type.label));
        router.push(`${KnownPages.Entities}/${id}`);
    };

    return (
        <Stack spacing={2}>
            <Typography level="body2">{t('PickTypeHeader')}</Typography>
            <Stack spacing={1}>
                {createEntityType.map(type => (
                    <Button key={type.value} onClick={() => onType(type)}>{tType(type.label)}</Button>
                ))}
            </Stack>
        </Stack>
    );
}

export default function Entities() {
    const { t } = useLocale('App', 'Entities');
    const [selectedType, setSelectedType] = useSearchParam('type', '1');
    const entities = useAllEntities(parseInt(selectedType, 10) || 1);

    const [entityListViewType, setEntityListViewType] = useUserSetting<string>('entityListViewType', 'table');
    const [filteredItems, setFilteredItems] = useState<IEntityDetails[] | undefined>(entities.data);

    const [isSelecting, setIsSelecting] = useState(false);
    const [selected, setSelected] = useState<IEntityDetails[]>([]);
    const handleToggleSelection = () => {
        setIsSelecting(!isSelecting);
    };
    const handleEntitySelection = useCallback((entity: IEntityDetails) => {
        if (!selected.find(e => e.id === entity.id)) {
            setSelected([...selected, entity]);
        } else {
            setSelected(selected.filter(e => e.id !== entity.id));
        }
    }, [selected]);

    const queryClient = useQueryClient();
    const handleConfirmDeleteSelected = async () => {
        await Promise.all(selected.map(e => entityDeleteAsync(e.id)));
        queryClient.invalidateQueries(['entities']);
        queryClient.invalidateQueries(['entities', parseInt(selectedType, 10)]);
        setSelected([]);
    };

    const typedItems = useMemo(() => filteredItems?.filter(e => {
        return e.type.toString() === selectedType;
    }), [filteredItems, selectedType]);

    const columns = useMemo(() => ({
        xs: entityListViewType === 'table' ? 12 : 6,
        sm: entityListViewType === 'table' ? 12 : 4,
        lg: entityListViewType === 'table' ? 12 : 3,
        xl: entityListViewType === 'table' ? 12 : 2
    }), [entityListViewType]);

    const results = useMemo(() => (
        <Box sx={{ px: 2 }}>
            <Grid container spacing={1}>
                {typedItems?.map(entity => (
                    <Grid key={entity.id} {...columns}>
                        <EntityCard
                            entity={entity}
                            spread={entityListViewType === 'table'}
                            selectable={isSelecting}
                            selected={!!selected.find(e => e.id === entity.id)}
                            onSelection={() => handleEntitySelection(entity)} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    ), [columns, entityListViewType, handleEntitySelection, isSelecting, selected, typedItems]);

    const [isAddEntityOpen, setIsAddEntityOpen] = useState(false);
    const handleAddEntity = () => setIsAddEntityOpen(true);

    return (
        <>
            <MuiStack spacing={{ xs: 2, sm: 4 }} sx={{ pt: { xs: 0, sm: 2 } }}>
                <Stack spacing={1}>
                    <Row justifyContent="space-between" style={{ paddingLeft: 16, paddingRight: 16 }}>
                        <SelectItems
                            minWidth={220}
                            value={selectedType ? [selectedType] : []}
                            onChange={(v) => setSelectedType(v[0])}
                            items={entityTypes.map(t => {
                                const Icon = EntityIconByType(parseInt(t.value));
                                return ({
                                    value: t.value, label: t.label, content: (
                                        <Row spacing={1}>
                                            <Avatar><Icon /></Avatar>
                                            <Typography>{t.label}</Typography>
                                        </Row>
                                    )
                                });
                            })}
                            heading />
                        <MuiStack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: { xs: 1, sm: 0 } }} justifyContent="end">
                            <SearchInput items={entities.data} onFilteredItems={setFilteredItems} />
                            <Picker value={entityListViewType} onChange={(_, value) => setEntityListViewType(value)} options={[
                                { value: 'table', label: <LayoutList /> },
                                { value: 'cards', label: <LayoutGrid /> }
                            ]} />
                            <IconButton size="lg" onClick={handleAddEntity}><Add /></IconButton>
                            <IconButton size="lg" onClick={handleToggleSelection}><Check /></IconButton>
                        </MuiStack>
                    </Row>
                    {isSelecting && (
                        <Row>
                            <ConfirmDeleteButton
                                expectedConfirmText="confirm"
                                buttonLabel="Delete selected"
                                header={`Delete ${selected.length} entities`}
                                onConfirm={handleConfirmDeleteSelected} />
                        </Row>
                    )}
                </Stack>
                <Stack>
                    <Loadable isLoading={entities.isLoading} loadingLabel="Loading entities" error={entities.error}>
                        {results}
                    </Loadable>
                </Stack>
            </MuiStack>
            <ConfigurationDialog isOpen={isAddEntityOpen} header={t('NewEntityDialogTitle')} onClose={() => setIsAddEntityOpen(false)}>
                <EntityCreateForm />
            </ConfigurationDialog>
        </>
    );
}
