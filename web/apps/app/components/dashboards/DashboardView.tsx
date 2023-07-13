import React, { useMemo } from 'react';
import Image from 'next/image';
import { Typography } from '@signalco/ui/dist/Typography';
import { Stack } from '@signalco/ui/dist/Stack';
import { Row } from '@signalco/ui/dist/Row';
import { Button } from '@signalco/ui/dist/Button';
import useLocale from '../../src/hooks/useLocale';
import { IDashboardModel } from '../../src/dashboards/DashboardsRepository';
import GridWrapper from './GridWrapper';
import DragableWidget from './DragableWidget';
import DisplayWidget from './DisplayWidget';

function NoWidgetsPlaceholder({ onAdd }: { onAdd: () => void }) {
    const { t } = useLocale('App', 'Dashboards');

    return (
        <Stack alignItems="center" justifyContent="center">
            <Row style={{ height: '80vh' }} justifyContent="center">
                <Stack style={{ maxWidth: 320 }} spacing={4} alignItems="center" justifyContent="center">
                    <Image priority width={280} height={213} alt="No Widgets" src="/assets/placeholders/placeholder-no-widgets.svg" />
                    <Typography level="h2">{t('NoWidgets')}</Typography>
                    <Typography textAlign="center" level="body2">{t('NoWidgetsHelpTextFirstLine')}<br />{t('NoWidgetsHelpTextSecondLine')}</Typography>
                    <Button onClick={onAdd}>{t('AddWidget')}</Button>
                </Stack>
            </Row>
        </Stack>
    );
}

function DashboardView(props: { dashboard: IDashboardModel, isEditing: boolean, onAddWidget: () => void }) {
    const { dashboard, isEditing, onAddWidget } = props;

    // Render placeholder when there is no widgets
    const widgetsOrder = useMemo(() => dashboard.widgets.slice().sort((a, b) => a.order - b.order).map(w => w.id), [dashboard.widgets]);
    const widgets = useMemo(() => widgetsOrder.map(wo => dashboard.widgets.find(w => wo === w.id)).filter(Boolean), [dashboard.widgets, widgetsOrder]);
    if (widgets.length <= 0) {
        return <NoWidgetsPlaceholder onAdd={onAddWidget} />
    }

    function handleOrderChanged(newOrder: string[]) {
        for (let i = 0; i < newOrder.length; i++) {
            const widget = widgets.find(w => w.id === newOrder[i]);
            if (widget) {
                widget.order = i;
            }
        }
    }

    function handleSetWidgetConfig(widgetId: string, config: object | undefined) {
        const widget = dashboard.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.config = config;
        }
    }

    function handleRemoveWidget(widgetId: string) {
        dashboard.widgets.splice(dashboard.widgets.findIndex(w => w.id === widgetId), 1);
    }

    const WidgetComponent = isEditing ? DragableWidget : DisplayWidget;
    const widgetSize = 78 + 8; // Widget is 76x76 + 2px for border + 8 spacing between widgets (2x4px)
    const dashbaordPadding = 48 + 109; // Has 24 x padding (109 nav width)
    const numberOfColumns = Math.max(4, Math.floor((window.innerWidth - dashbaordPadding) / widgetSize)); // When width is less than 400, set to quad column

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numberOfColumns}, 1fr)`,
            gap: 4,
            width: `${widgetSize * numberOfColumns - 8}px`
        }}>
            <GridWrapper isEditing={isEditing} order={widgetsOrder} orderChanged={handleOrderChanged}>
                {widgets.map((widget) => (
                    <WidgetComponent
                        key={`widget-${widget.id.toString()}`}
                        id={widget.id}
                        onRemove={() => handleRemoveWidget(widget.id)}
                        isEditMode={isEditing}
                        type={widget.type}
                        config={widget.config ?? {}}
                        setConfig={(config) => handleSetWidgetConfig(widget.id, config)} />
                ))}
            </GridWrapper>
        </div>
    );
}

export default DashboardView;
