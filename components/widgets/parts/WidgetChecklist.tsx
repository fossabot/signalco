import { Button, Checkbox, FormControlLabel, FormGroup, IconButton, Input, InputAdornment, ListItemIcon, ListItemText, Menu, MenuItem, Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import WidgetCard from './WidgetCard';
import { Box } from '@mui/system';
import { IWidgetSharedProps } from "../Widget";
import { DefaultHeight, DefaultLabel, DefaultWidth } from "../../../src/widgets/WidgetConfigurationOptions";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { observable, runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import { bindMenu, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import DeleteIcon from '@mui/icons-material/Delete';
import NoDataPlaceholder from "../../shared/indicators/NoDataPlaceholder";
import LocalStorageService from "../../../src/services/LocalStorageService";
import CheckIcon from "@mui/icons-material/Check";
import { v4 as uuidv4 } from 'uuid';
import IWidgetConfigurationOption from "../../../src/widgets/IWidgetConfigurationOption";

const stateOptions: IWidgetConfigurationOption[] = [
    DefaultLabel,
    { label: 'Remove when done', name: 'removeOnDone', type: 'yesno', default: true, optional: true },
    DefaultHeight(4),
    DefaultWidth(4)
];

interface IChecklistItem {
    id: string,
    done?: boolean,
    text: string
};

const ChecklistItem = observer((props: { item: IChecklistItem, onChange: (id: string, done: boolean) => void, onRemove: (id: string) => void }) => {
    const { item, onChange, onRemove } = props;
    const popupState = usePopupState({ variant: 'popover', popupId: `checkboxItemMenu${item.id}` });

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <FormGroup sx={{ flexGrow: 1 }}>
                    <FormControlLabel
                        control={<Checkbox checked={item.done} onChange={(e) => onChange(item.id, e.currentTarget.checked)} />}
                        sx={{ textDecorationLine: item.done ? 'line-through' : 'none' }}
                        label={item.text} />
                </FormGroup>
                <IconButton {...bindTrigger(popupState)} edge="end"><MoreHorizIcon sx={{ opacity: 0.3 }} /></IconButton>
            </Stack>
            <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={() => onRemove(item.id)}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>Remove</ListItemText>
                </MenuItem>
            </Menu>
        </>
    )
});

const WidgetChecklist = (props: IWidgetSharedProps) => {
    const { id, config, setConfig, isEditMode, onRemove } = props;
    const [items] = useState(observable(LocalStorageService.getItemOrDefault<IChecklistItem[]>(`checklist-${id}`, [])));
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [newItemText, setNewItemText] = useState('');

    const removeOnDoneDelay = 500;
    const label = config?.label ?? "Checklist";
    const removeOnDone = config?.removeOnDone ?? true;

    const saveItems = useCallback((items: IChecklistItem[]) => {
        LocalStorageService.setItem<IChecklistItem[]>(`checklist-${id}`, items);
    }, [id]);

    const handleNewItem = () => {
        items.push({ id: uuidv4(), text: newItemText });
        saveItems(items);
        setIsAddingItem(false);
        setNewItemText('');
    }

    const handleItemChanged = (id: string, done: boolean) => {
        const item = items.find(i => i.id === id);
        if (item) {
            runInAction(() => {
                item.done = done;
                if (done && removeOnDone) {
                    setTimeout(() => {
                        handleItemRemoved(id);
                    }, removeOnDoneDelay);
                } else {
                    saveItems(items);
                }
            })
        }
    };

    const handleItemRemoved = (id: string) => {
        runInAction(() => {
            items.splice(items.findIndex(i => i.id === id), 1);
            saveItems(items);
        });
    };

    return (
        <WidgetCard
            state={items.length > 0}
            isEditMode={isEditMode}
            onConfigured={setConfig}
            onRemove={onRemove}
            options={stateOptions}
            config={config}>
            <Stack sx={{ height: '100%' }} spacing={2} pt={2} pb={3}>
                <Typography fontSize={24} sx={{ px: 2 }}>{label}</Typography>
                <Box sx={{ flexGrow: 1, overflow: 'auto', overflowX: 'hidden' }}>
                    <Stack sx={{ height: '100%', pl: 2, pr: 3 }}>
                        {items.length
                            ? items.map(item => <ChecklistItem key={item.id} item={item} onChange={handleItemChanged} onRemove={handleItemRemoved} />)
                            : <Box display="flex" height="100%" alignItems="center" justifyContent="center"><NoDataPlaceholder content="No items :)" /></Box>}
                    </Stack>
                </Box>
                <Box sx={{ px: 2 }}>
                    {isAddingItem
                        ? <form onSubmit={handleNewItem}>
                            <Input
                                autoFocus
                                size="small"
                                value={newItemText}
                                onChange={(e) => setNewItemText(e.currentTarget.value)}
                                fullWidth
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton type="submit" edge="end"><CheckIcon /></IconButton>
                                    </InputAdornment>
                                } />
                        </form>
                        : <Button variant="outlined" fullWidth onClick={() => setIsAddingItem(true)}>Add item</Button>}
                </Box>
            </Stack>
        </WidgetCard>
    );
};

export default observer(WidgetChecklist);