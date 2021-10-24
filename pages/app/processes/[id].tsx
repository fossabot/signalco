import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, ButtonBase, Chip, Grid, Menu, MenuItem, OutlinedInput, Paper, Popover, Skeleton, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react';
import { AppLayoutWithAuth } from "../../../components/AppLayout";
import { observer } from 'mobx-react-lite';
import ProcessesRepository, { IProcessModel } from '../../../src/processes/ProcessesRepository';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoDataPlaceholder from '../../../components/shared/indicators/NoDataPlaceholder';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import { makeAutoObservable } from 'mobx';
import { DeviceModel } from '../../../src/devices/Device';
import DevicesRepository from '../../../src/devices/DevicesRepository';
import DisplayDeviceTarget from '../../../components/shared/entity/DisplayDeviceTarget';

interface IDeviceContactTarget {
    Channel: string | undefined;
    Contact: string | undefined;
}

interface IDeviceStateTarget extends IDeviceContactTarget {
    Identifier: string | undefined;
}

class DeviceStateTarget implements IDeviceStateTarget {
    Identifier: string | undefined;
    Channel: string | undefined;
    Contact: string | undefined;

    constructor(identifier?: string, channel?: string, contact?: string) {
        this.Identifier = identifier;
        this.Channel = channel;
        this.Contact = contact;
    }
}

interface IDeviceStateValue {
    Value?: any
}

interface IDeviceTargetState {
    Target: IDeviceStateTarget;
    Value: any | undefined;
}

const isIDeviceStateValue = (arg: any): arg is IDeviceStateValue => arg?.Value !== undefined;
const isIConditionDeviceStateTarget = (arg: any): arg is IConditionDeviceStateTarget => arg?.Target !== undefined;
const isIDeviceStateTarget = (arg: any): arg is IDeviceStateTarget => arg?.Identifier !== undefined && typeof arg?.Contact !== 'undefined' && typeof arg?.Channel !== 'undefined';

interface IDeviceStateTrigger extends IDeviceStateTarget { }

class DeviceStateTrigger implements IDeviceStateTrigger {
    Identifier: string | undefined;
    Channel: string | undefined;
    Contact: string | undefined;
}

interface IConditionDeviceStateTarget {
    Target: IDeviceStateTarget;
}

interface IConditionValueComparison {
    Operation?: string,
    Left: IDeviceStateValue | IConditionDeviceStateTarget | undefined,
    ValueOperation?: string,
    Right: IDeviceStateValue | IConditionDeviceStateTarget | undefined,
}

interface ICondition {
    Operation?: string,
    Operations: Array<IConditionValueComparison | ICondition>
}

class Condition implements ICondition {
    Operation?: string | undefined;
    Operations: (IConditionValueComparison | ICondition)[] = [];
}

const isIConditionValueComparison = (arg: any): arg is IConditionValueComparison => arg.Left !== undefined && arg.Right !== undefined;
const isICondition = (arg: any): arg is ICondition => arg.Operations !== undefined;

interface IConduct extends IDeviceTargetState {
}

class Conduct implements IConduct {
    Target: IDeviceStateTarget;
    Value: any;

    constructor(target?: IDeviceStateTarget, value?: any) {
        this.Target = target || new DeviceStateTarget();
        this.Value = value;

        makeAutoObservable(this);
    }
}

function parseTrigger(trigger: any): IDeviceStateTrigger | undefined {
    if (typeof trigger.Channel === 'undefined' ||
        typeof trigger.Identifier === 'undefined' ||
        typeof trigger.Contact === 'undefined') {
        return undefined;
    }

    return trigger;
}

function parseCondition(condition: any): ICondition | undefined {
    return condition;
}

function parseConduct(conduct: any): IConduct | undefined {
    return conduct;
}

function parseProcessConfiguration(configJson: string | undefined) {
    const config = JSON.parse(configJson ?? "");

    const triggers = typeof config.Triggers !== 'undefined' && Array.isArray(config.Triggers)
        ? (config.Triggers.map((t: any) => parseTrigger(t)) as IDeviceStateTrigger[])
        : new Array<IDeviceStateTrigger>();
    const condition = typeof config.Condition !== 'undefined'
        ? parseCondition(config.Condition) as ICondition
        : {} as ICondition | undefined;
    const conducts = typeof config.Conducts !== 'undefined' && Array.isArray(config.Conducts)
        ? config.Conducts.map((t: any) => parseConduct(t)) as IConduct[]
        : new Array<IConduct>();

    const configMapped = makeAutoObservable({
        Triggers: triggers.filter(t => typeof t !== undefined),
        Condition: condition,
        Conducts: conducts.filter(c => typeof c !== undefined)
    });

    return configMapped;
}

