import "./globals.css";

export const metadata = {
  title: 'Fable Flow',
  description: 'Where books travel, not gather dust.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
