/* eslint-disable tailwindcss/no-custom-classname */
import styles from './LightBulbVisual.module.scss';

function LightBulbVisual(props: { state: boolean, size: number }) {
    const isActive = props.state;
    const bulbColor = isActive ? '#FFDD66' : '#c4c4c4';

    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={styles.root} width={props.size * 1.4} height={props.size * 1.4} fill="none" viewBox="0 0 78 94">
            <g className="Theme=Light, State=On">
                <g className="GlassCircle" filter={isActive ? 'url(#lightbulbfilter0_d_11:221)' : ''}>
                    <circle cx="39" cy="53" r="15" fill={bulbColor} />
                </g>
                <path fill={bulbColor} d="M25 52.036c0-9.36 5.026-9.805 5.026-19.016 0-9.21 18.235-9.508 18.523 0C48.836 42.528 53 42.825 53 52.036c0 9.21-28 9.36-28 0z" className="GlassCurve" />
                <path fill="var(--joy-palette-text-primary)" d="M27 8h24v28H27z" className="Base" />
                <path fill="var(--joy-palette-text-primary)" d="M38.46 0h2.918L43 12h-6l1.46-12z" className="CordConnection" />
            </g>
            <defs>
                <filter id="lightbulbfilter0_d_11:221" width="78" height="78" x="0" y="16" className="lightbulbfilter0_d_11:221" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                    <feOffset dy="2" />
                    <feGaussianBlur stdDeviation="12" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.866667 0 0 0 0 0.4 0 0 0 1 0" />
                    <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_11:221" />
                    <feBlend in="SourceGraphic" in2="effect1_dropShadow_11:221" result="shape" />
                </filter>
            </defs>
        </svg>
    );
}

export default LightBulbVisual;
