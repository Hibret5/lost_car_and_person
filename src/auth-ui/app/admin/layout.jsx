"use client";

import React, { useState } from 'react';
import { AppShell, Box, Stack, UnstyledButton, Group, Text, ScrollArea, Image, ActionIcon, Tooltip } from '@mantine/core';
import { 
  IconLayoutDashboard, IconUsers, IconDatabase, IconFileCheck, 
  IconCoin, IconBell, IconMessageDots, IconSettings, IconHistory, IconLogout,
  IconChevronLeft, IconMenu2
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false); // State to toggle sidebar
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: <IconLayoutDashboard size={22} />, label: 'Dashboard', path: '/admin' },
    { icon: <IconUsers size={22} />, label: 'Accounts', path: '/admin/accounts' },
    { icon: <IconDatabase size={22} />, label: 'Data Management', path: '/admin/data' },
    { icon: <IconFileCheck size={22} />, label: 'Document Validation', path: '/admin/docs' },
    { icon: <IconCoin size={22} />, label: 'Finance', path: '/admin/finance' },
    { icon: <IconBell size={22} />, label: 'Notifications', path: '/admin/notifications' },
    { icon: <IconMessageDots size={22} />, label: 'Feedback', path: '/admin/feedback' },
    { icon: <IconSettings size={22} />, label: 'Setting', path: '/admin/settings' },
    { icon: <IconHistory size={22} />, label: 'Activities', path: '/admin/activities' },
  ];

  return (
    <AppShell
      navbar={{ 
        width: collapsed ? 80 : 280, // Dynamic width
        breakpoint: 'sm' 
      }}
      padding="0"
      transitionDuration={300} // Smooth sliding animation
      transitionTimingFunction="ease"
    >
      <AppShell.Navbar 
        p="md" 
        style={{ 
          background: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)', 
          borderRight: 'none',
          zIndex: 100,
          transition: 'width 0.3s ease' // Animation for the navbar itself
        }}
      >
        <Stack justify="space-between" h="100%">
          <Box>
            {/* TOGGLE BUTTON & LOGO */}
            <Group mb={30} mt={10} justify={collapsed ? "center" : "space-between"}>
              {!collapsed && (
                <Image 
                  src="/logo.jpg" 
                  alt="Logo" 
                  w={120} 
                  fallbackSrc="https://placehold.co/120x40?text=GFH+LOGO"
                />
              )}
              <ActionIcon 
                onClick={() => setCollapsed(!collapsed)} 
                variant="transparent" 
                color="white"
              >
                {collapsed ? <IconMenu2 size={24} /> : <IconChevronLeft size={24} />}
              </ActionIcon>
            </Group>

            {/* NAVIGATION MENU */}
            <ScrollArea h="calc(100vh - 250px)" scrollbarSize={0}>
              <Stack gap={4}>
                {menuItems.map((item) => (
                  <AdminNavItem 
                    key={item.label}
                    {...item} 
                    collapsed={collapsed}
                    active={pathname === item.path}
                    onClick={() => router.push(item.path)}
                  />
                ))}
              </Stack>
            </ScrollArea>
          </Box>
          
          {/* BOTTOM ACTIONS */}
          <Stack gap={4} mb={20}>
            <AdminNavItem 
              icon={<IconLogout size={22} />} 
              label="Logout" 
              collapsed={collapsed}
              onClick={() => router.push('/')} 
            />
          </Stack>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main bg="#F4F7FE" style={{ minHeight: '100vh' }}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

function AdminNavItem({ icon, label, active, onClick, collapsed }) {
  const content = (
    <UnstyledButton 
      onClick={onClick}
      p="md" 
      w="100%" 
      style={{ 
        borderRadius: '8px',
        backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
        transition: 'all 0.2s ease',
        position: 'relative',
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'flex-start'
      }}
    >
      {active && !collapsed && (
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
      
      <Group gap="md" wrap="nowrap">
        {React.cloneElement(icon, { color: 'white' })}
        {!collapsed && (
          <Text c="white" size="sm" fw={active ? 700 : 400} style={{ whiteSpace: 'nowrap' }}>
            {label}
          </Text>
        )}
      </Group>
    </UnstyledButton>
  );

  // If collapsed, show a tooltip on hover
  return collapsed ? (
    <Tooltip label={label} position="right" withArrow offset={15}>
      {content}
    </Tooltip>
  ) : content;
}