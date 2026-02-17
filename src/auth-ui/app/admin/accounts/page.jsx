"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Title, Text, Group, Box, Paper, SimpleGrid, TextInput,
  Table, Badge, Avatar, ActionIcon, Button, Select, Pagination,
  Modal, Stack, Grid, Divider, Tooltip, UnstyledButton
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconUsers, IconSearch, IconEdit, IconPlus, IconDownload, IconSettings, IconBell,
  IconTrash, IconEye, IconCheck, IconFileSpreadsheet, IconChevronRight
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';

// ---------- Initial Data ----------
const initialUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@gmail.com', username: 'jonny77', status: 'Paid', role: 'Admin', joined: 'March 12, 2023', joinedDate: new Date('2023-03-12'), active: '1 minute ago' },
  { id: 2, name: 'Olivia Bennett', email: 'ollyben@gmail.com', username: 'olly659', status: 'Free', role: 'User', joined: 'June 27, 2022', joinedDate: new Date('2022-06-27'), active: '1 month ago' },
  { id: 3, name: 'Daniel Warren', email: 'dwarren3@gmail.com', username: 'dwarren3', status: 'Paid', role: 'User', joined: 'January 8, 2024', joinedDate: new Date('2024-01-08'), active: '4 days ago' },
  { id: 4, name: 'Chloe Hayes', email: 'chloehhye@gmail.com', username: 'chloehh', status: 'Paid', role: 'Guest', joined: 'October 5, 2021', joinedDate: new Date('2021-10-05'), active: '10 days ago' },
  { id: 5, name: 'Marcus Reed', email: 'reeds777@gmail.com', username: 'reeds7', status: 'Free', role: 'User', joined: 'February 19, 2023', joinedDate: new Date('2023-02-19'), active: '3 months ago' },
];

// ---------- Helper Functions ----------
const formatDateForInput = (date) => date.toISOString().split('T')[0];

const getActiveThreshold = (activeStr) => {
  if (activeStr.includes('minute') || activeStr.includes('hour') || (activeStr.includes('day') && !activeStr.includes('days'))) return 1;
  if (activeStr.includes('days')) return parseInt(activeStr) || 7;
  if (activeStr.includes('week')) return 7;
  if (activeStr.includes('month')) return 30;
  return 365;
};

