import { Row } from '@signalco/ui-primitives/Row';
import { ListChecks, Navigate } from '@signalco/ui-icons';
import { SharedWithIndicator } from '../../shared/SharedWithIndicator';
import { ListItem } from '../../shared/ListItem';
import { KnownPages } from '../../../src/knownPages';
import { ProcessDto } from '../../../app/api/dtos/dtos';

export type ProcessListItemProps = {
    process: ProcessDto;
};

export function ProcessesListItem({ process }: ProcessListItemProps) {
    return (
        <ListItem
            label={process.name}
            startDecorator={<ListChecks />}
            endDecorator={(
                <Row spacing={1}>
                    <SharedWithIndicator shareableEntity={process} />
                    <Navigate className="hidden opacity-0 group-hover:opacity-100 md:block" />
                </Row>
            )}
            className="group w-full"
            href={KnownPages.Process(process.id)} />
    );
}
