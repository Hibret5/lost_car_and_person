"use client";

import React, { useState } from 'react';
import { 
  Title, Text, Group, Box, Paper, SimpleGrid, TextInput, 
  Avatar, ActionIcon, Button, Select, Table, Stack, Grid, Pagination, UnstyledButton, SegmentedControl
} from '@mantine/core';
import { 
  IconSettings, IconBell, IconChevronRight, IconSelector, IconFilter, IconDotsVertical
} from '@tabler/icons-react';

export default function AccountManagement() {
  const [viewMode, setViewMode] = useState('person'); // toggle between 'person' and 'vehicle'

  // Mock data tailored to each Figma screenshot
  const vehicleData = {
    title: "Toyota Corolla",
    subtitle: "Sedan 2013",
    avatar: "https://images.unsplash.com/photo-1623854275532-67350de77d5e?w=400",
    stats: [
      { label: "Total Alerts", value: "40" },
      { label: "CCTV alerts", value: "7" }
    ],
    tableHeader: "Location",
    logs: [
      { time: '2:40 PM', info: '9°00\'22.2" N, 38°45\'24.0" E.' },
      { time: '2:55 PM', info: '9°00\'00" N, 38°44\'39" E.' },
      { time: '3:10 PM', info: '9°02\'12.1" N, 38°45\'05.1" E.' },
      { time: '3:11 PM', info: '9°00\'22.2" N, 38°45\'24.0" E.' },
      { time: '4:00 PM', info: '' },
      { time: '5:20 PM', info: '' },
    ]
  };

  const personData = {
    title: "Example User",
    subtitle: "exampleuser@gmail.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    stats: [
      { label: "Reported car", value: "1" },
      { label: "Recieved alerts", value: "20" }
    ],
    tableHeader: "Action",
    logs: [
      { time: '2:40 PM', info: 'Login' },
      { time: '2:55 PM', info: 'Edit' },
      { time: '3:10 PM', info: 'Delete' },
      { time: '3:11 PM', info: 'save' },
      { time: '4:00 PM', info: 'subscribe' },
      { time: '5:20 PM', info: 'logged out' },
    ]
  };

  const active = viewMode === 'vehicle' ? vehicleData : personData;

  return (
    <Box p="xl" bg="#F4F7FE" style={{ minHeight: '100vh' }}>
      
      {/* HEADER */}
      <Group justify="space-between" mb="xl">
        <Title order={2} fw={700} c="#2B3674">User Management</Title>
        <Group>
          <SegmentedControl
            value={viewMode}
            onChange={setViewMode}
            radius="xl"
            data={[
              { label: 'Person', value: 'person' },
              { label: 'Vehicle', value: 'vehicle' },
            ]}
          />
          <Group bg="white" p={8} style={{ borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <ActionIcon variant="transparent" color="gray"><IconSettings size={22} /></ActionIcon>
            <ActionIcon variant="transparent" color="red"><IconBell size={22} /></ActionIcon>
          </Group>
        </Group>
      </Group>

      <Grid gutter="xl">
        {/* LEFT PANEL: DETAILS */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper p="xl" radius="lg" shadow="xs">
            <Group mb="xl" align="center">
              <Avatar 
                src={active.avatar} 
                size={120} 
                radius="100%" 
                style={{ border: `4px solid ${viewMode === 'person' ? '#2d7a4d' : '#F4F7FE'}` }}
              />
              <Box>
                <Title order={3} c="#1B2559" fw={700}>{active.title}</Title>
                <Text c="dimmed" fw={500}>{active.subtitle}</Text>
              </Box>
            </Group>

            {/* PERSON VIEW FORM (3-column layout for names) */}
            {viewMode === 'person' ? (
              <Stack gap="md">
                <SimpleGrid cols={3}>
                  <TextInput label="First name" defaultValue="Example user" radius="md" />
                  <TextInput label="Middle name" defaultValue="Example user" radius="md" />
                  <TextInput label="Last name" defaultValue="Example user" radius="md" />
                </SimpleGrid>
                <SimpleGrid cols={2}>
                  <TextInput label="Email" defaultValue="exampleuser@gmail.com" radius="md" />
                  <TextInput label="Phone number" defaultValue="+2519xxxxxxxxx" radius="md" />
                </SimpleGrid>
                <SimpleGrid cols={2}>
                  <Select label="Account type" defaultValue="Private" data={['Private', 'Business']} radius="md" />
                  <TextInput label="Status" defaultValue="Paid" radius="md" />
                </SimpleGrid>
                <SimpleGrid cols={2}>
                  <Select label="Role" defaultValue="User" data={['User', 'Admin']} radius="md" />
                  <TextInput label="Joined at" defaultValue="xx/xx/xxxx" radius="md" />
                </SimpleGrid>
              </Stack>
            ) : (
              /* VEHICLE VIEW FORM (2-column layout) */
              <SimpleGrid cols={2} spacing="md">
                <TextInput label="Color" defaultValue="Silver" radius="md" />
                <TextInput label="Description" defaultValue="A sark blue with a scrach..." radius="md" />
                <TextInput label="Plate number" defaultValue="AA 2 1XXXX" radius="md" />
                <TextInput label="Phone number" defaultValue="+2519xxxxxxxxx" radius="md" />
                <TextInput label="Last seen location" defaultValue="Addis Abeba, Mexico" radius="md" />
                <TextInput label="Last seen date and time" defaultValue="December 1, 2:33 Pm" radius="md" />
                <Select label="Status" defaultValue="Verified" data={['Verified', 'Pending']} radius="md" />
                <TextInput label="owner" defaultValue="user Example" radius="md" />
              </SimpleGrid>
            )}

            <Group grow mt="xl">
              <Button bg="#4CF033" size="lg" radius="md" fw={700}>Edit</Button>
              <Button bg="#FF0000" size="lg" radius="md" fw={700}>Remove</Button>
            </Group>
          </Paper>
        </Grid.Col>

        {/* RIGHT PANEL: STATS & TABLE */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="lg">
            <Group grow>
              {active.stats.map((stat, i) => (
                <StatCardSmall key={i} label={stat.label} value={stat.value} color="#FFB800" />
              ))}
            </Group>

            <Box>
              <Title order={4} c="#2B3674" mb="xs">
                {viewMode === 'person' ? 'User Logs' : 'Alerts'}
              </Title>
              <Paper radius="lg" shadow="md" style={{ overflow: 'hidden' }}>
                <Box bg="#A0C4FF">
                  <Table verticalSpacing="sm">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th c="black">Time <IconSelector size={14} /></Table.Th>
                        <Table.Th c="black">{active.tableHeader} <IconSelector size={14} /></Table.Th>
                        <Table.Th>
                            <Group justify="flex-end" gap="xs">
                                <IconFilter size={16} />
                                <IconDotsVertical size={16} />
                            </Group>
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {active.logs.map((log, i) => (
                        <Table.Tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                          <Table.Td fw={600} size="sm">{log.time}</Table.Td>
                          <Table.Td fw={600} size="xs">{log.info}</Table.Td>
                          <Table.Td align="right">
                            <ActionIcon variant="white" color="blue" size="sm" radius="md">
                                <IconChevronRight size={14} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                      {/* Fill empty rows to match Figma height */}
                      {[...Array(4)].map((_, i) => (
                        <Table.Tr key={`empty-${i}`}>
                           <Table.Td>----</Table.Td>
                           <Table.Td size="xs">urael , khalid ..</Table.Td>
                           <Table.Td align="right">
                            <ActionIcon variant="white" color="blue" size="sm" radius="md">
                                <IconChevronRight size={14} />
                            </ActionIcon>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                  
                  {/* FOOTER */}
                  <Box bg="#4A90E2" p="xs">
                    <Group justify="space-between">
                      <Group gap={4}>
                        <Text size="xs" c="white">Page</Text>
                        <Select size="xs" w={60} data={['1']} defaultValue="1" variant="filled" />
                        <Text size="xs" c="white">of 10</Text>
                      </Group>
                      <Pagination total={1} size="xs" radius="md" color="gray" />
                    </Group>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

function StatCardSmall({ label, value, color }) {
  return (
    <Paper radius="lg" shadow="md" style={{ overflow: 'hidden' }}>
      <Box p="md" bg={color} c="white">
        <Text size="32px" fw={800}>{value}</Text>
        <Text size="xs" fw={500}>{label}</Text>
      </Box>
      <UnstyledButton w="100%" py={4} bg="rgba(0,0,0,0.1)" style={{ textAlign: 'center' }}>
        <Group justify="center" gap={4}>
          <Text size="xs" fw={700} c="white">More info</Text>
          <IconChevronRight size={12} stroke={3} color="white" />
        </Group>
      </UnstyledButton>
    </Paper>
  );
}