import React, { useMemo, useState } from 'react';
import { usePopupState } from 'material-ui-popup-state/hooks';
import { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Box, Stack } from '@mui/system';
import { Button, Card, CardOverflow, IconButton, ListItemDecorator, Menu, MenuItem, TextField, Typography } from '@mui/joy';
import { Add, MoreVertical } from 'components/shared/Icons';
import Picker from 'components/shared/form/Picker';
import CodeEditor from 'components/code/CodeEditor';
import SelectItems from '../../shared/form/SelectItems';
import ConfigurationDialog from '../../shared/dialog/ConfigurationDialog';
import useLocale from '../../../src/hooks/useLocale';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import { setAsync } from '../../../src/contacts/ContactRepository';
import Timeago from '../../../components/shared/time/Timeago';
import AutoTable from '../../../components/shared/table/AutoTable';

function JsonNonArrayVisualizer(props: { name: string, value: any }) {
    if (props.value === null ||
        typeof (props.value) === 'undefined') {
        return <div>null</div>
    }

    if (typeof props.value === 'object') {
        const propertyNames = Object.keys(props.value);
        const properties = typeof props.value !== 'undefined' && propertyNames
            ? propertyNames.map(pn => ({ name: pn, value: props.value[pn] }))
            : [];

        return (
            <div>
                {properties && properties.map(prop =>
                    <JsonVisualizer key={prop.name} name={prop.name} value={prop.value} />)}
            </div>
        );
    }

    return null;
}
function JsonArrayVisualizer(props: { name: string, value: Array<any> }) {
    return (
        <>
            {props.value.map((v, i) => <JsonVisualizer key={`${props.name}-${i}`} name={i.toString()} value={v} />)}
        </>
    );
}

function JsonVisualizer(props: { name: string, value: any }) {
    return (
        <div>
            <Stack spacing={1} direction="row" alignItems="center">
                {props.name && <Typography>{props.name}</Typography>}
                {(typeof props.value !== 'object' && !Array.isArray(props.value)) && (
                    <Typography>{props.value?.toString()}</Typography>
                )}
                <Typography level="body3">({Array.isArray(props.value) ? `array(${props.value.length})` : typeof props.value})</Typography>
            </Stack>
            <Box sx={{ borderLeft: '1px solid', borderColor: 'divider', px: 2 }}>
                {Array.isArray(props.value)
                    ? <JsonArrayVisualizer name={props.name} value={props.value as Array<any>} />
                    : <JsonNonArrayVisualizer name={props.name} value={props.value} />}
            </Box>
        </div>
    );
}

function DisplayJson(props: { json: string | undefined }) {
    const [showSource, setShowSource] = useState(false);
    const jsonObj = useMemo(() => JSON.parse(props.json ?? ''), [props.json]);
    const jsonFormatted = useMemo(() => JSON.stringify(jsonObj, undefined, 4), [jsonObj]);

    return (
        <Box sx={{ position: 'relative', minWidth: '230px' }}>
            {showSource ? (
                <CodeEditor language="json" code={jsonFormatted} height={300} />
            ) : (
                <JsonVisualizer name="" value={jsonObj} />
            )}
            <Box sx={{ position: 'absolute', right: 0, top: 0 }}>
                <Picker value={showSource ? 'source' : 'ui'} onChange={(_, s) => setShowSource(s === 'source')} options={[
                    { value: 'ui', label: 'UI' },
                    { value: 'source', label: 'Source' }
                ]} />
            </Box>
        </Box>
    );
}

function isJson(value: string | undefined) {
    try {
        if (typeof value === 'string' &&
            value[0] === '{' &&
            typeof JSON.parse(value) !== 'undefined')
            return true;
        return false;
    } catch {
        return false;
    }
}

export default function ContactsTable(props: { entity: IEntityDetails | undefined; }) {
    const { entity } = props;
    const { t } = useLocale('App', 'Entities');

    const tableItems = entity?.contacts?.map(c => ({
        id: c.contactName,
        name: c.contactName,
        channel: c.channelName,
        value: isJson(c.valueSerialized) ? <DisplayJson json={c.valueSerialized} /> : c.valueSerialized,
        lastActivity: <Timeago date={c.timeStamp} live />
    }));
    const isLoading = false;
    const error = undefined;

    const popupState = usePopupState({ variant: 'popover', popupId: 'contactsMenu' });
    const createContactDialogState = usePopupState({ variant: 'dialog', popupId: 'contactCreateDialog' });
    const editContactValueDialogState = usePopupState({ variant: 'dialog', popupId: 'contactCreateDialog' });
    const [channelName, setChannelName] = useState('');
    const [contactName, setContactName] = useState('');
    const [editingContact, setEditingContact] = useState('');
    const [valueSerialized, setValueSerialized] = useState('');

    const handleCreateSubmit = async () => {
        if (entity) {
            await setAsync({
                entityId: entity.id,
                channelName,
                contactName
            }, undefined);
        }
        createContactDialogState.close();
    };
    const handleEditValueSubmit = async () => {
        if (entity) {
            await setAsync({
                entityId: entity.id,
                channelName: entity.contacts.find(c => c.contactName === editingContact)?.channelName ?? '',
                contactName: editingContact
            }, valueSerialized);
        }
        editContactValueDialogState.close();
    };

    return (
        <>
            <Card>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography>{t('Contacts')}</Typography>
                    <IconButton size="sm" {...bindTrigger(popupState)}>
                        <MoreVertical />
                    </IconButton>
                </Stack>
                <CardOverflow>
                    <Stack spacing={4}>
                        <AutoTable error={error} isLoading={isLoading} items={tableItems} localize={t} />
                    </Stack>
                </CardOverflow>
            </Card>
            <Menu {...bindMenu(popupState)}>
                <MenuItem {...bindTrigger(createContactDialogState)}>
                    <ListItemDecorator>
                        <Add />
                    </ListItemDecorator>
                    {t('CreateContact')}
                </MenuItem>
                <MenuItem {...bindTrigger(editContactValueDialogState)}>
                    <ListItemDecorator>
                        <Add />
                    </ListItemDecorator>
                    {t('EditContact')}
                </MenuItem>
            </Menu>
            <ConfigurationDialog
                isOpen={createContactDialogState.isOpen}
                title="Create contact"
                onClose={createContactDialogState.close}>
                <Stack spacing={1}>
                    <TextField value={channelName} onChange={(e) => setChannelName(e.target.value)} />
                    <TextField value={contactName} onChange={(e) => setContactName(e.target.value)} />
                    <Button onClick={handleCreateSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
            <ConfigurationDialog
                isOpen={editContactValueDialogState.isOpen}
                title="Create contact"
                onClose={editContactValueDialogState.close}>
                <Stack spacing={1}>
                    <SelectItems
                        items={entity?.contacts?.map(c => ({ value: c.contactName, label: c.contactName })) ?? []}
                        value={editingContact ? [editingContact] : []}
                        onChange={(values) => setEditingContact(values[0])} />
                    <TextField value={valueSerialized} onChange={(e) => setValueSerialized(e.target.value)} />
                    <Button onClick={handleEditValueSubmit}>Create</Button>
                </Stack>
            </ConfigurationDialog>
        </>
    );
}
