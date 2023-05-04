import { useMemo } from 'react';
import { Close, Equal, EqualNot, Play, Warning, Timer, Pause, Left, Right } from '@signalco/ui-icons';
import { Typography } from '@signalco/ui/dist/Typography';
import { Timeago } from '@signalco/ui/dist/Timeago';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { IconButton } from '@signalco/ui/dist/IconButton';
import { Container } from '@signalco/ui/dist/Container';
import { Chip } from '@signalco/ui/dist/Chip';
import { Card } from '@signalco/ui/dist/Card';
import { Box } from '@signalco/ui/dist/Box';
import { Alert } from '@signalco/ui/dist/Alert';
import DisplayEntityTarget from '../../shared/entity/DisplayEntityTarget';
import useContact from '../../../src/hooks/signalco/useContact';
import IEntityDetails from '../../../src/entity/IEntityDetails';
import { setAsync } from '../../../src/contacts/ContactRepository';

declare namespace ProcessConfigurationV1 {
    export interface ContactPointer {
        entityId: string;
        channelName: string;
        contactName: string;
    }

    export interface ConditionContact {
        type: 'contact';
        contactPointer: ContactPointer;
    }

    export interface ConditionConstant {
        type: 'value';
        valueSerialized: string;
    }

    export interface ConditionOrGroup {
        type: 'orGroup';
        conditions: Condition[];
    }

    export interface ConditionCompare {
        type: 'compare';
        left: Condition;
        op: number;
        right: Condition;
    }

    export type Condition = ConditionContact | ConditionConstant | ConditionCompare | ConditionOrGroup;

    export interface Contact {
        contactPointer: ContactPointer;
        valueSerialized: string;
    }

    export interface Conduct {
        id: string;
        type: string;
        conditions: Condition[];
        contacts: Contact[];
        notBeforeConduct?: string;
        delayBefore?: number;
        delayAfter?: number;
    }

    export interface Configuration {
        $schema: string;
        type: number;
        conducts: Conduct[];
    }
}

function CompareOperation({ operation }: { operation: number }) {
    if (operation === 0)
        return <Equal />;
    if (operation === 1)
        return <EqualNot />;
    if (operation === 2)
        return <Left />;
    if (operation === 3)
        return <Right />;
    if (operation === 4)
        return <><Left /><Equal /></>;
    if (operation === 5)
        return <><Right /><Equal /></>;

    return <Typography color="danger">{`Unknown operation: ${operation}`}</Typography>;
}

function Condition(props: { condition: ProcessConfigurationV1.Condition }) {
    const { condition } = props;

    return (
        <div>
            {(condition.type === 'contact') && (
                <>
                    <DisplayEntityTarget target={condition.contactPointer} selectContact />
                </>
            )}
            {(condition.type === 'value') && (
                <>
                    {condition.valueSerialized}
                </>
            )}
            {(condition.type === 'compare') && (
                <Row spacing={1}>
                    <Condition condition={condition.left} />
                    <CompareOperation operation={condition.op} />
                    <Condition condition={condition.right} />
                </Row>
            )}
            {(condition.type === 'orGroup') && (
                <Row spacing={1}>
                    {condition.conditions.map((c, i) => (
                        <>
                            <Condition key={i} condition={c} />
                            {i < condition.conditions.length - 1 && <Typography>or</Typography>}
                        </>
                    ))}
                </Row>
            )}
        </div>
    )
}

function ExecutionDisplay(props: { entity: IEntityDetails }) {
    const { entity } = props;
    const executeContact = useContact({ entityId: entity.id, channelName: 'signalco', contactName: 'executed' });
    const executed = executeContact?.data?.valueSerialized ? JSON.parse(executeContact?.data?.valueSerialized) : undefined;

    return (
        <Chip startDecorator={<Play />}>
            <Timeago date={executed?.StartTimeStamp} />
        </Chip>
    )
}

export default function EntityProcessDetails(props: { entity: IEntityDetails; }) {
    const { entity } = props;
    const configurationErrorContactPointer = { entityId: entity.id, channelName: 'signalco', contactName: 'configurationError' };



    const configurationContact = useContact({ entityId: entity.id, channelName: 'signalco', contactName: 'configuration' });
    const config: ProcessConfigurationV1.Configuration = useMemo(() => configurationContact.data?.valueSerialized ? JSON.parse(configurationContact.data?.valueSerialized) : undefined, [configurationContact.data]);
    const errorContact = useContact(configurationErrorContactPointer);

    const handleDismissError = async () => {
        await setAsync(configurationErrorContactPointer, '');
    }

    return (
        <Container>
            <Stack spacing={2}>
                <Row>
                    <ExecutionDisplay entity={entity} />
                </Row>
                {errorContact.data?.valueSerialized && (
                    <Alert
                        color="danger"
                        sx={{ alignItems: 'flex-start' }}
                        startDecorator={<Warning />}
                        endDecorator={
                            <IconButton size="sm" color="danger" onClick={handleDismissError}>
                                <Close />
                            </IconButton>
                        }>
                        <Stack>
                            <Typography>Configuration error</Typography>
                            <Timeago date={errorContact.data.timeStamp} />
                            <Typography level="body3">{errorContact.data?.valueSerialized}</Typography>
                        </Stack>
                    </Alert>
                )}
                <Stack spacing={2}>
                    {config?.conducts?.map(conduct => (
                        <Card key={conduct.id}>
                            <Stack spacing={1}>
                                {/* {conduct.id && (
                                    <Typography>{conduct.id}</Typography>
                                )} */}

                                {conduct.conditions?.length > 0 && (
                                    <>
                                        <Typography level="h6">When</Typography>
                                        <Stack spacing={1}>
                                            {conduct.conditions.map((condition, i) => <Condition key={i} condition={condition} />)}
                                        </Stack>
                                    </>
                                )}

                                {conduct.notBeforeConduct && (
                                    <Card>
                                        <Row spacing={2}>
                                            <Pause />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Row spacing={1} justifyContent="space-between">
                                                    <Typography semiBold>Wait for</Typography>
                                                    <Typography>{conduct.notBeforeConduct}</Typography>
                                                </Row>
                                            </Box>
                                        </Row>
                                    </Card>
                                )}
                                {conduct.delayBefore && (
                                    <Card>
                                        <Row spacing={2}>
                                            <Timer />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Row spacing={1} justifyContent="space-between">
                                                    <Typography semiBold>Delay</Typography>
                                                    <Typography>{`${conduct.delayBefore / 1000}s`}</Typography>
                                                </Row>
                                            </Box>
                                        </Row>
                                    </Card>
                                )}

                                <Typography level="h6">Do</Typography>
                                <Stack spacing={1}>
                                    {conduct.contacts.map(conductTargets => (
                                        <div key={`${conductTargets.contactPointer.entityId}-${conductTargets.contactPointer.channelName}-${conductTargets.contactPointer.contactName}`}>
                                            <DisplayEntityTarget target={conductTargets.contactPointer} valueSerialized={conductTargets.valueSerialized} selectContact selectValue />
                                        </div>
                                    ))}
                                </Stack>

                                {conduct.delayAfter && (
                                    <Card>
                                        <Row spacing={2}>
                                            <Timer />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Row spacing={1} justifyContent="space-between">
                                                    <Typography semiBold>Delay after</Typography>
                                                    <Typography>{`${conduct.delayAfter / 1000}s`}</Typography>
                                                </Row>
                                            </Box>
                                        </Row>
                                    </Card>
                                )}
                            </Stack>
                        </Card>
                    ))}
                </Stack>
            </Stack>
        </Container>
    );
}
