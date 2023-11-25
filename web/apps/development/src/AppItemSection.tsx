import { AppItem } from './AppItem';
import { AppItemType } from './AppItemType';
import { Row } from '@signalco/ui-primitives/Row';
import { Typography } from '@signalco/ui-primitives/Typography';

export function AppItemSection({ items, title }: { items: AppItemType[]; title: string; }) {
    return (
        <Row spacing={2}>
            <Typography level="body3" uppercase>
                {title}
            </Typography>
            <Row spacing={1}>
                {items.map(app => <AppItem key={app.label} {...app} />)}
            </Row>
        </Row>
    );
}
