"use client";

import React from 'react';
import { AppShell, Box, Stack, UnstyledButton, Group, Text, ScrollArea, Image } from '@mantine/core';
import { 
  IconLayoutDashboard, IconUsers, IconDatabase, IconFileCheck, 
  IconCoin, IconBell, IconMessageDots, IconSettings, IconHistory, IconLogout 
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation items mapping exactly to your sidebar screenshot
  const menuItems = [
    { icon: <IconLayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <IconUsers size={20} />, label: 'Accounts', path: '/admin/accounts' },
    { icon: <IconDatabase size={20} />, label: 'Data Management', path: '/admin/data' },
    { icon: <IconFileCheck size={20} />, label: 'Document Validation', path: '/admin/docs' },
    { icon: <IconCoin size={20} />, label: 'Finance', path: '/admin/finance' },
    { icon: <IconBell size={20} />, label: 'Notifications', path: '/admin/notifications' },
    { icon: <IconMessageDots size={20} />, label: 'Feedback', path: '/admin/feedback' },
    { icon: <IconSettings size={20} />, label: 'Setting', path: '/admin/settings' },
    { icon: <IconHistory size={20} />, label: 'Activities', path: '/admin/activities' },
  ];

  const handleLogout = () => {
    // Basic logout logic for frontend demo
    router.push('/');
  };

  return (
    <AppShell
      navbar={{ width: 280, breakpoint: 'sm' }}
      padding="0"
    >
      <AppShell.Navbar 
        p="md" 
        style={{ 
          background: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)', 
          borderRight: 'none',
          zIndex: 100
        }}
      >
        <Stack justify="space-between" h="100%">
          <Box>
            {/* LOGO SECTION - Loads from public/logo.jpg */}
            <Group mb={40} mt={10} justify="center">
              <Image 
                src="/logo.jpg" 
                alt="GFH Logo" 
                w={160} 
                fallbackSrc="https://placehold.co/200x80?text=GFH+LOGO"
              />
            </Group>

            {/* SCROLLABLE SIDEBAR MENU */}
            <ScrollArea h="calc(100vh - 280px)" scrollbarSize={0}>
              <Stack gap={4}>
                {menuItems.map((item) => (
                  <AdminNavItem 
                    key={item.label}
                    {...item} 
                    active={pathname === item.path}
                    onClick={() => router.push(item.path)}
                  />
                ))}
              </Stack>
            </ScrollArea>
          </Box>
          
          {/* BOTTOM ACTIONS SECTION */}
          <Stack gap={4} mb={20}>
            <AdminNavItem 
              icon={<IconLogout size={20} />} 
              label="Logout" 
              onClick={handleLogout} 
            />
            <AdminNavItem 
              icon={<IconDatabase size={20} />} 
              label="Data Management" 
              onClick={() => {}} 
            />
          </Stack>
        </Stack>
      </AppShell.Navbar>

      {/* This renders the content of page.jsx (Dashboard or Accounts) */}
      <AppShell.Main bg="#F4F7FE" style={{ minHeight: '100vh' }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

// Helper component for individual navigation buttons
function AdminNavItem({ icon, label, active, onClick }) {
  return (
    <UnstyledButton 
      onClick={onClick}
      p="md" 
      w="100%" 
      style={{ 
        borderRadius: '8px',
        backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        transition: 'background 0.2s ease',
        position: 'relative'
      }}
    >
      {/* The white indicator bar seen in your screenshot */}
      {active && (
        <Box 
          style={{ 
            position: 'absolute', 
            left: -16, 
            top: 10, 
            bottom: 10, 
            width: 4, 
            backgroundColor: 'white', 
            borderRadius: '0 4px 4px 0' 
          }} 
        />
      )}
      
      <Group gap="md">
        {React.cloneElement(icon, { color: 'white' })}
        <Text c="white" size="sm" fw={active ? 700 : 400}>
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}