'use client';

import { NoDataPlaceholder } from '@signalco/ui/dist/NoDataPlaceholder';
import { List } from '@signalco/ui/dist/List';
import { useSearchParam } from '@signalco/hooks/dist/useSearchParam';
import { ListItemCreate } from '../../shared/ListItemCreate';
import { useProcessTaskDefinitionCreate } from '../../../src/hooks/useProcessTaskDefinitionCreate';
import { ProcessRunTaskDto, ProcessTaskDefinitionDto } from '../../../app/api/dtos/dtos';
import { TaskListItem } from './TaskListItem';

type TaskListProps = {
    processId: string;
    tasks: {
        taskDefinition: ProcessTaskDefinitionDto;
        task?: ProcessRunTaskDto;
    }[];
    editable: boolean;
};

export default function TaskList({ processId, tasks, editable }: TaskListProps) {
    const [selectedTaskId, setSelectedTask] = useSearchParam('task');
    const taskDefinitionCreate = useProcessTaskDefinitionCreate();

    const handleCreateTaskDefinition = async () => {
        const result = await taskDefinitionCreate.mutateAsync({
            processId,
            text: 'New task'
        });
        if (result?.id) {
            setSelectedTask(result?.id);
        }
    };

    return (
        <List className="divide-y rounded-lg border">
            {tasks.map((item, taskIndex) => (
                <TaskListItem
                    key={item.taskDefinition.id}
                    selected={selectedTaskId === item.taskDefinition.id.toString()}
                    taskDefinition={item.taskDefinition}
                    task={item.task}
                    taskIndex={taskIndex}
                    editable={editable} />
            ))}
            {editable && (
                <ListItemCreate
                    label="Add task"
                    onSelected={handleCreateTaskDefinition} />
            )}
            {!editable && tasks.length <= 0 && (
                <NoDataPlaceholder className="p-2">No tasks</NoDataPlaceholder>
            )}
        </List>
    );
}
