import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack } from "@mui/material";
import React, { useState, useContext } from "react";
import WidgetConfiguration from "./WidgetConfiguration";
import MoreHorizSharpIcon from '@mui/icons-material/MoreHorizSharp';
import { Delete, Settings } from "@mui/icons-material";
import {
    usePopupState,
    bindTrigger,
    bindMenu,
} from 'material-ui-popup-state/hooks';
import { AppContext } from "../../../pages/_app";
import IWidgetConfigurationOption from "../../../src/widgets/IWidgetConfigurationOption";
import { IsConfigurationValid } from "../../../src/widgets/ConfigurationValidator";

interface IWidgetCardProps {
    children: JSX.Element,
    state: boolean,
    isEditMode?: boolean
    config?: any,
    options?: IWidgetConfigurationOption[],
    onConfigured?: (config: any) => void
    onRemove?: () => void
}

function applyStaticToConfig(config: any | undefined, options: IWidgetConfigurationOption[] | undefined) {
    const staticConfigs: { [key: string]: any } = {};
    if (options) {
        options.filter(o => o.type === 'static').forEach(o => {
            staticConfigs[o.name] = o.default;
        });
    }

    return {
        ...staticConfigs,
        ...config
    };
}

const WidgetCard = (props: IWidgetCardProps) => {
    const {
        children,
        state,
        isEditMode,
        options,
        onConfigured,
        onRemove
    } = props;

    const appContext = useContext(AppContext);
    const configWithStatic = applyStaticToConfig(props.config, options);

    const width = (configWithStatic as any)?.columns || 2;
    const height = (configWithStatic as any)?.rows || 2;
    const sizeWidth = width * 78 + (width - 1) * 8;
    const sizeHeight = height * 78 + (height - 1) * 8;

    const needsConfiguration = !options || !IsConfigurationValid(configWithStatic, options);

    const popupState = usePopupState({ variant: 'popover', popupId: 'accountMenu' })

    const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
    const handleOnConfiguration = (config: object) => {
        if (onConfigured) {
            onConfigured(config);
        }
        setIsConfiguring(false);
    }

    const handleOnConfigureClicked = () => {
        setIsConfiguring(true);
        popupState.close();
    };

    const handleOnRemove = () => {
        popupState.close();
        if (onRemove) {
            onRemove();
        }
    }

    let bgColor;
    if (appContext.theme === 'dark') {
        bgColor = state ? 'action.selected' : undefined;
    } else {
        bgColor = state ? 'background.default' : undefined
    }

    return (
        <>
            <Paper
                sx={{
                    position: 'relative',
                    borderRadius: 2,
                    width: sizeWidth,
                    height: sizeHeight,
                    display: "block",
                    bgcolor: bgColor
                }}
                variant='outlined'>
                {needsConfiguration ? (
                    <Stack justifyContent="stretch" sx={{ height: '100%' }}>
                        <Button disabled={!isEditMode} size="large" sx={{ height: '100%', fontSize: width < 2 ? '0.7em' : '1em' }} fullWidth onClick={handleOnConfigureClicked}>Configure widget</Button>
                    </Stack>
                ) : (<>{children}</>)}
                {isEditMode && (
                    <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <Button sx={{ minWidth: '42px' }}  {...bindTrigger(popupState)}><MoreHorizSharpIcon /></Button>
                    </Box>
                )}
            </Paper >
            {options && <WidgetConfiguration onConfiguration={handleOnConfiguration} options={options} config={configWithStatic} isOpen={isConfiguring} />}
            <Menu {...bindMenu(popupState)}>
                {options && (
                    <MenuItem onClick={handleOnConfigureClicked}>
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText>Configure</ListItemText>
                    </MenuItem>
                )}
                {onRemove && (
                    <MenuItem onClick={handleOnRemove}>
                        <ListItemIcon>
                            <Delete />
                        </ListItemIcon>
                        <ListItemText>Remove</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}

export default WidgetCard;