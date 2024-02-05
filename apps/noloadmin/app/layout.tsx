import './global.css';

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
      <body>{children}</body>
    </html>
  );
}
