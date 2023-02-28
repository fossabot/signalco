/** @alpha */
export interface DotIndicatorProps {
    color: 'success' | 'warning' | 'danger' | 'neutral';
    content?: React.ReactElement;
    size?: number;
}

/** @alpha */
export default function DotIndicator(props: DotIndicatorProps) {
    const { color, content, size: requestedSize } = props;
    const size = requestedSize || 10;
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: `var(--joy-palette-${color}-400)`,
            color: 'white',
            textAlign: 'center'
        }}>
            {content}
        </div>
    )
}