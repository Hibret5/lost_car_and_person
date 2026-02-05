"use client";

import React, { useState } from 'react'; // Added useState
import { 
  Grid, Paper, Text, Group, Box, Title, TextInput, ActionIcon, Avatar, SimpleGrid, Stack, UnstyledButton 
} from '@mantine/core';
import { 
  IconSearch, IconSettings, IconBell, IconUsers, IconShoppingCart, IconCar, IconChevronRight 
} from '@tabler/icons-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

// --- MOCK DATA ---
const weeklyData = [
  { name: 'Sat', sub: 500, reg: 150 }, { name: 'Sun', sub: 380, reg: 80 },
  { name: 'Mon', sub: 350, reg: 180 }, { name: 'Tue', sub: 550, reg: 320 },
  { name: 'Wed', sub: 200, reg: 250 }, { name: 'Thu', sub: 480, reg: 230 },
  { name: 'Fri', sub: 400, reg: 330 },
];

const pieData = [
  { name: 'People', value: 30, color: '#3F51B5' },
  { name: 'Special case', value: 15, color: '#FF9800' },
  { name: 'Cars', value: 35, color: '#0000FF' },
  { name: 'Closed', value: 20, color: '#E91E63' },
];

const subscriptionData = [
  { id: 1, name: 'Ms. x', type: 'Private', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'MR. r', type: 'Private', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Mr. W', type: 'Private', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState(''); // State for search

  // Filter logic: This checks if the user's name includes the search text
  const filteredSubs = subscriptionData.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box p="xl" bg="#F4F7FE">
      {/* HEADER SECTION */}
      <Group justify="space-between" mb="xl">
        <Title order={2} fw={700} c="#2B3674">Overview</Title>
        <Group 
          bg="white" 
          p={8} 
          style={{ borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <TextInput 
            variant="unstyled" 
            placeholder="Search for something" 
            leftSection={<IconSearch size={18} color="gray" />} 
            value={searchQuery} // Connect search bar to state
            onChange={(event) => setSearchQuery(event.currentTarget.value)} // Update state on type
            styles={{ input: { backgroundColor: 'transparent', minHeight: 'unset', height: '30px' } }}
          />
          <ActionIcon variant="transparent" color="gray"><IconSettings size={20} /></ActionIcon>
          <ActionIcon variant="transparent" color="red"><IconBell size={20} /></ActionIcon>
        </Group>
      </Group>

      {/* STAT CARDS */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="lg">
        <StatCard label="User Registrations" value="44" color="#FFB800" icon={<IconUsers />} />
        <StatCard label="User Registrations" value="44" color="#FFB800" icon={<IconUsers />} />
        <StatCard label="User Registrations" value="44" color="#FFB800" icon={<IconUsers />} />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
        <StatCard label="Total reports" value="1320" color="#BDEAF0" darkText icon={<IconShoppingCart />} />
        <StatCard label="Lost people report" value="720" color="#BDEAF0" darkText icon={<IconShoppingCart />} />
        <StatCard label="Lost car reports" value="599" color="#BDEAF0" darkText icon={<IconCar />} />
      </SimpleGrid>

      {/* CHARTS SECTION */}
      <Grid gutter="lg" mb="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder>
            <Title order={4} mb="xl">Weekly Report</Title>
            <Box h={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="sub" fill="#4318FF" radius={[10, 10, 10, 10]} barSize={15} />
                  <Bar dataKey="reg" fill="#6AD2FF" radius={[10, 10, 10, 10]} barSize={15} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder>
            <Title order={4} mb="xl">Report Statistics</Title>
            <Box h={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* BOTTOM SECTION */}
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder>
            <Title order={4} mb="lg">Recent subscription</Title>
            <Stack gap="md">
              {filteredSubs.length > 0 ? (
                filteredSubs.map((sub) => (
                  <Group key={sub.id}>
                    <Avatar radius="xl" size="lg" src={sub.avatar} />
                    <Box><Text fw={700}>{sub.name}</Text><Text size="xs" c="dimmed">{sub.type}</Text></Box>
                  </Group>
                ))
              ) : (
                <Text c="dimmed" size="sm" py="md">No users found matching "{searchQuery}"</Text>
              )}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder>
            <Title order={4} mb="lg">Report History</Title>
            <Box h={200}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <Area type="monotone" dataKey="sub" stroke="#4318FF" strokeWidth={3} fill="#4318FF" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

function StatCard({ label, value, color, icon, darkText = false }) {
  return (
    <Paper radius="md" shadow="md" style={{ overflow: 'hidden' }}>
      <Box p="xl" bg={color} c={darkText ? 'black' : 'white'}>
        <Group justify="space-between" align="flex-start">
          <Box>
            <Text fw={800} style={{ fontSize: '36px', lineHeight: 1 }}>{value}</Text>
            <Text size="sm" fw={600} mt={5}>{label}</Text>
          </Box>
          <Box style={{ opacity: 0.2 }}>{icon && React.cloneElement(icon, { size: 54 })}</Box>
        </Group>
      </Box>
      <UnstyledButton w="100%" py={10} bg="rgba(0,0,0,0.08)">
        <Group justify="center" gap={5}>
          <Text size="xs" fw={700} c={darkText ? 'black' : 'white'}>More info</Text>
          <IconChevronRight size={14} stroke={3} color={darkText ? 'black' : 'white'} />
        </Group>
      </UnstyledButton>
    </Paper>
  );
}