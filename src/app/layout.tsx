import {QueryProvider} from "../components/providers/query-provider";

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="ar" dir="rtl">
            <body>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
