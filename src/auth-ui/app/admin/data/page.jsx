"use client";

import React, { useState } from 'react';
import {
  Box, Title, Text, Table, Badge, Group, TextInput, 
  Button, Select, ActionIcon, Paper, SimpleGrid,
  Pagination, Checkbox, Avatar, Menu, UnstyledButton
} from '@mantine/core';
import { 
  IconSearch, IconCalendar, IconDownload, 
  IconEdit, IconChevronRight, IconSettings, IconBell,
  IconCar, IconDotsVertical, IconTrash, IconCheck, IconX, IconUsers
} from '@tabler/icons-react';

// --- FRONTEND MOCK DATA ---
const INITIAL_DATA = [
  { id: 1, brand: 'Toyota Corolla', model: 'Sedan', user: 'Hibrewerk Mossie', status: 'Verified', plate: 'AA 2345', date: 'Feb 05, 2026', alerts: 2 },
  { id: 2, brand: 'Hyundai Atos', model: 'Hatchback', user: 'John Doe', status: 'Unverified', plate: 'B 9912', date: 'Feb 06, 2026', alerts: 0 },
  { id: 3, brand: 'Abebe Bikila', model: 'Person', user: 'Admin', status: 'Verified', plate: 'ID-990', date: 'Feb 07, 2026', alerts: 5 },
  { id: 4, brand: 'Suzuki Swift', model: 'Compact', user: 'User1', status: 'Unverified', plate: 'C 4452', date: 'Feb 07, 2026', alerts: 1 },
];

export default function DataManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tableData, setTableData] = useState(INITIAL_DATA);

  // --- INTERACTION LOGIC (FRONTEND ONLY) ---
  const handleToggleStatus = (id) => {
    setTableData(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'Verified' ? 'Unverified' : 'Verified' } 
        : item
    ));
  };

  const handleDelete = (id) => {
    setTableData(prev => prev.filter(item => item.id !== id));
  };

  const filtered = tableData.filter(item => 
    item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p="xl">
      {/* HEADER SECTION */}
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} fw={700} c="#2B3674">Data Management</Title>
          <Text size="sm" c="dimmed">Frontend Demo Mode</Text>
        </Box>
        <Group bg="white" p={8} style={{ borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <TextInput 
            variant="unstyled" 
            placeholder="Search data..." 
            leftSection={<IconSearch size={18} color="gray" />} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            styles={{ input: { backgroundColor: 'transparent', height: '30px' } }}
          />
          <ActionIcon variant="transparent" color="gray"><IconSettings size={20} /></ActionIcon>
          <ActionIcon variant="transparent" color="red"><IconBell size={20} /></ActionIcon>
        </Group>
      </Group>

      {/* YELLOW STAT CARDS */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
        {[
          { label: 'Total Records', val: tableData.length },
          { label: 'Verified', val: tableData.filter(d => d.status === 'Verified').length },
          { label: 'Pending', val: tableData.filter(d => d.status === 'Unverified').length },
          { label: 'Active Alerts', val: '12' }
        ].map((stat, i) => (
          <Paper key={i} p="xl" radius="lg" bg="#FFB800" shadow="sm">
            <Group justify="space-between">
              <Box c="white">
                <Text fw={800} size="xl" style={{ fontSize: '32px' }}>{stat.val}</Text>
                <Text size="xs" fw={600}>{stat.label}</Text>
              </Box>
              <IconUsers size={40} color="white" style={{ opacity: 0.3 }} />
            </Group>
            <UnstyledButton w="100%" py={5} mt="md" bg="rgba(0,0,0,0.1)" style={{ textAlign: 'center', borderRadius: '4px' }}>
               <Text size="xs" fw={700} c="white">View Details →</Text>
            </UnstyledButton>
          </Paper>
        ))}
      </SimpleGrid>

      {/* FILTER BAR */}
      <Paper p="md" radius="lg" mb="md" shadow="xs" withBorder>
        <Group justify="space-between">
          <Group>
            <Select placeholder="Type" data={['Car', 'Person']} radius="md" w={120} />
            <Select placeholder="Date" data={['Today', 'Week']} radius="md" leftSection={<IconCalendar size={16} />} w={140} />
          </Group>
          <Button variant="light" color="blue" radius="md" leftSection={<IconDownload size={18} />}>Export</Button>
        </Group>
      </Paper>

      {/* THE TABLE */}
      <Paper radius="lg" shadow="xs" withBorder style={{ overflow: 'hidden' }}>
        <Table verticalSpacing="md" highlightOnHover striped>
          <Table.Thead bg="#F8F9FA">
            <Table.Tr>
              <Table.Th><Checkbox color="blue" /></Table.Th>
              <Table.Th>Brand / Name</Table.Th>
              <Table.Th>Model</Table.Th>
              <Table.Th>Registered By</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Plate No</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td><Checkbox /></Table.Td>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar size="sm" color="blue" radius="xl">{item.brand[0]}</Avatar>
                    <Text size="sm" fw={600}>{item.brand}</Text>
                  </Group>
                </Table.Td>
                <Table.Td><Text size="sm" c="dimmed">{item.model}</Text></Table.Td>
                <Table.Td><Text size="sm">{item.user}</Text></Table.Td>
                <Table.Td>
                  <Badge color={item.status === 'Verified' ? 'green' : 'gray'} variant="light">
                    {item.status}
                  </Badge>
                </Table.Td>
                <Table.Td><Text size="sm" family="monospace">{item.plate}</Text></Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={150}>
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray"><IconDotsVertical size={18} /></ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item 
                        leftSection={item.status === 'Verified' ? <IconX size={14}/> : <IconCheck size={14}/>} 
                        onClick={() => handleToggleStatus(item.id)}
                      >
                        {item.status === 'Verified' ? 'Unverify' : 'Verify'}
                      </Menu.Item>
                      <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => handleDelete(item.id)}>
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <Group justify="space-between" p="md" bg="white">
          <Text size="sm" c="dimmed">Showing {filtered.length} entries</Text>
          <Pagination total={1} size="sm" radius="md" />
        </Group>
      </Paper>
    </Box>
  );
}