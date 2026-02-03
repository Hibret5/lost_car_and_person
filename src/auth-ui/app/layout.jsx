import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

export const metadata = {
  title: 'Auth UI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <MantineProvider
          theme={{ primaryColor: 'blue' }}
          withGlobalStyles
          withNormalizeCSS
        >
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
