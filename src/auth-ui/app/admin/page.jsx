"use client";

import React, { useState } from 'react';
import { 
  Grid, Paper, Text, Group, Box, Title, TextInput, ActionIcon, Avatar, SimpleGrid, Stack, UnstyledButton 
} from '@mantine/core';
import { 
  IconSearch, IconSettings, IconBell, IconUsers, IconShoppingCart, IconCar, 
  IconChevronRight 
} from '@tabler/icons-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid 
} from 'recharts';

// --- MOCK DATA ---
const weeklyData = [
  { name: 'Sat', Subscription: 500, Registration: 150 }, 
  { name: 'Sun', Subscription: 380, Registration: 80 },
  { name: 'Mon', Subscription: 350, Registration: 180 }, 
  { name: 'Tue', Subscription: 550, Registration: 320 },
  { name: 'Wed', Subscription: 200, Registration: 250 }, 
  { name: 'Thu', Subscription: 480, Registration: 230 },
  { name: 'Fri', Subscription: 400, Registration: 330 },
];

const pieData = [
  { name: 'People', value: 30, color: '#4318FF' },
  { name: 'Special case', value: 15, color: '#FFB800' },
  { name: 'Cars', value: 35, color: '#0000FF' },
  { name: 'Closed', value: 20, color: '#FF00FF' },
];

const subscriptionData = [
  { id: 1, name: 'Ms. x', type: 'Private', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'MR. r', type: 'Private', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Mr. W', type: 'Private', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export default function FullWidthDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box bg="#F4F7FE" style={{ minHeight: '100vh' }} p="xl">
      
      {/* HEADER SECTION */}
      <Group justify="space-between" mb="xl">
        <Title order={2} fw={700} c="#2B3674">Overview</Title>
        <Group bg="white" p={8} style={{ borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <TextInput 
            variant="unstyled" 
            placeholder="Search for something" 
            leftSection={<IconSearch size={18} color="gray" />} 
            styles={{ input: { backgroundColor: '#F4F7FE', borderRadius: '20px', height: '35px', paddingLeft: '40px' } }}
          />
          <ActionIcon variant="transparent" color="gray"><IconSettings size={20} /></ActionIcon>
          <ActionIcon variant="transparent" color="red"><IconBell size={20} /></ActionIcon>
        </Group>
      </Group>

      {/* TOP STAT CARDS */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="lg">
        <StatCard label="User Registrations" value="44" color="#FFB800" icon={<IconUsers />} />
        <StatCard label="User Registrations" value="44" color="#FFB800" icon={<IconUsers />} />
        <StatCard label="User Registrations" value="44" color="#FFB800" icon={<IconUsers />} />
      </SimpleGrid>

      {/* LOWER STAT CARDS */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
        <StatCard label="Total reports" value="1320" color="#BDEAF0" darkText icon={<IconShoppingCart />} />
        <StatCard label="Lost people report" value="720" color="#BDEAF0" darkText icon={<IconShoppingCart />} />
        <StatCard label="Lost car reports" value="599" color="#BDEAF0" darkText icon={<IconCar />} />
      </SimpleGrid>

      {/* FIXED CHARTS SECTION */}
      <Grid gutter="lg" mb="xl">
        {/* WEEKLY REPORT */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder>
            <Group justify="space-between" mb="xl">
              <Title order={4} c="#2B3674">Weekly Report</Title>
              <Group gap="lg">
                <Group gap={5}><Box w={8} h={8} bg="#4318FF" style={{borderRadius: '50%'}} /><Text size="xs" c="dimmed">Subscription</Text></Group>
                <Group gap={5}><Box w={8} h={8} bg="#6AD2FF" style={{borderRadius: '50%'}} /><Text size="xs" c="dimmed">Registration</Text></Group>
              </Group>
            </Group>
            <Box h={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3AED0'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#A3AED0'}} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="Subscription" fill="#4318FF" radius={[10, 10, 10, 10]} barSize={12} />
                  <Bar dataKey="Registration" fill="#6AD2FF" radius={[10, 10, 10, 10]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid.Col>

        {/* REPORT STATISTICS */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder>
            <Title order={4} mb="xl" c="#2B3674">Report Statistics</Title>
            <Box h={200}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <SimpleGrid cols={2} mt="md">
              {pieData.map((e) => (
                <Group key={e.name} gap={5}>
                  <Box w={8} h={8} bg={e.color} style={{borderRadius: '50%'}} />
                  <Box><Text size="xs" c="dimmed">{e.name}</Text><Text size="sm" fw={700}>{e.value}%</Text></Box>
                </Group>
              ))}
            </SimpleGrid>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* BOTTOM SECTION */}
      <Grid gutter="lg">
        {/* RECENT SUBSCRIPTION */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder>
            <Title order={4} mb="lg" c="#2B3674">Recent subscription</Title>
            <Group gap="xl">
              {subscriptionData.map((sub) => (
                <Stack key={sub.id} align="center" gap={5}>
                  <Avatar radius="xl" size="lg" src={sub.avatar} />
                  <Text fw={700} size="sm">{sub.name}</Text>
                  <Text size="xs" c="blue">{sub.type}</Text>
                </Stack>
              ))}
              <ActionIcon variant="light" radius="xl" size="lg"><IconChevronRight size={18}/></ActionIcon>
            </Group>
          </Paper>
        </Grid.Col>

        {/* REPORT HISTORY */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder>
            <Title order={4} mb="lg" c="#2B3674">Report History</Title>
            <Box h={200}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4318FF" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4318FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9EDF7" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3AED0'}} />
                  <Area type="monotone" dataKey="Subscription" stroke="#4318FF" strokeWidth={4} fill="url(#colorSub)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

// --- HELPER COMPONENT ---

function StatCard({ label, value, color, icon, darkText = false }) {
  return (
    <Paper radius="md" shadow="md" style={{ overflow: 'hidden' }}>
      <Box p="md" bg={color} c={darkText ? 'black' : 'white'}>
        <Group justify="space-between" align="center">
          <Box>
            <Text fw={800} style={{ fontSize: '32px', lineHeight: 1 }}>{value}</Text>
            <Text size="xs" fw={600}>{label}</Text>
          </Box>
          <Box style={{ opacity: 0.3 }}>{icon && React.cloneElement(icon, { size: 40 })}</Box>
        </Group>
      </Box>
      <UnstyledButton w="100%" py={5} bg="rgba(0,0,0,0.1)">
        <Group justify="center" gap={5}>
          <Text size="xs" fw={700} c={darkText ? 'black' : 'white'}>More info</Text>
          <IconChevronRight size={12} stroke={3} color={darkText ? 'black' : 'white'} />
        </Group>
      </UnstyledButton>
    </Paper>
  );
}