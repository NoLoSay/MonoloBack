import './global.css';
import { Open_Sans } from 'next/font/google'
import { ThemeProvider } from '@nolofront/shared/components/providers/theme-provider'
import { cn } from '@nolofront/shared/lib/utils';
import { Navbar } from '@nolofront/shared';

const font = Open_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'NoLoAdmin',
  description: 'Intranet NoLoSay',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
      <ThemeProvider
        attribute='class'
        defaultTheme='dark'
        enableSystem={false}
        storageKey='app-theme'
      >
        <Navbar />
        {/* <ModalProvider /> */}
        {children}
      </ThemeProvider>
    </body>
    </html>
  );
}