export default function UserManagementPage() {
  const router = useRouter();

  // ---------- State ----------
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [dateSort, setDateSort] = useState('Newest');
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  // ---------- Modals ----------
  const [addModalOpened, addModalHandlers] = useDisclosure(false);
  const [editModalOpened, editModalHandlers] = useDisclosure(false);
  const [viewModalOpened, viewModalHandlers] = useDisclosure(false);

  // ---------- Filtered & Sorted Users ----------
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(u =>
        u.name.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower) ||
        u.username.toLowerCase().includes(lower)
      );
    }

    if (roleFilter && roleFilter !== 'All') {
      result = result.filter(u => u.role === roleFilter);
    }

    if (statusFilter && statusFilter !== 'All') {
      result = result.filter(u => u.status === statusFilter);
    }

    if (dateSort === 'Newest') {
      result.sort((a, b) => b.joinedDate.getTime() - a.joinedDate.getTime());
    } else if (dateSort === 'Oldest') {
      result.sort((a, b) => a.joinedDate.getTime() - b.joinedDate.getTime());
    }

    return result;
  }, [users, search, roleFilter, statusFilter, dateSort]);

  // ---------- Pagination ----------
  const paginatedUsers = useMemo(() => {
    const size = parseInt(pageSize);
    const start = (activePage - 1) * size;
    return filteredUsers.slice(start, start + size);
  }, [filteredUsers, activePage, pageSize]);

  const totalPages = useMemo(() => Math.ceil(filteredUsers.length / parseInt(pageSize)), [filteredUsers, pageSize]);

  useEffect(() => {
    setActivePage(1);
  }, [search, roleFilter, statusFilter, dateSort, pageSize]);

  // ---------- Stats ----------
  const stats = useMemo(() => {
    const total = users.length;
    const activeUsers = users.filter(u => getActiveThreshold(u.active) < 7).length;
    const paidUsers = users.filter(u => u.status === 'Paid').length;
    const now = new Date();
    const thisMonth = users.filter(u =>
      u.joinedDate.getMonth() === now.getMonth() &&
      u.joinedDate.getFullYear() === now.getFullYear()
    ).length;
    return { total, activeUsers, paidUsers, thisMonth };
  }, [users]);

  // ---------- CRUD Operations ----------
  const addUser = (values) => {
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const joinedDate = new Date(values.joined);
    const joinedDisplay = joinedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const newUser = {
      ...values,
      id: newId,
      joined: joinedDisplay,
      joinedDate,
      active: 'Just now',
    };
    setUsers(prev => [newUser, ...prev]);
    notifications.show({
      title: 'Success',
      message: `User ${newUser.name} added`,
      color: 'green',
      icon: <IconCheck size={18} />,
    });
    addModalHandlers.close();
  };

  const updateUser = (values) => {
    setUsers(prev => prev.map(u => u.id === values.id ? { ...values } : u));
    notifications.show({
      title: 'Updated',
      message: `User ${values.name} updated`,
      color: 'blue',
      icon: <IconCheck size={18} />,
    });
    editModalHandlers.close();
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    notifications.show({
      title: 'Deleted',
      message: 'User removed',
      color: 'red',
      icon: <IconTrash size={18} />,
    });
  };

  // ---------- Export CSV ----------
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Username', 'Status', 'Role', 'Joined Date', 'Last Active'];
    const data = filteredUsers.map(u => [
      u.name, u.email, u.username, u.status, u.role, u.joined, u.active
    ]);
    const csv = [headers.join(','), ...data.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    notifications.show({
      title: 'Exported',
      message: `${filteredUsers.length} users exported`,
      color: 'green',
      icon: <IconFileSpreadsheet size={18} />,
    });
  };

  // ---------- Forms ----------
  const addForm = useForm({
    initialValues: {
      name: '',
      email: '',
      username: '',
      status: 'Free',
      role: 'User',
      joined: formatDateForInput(new Date()),
    },
    validate: {
      name: (v) => (v.trim().length < 2 ? 'Name is too short' : null),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Invalid email'),
      username: (v) => (v.trim().length < 3 ? 'Username too short' : null),
    },
  });

  const editForm = useForm({
    initialValues: editingUser || {},
    validate: {
      name: (v) => (v?.trim().length < 2 ? 'Name is too short' : null),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Invalid email'),
      username: (v) => (v?.trim().length < 3 ? 'Username too short' : null),
    },
  });

  useEffect(() => {
    if (editingUser) {
      editForm.setValues(editingUser);
      editForm.resetDirty();
    }
  }, [editingUser]);

  // ---------- Render ----------
  return (
    <Box p="xl" bg="#F4F7FE" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <Title order={2} fw={700} c="#2B3674">User Management</Title>
        <Group bg="white" p={8} style={{ borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Tooltip label="Settings">
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconSettings size={22} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Notifications">
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconBell size={22} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg" mb="xl">
        {[
          { label: 'Total Users', value: stats.total, color: '#4318FF' },
          { label: 'Active (7d)', value: stats.activeUsers, color: '#00B8D9' },
          { label: 'Paid Users', value: stats.paidUsers, color: '#20C997' },
          { label: 'New This Month', value: stats.thisMonth, color: '#F59E0B' }
        ].map((stat, i) => (
          <Paper key={i} p="md" radius="lg" bg={`linear-gradient(145deg, ${stat.color}, ${stat.color}DD)`} c="white" shadow="md">
            <Group justify="space-between" align="flex-start">
              <Box>
                <Text size="xl" fw={800} style={{ fontSize: '32px' }}>{stat.value}</Text>
                <Text size="sm" fw={500}>{stat.label}</Text>
              </Box>
              <IconUsers size={48} opacity={0.3} />
            </Group>
            <UnstyledButton
              w="100%"
              py={8}
              mt="md"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
              onClick={() => notifications.show({ message: `Showing ${stat.label.toLowerCase()}`, color: 'blue' })}
            >
              <Text size="xs" fw={600}>More info →</Text>
            </UnstyledButton>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Main Table Card */}
      <Paper p="md" radius="lg" shadow="sm" withBorder>
        <Stack gap="md">
          {/* Filters & Actions */}
          <Group justify="space-between">
            <Group gap="xs">
              <TextInput
                placeholder="Search by name, email, username"
                leftSection={<IconSearch size={16} />}
                radius="md"
                w={260}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
              <Select
                placeholder="Role"
                data={['All', 'Admin', 'User', 'Guest']}
                w={110}
                radius="md"
                value={roleFilter}
                onChange={setRoleFilter}
                clearable
              />
              <Select
                placeholder="Status"
                data={['All', 'Paid', 'Free']}
                w={110}
                radius="md"
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
              />
              <Select
                placeholder="Sort by"
                data={['Newest', 'Oldest']}
                w={130}
                radius="md"
                value={dateSort}
                onChange={setDateSort}
              />
            </Group>

            <Group gap="sm">
              <Button
                variant="outline"
                color="gray"
                leftSection={<IconDownload size={16} />}
                radius="md"
                onClick={exportToCSV}
              >
                Export
              </Button>
              <Button
                leftSection={<IconPlus size={16} />}
                bg="#2B3674"
                radius="md"
                onClick={addModalHandlers.open}
              >
                Add User
              </Button>
            </Group>
          </Group>

          {/* Table */}
          <Table.ScrollContainer minWidth={900}>
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead bg="#4318FF">
                <Table.Tr>
                  <Table.Th c="white">Full Name</Table.Th>
                  <Table.Th c="white">Email</Table.Th>
                  <Table.Th c="white">Username</Table.Th>
                  <Table.Th c="white">Status</Table.Th>
                  <Table.Th c="white">Role</Table.Th>
                  <Table.Th c="white">Joined Date</Table.Th>
                  <Table.Th c="white">Last Active</Table.Th>
                  <Table.Th c="white" style={{ width: 140 }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedUsers.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Text ta="center" py="xl" c="dimmed">No users found</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <Table.Tr key={user.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar size="sm" radius="xl" color="blue">
                            {user.name.charAt(0)}
                          </Avatar>
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
                      <Table.Td>
                        <Badge
                          color={
                            user.role === 'Admin' ? 'red' :
                            user.role === 'User' ? 'blue' : 'cyan'
                          }
                          variant="light"
                        >
                          {user.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{user.joined}</Table.Td>
                      <Table.Td>{user.active}</Table.Td>
                      <Table.Td>
                        <Group gap={4} justify="flex-end">
                          <Tooltip label="Edit">
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              onClick={() => {
                                setEditingUser(user);
                                editModalHandlers.open();
                              }}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="View details">
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={() => {
                                setViewingUser(user);
                                viewModalHandlers.open();
                              }}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="User details page">
                            <ActionIcon
                              variant="subtle"
                              color="teal"
                              onClick={() => router.push(`/admin/accounts/${user.id}`)}
                            >
                              <IconChevronRight size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>

          {/* Pagination */}
          <Group justify="space-between" mt="md">
            <Group gap="xs">
              <Text size="sm" c="dimmed">Rows per page</Text>
              <Select
                size="xs"
                w={70}
                data={['10', '20', '50']}
                value={pageSize}
                onChange={(val) => setPageSize(val || '10')}
              />
              <Text size="sm" c="dimmed">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
              </Text>
            </Group>
            <Pagination
              total={totalPages}
              value={activePage}
              onChange={setActivePage}
              radius="xl"
              color="blue"
              size="sm"
            />
          </Group>
        </Stack>
      </Paper>

      {/* ---------- Modals ---------- */}
      <Modal opened={addModalOpened} onClose={addModalHandlers.close} title={<Text fw={700} size="lg">Add New User</Text>} centered size="lg" radius="md">
        <form onSubmit={addForm.onSubmit(addUser)}>
          <Stack gap="sm">
            <Grid>
              <Grid.Col span={6}>
                <TextInput label="Full Name" placeholder="John Doe" {...addForm.getInputProps('name')} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Email" placeholder="john@example.com" {...addForm.getInputProps('email')} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Username" placeholder="john123" {...addForm.getInputProps('username')} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Join Date" type="date" {...addForm.getInputProps('joined')} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select label="Status" data={['Free', 'Paid']} {...addForm.getInputProps('status')} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select label="Role" data={['Admin', 'User', 'Guest']} {...addForm.getInputProps('role')} required />
              </Grid.Col>
            </Grid>
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={addModalHandlers.close}>Cancel</Button>
              <Button type="submit" bg="#2B3674">Add User</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal opened={editModalOpened} onClose={editModalHandlers.close} title={<Text fw={700} size="lg">Edit User</Text>} centered size="lg" radius="md">
        {editingUser && (
          <form onSubmit={editForm.onSubmit(updateUser)}>
            <Stack gap="sm">
              <Grid>
                <Grid.Col span={6}>
                  <TextInput label="Full Name" {...editForm.getInputProps('name')} required />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput label="Email" {...editForm.getInputProps('email')} required />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput label="Username" {...editForm.getInputProps('username')} required />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Join Date"
                    type="date"
                    value={formatDateForInput(editingUser.joinedDate)}
                    onChange={(e) => {
                      const newDate = new Date(e.currentTarget.value);
                      editForm.setFieldValue('joinedDate', newDate);
                      editForm.setFieldValue('joined', newDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
                    }}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select label="Status" data={['Free', 'Paid']} {...editForm.getInputProps('status')} required />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select label="Role" data={['Admin', 'User', 'Guest']} {...editForm.getInputProps('role')} required />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput label="Last Active" {...editForm.getInputProps('active')} />
                </Grid.Col>
              </Grid>
              <Group justify="space-between" mt="md">
                <Button color="red" variant="light" leftSection={<IconTrash size={16} />} onClick={() => { deleteUser(editingUser.id); editModalHandlers.close(); }}>
                  Delete
                </Button>
                <Group>
                  <Button variant="subtle" onClick={editModalHandlers.close}>Cancel</Button>
                  <Button type="submit" bg="#2B3674">Update</Button>
                </Group>
              </Group>
            </Stack>
          </form>
        )}
      </Modal>

      <Modal opened={viewModalOpened} onClose={viewModalHandlers.close} title={<Text fw={700} size="lg">User Details</Text>} centered size="lg" radius="md">
        {viewingUser && (
          <Stack gap="md">
            <Group gap="xl">
              <Avatar size={80} radius="xl" color="blue">{viewingUser.name.charAt(0)}</Avatar>
              <Box>
                <Text fw={700} size="xl">{viewingUser.name}</Text>
                <Text size="sm" c="dimmed">@{viewingUser.username}</Text>
              </Box>
            </Group>
            <Divider />
            <Grid>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Email</Text>
                <Text>{viewingUser.email}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Status</Text>
                <Badge color={viewingUser.status === 'Paid' ? 'green' : 'gray'}>{viewingUser.status}</Badge>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">Role</Text>
                <Badge color={viewingUser.role === 'Admin' ? 'red' : viewingUser.role === 'User' ? 'blue' : 'cyan'}>{viewingUser.role}</Badge>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Joined</Text>
                <Text>{viewingUser.joined}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Last Active</Text>
                <Text>{viewingUser.active}</Text>
              </Grid.Col>
            </Grid>
            <Group justify="flex-end">
              <Button
                variant="light"
                leftSection={<IconEdit size={16} />}
                onClick={() => {
                  viewModalHandlers.close();
                  setEditingUser(viewingUser);
                  editModalHandlers.open();
                }}
              >
                Edit User
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}