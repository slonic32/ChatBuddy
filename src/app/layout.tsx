import './globals.css';
import Footer from '../components/Footer/Footer';
import { Providers } from './providers';
import { Metadata, Viewport } from 'next';
import { ServiceWorkerRegister } from '../components/ServiceWorkerRegister/ServiceWorkerRegister';

export const metadata: Metadata = {
    title: 'ChatBuddy AI Chat',
    description: 'AI chat app for ACS-305',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'ChatBuddy',
    },
    icons: {
        icon: '/icon-192.png',
        apple: '/apple-touch-icon.png',
    },
};

export const viewport: Viewport = {
    themeColor: '#111827',
    viewportFit: 'cover',
};

// every page on the site gets this wrapper
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="min-h-screen bg-slate-950 text-slate-100 mx-auto flex max-w-5xl flex-col px-4">
                        {children}

                        <Footer></Footer>
                        <ServiceWorkerRegister />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
