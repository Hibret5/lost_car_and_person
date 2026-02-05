"use client";

import React from 'react';
import { 
  Title, Text, Group, Box, Paper, SimpleGrid, TextInput, 
  Avatar, ActionIcon, Button, Select, Table, Stack, Grid, Pagination, UnstyledButton
} from '@mantine/core';
import { 
  IconSettings, IconBell, IconChevronRight, IconSelector, IconFilter
} from '@tabler/icons-react';

export default function SingleUserManagement() {
  const logs = [
    { time: '2:40 PM', action: 'Login' },
    { time: '2:55 PM', action: 'Edit' },
    { time: '3:10 PM', action: 'Delete' },
    { time: '3:11 PM', action: 'save' },
    { time: '4:00 PM', action: 'subscribe' },
    { time: '5:20 PM', action: 'logged out' },
  ];

  return (
    <Box p="xl" bg="#F4F7FE" style={{ minHeight: '100vh' }}>
      {/* HEADER */}
      <Group justify="space-between" mb="xl">
        <Title order={2} fw={700} c="#2B3674">User Management</Title>
        <Group bg="white" p={8} style={{ borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <ActionIcon variant="transparent" color="gray"><IconSettings size={22} /></ActionIcon>
          <ActionIcon variant="transparent" color="red"><IconBell size={22} /></ActionIcon>
        </Group>
      </Group>

      <Grid gutter="xl">
        {/* LEFT: USER DETAILS */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder>
            <Group mb="xl" align="center">
              <Avatar 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256" 
                size={120} 
                radius="100%" 
                style={{ border: '4px solid #2d7a4d' }}
              />
              <Box>
                <Title order={3} c="#2B3674">Example User</Title>
                <Text c="dimmed">exampleuser@gmail.com</Text>
              </Box>
            </Group>

            <SimpleGrid cols={3} mb="md">
              <TextInput label="First name" defaultValue="Example user" radius="md" />
              <TextInput label="Middle name" defaultValue="Example user" radius="md" />
              <TextInput label="Last name" defaultValue="Example user" radius="md" />
            </SimpleGrid>

            <SimpleGrid cols={2} mb="md">
              <TextInput label="Email" defaultValue="exampleuser@gmail.com" radius="md" />
              <TextInput label="Phone number" defaultValue="+2519xxxxxxxxx" radius="md" />
            </SimpleGrid>

            <SimpleGrid cols={2} mb="md">
              <Select label="Account type" defaultValue="Private" data={['Private', 'Business']} radius="md" />
              <TextInput label="Status" defaultValue="Paid" radius="md" />
            </SimpleGrid>

            <SimpleGrid cols={2} mb="xl">
              <Select label="Role" defaultValue="User" data={['User', 'Admin']} radius="md" />
              <TextInput label="Joined at" defaultValue="xx/xx/xxxx" radius="md" />
            </SimpleGrid>

            <Group grow mt="xl">
              <Button bg="#44FF44" size="lg" radius="md" fw={700}>Edit</Button>
              <Button bg="#FF0000" size="lg" radius="md" fw={700}>Remove</Button>
            </Group>
          </Paper>
        </Grid.Col>

        {/* RIGHT: STATS & LOGS */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="lg">
            <Group grow>
              <StatCardSmall label="Reported car" value="1" color="#FFB800" />
              <StatCardSmall label="Recieved alerts" value="20" color="#FFB800" />
            </Group>

            <Paper radius="lg" shadow="md" style={{ overflow: 'hidden' }}>
              <Table verticalSpacing="sm">
                <Table.Thead bg="#90caf9">
                  <Table.Tr>
                    <Table.Th>Time <IconSelector size={14} /></Table.Th>
                    <Table.Th>Action <IconSelector size={14} /></Table.Th>
                    <Table.Th align="right"><IconFilter size={14} /></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {logs.map((log, i) => (
                    <Table.Tr key={i}>
                      <Table.Td fw={600}>{log.time}</Table.Td>
                      <Table.Td fw={600}>{log.action}</Table.Td>
                      <Table.Td align="right">
                        <ActionIcon variant="outline" color="blue" size="sm"><IconChevronRight size={14} /></ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Box bg="#64b5f6" p="xs">
                <Group justify="space-between">
                  <Group gap={4}><Text size="xs" c="white">Page</Text><Select size="xs" w={60} data={['1']} defaultValue="1" /><Text size="xs" c="white">of 10</Text></Group>
                  <Pagination total={1} size="xs" radius="md" />
                </Group>
              </Box>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

function StatCardSmall({ label, value, color }) {
  return (
    <Paper radius="lg" shadow="md" style={{ overflow: 'hidden' }}>
      <Box p="md" bg={color}><Text size="28px" fw={800}>{value}</Text><Text size="xs" fw={500}>{label}</Text></Box>
      <UnstyledButton w="100%" py={4} bg="rgba(0,0,0,0.1)" style={{ textAlign: 'center' }}>
        <Group justify="center" gap={4}><Text size="xs" fw={700}>More info</Text><IconChevronRight size={12} stroke={3} /></Group>
      </UnstyledButton>
    </Paper>
  );
}