const DisplayValue = observer((props: { value: any | undefined, dataType: string, onChanged: (value: any | undefined) => void }) => {
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [dataType, setDataType] = useState(props.dataType);
    const [value, setValue] = useState<string>(props.value || "");

    useEffect(() => {
        if (!dataType) {
            setDataType(props.dataType);
        }
    }, [dataType, props.dataType]);

    const handleValueClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget)
    };

    const handleEditOptionSelected = (value: boolean | string | number | undefined) => {
        props.onChanged(value);
        handleClosed();
    };

    const handleClosedApplyValue = () => {
        let submitValue: any = value;
        if (dataType === 'double' || dataType === 'colortemp') {
            submitValue = parseFloat(value) || 0;
        }
        handleEditOptionSelected(submitValue);
        handleClosed();
    };

    const handleClosed = () => {
        setMenuAnchorEl(null);
    };

    let label: string | React.ReactNode = "None";
    if (dataType === 'bool' || dataType === "any") {
        label = props.value?.toString() || "Unknown";
    } else if (dataType === 'string') {
        label = `"${props.value}"`;
    } else if (dataType === 'double' || dataType === 'colortemp') {
        label = props.value;
    }

    return (
        <>
            <ButtonBase onClick={handleValueClick} aria-controls="displayvalue-select-menu" aria-haspopup="true">
                <Chip label={label} />
            </ButtonBase>
            {(dataType === 'bool' && Boolean(menuAnchorEl)) &&
                <Menu id="displayvalue-select-menu" open={Boolean(menuAnchorEl)} anchorEl={menuAnchorEl} keepMounted onClose={handleClosed}>
                    <MenuItem onClick={() => handleEditOptionSelected(true)}>true</MenuItem>
                    <MenuItem onClick={() => handleEditOptionSelected(false)}>false</MenuItem>
                    <MenuItem onClick={() => handleEditOptionSelected(undefined)}>None</MenuItem>
                </Menu>}
            {(dataType === 'string' && Boolean(menuAnchorEl)) &&
                <Popover open={true} anchorEl={menuAnchorEl} onClose={handleClosedApplyValue}>
                    <Paper sx={{ p: 2 }}>
                        <Stack spacing={1}>
                            <Typography>String</Typography>
                            <OutlinedInput size="small" value={value} onChange={(e) => setValue(e.target.value)} />
                        </Stack>
                    </Paper>
                </Popover>}
            {((dataType === 'double' || dataType === 'colortemp') && Boolean(menuAnchorEl)) &&
                <Popover open={true} anchorEl={menuAnchorEl} onClose={handleClosedApplyValue}>
                    <Paper sx={{ p: 2 }}>
                        <Stack spacing={1}>
                            <Typography>{dataType === 'double' ? 'Value' : 'Color temperature'}</Typography>
                            <OutlinedInput size="small" value={value} onChange={(e) => setValue(e.target.value)} />
                        </Stack>
                    </Paper>
                </Popover>}
        </>
    );
});

const DisplayConditionComparisonValueOperation = (props: { valueOperation?: string }) => {
    let sign = "=";
    switch (props.valueOperation) {
        case "EqualOrNull": sign = "?="; break;
        case "GreaterThan": sign = ">"; break;
        case "LessThan": sign = "<"; break;
        default: break;
    }

    return (
        <div>{sign}</div>
    );
};

const DisplayConditionValueComparison = (props: { comparison: IConditionValueComparison, onChanged: (updated: IConditionValueComparison) => void }) => {
    const handleChanged = (side: "left" | "right", updated: IDeviceStateTarget | any | undefined) => {
        const stateValue = isIDeviceStateValue(updated) ? updated : undefined;
        const deviceTarget = isIDeviceStateTarget(updated) ? updated : undefined;
        let conditionDeviceStateTarget: IConditionDeviceStateTarget | undefined = undefined;
        if (deviceTarget !== undefined)
            conditionDeviceStateTarget = { Target: deviceTarget };

        props.onChanged({
            Left: side === "left" ? (stateValue ?? conditionDeviceStateTarget) : props.comparison.Left,
            Right: side === "right" ? updated : props.comparison.Right,
            Operation: props.comparison.Operation,
            ValueOperation: props.comparison.ValueOperation
        });
    };

    return (
        <Stack alignItems="center" spacing={1} direction="row">
            {props.comparison.Operation &&
                <div>{props.comparison.Operation}</div>}
            {
                isIDeviceStateValue(props.comparison.Left)
                    ? <DisplayValue dataType="any" value={props.comparison.Left.Value} onChanged={(updated) => handleChanged("left", updated)} />
                    : (isIConditionDeviceStateTarget(props.comparison.Left)
                        ? <DisplayDeviceTarget target={props.comparison.Left.Target} onChanged={(updated) => handleChanged("left", updated)} />
                        : <span>Unknown</span>)
            }
            <DisplayConditionComparisonValueOperation valueOperation={props.comparison.ValueOperation} />
            {
                isIDeviceStateValue(props.comparison.Right)
                    ? <DisplayValue dataType="any" value={props.comparison.Right.Value} onChanged={(updated) => handleChanged("right", updated)} />
                    : (isIConditionDeviceStateTarget(props.comparison.Right)
                        ? <DisplayDeviceTarget target={props.comparison.Right.Target} onChanged={(updated) => handleChanged("right", updated)} />
                        : <span>Unknown</span>)
            }
        </Stack>
    );
}

