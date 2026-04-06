import './globals.css';

// every page on the site gets this wrapper
export default function RootLayout({ children }: {}) {
    children: React.ReactNode;
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen bg-slate-950 text-slate-100 mx-auto flex max-w-5xl flex-col px-4">
                    {children}

                    <Footer></Footer>
                    {isLoading && <Loader />}
                </div>
            </body>
        </html>
    );
}
