import './globals.css';
import { Inter } from 'next/font/google';
import 'antd/dist/reset.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Healthcare Clock-In',
  description: 'Clock-in system for healthcare workers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body suppressHydrationWarning={true}>
        <UserProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </UserProvider>
      </body>
    </html>
  );
}
