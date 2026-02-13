import '@mantine/core/styles.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';


export const metadata = {
  title: 'Auth UI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Forces the initial theme state to prevent white-flash on dark mode load */}
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body style={{ margin: 0 }}>
        {/* Added defaultColorScheme here so the hook can manage it */}
        <MantineProvider 
          theme={{ primaryColor: 'blue' }} 
          defaultColorScheme="light"
        >
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