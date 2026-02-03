import '@mantine/core/styles.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export const metadata = {
  title: 'Auth UI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body style={{ margin: 0 }}>
        <MantineProvider theme={{ primaryColor: 'blue' }}>
          <Notifications 
            position="top-right" 
            zIndex={9999}
            containerWidth={300}
            limit={3}
          />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
