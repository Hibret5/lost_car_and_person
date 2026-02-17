'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Container, Title, Paper, Text, Table, Badge, Group, Avatar, Loader, Center, Grid, Button
} from '@mantine/core';

// Mock data – replace with actual data fetching
const mockUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@gmail.com', username: 'jonny77', status: 'Paid', role: 'Admin', joined: 'March 12, 2023', active: '1 minute ago' },
  { id: 2, name: 'Olivia Bennett', email: 'ollyben@gmail.com', username: 'olly659', status: 'Free', role: 'User', joined: 'June 27, 2022', active: '1 month ago' },
  { id: 3, name: 'Daniel Warren', email: 'dwarren3@gmail.com', username: 'dwarren3', status: 'Paid', role: 'User', joined: 'January 8, 2024', active: '4 days ago' },
  { id: 4, name: 'Chloe Hayes', email: 'chloehhye@gmail.com', username: 'chloehh', status: 'Paid', role: 'Guest', joined: 'October 5, 2021', active: '10 days ago' },
  { id: 5, name: 'Marcus Reed', email: 'reeds777@gmail.com', username: 'reeds7', status: 'Free', role: 'User', joined: 'February 19, 2023', active: '3 months ago' },
];

const mockReportsCount = {
  1: 5,
  2: 2,
  3: 0,
  4: 1,
  5: 3,
};

const mockLogs = {
  1: [
    { id: 101, action: 'Login', timestamp: '2025-02-13 10:30', ip: '192.168.1.1' },
    { id: 102, action: 'Updated profile', timestamp: '2025-02-12 15:20', ip: '192.168.1.1' },
    { id: 103, action: 'Changed password', timestamp: '2025-02-10 09:15', ip: '192.168.1.1' },
  ],
  2: [
    { id: 201, action: 'Login', timestamp: '2025-02-11 08:00', ip: '10.0.0.2' },
  ],
  3: [],
  4: [
    { id: 401, action: 'Login', timestamp: '2025-02-09 14:22', ip: '172.16.0.1' },
    { id: 402, action: 'Viewed reports', timestamp: '2025-02-08 11:05', ip: '172.16.0.1' },
  ],
  5: [
    { id: 501, action: 'Login', timestamp: '2025-02-07 09:30', ip: '192.168.1.5' },
    { id: 502, action: 'Exported data', timestamp: '2025-02-06 16:45', ip: '192.168.1.5' },
    { id: 503, action: 'Login', timestamp: '2025-02-05 08:20', ip: '192.168.1.5' },
  ],
};

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reportsCount, setReportsCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate data fetching
    const userId = Number(id);
    const foundUser = mockUsers.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      setReportsCount(mockReportsCount[userId] || 0);
      setLogs(mockLogs[userId] || []);
    }
    setLoading(false);
  }, [id]);

  const handleEdit = () => {
    // Replace with actual edit logic (e.g., open modal or navigate to edit page)
    alert(`Edit user ${user?.name}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${user?.name}?`)) {
      // Replace with actual delete API call, then redirect
      alert('User deleted (simulated)');
      router.push('/users'); // or wherever your user list is
    }
  };

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!user) {
    return (
      <Container size="lg" py="xl">
        <Title order={2} c="red">User not found</Title>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">User Details</Title>
      <Paper withBorder p="lg" radius="md" shadow="sm">
        {/* User header with avatar and action buttons */}
        <Group justify="space-between" align="center">
          <Group gap="xl">
            <Avatar size={80} radius="xl" color="blue">
              {user.name.charAt(0)}
            </Avatar>
            <div>
              <Text fw={700} size="xl">{user.name}</Text>
              <Text size="sm" c="dimmed">@{user.username}</Text>
            </div>
          </Group>
          <Group>
            <Button variant="outline" onClick={handleEdit}>Edit</Button>
            <Button color="red" onClick={handleDelete}>Delete</Button>
          </Group>
        </Group>

        {/* User information grid */}
        <Grid mt="md">
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Email</Text>
            <Text>{user.email}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Status</Text>
            <Badge color={user.status === 'Paid' ? 'green' : 'gray'}>{user.status}</Badge>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Role</Text>
            <Badge
              color={
                user.role === 'Admin' ? 'red' :
                user.role === 'User' ? 'blue' : 'cyan'
              }
            >
              {user.role}
            </Badge>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Joined</Text>
            <Text>{user.joined}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" c="dimmed">Last Active</Text>
            <Text>{user.active}</Text>
          </Grid.Col>
        </Grid>

        {/* Reports count */}
        <Paper withBorder p="md" mt="xl" bg="blue.0">
          <Text fw={600} size="lg">Reports Submitted</Text>
          <Text fw={700} size="48px" c="blue">{reportsCount}</Text>
        </Paper>

        {/* Logs table */}
        <Title order={3} mt="xl" mb="sm">User Activity Logs</Title>
        {logs.length === 0 ? (
          <Text c="dimmed">No logs found for this user.</Text>
        ) : (
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Action</Table.Th>
                <Table.Th>Timestamp</Table.Th>
                <Table.Th>IP Address</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {logs.map(log => (
                <Table.Tr key={log.id}>
                  <Table.Td>{log.action}</Table.Td>
                  <Table.Td>{log.timestamp}</Table.Td>
                  <Table.Td>{log.ip}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </Container>
  );
}