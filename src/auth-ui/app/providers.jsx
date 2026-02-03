'use client';

import { MantineProvider } from '@mantine/core';
import { useState } from 'react';
import { Notifications } from '@mantine/notifications';


export default function Providers({ children }) {
  const [colorScheme, setColorScheme] = useState('light');

  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <MantineProvider
      theme={{ colorScheme }}
      defaultColorScheme="light"
    >
      <Notifications 
            position="top-right" 
            zIndex={9999}
            containerWidth={300}
            limit={3}
          />
      {children &&
        typeof children === 'function'
          ? children({ colorScheme, toggleColorScheme })
          : children}
    </MantineProvider>
  );
}
