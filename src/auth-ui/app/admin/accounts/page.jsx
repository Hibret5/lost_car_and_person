"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Title,
  Text,
  Group,
  Box,
  Paper,
  SimpleGrid,
  TextInput,
  Table,
  Badge,
  Avatar,
  ActionIcon,
  Button,
  Select,
  Pagination,
  Modal,
  Stack,
  Grid,
  Divider,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
  useMantineColorScheme,
  Loader,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  IconUsers,
  IconSearch,
  IconEdit,
  IconPlus,
  IconDownload,
  IconSettings,
  IconBell,
  IconTrash,
  IconEye,
  IconCheck,
  IconFileSpreadsheet,
  IconChevronRight,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useRouter } from "next/navigation";

// API base URL – adjust to your JSON Server endpoint
const API_BASE_URL = "http://localhost:3001";

// Helper to get dynamic background/color values
const getBg = (colorScheme: string, light: string, dark: string) =>
  colorScheme === "dark" ? dark : light;
const getTextColor = (colorScheme: string, light: string, dark: string) =>
  colorScheme === "dark" ? dark : light;

// Type definitions for API user
interface ApiUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  role: string;
  lastLogin: string;
  registrations: number;
  hasPaidSubscription: boolean;
  address?: string;
}

// Type for component user (derived from API)
interface ComponentUser {
  id: string;
  name: string;
  email: string;
  username: string; // generated from email or name
  status: "Paid" | "Free";
  role: string;
  joined: string; // formatted createdAt
  joinedDate: Date;
  active: string; // formatted lastLogin
  lastLogin: string; // raw date for threshold
  phone: string;
  address?: string;
  isActive: boolean;
  registrations: number;
}

// Helper functions to map between API and component formats
const mapApiToComponent = (apiUser: ApiUser): ComponentUser => {
  const name = `${apiUser.firstName} ${apiUser.lastName}`.trim();
  // Generate username from email or name
  const username = apiUser.email.split("@")[0] || name.replace(/\s/g, "").toLowerCase();

  // Format joined date
  const joinedDate = new Date(apiUser.createdAt);
  const joined = joinedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format last active string
  let active = "Just now";
  const lastLoginDate = new Date(apiUser.lastLogin);
  const now = new Date();
  const diffMs = now.getTime() - lastLoginDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMinutes < 1) active = "Just now";
  else if (diffMinutes < 60) active = `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  else if (diffHours < 24) active = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  else if (diffDays < 30) active = `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  else if (diffMonths < 12) active = `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  else active = `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;

  return {
    id: apiUser.id,
    name,
    email: apiUser.email,
    username,
    status: apiUser.hasPaidSubscription ? "Paid" : "Free",
    role: apiUser.role,
    joined,
    joinedDate,
    active,
    lastLogin: apiUser.lastLogin,
    phone: apiUser.phone,
    address: apiUser.address,
    isActive: apiUser.isActive,
    registrations: apiUser.registrations,
  };
};

const mapComponentToApi = (componentUser: ComponentUser): ApiUser => {
  // Split name into first and last
  const nameParts = componentUser.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    id: componentUser.id,
    firstName,
    lastName,
    email: componentUser.email,
    phone: componentUser.phone,
    password: "", // We won't send password on updates, but for full object we need it; we'll handle separately
    createdAt: componentUser.joinedDate.toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: componentUser.isActive,
    role: componentUser.role,
    lastLogin: componentUser.lastLogin,
    registrations: componentUser.registrations,
    hasPaidSubscription: componentUser.status === "Paid",
    address: componentUser.address,
  };
};

// Form values for adding a new user (subset of ApiUser)
interface AddUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  hasPaidSubscription: boolean;
  address?: string;
}

