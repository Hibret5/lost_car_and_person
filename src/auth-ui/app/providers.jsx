'use client';

import { MantineProvider } from '@mantine/core';
import { useState } from 'react';

export default function Providers({ children }) {
  const [colorScheme, setColorScheme] = useState('light');

  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <MantineProvider
      theme={{ colorScheme }}
      defaultColorScheme="light"
    >
      {children &&
        typeof children === 'function'
          ? children({ colorScheme, toggleColorScheme })
          : children}
    </MantineProvider>
  );
}
