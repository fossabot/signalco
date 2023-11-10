import { RunsListView } from '../../../../../../components/processes/RunsListView';

export default function ProcessRunsPage({ params }: { params: { id: string } }) {
    const processId = params.id;
    return <RunsListView processId={processId} />
}