const mapFormToApi = (values: AddUserFormValues): Omit<ApiUser, "id"> => ({
  firstName: values.firstName,
  lastName: values.lastName,
  email: values.email,
  phone: values.phone,
  password: values.password,
  role: values.role,
  hasPaidSubscription: values.hasPaidSubscription,
  address: values.address,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  lastLogin: new Date().toISOString(),
  registrations: 0,
});

// Helper to compute active threshold (days since last login)
const getActiveThreshold = (lastLogin: string): number => {
  const lastLoginDate = new Date(lastLogin);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastLoginDate.getTime()) / (1000 * 3600 * 24));
  return diffDays;
};

export default function UserManagementPage() {
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Dynamic colors
  const mainBg = getBg(colorScheme, "#F4F7FE", theme.colors.dark[7]);
  const primaryText = getTextColor(colorScheme, "#2B3674", theme.colors.gray[3]);
  const headerBg = getBg(colorScheme, "white", theme.colors.dark[6]);
  const cardBg = getBg(colorScheme, "white", theme.colors.dark[6]);
  const tableHeaderBg = "#4318FF";
  const buttonPrimaryBg = "#2B3674";

  // ---------- State ----------
  const [users, setUsers] = useState<ComponentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dateSort, setDateSort] = useState("Newest");
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState("10");
  const [editingUser, setEditingUser] = useState<ComponentUser | null>(null);
  const [viewingUser, setViewingUser] = useState<ComponentUser | null>(null);

  // ---------- Modals ----------
  const [addModalOpened, addModalHandlers] = useDisclosure(false);
  const [editModalOpened, editModalHandlers] = useDisclosure(false);
  const [viewModalOpened, viewModalHandlers] = useDisclosure(false);

  // ---------- Fetch users from API ----------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const apiUsers: ApiUser[] = await response.json();
      const componentUsers = apiUsers.map(mapApiToComponent);
      setUsers(componentUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      notifications.show({
        title: "Error",
        message: "Could not load users",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------- Filtered & Sorted Users ----------
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower) ||
          u.username.toLowerCase().includes(lower)
      );
    }

    if (roleFilter && roleFilter !== "All") {
      result = result.filter((u) => u.role === roleFilter);
    }

    if (statusFilter && statusFilter !== "All") {
      result = result.filter((u) => u.status === statusFilter);
    }

    if (dateSort === "Newest") {
      result.sort((a, b) => b.joinedDate.getTime() - a.joinedDate.getTime());
    } else if (dateSort === "Oldest") {
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

  const totalPages = useMemo(
    () => Math.ceil(filteredUsers.length / parseInt(pageSize)),
    [filteredUsers, pageSize]
  );

  useEffect(() => {
    setActivePage(1);
  }, [search, roleFilter, statusFilter, dateSort, pageSize]);

  // ---------- Stats ----------
  const stats = useMemo(() => {
    const total = users.length;
    const activeUsers = users.filter((u) => getActiveThreshold(u.lastLogin) < 7).length;
    const paidUsers = users.filter((u) => u.status === "Paid").length;
    const now = new Date();
    const thisMonth = users.filter(
      (u) =>
        u.joinedDate.getMonth() === now.getMonth() &&
        u.joinedDate.getFullYear() === now.getFullYear()
    ).length;
    return { total, activeUsers, paidUsers, thisMonth };
  }, [users]);

  // ---------- CRUD Operations ----------
  const addUser = async (values: AddUserFormValues) => {
    try {
      const newApiUser = mapFormToApi(values);
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newApiUser),
      });
      if (!response.ok) throw new Error("Failed to add user");
      const createdUser: ApiUser = await response.json();
      const newComponentUser = mapApiToComponent(createdUser);
      setUsers((prev) => [newComponentUser, ...prev]);
      notifications.show({
        title: "Success",
        message: `User ${newComponentUser.name} added`,
        color: "green",
        icon: <IconCheck size={18} />,
      });
      addModalHandlers.close();
    } catch (error) {
      console.error("Error adding user:", error);
      notifications.show({
        title: "Error",
        message: "Could not add user",
        color: "red",
      });
    }
  };

  const updateUser = async (values: ComponentUser) => {
    try {
      // Get the full API user object (we need all fields, including password)
      // Since we don't have the password in the component, we fetch it first or keep it in state
      // Alternatively, we can make a PATCH request with only changed fields.
      // Here we'll fetch the existing user to get the password.
      const existingUserResponse = await fetch(`${API_BASE_URL}/users/${values.id}`);
      if (!existingUserResponse.ok) throw new Error("User not found");
      const existingApiUser: ApiUser = await existingUserResponse.json();

      // Update fields from the component user
      const updatedApiUser: ApiUser = {
        ...existingApiUser,
        firstName: values.name.split(" ")[0] || "",
        lastName: values.name.split(" ").slice(1).join(" ") || "",
        email: values.email,
        phone: values.phone,
        role: values.role,
        hasPaidSubscription: values.status === "Paid",
        address: values.address,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE_URL}/users/${values.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedApiUser),
      });
      if (!response.ok) throw new Error("Failed to update user");
      const updatedUser: ApiUser = await response.json();
      const updatedComponentUser = mapApiToComponent(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === updatedComponentUser.id ? updatedComponentUser : u)));
      notifications.show({
        title: "Updated",
        message: `User ${updatedComponentUser.name} updated`,
        color: "blue",
        icon: <IconCheck size={18} />,
      });
      editModalHandlers.close();
    } catch (error) {
      console.error("Error updating user:", error);
      notifications.show({
        title: "Error",
        message: "Could not update user",
        color: "red",
      });
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      notifications.show({
        title: "Deleted",
        message: "User removed",
        color: "red",
        icon: <IconTrash size={18} />,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      notifications.show({
        title: "Error",
        message: "Could not delete user",
        color: "red",
      });
    }
  };

  // ---------- Export CSV ----------
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Username", "Status", "Role", "Joined Date", "Last Active"];
    const data = filteredUsers.map((u) => [u.name, u.email, u.username, u.status, u.role, u.joined, u.active]);
    const csv = [headers.join(","), ...data.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    notifications.show({
      title: "Exported",
      message: `${filteredUsers.length} users exported`,
      color: "green",
      icon: <IconFileSpreadsheet size={18} />,
    });
  };

  // ---------- Forms ----------
  const addForm = useForm<AddUserFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      role: "user",
      hasPaidSubscription: false,
      address: "",
    },
    validate: {
      firstName: (v) => (v.trim().length < 2 ? "First name is too short" : null),
      lastName: (v) => (v.trim().length < 2 ? "Last name is too short" : null),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Invalid email"),
      phone: (v) => (v.trim().length < 10 ? "Phone number too short" : null),
      password: (v) => (v.length < 6 ? "Password must be at least 6 characters" : null),
    },
  });

  const editForm = useForm<ComponentUser>({
    initialValues: editingUser || {
      id: "",
      name: "",
      email: "",
      username: "",
      status: "Free",
      role: "user",
      joined: "",
      joinedDate: new Date(),
      active: "",
      lastLogin: "",
      phone: "",
      address: "",
      isActive: true,
      registrations: 0,
    },
    validate: {
      name: (v) => (v?.trim().length < 2 ? "Name is too short" : null),
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Invalid email"),
      phone: (v) => (v?.trim().length < 10 ? "Phone number too short" : null),
    },
  });

  useEffect(() => {
    if (editingUser) {
      editForm.setValues(editingUser);
      editForm.resetDirty();
    }
  }, [editingUser]);

  // ---------- Render ----------
  if (loading) {
    return (
      <Box bg={mainBg} style={{ minHeight: "100vh" }} p="xl">
        <Group justify="center" mt={100}>
          <Loader size="xl" />
        </Group>
      </Box>
    );
  }

  return (
    <Box bg={mainBg} style={{ minHeight: "100vh" }} p="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl">
        <Title order={2} fw={700} c={primaryText}>
          User Management
        </Title>
        <Group bg={headerBg} p={8} style={{ borderRadius: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
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
          { label: "Total Users", value: stats.total, color: "#4318FF" },
          { label: "Active (7d)", value: stats.activeUsers, color: "#00B8D9" },
          { label: "Paid Users", value: stats.paidUsers, color: "#20C997" },
          { label: "New This Month", value: stats.thisMonth, color: "#F59E0B" },
        ].map((stat, i) => (
          <Paper
            key={i}
            p="md"
            radius="lg"
            bg={`linear-gradient(145deg, ${stat.color}, ${stat.color}DD)`}
            c="white"
            shadow="md"
          >
            <Group justify="space-between" align="flex-start">
              <Box>
                <Text size="xl" fw={800} style={{ fontSize: "32px" }}>
                  {stat.value}
                </Text>
                <Text size="sm" fw={500}>
                  {stat.label}
                </Text>
              </Box>
              <IconUsers size={48} opacity={0.3} />
            </Group>
            <UnstyledButton
              w="100%"
              py={8}
              mt="md"
              style={{ backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "8px" }}
              onClick={() => notifications.show({ message: `Showing ${stat.label.toLowerCase()}`, color: "blue" })}
            >
              <Text size="xs" fw={600}>
                More info →
              </Text>
            </UnstyledButton>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Main Table Card */}
      <Paper p="md" radius="lg" shadow="sm" withBorder bg={cardBg}>
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
                data={["All", "Admin", "User", "Guest"]}
                w={110}
                radius="md"
                value={roleFilter}
                onChange={setRoleFilter}
                clearable
              />
              <Select
                placeholder="Status"
                data={["All", "Paid", "Free"]}
                w={110}
                radius="md"
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
              />
              <Select
                placeholder="Sort by"
                data={["Newest", "Oldest"]}
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
                bg={buttonPrimaryBg}
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
              <Table.Thead bg={tableHeaderBg}>
                <Table.Tr>
                  <Table.Th c="white">Full Name</Table.Th>
                  <Table.Th c="white">Email</Table.Th>
                  <Table.Th c="white">Username</Table.Th>
                  <Table.Th c="white">Status</Table.Th>
                  <Table.Th c="white">Role</Table.Th>
                  <Table.Th c="white">Joined Date</Table.Th>
                  <Table.Th c="white">Last Active</Table.Th>
                  <Table.Th c="white" style={{ width: 140 }}>
                    Actions
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedUsers.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Text ta="center" py="xl" c="dimmed">
                        No users found
                      </Text>
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
                          <Text size="sm" fw={500}>
                            {user.name}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>{user.email}</Table.Td>
                      <Table.Td>{user.username}</Table.Td>
                      <Table.Td>
                        <Badge color={user.status === "Paid" ? "green" : "gray"} variant="filled" radius="xl">
                          {user.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            user.role === "Admin" ? "red" : user.role === "User" ? "blue" : "cyan"
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
              <Text size="sm" c="dimmed">
                Rows per page
              </Text>
              <Select
                size="xs"
                w={70}
                data={["10", "20", "50"]}
                value={pageSize}
                onChange={(val) => setPageSize(val || "10")}
              />
              <Text size="sm" c="dimmed">
                {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
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
      <Modal
        opened={addModalOpened}
        onClose={addModalHandlers.close}
        title={<Text fw={700} size="lg">Add New User</Text>}
        centered
        size="lg"
        radius="md"
      >
        <form onSubmit={addForm.onSubmit(addUser)}>
          <Stack gap="sm">
            <Grid>
              <Grid.Col span={6}>
                <TextInput label="First Name" placeholder="John" {...addForm.getInputProps("firstName")} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Last Name" placeholder="Doe" {...addForm.getInputProps("lastName")} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Email" placeholder="john@example.com" {...addForm.getInputProps("email")} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Phone" placeholder="+251911111111" {...addForm.getInputProps("phone")} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Password" type="password" placeholder="******" {...addForm.getInputProps("password")} required />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Role"
                  data={["admin", "user", "guest"]}
                  {...addForm.getInputProps("role")}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Subscription Status"
                  data={[
                    { value: "true", label: "Paid" },
                    { value: "false", label: "Free" },
                  ]}
                  value={String(addForm.values.hasPaidSubscription)}
                  onChange={(val) => addForm.setFieldValue("hasPaidSubscription", val === "true")}
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Address" placeholder="Addis Ababa" {...addForm.getInputProps("address")} />
              </Grid.Col>
            </Grid>
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={addModalHandlers.close}>
                Cancel
              </Button>
              <Button type="submit" bg={buttonPrimaryBg}>
                Add User
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Modal
        opened={editModalOpened}
        onClose={editModalHandlers.close}
        title={<Text fw={700} size="lg">Edit User</Text>}
        centered
        size="lg"
        radius="md"
      >
        {editingUser && (
          <form onSubmit={editForm.onSubmit(updateUser)}>
            <Stack gap="sm">
              <Grid>
                <Grid.Col span={12}>
                  <TextInput label="Full Name" {...editForm.getInputProps("name")} required />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput label="Email" {...editForm.getInputProps("email")} required />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput label="Phone" {...editForm.getInputProps("phone")} required />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Role"
                    data={["Admin", "User", "Guest"]}
                    {...editForm.getInputProps("role")}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Status"
                    data={["Paid", "Free"]}
                    {...editForm.getInputProps("status")}
                    required
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput label="Address" {...editForm.getInputProps("address")} />
                </Grid.Col>
              </Grid>
              <Group justify="space-between" mt="md">
                <Button
                  color="red"
                  variant="light"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => {
                    deleteUser(editingUser.id);
                    editModalHandlers.close();
                  }}
                >
                  Delete
                </Button>
                <Group>
                  <Button variant="subtle" onClick={editModalHandlers.close}>
                    Cancel
                  </Button>
                  <Button type="submit" bg={buttonPrimaryBg}>
                    Update
                  </Button>
                </Group>
              </Group>
            </Stack>
          </form>
        )}
      </Modal>

      <Modal
        opened={viewModalOpened}
        onClose={viewModalHandlers.close}
        title={<Text fw={700} size="lg">User Details</Text>}
        centered
        size="lg"
        radius="md"
      >
        {viewingUser && (
          <Stack gap="md">
            <Group gap="xl">
              <Avatar size={80} radius="xl" color="blue">
                {viewingUser.name.charAt(0)}
              </Avatar>
              <Box>
                <Text fw={700} size="xl">
                  {viewingUser.name}
                </Text>
                <Text size="sm" c="dimmed">
                  @{viewingUser.username}
                </Text>
              </Box>
            </Group>
            <Divider />
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Email
                </Text>
                <Text>{viewingUser.email}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Phone
                </Text>
                <Text>{viewingUser.phone}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">
                  Status
                </Text>
                <Badge color={viewingUser.status === "Paid" ? "green" : "gray"}>{viewingUser.status}</Badge>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">
                  Role
                </Text>
                <Badge
                  color={
                    viewingUser.role === "Admin" ? "red" : viewingUser.role === "User" ? "blue" : "cyan"
                  }
                >
                  {viewingUser.role}
                </Badge>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text size="sm" c="dimmed">
                  Registrations
                </Text>
                <Text>{viewingUser.registrations}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Joined
                </Text>
                <Text>{viewingUser.joined}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">
                  Last Active
                </Text>
                <Text>{viewingUser.active}</Text>
              </Grid.Col>
              {viewingUser.address && (
                <Grid.Col span={12}>
                  <Text size="sm" c="dimmed">
                    Address
                  </Text>
                  <Text>{viewingUser.address}</Text>
                </Grid.Col>
              )}
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