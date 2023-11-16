import '@signalco/ui/dist/index.css';
import { Inter } from 'next/font/google';
import './global.scss';
import { Metadata, Viewport } from 'next';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans`}>
                {children}
            </body>
        </html>
    );
}

export const metadata = {
    title: 'BrandGrab',
    description: 'Discover branding',
    icons: {
        apple: '/apple-touch-icon.png',
        icon: [
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'}
        ]
    }
} satisfies Metadata;

export const viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { color: 'black' },
    ]
} satisfies Viewport;
