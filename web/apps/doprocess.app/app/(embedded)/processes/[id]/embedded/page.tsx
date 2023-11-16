import { TaskDetails } from '../../../../../components/processes/tasks/TaskDetails';
import { ProcessDetails } from '../../../../../components/processes/ProcessDetails';
import { SplitView } from '../../../../../components/layouts/SplitView';

export default function ProcessEmbeddedPage({ params }: { params: { id: string } }) {
    const editable = false;
    return (
        <SplitView>
            <div className="p-2">
                <ProcessDetails id={params.id} editable={editable} />
            </div>
            <div className="p-2">
                <TaskDetails processId={params.id} editable={editable} />
            </div>
        </SplitView>
    );
}
