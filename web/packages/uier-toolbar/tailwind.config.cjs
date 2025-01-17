import { baseConfig } from '@signalco/tailwindcss-config-signalco';

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    presets: [baseConfig],
    content: [
        './src/**/*.{ts,tsx}',
        '../ui/src/**/*.{ts,tsx}',
        '../ui-primitives/src/**/*.{ts,tsx}'
    ]
}
