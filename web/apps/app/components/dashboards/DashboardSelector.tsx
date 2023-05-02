import React, { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import { Select } from '@signalco/ui-icons';
import { useSearchParam } from '@signalco/hooks';
import useDashboards from '../../src/hooks/dashboards/useDashboards';
import DashboardSelectorMenu from './DashboardSelectorMenu';
import { Button } from '@signalco/ui/dist/Button';
import { Row } from '@signalco/ui/dist/Row';
import { Popper} from '@signalco/ui/dist/Popper';
export interface IDashboardSelectorProps {
    onEditWidgets: () => void,
    onSettings: () => void
}

function DashboardSelector(props: IDashboardSelectorProps) {
    const { onEditWidgets, onSettings } = props;
    const popupState = usePopupState({ variant: 'popover', popupId: 'dashboardsMenu' });
    const [selectedId, setSelectedId] = useSearchParam('dashboard');
    const { data: dashboards } = useDashboards();

    const currentDashboard = dashboards?.find(d => d.id == selectedId);
    const currentName = currentDashboard?.name;
    const favoriteDashboards = dashboards?.filter(d => d.isFavorite);

    // Set initial selection on component and dashboards load
    useEffect(() => {
        if (!selectedId && dashboards?.length) {
            console.log('Selecting first available dashboard', dashboards[0].id);
            setSelectedId(dashboards[0].id);
        }
    }, [selectedId, dashboards, setSelectedId]);

    console.debug('Rendering DashboardSelector');

    return (
        <Suspense>
            <Row>
                {(dashboards?.length ?? 0) > 0 && (
                    <div>
                        <Button
                            variant="plain"
                            size="lg"
                            sx={{
                                '.JoyButton-endDecorator': {
                                    pointerEvents: 'none'
                                }
                            }}
                            endDecorator={<Select />} {...bindTrigger(popupState)}>
                            {currentName}
                        </Button>
                    </div>
                )}
                {(favoriteDashboards?.length ?? 0) > 0 && (
                    <Row>
                        {favoriteDashboards?.map(fd => (
                            <Link key={fd.id} href={`#dashboard=${fd.id}`} passHref>
                                <Button variant="plain" sx={{ color: 'var(--joy-palette-neutral-400)' }}>
                                    {fd.name}
                                </Button>
                            </Link>
                        ))}
                    </Row>
                )}
            </Row>
            <Popper popupState={popupState}>
                <DashboardSelectorMenu
                    selectedId={selectedId}
                    popupState={popupState}
                    onSelection={setSelectedId}
                    onEditWidgets={onEditWidgets}
                    onSettings={onSettings} />
            </Popper>
        </Suspense>
    );
}

export default DashboardSelector;
