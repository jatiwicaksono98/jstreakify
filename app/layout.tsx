import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/navigation/nav';
import { Toaster } from 'sonner';
import { DM_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
// import ZewuNav from '@/components/navigation/nav-zewu';

export const metadata: Metadata = {
  title: 'JStreakify',
  description: 'App to track my own habit LOL',
};

const dmSans = DM_Sans({
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="manifest" href="/manifest.json" />

      <body className={dmSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-grow px-6 md:px-12 mx-auto max-w-8xl pb-8">
            <Nav />
            {/* <ZewuNav /> */}
            <Toaster richColors />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