const DisplayItemPlaceholder = () => (
    <Grid container direction="row" spacing={1}>
        <Grid item>
            <Skeleton variant="text" width={120} height={40} />
        </Grid>
        <Grid item>
            <Skeleton variant="text" width={40} height={40} />
        </Grid>
        <Grid item>
            <Skeleton variant="text" width={180} height={40} />
        </Grid>
        <Grid item>
            <Skeleton variant="text" width={30} height={40} />
        </Grid>
    </Grid>
);

const DisplayCondition = observer((props: { condition: ICondition, onChanged: (updated: ICondition) => void, isTopLevel: boolean }) => {
    const handleConditionOperationSelection = () => {

    };

    return (
        <Stack direction="row">
            {!props.isTopLevel && (
                <ButtonBase onClick={handleConditionOperationSelection} aria-controls="condition-operation-select-menu" aria-haspopup="true">
                    <Chip label={props.condition.Operation?.toString() ?? "None"} title={`${props.condition.Operation}`} />
                </ButtonBase>
            )}
            <Stack>
                {props.condition.Operations.map((op, i) => {
                    if (isICondition(op))
                        return <DisplayCondition key={i} condition={op} isTopLevel={false} onChanged={(updated) => {
                            const updatedOperations = [...props.condition.Operations];
                            updatedOperations[i] = updated;
                            props.onChanged({
                                Operation: props.condition.Operation,
                                Operations: updatedOperations
                            });
                        }} />;
                    else if (isIConditionValueComparison(op))
                        return <DisplayConditionValueComparison key={i} comparison={op as IConditionValueComparison} onChanged={(updated) => {
                            const updatedOperations = [...props.condition.Operations];
                            updatedOperations[i] = updated;
                            props.onChanged({
                                Operation: props.condition.Operation,
                                Operations: updatedOperations
                            });
                        }} />;
                    else
                        return (<span>Unknown</span>);
                })}
            </Stack>
        </Stack>
    );
});

const DisplayDeviceStateValue = observer((props: { target: IDeviceStateTarget, value: any | undefined, onChanged: (updated: IDeviceTargetState) => void }) => {
    const [device, setDevice] = useState<DeviceModel | undefined>();

    useEffect(() => {
        const loadDevice = async () => {
            if (props.target.Identifier) {
                setDevice(await DevicesRepository.getDeviceByIdentifierAsync(props.target.Identifier));
            } else {
                // TODO: Display error if device identifier is not provided
            }
        };

        loadDevice();
    }, [props.target.Identifier]);

    const contact = props.target.Contact && props.target.Channel
        ? device?.getContact({
            contactName: props.target.Contact,
            channelName: props.target.Channel,
            deviceId: device.id
        })
        : null;

    return (
        <Grid container alignItems="center" spacing={1}>
            <Grid item>
                <DisplayDeviceTarget target={props.target} onChanged={(value) => {
                    props.onChanged({
                        Target: value,
                        Value: typeof value.Contact !== 'undefined' ? props.value : undefined
                    });
                }} />
            </Grid>
            <Grid item>
                <span>set</span>
            </Grid>
            <Grid item>
                {contact ?
                    <DisplayValue dataType={contact.dataType} value={props.value} onChanged={(value) => {
                        props.onChanged({
                            Target: props.target,
                            Value: typeof props.target.Contact !== 'undefined' ? value : undefined
                        });
                    }} />
                    : <Skeleton />}
            </Grid>
        </Grid>
    );
});

const ProcessDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const [process, setProcess] = useState<IProcessModel | undefined>();
    const [processConfig, setProcessConfig] = useState<{
        Triggers: IDeviceStateTrigger[],
        Condition: ICondition | undefined,
        Conducts: IConduct[]
    } | undefined>(undefined);

    useEffect(() => {
        const loadDeviceAsync = async () => {
            try {
                if (typeof id !== "object" &&
                    typeof id !== 'undefined') {
                    const loadedProcess = await ProcessesRepository.getProcessAsync(id);
                    setProcess(loadedProcess);
                    if (loadedProcess) {
                        setProcessConfig(parseProcessConfiguration(loadedProcess.configurationSerialized));
                    }
                }
            } catch (err: any) {
                setError(err?.toString());
            } finally {
                setIsLoading(false);
            }
        };

        loadDeviceAsync();
    }, [id]);

    const persistProcessAsync = () => {
        if (process == null) {
            console.error("Can't persist null process.");
            return;
        }

        const configSerialized = JSON.stringify(processConfig);

        ProcessesRepository.saveProcessConfigurationAsync(process?.id, configSerialized);
    };

    const handleTriggerChange = (updated: IDeviceStateTrigger, index: number) => {
        // TODO: Use action to change state
        if (processConfig)
            processConfig.Triggers[index] = updated;

        persistProcessAsync();
    }

    const handleConditionChange = (updated: ICondition) => {
        // TODO: Use action to change state
        console.log(updated);
        if (processConfig)
            processConfig.Condition = updated;

        persistProcessAsync();
    };

    const handleValueChanged = (updated: IDeviceTargetState, index: number) => {
        // TODO: Use action to change state
        if (processConfig) {
            processConfig.Conducts[index].Value = updated.Value;
            processConfig.Conducts[index].Target.Channel = updated.Target.Channel;
            processConfig.Conducts[index].Target.Contact = updated.Target.Contact;
            processConfig.Conducts[index].Target.Identifier = updated.Target.Identifier;
        }

        persistProcessAsync();
    };

    const handleAddConduct = () => {
        if (processConfig)
            processConfig.Conducts.push(new Conduct());
    };

    const handleAddTrigger = () => {
        if (processConfig)
            processConfig.Triggers.push(new DeviceStateTrigger());
    }

    const handleAddCondition = () => {
        if (processConfig) {
            const condition = processConfig.Condition;
            if (condition)
                condition.Operations.push(new Condition());
        }
    }

    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ px: { sm: 2 }, py: 2 }}>
                <Grid container spacing={2} direction="column" wrap="nowrap">
                    <Grid item>
                        {isLoading ?
                            <Skeleton variant="text" width={260} height={60} /> :
                            <Typography variant="h1">{process?.alias ?? "Unknown"}</Typography>}
                    </Grid>
                    <Grid item>
                        <Grid container direction="row">
                            <Grid item xs={12} md={6}>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panelTriggers-content"
                                        id="panelTriggers-header"
                                    >
                                        <Typography>Triggers</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={1}>
                                            {isLoading && <DisplayItemPlaceholder />}
                                            {!isLoading &&
                                                (processConfig?.Triggers?.length
                                                    ? processConfig.Triggers.map((t, i) => <DisplayDeviceTarget key={`trigger${i}`} target={t} onChanged={(updated) => handleTriggerChange(updated, i)} />)
                                                    : <NoDataPlaceholder content="No triggers" />)}
                                            <Button fullWidth startIcon={<AddSharpIcon />} disabled={isLoading} onClick={handleAddTrigger}>Add trigger</Button>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panelConditions-content"
                                        id="panelConditions-header"
                                    >
                                        <Typography>Conditions</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={1}>
                                            {isLoading && <><DisplayItemPlaceholder /><DisplayItemPlaceholder /><DisplayItemPlaceholder /></>}
                                            {!isLoading &&
                                                (typeof processConfig?.Condition !== 'undefined'
                                                    ? <DisplayCondition isTopLevel condition={processConfig.Condition} onChanged={handleConditionChange} />
                                                    : <NoDataPlaceholder content="No condition" />)}
                                            <Button fullWidth startIcon={<AddSharpIcon />} disabled={isLoading} onClick={handleAddCondition}>Add condition</Button>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion defaultExpanded>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panelConducts-content"
                                        id="panelConducts-header"
                                    >
                                        <Typography>Conducts</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={1}>
                                            {isLoading && <><DisplayItemPlaceholder /><DisplayItemPlaceholder /></>}
                                            {!isLoading &&
                                                (processConfig?.Conducts?.length
                                                    ? processConfig.Conducts.map((c, i) => <DisplayDeviceStateValue key={`value${i}`} target={c.Target} value={c.Value} onChanged={(u) => handleValueChanged(u, i)} />)
                                                    : <NoDataPlaceholder content="No conducts" />)}
                                            <Button fullWidth startIcon={<AddSharpIcon />} disabled={isLoading} onClick={handleAddConduct}>Add conduct</Button>
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box >
        </>
    );
}

ProcessDetails.layout = AppLayoutWithAuth;

export default observer(ProcessDetails);
