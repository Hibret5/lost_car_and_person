"use client";

import React, { useState } from 'react';
import { 
  Title, Text, Group, Box, Paper, SimpleGrid, TextInput, 
  Table, Badge, Avatar, ActionIcon, Checkbox, Button, Select, Pagination 
} from '@mantine/core';
import { 
  IconUsers, IconSearch, IconFilter, IconChevronRight, 
  IconEdit, IconPlus, IconDownload, IconCalendar, IconSettings, IconBell
} from '@tabler/icons-react';

const initialUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@gmail.com', username: 'jonny77', status: 'Paid', role: 'Admin', joined: 'March 12, 2023', active: '1 minute ago' },
  { id: 2, name: 'Olivia Bennett', email: 'ollyben@gmail.com', username: 'olly659', status: 'Free', role: 'User', joined: 'June 27, 2022', active: '1 month ago' },
  { id: 3, name: 'Daniel Warren', email: 'dwarren3@gmail.com', username: 'dwarren3', status: 'Paid', role: 'User', joined: 'January 8, 2024', active: '4 days ago' },
  { id: 4, name: 'Chloe Hayes', email: 'chloehhye@gmail.com', username: 'chloehh', status: 'Paid', role: 'Guest', joined: 'October 5, 2021', active: '10 days ago' },
  { id: 5, name: 'Marcus Reed', email: 'reeds777@gmail.com', username: 'reeds7', status: 'Free', role: 'User', joined: 'February 19, 2023', active: '3 months ago' },
];

export default function UserManagementPage() {
  const [search, setSearch] = useState('');

  const rows = initialUsers.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td><Checkbox radius="sm" /></Table.Td>
      <Table.Td>
        <Group gap="sm">
          <Avatar size="sm" radius="xl" color="blue" />
          <Text size="sm" fw={500}>{user.name}</Text>
        </Group>
      </Table.Td>
      <Table.Td>{user.email}</Table.Td>
      <Table.Td>{user.username}</Table.Td>
      <Table.Td>
        <Badge color={user.status === 'Paid' ? 'green' : 'gray'} variant="filled" radius="xl">
          {user.status}
        </Badge>
      </Table.Td>
      <Table.Td>{user.role}</Table.Td>
      <Table.Td>{user.joined}</Table.Td>
      <Table.Td>{user.active}</Table.Td>
      <Table.Td>
        <Group gap={4} justify="flex-end">
          <ActionIcon variant="subtle" color="gray"><IconEdit size={16} /></ActionIcon>
          <ActionIcon variant="subtle" color="blue"><IconChevronRight size={16} /></ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box p="xl" bg="#F4F7FE" style={{ minHeight: '100vh' }}>
      {/* HEADER WITH SETTINGS AND NOTIFICATIONS */}
      <Group justify="space-between" mb="xl">
        <Title order={2} fw={700} c="#2B3674">User Management</Title>
        <Group bg="white" p={8} style={{ borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <ActionIcon variant="transparent" color="gray"><IconSettings size={22} /></ActionIcon>
          <ActionIcon variant="transparent" color="red"><IconBell size={22} /></ActionIcon>
        </Group>
      </Group>

      {/* TOP STAT CARDS */}
      <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg" mb="xl">
        {[1, 2, 3, 4].map((i) => (
          <Paper key={i} p="md" radius="md" bg="#FFB800" c="white" shadow="sm" style={{ position: 'relative' }}>
            <Group justify="space-between" align="flex-start">
              <Box>
                <Text size="xl" fw={800} style={{ fontSize: '28px' }}>44</Text>
                <Text size="xs" fw={500}>User Registrations</Text>
              </Box>
              <IconUsers size={45} style={{ opacity: 0.2 }} />
            </Group>
            <UnstyledButton w="100%" py={5} mt="md" bg="rgba(0,0,0,0.1)" style={{ textAlign: 'center', borderRadius: '4px' }}>
               <Text size="xs" fw={600}>More info →</Text>
            </UnstyledButton>
          </Paper>
        ))}
      </SimpleGrid>

      {/* MAIN TABLE SECTION */}
      <Paper p="md" radius="lg" shadow="xs" withBorder>
        {/* FILTERS & ACTION BUTTONS */}
        <Group justify="space-between" mb="lg">
          <Group gap="xs">
            <TextInput 
              placeholder="Search" 
              leftSection={<IconSearch size={16} />} 
              radius="md"
              w={200}
            />
            <Select placeholder="Role" data={['Admin', 'User']} w={110} radius="md" />
            <Select placeholder="Status" data={['Paid', 'Free']} w={110} radius="md" />
            <Select placeholder="Date" data={['Newest']} w={110} radius="md" />
          </Group>
          
          {/* RIGHT SIDE BUTTONS */}
          <Group gap="sm">
            <Button 
              variant="outline" 
              color="gray" 
              leftSection={<IconDownload size={16}/>} 
              radius="md"
            >
              Export
            </Button>
            <Button 
              leftSection={<IconPlus size={16}/>} 
              bg="#2B3674" 
              radius="md"
            >
              Add User
            </Button>
          </Group>
        </Group>

        {/* DATA TABLE */}
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" highlightOnHover borderlessRow>
            <Table.Thead bg="#4318FF">
              <Table.Tr>
                <Table.Th><Checkbox color="white" /></Table.Th>
                <Table.Th c="white">Full Name</Table.Th>
                <Table.Th c="white">Email</Table.Th>
                <Table.Th c="white">Username</Table.Th>
                <Table.Th c="white">Status</Table.Th>
                <Table.Th c="white">Role</Table.Th>
                <Table.Th c="white">Joined Date</Table.Th>
                <Table.Th c="white">Last Active</Table.Th>
                <Table.Th c="white">Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {/* FOOTER */}
        <Group justify="space-between" mt="md" p="xs">
          <Group gap="xs">
            <Text size="sm" c="dimmed">Rows per page</Text>
            <Select size="xs" w={65} data={['10', '20']} defaultValue="10" />
            <Text size="sm" c="dimmed">of 140 rows</Text>
          </Group>
          <Pagination total={10} radius="xl" color="blue" size="sm" />
        </Group>
      </Paper>
    </Box>
  );
}

// Ensure UnstyledButton is imported from @mantine/core
import { UnstyledButton } from '@mantine/core';