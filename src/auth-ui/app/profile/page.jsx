"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Title, Text, Button, TextInput, 
  Textarea, Avatar, Paper, Stack, Divider, 
  ActionIcon, Flex, UnstyledButton, Group, Switch, Modal, PasswordInput, Select, Table, Badge,
  useMantineColorScheme, useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconUser, IconBell, IconShield, IconHistory, 
  IconSettings, IconLogout, IconCamera, IconChevronRight, IconArrowLeft,
  IconClock, IconWorld, IconTrash, IconExternalLink,
  IconLock 
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

// Helper to get dynamic background colors
const getBg = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);
const getTextColor = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  
  const [activeTab, setActiveTab] = useState('Person');
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '' });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  const [pwdOpened, { open: openPwd, close: closePwd }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn'); 
    router.push('/');
    router.refresh();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          router.push('/');
        }
        // Use the absolute URL for JSON Server
        const response = await fetch('http://localhost:3001/alerts');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setAlerts(data);
      } catch (error) {
        setAlerts([
          { id: 1, type: 'Person', time: '2026-02-05 08:30 AM', location: 'Front Gate', status: 'Reviewed' },
          { id: 2, type: 'Vehicle', time: '2026-02-05 09:15 AM', location: 'Driveway', status: 'New' },
          { id: 3, type: 'Person', time: '2026-02-04 11:00 PM', location: 'Backyard', status: 'Reviewed' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) return null;

  const renderContent = () => {
    switch (activeTab) {
      case 'Person':
        return (
          <Stack gap="lg">
            <Stack align="center" mb={20}>
              <Box style={{ position: 'relative' }}>
                <Avatar
                  size={120}
                  radius={100}
                  src={profileImage}
                  bg={getBg(colorScheme, '#D0EBFF', theme.colors.blue[9])}
                  color="blue"
                >
                  {!profileImage && <IconUser size={60} />}
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <ActionIcon
                  variant="filled"
                  color="#0038FF"
                  radius="xl"
                  size="lg"
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    border: `3px solid ${getBg(colorScheme, 'white', theme.colors.dark[7])}`,
                    cursor: 'pointer',
                  }}
                >
                  <IconCamera size={18} />
                </ActionIcon>
              </Box>
            </Stack>
            <TextInput
              label="Full Name"
              defaultValue={`${user.firstName} ${user.lastName}`}
              styles={inputStyles(colorScheme, theme)}
            />
            <TextInput
              label="Phone Number"
              placeholder="+ 251 XXXXXXX"
              styles={inputStyles(colorScheme, theme)}
            />
            <TextInput
              label="Email"
              defaultValue={user.email}
              styles={inputStyles(colorScheme, theme)}
            />
            <TextInput
              label="Address"
              placeholder="Adama, Ethiopia"
              styles={inputStyles(colorScheme, theme)}
            />
            <Textarea
              label="BIO"
              placeholder="Tell us about yourself"
              minRows={4}
              styles={inputStyles(colorScheme, theme)}
            />
            <Button fullWidth size="lg" radius="md" mt="xl" bg="#0038FF">
              Save Changes
            </Button>
          </Stack>
        );
      
      case 'Notification':
        return (
          <Stack gap="xl" maw={650} mx="auto">
            <Paper
              p="xl"
              radius="md"
              bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
            >
              <Text fw={700} mb="md">Alert Preference</Text>
              <Stack gap="md">
                <NotificationToggle
                  title="Vehicle Alert"
                  description="Get notified about vehicle detection"
                  defaultChecked
                  colorScheme={colorScheme}
                  theme={theme}
                />
                <NotificationToggle
                  title="Person Alert"
                  description="Get notified about Person detection"
                  defaultChecked
                  colorScheme={colorScheme}
                  theme={theme}
                />
              </Stack>
            </Paper>
            <Paper
              p="xl"
              radius="md"
              bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
            >
              <Text fw={700} mb="md">Delivery Methods</Text>
              <Stack gap="md">
                <NotificationToggle
                  title="Push Notification"
                  description="Instant alerts on your device"
                  defaultChecked
                  colorScheme={colorScheme}
                  theme={theme}
                />
                <NotificationToggle
                  title="Email Notification"
                  description="Recieve updates via email"
                  defaultChecked
                  colorScheme={colorScheme}
                  theme={theme}
                />
                <NotificationToggle
                  title="SMS Alert"
                  description="Get text message for urgent alert"
                  colorScheme={colorScheme}
                  theme={theme}
                />
              </Stack>
            </Paper>
          </Stack>
        );

      case 'Security':
        return (
          <Stack gap="xl" maw={650} mx="auto">
            <Paper
              p="xl"
              radius="md"
              bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
            >
              <Text fw={700} mb="md">Appearance</Text>
              <Stack gap="md">
                <Select
                  label="Language"
                  defaultValue="English"
                  data={['English', 'Amharic', 'Oromo']}
                  styles={inputStyles(colorScheme, theme)}
                />
                <Select
                  label="Theme"
                  value={colorScheme}
                  onChange={setColorScheme}
                  data={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'System' },
                  ]}
                  styles={inputStyles(colorScheme, theme)}
                />
              </Stack>
            </Paper>

            <Paper
              p="xl"
              radius="md"
              bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
            >
              <Text fw={700} mb="md">Security Preference</Text>
              <Stack gap="md">
                <Group justify="space-between">
                  <Box>
                    <Text fw={600} size="sm">Auto-Lock</Text>
                    <Text size="xs" c="dimmed">Lock account after inactivity</Text>
                  </Box>
                  <Switch size="md" color="blue" defaultChecked />
                </Group>
                <Select
                  label="Auto-lock timeout"
                  defaultValue="5 min"
                  data={['1 min', '5 min', '10 min']}
                  styles={inputStyles(colorScheme, theme)}
                />
              </Stack>
            </Paper>

            <Paper
              p="xl"
              radius="md"
              bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
            >
              <Text fw={700} mb="md">Data & Storage</Text>
              <Stack gap="sm">
                <UnstyledButton
                  p="md"
                  bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                  style={{
                    borderRadius: '8px',
                    border: `1px solid ${getBg(colorScheme, '#eee', theme.colors.dark[5])}`,
                  }}
                >
                  <Group justify="space-between">
                    <Text size="sm" fw={600}>Clear Cache</Text>
                    <IconChevronRight size={18} color={getBg(colorScheme, '#adb5bd', theme.colors.dark[3])} />
                  </Group>
                </UnstyledButton>
                <UnstyledButton
                  p="md"
                  bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                  style={{
                    borderRadius: '8px',
                    border: `1px solid ${getBg(colorScheme, '#eee', theme.colors.dark[5])}`,
                  }}
                >
                  <Group justify="space-between">
                    <Text size="sm" fw={600}>Export Data</Text>
                    <IconChevronRight size={18} color={getBg(colorScheme, '#adb5bd', theme.colors.dark[3])} />
                  </Group>
                </UnstyledButton>
              </Stack>
            </Paper>
          </Stack>
        );

      case 'Privacy and Policy':
        return (
          <Stack gap="xl" maw={650} mx="auto">
            <Paper
              p="xl"
              radius="md"
              bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
            >
              <Text fw={700} mb="md">Account Security</Text>
              <Stack gap="sm">
                <ActionCard
                  label="Change Password"
                  onClick={openPwd}
                  colorScheme={colorScheme}
                  theme={theme}
                />
                <ActionCard
                  label="Two-Factor Authentication"
                  description="Add extra security to your account"
                  hasSwitch
                  colorScheme={colorScheme}
                  theme={theme}
                />
              </Stack>
            </Paper>
            <Paper
              p="xl"
              radius="md"
              bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
            >
              <Text fw={700} mb="md">Danger Zone</Text>
              <Stack gap="sm">
                <ActionCard
                  label="Delete Account"
                  isDanger
                  onClick={openDelete}
                  colorScheme={colorScheme}
                  theme={theme}
                />
              </Stack>
            </Paper>
          </Stack>
        );

      case 'Alert History':
        return (
          <Stack gap="md">
            <Title order={4}>Recent Activity Logs</Title>
            <Paper
              withBorder
              radius="md"
              bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
              style={{ overflow: 'hidden' }}
            >
              <Table verticalSpacing="md" highlightOnHover>
                <Table.Thead
                  bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
                >
                  <Table.Tr>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Time</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {alerts.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <Text fw={500} size="sm">{item.type}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{item.location}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" c="dimmed">{item.time}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          variant="light"
                          color={item.status === 'New' ? 'blue' : 'gray'}
                        >
                          {item.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon variant="subtle" color="gray">
                          <IconExternalLink size={16} />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          </Stack>
        );

      case 'Settings':
        return (
          <Stack gap="xl" maw={650} mx="auto">
            <Paper
              p="xl"
              radius="md"
              bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
            >
              <Text fw={700} mb="md">App Preferences</Text>
              <Stack gap="md">
                <Select
                  label="Language"
                  defaultValue="English"
                  data={['English', 'Amharic', 'Oromo']}
                  styles={inputStyles(colorScheme, theme)}
                  leftSection={<IconWorld size={18} />}
                />
                <Group justify="space-between" mt="sm">
                  <Box>
                    <Text fw={600} size="sm">Dark Mode</Text>
                    <Text size="xs" c="dimmed">Switch between light and dark themes</Text>
                  </Box>
                  <Switch
                    size="md"
                    color="blue"
                    checked={colorScheme === 'dark'}
                    onChange={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
                  />
                </Group>
              </Stack>
            </Paper>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
      style={{ minHeight: '100vh' }}
    >
      <Modal
        opened={pwdOpened}
        onClose={closePwd}
        title="Change Password"
        centered
        radius="md"
        styles={{
          header: { backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]) },
          body: { backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]) },
          title: { color: getBg(colorScheme, 'black', theme.colors.gray[3]) },
        }}
      >
        <Stack gap="md">
          <PasswordInput
            label="Current Password"
            styles={inputStyles(colorScheme, theme)}
          />
          <PasswordInput
            label="New Password"
            styles={inputStyles(colorScheme, theme)}
          />
          <Button fullWidth bg="#0038FF" onClick={closePwd}>
            Update Password
          </Button>
        </Stack>
      </Modal>

      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Confirm Deletion"
        centered
        radius="md"
        styles={{
          header: { backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]) },
          body: { backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]) },
          title: { color: getBg(colorScheme, 'black', theme.colors.gray[3]) },
        }}
      >
        <Text size="sm">This action is permanent. Are you sure?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={handleLogout}>
            Delete Account
          </Button>
        </Group>
      </Modal>

      <Box
        p="md"
        style={{
          borderBottom: `1px solid ${getBg(colorScheme, '#eee', theme.colors.dark[5])}`,
        }}
      >
        <Container size="xl">
          <Group>
            <ActionIcon
              variant="subtle"
              color={getBg(colorScheme, 'black', theme.colors.gray[3])}
              onClick={() => router.back()}
            >
              <IconArrowLeft size={24} />
            </ActionIcon>
            <Title order={3} fw={700}>
              {activeTab === 'Person' ? 'My Profile' : activeTab}
            </Title>
          </Group>
        </Container>
      </Box>

      <Flex style={{ height: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <Box
          w={320}
          bg={getBg(colorScheme, '#A5C9F3', theme.colors.blue[9])}
          p="md"
          style={{
            borderRight: `1px solid ${getBg(colorScheme, '#dee2e6', theme.colors.dark[5])}`,
          }}
        >
          <Stack gap="sm">
            <SidebarItem
              icon={<IconUser size={20} />}
              label="Person"
              active={activeTab === 'Person'}
              onClick={() => setActiveTab('Person')}
              colorScheme={colorScheme}
              theme={theme}
            />
            <SidebarItem
              icon={<IconBell size={20} />}
              label="Notification"
              active={activeTab === 'Notification'}
              onClick={() => setActiveTab('Notification')}
              colorScheme={colorScheme}
              theme={theme}
            />
            <SidebarItem
              icon={<IconLock size={20} />}
              label="Security"
              active={activeTab === 'Security'}
              onClick={() => setActiveTab('Security')}
              colorScheme={colorScheme}
              theme={theme}
            />
            <SidebarItem
              icon={<IconShield size={20} />}
              label="Privacy and Policy"
              active={activeTab === 'Privacy and Policy'}
              onClick={() => setActiveTab('Privacy and Policy')}
              colorScheme={colorScheme}
              theme={theme}
            />
            <SidebarItem
              icon={<IconHistory size={20} />}
              label="Alert History"
              active={activeTab === 'Alert History'}
              onClick={() => setActiveTab('Alert History')}
              colorScheme={colorScheme}
              theme={theme}
            />
            <SidebarItem
              icon={<IconSettings size={20} />}
              label="Settings"
              active={activeTab === 'Settings'}
              onClick={() => setActiveTab('Settings')}
              colorScheme={colorScheme}
              theme={theme}
            />

            <Divider
              my="xl"
              style={{ borderColor: getBg(colorScheme, '#8db6e6', theme.colors.blue[8]) }}
            />
            <UnstyledButton
              p="md"
              bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
              style={{ borderRadius: '12px' }}
              onClick={handleLogout}
            >
              <Group>
                <IconLogout size={20} color="red" />
                <Text fw={600} c="red">
                  Log Out
                </Text>
              </Group>
            </UnstyledButton>
          </Stack>
        </Box>

        <Box style={{ flex: 1, overflowY: 'auto' }} p={50}>
          <Container size={activeTab === 'Alert History' ? 'lg' : 'sm'}>
            {renderContent()}
          </Container>
        </Box>
      </Flex>
    </Box>
  );
}

// Helper Components

function ActionCard({ label, description, hasSwitch = false, isDanger = false, onClick, colorScheme, theme }) {
  return (
    <Paper
      withBorder
      p="sm"
      radius="md"
      bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Box>
          <Text fw={600} size="sm" c={isDanger ? 'red' : getBg(colorScheme, 'black', theme.colors.gray[3])}>
            {label}
          </Text>
          {description && <Text size="xs" c="dimmed">{description}</Text>}
        </Box>
        {hasSwitch ? (
          <Switch size="md" color="blue" />
        ) : (
          <IconChevronRight size={18} color={getBg(colorScheme, '#adb5bd', theme.colors.dark[3])} />
        )}
      </Group>
    </Paper>
  );
}

function NotificationToggle({ title, description, defaultChecked = false, colorScheme, theme }) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <Box>
        <Text fw={600} size="sm">{title}</Text>
        <Text size="xs" c="dimmed">{description}</Text>
      </Box>
      <Switch defaultChecked={defaultChecked} size="md" color="blue" />
    </Group>
  );
}

function SidebarItem({ icon, label, active, onClick, colorScheme, theme }) {
  return (
    <UnstyledButton
      p="md"
      w="100%"
      bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
      onClick={onClick}
      style={{
        borderRadius: '12px',
        border: active ? '2px solid #0038FF' : 'none',
      }}
    >
      <Group justify="space-between">
        <Group gap="sm">
          {React.cloneElement(icon, { color: active ? '#0038FF' : getBg(colorScheme, '#495057', theme.colors.gray[5]) })}
          <Text
            fw={600}
            size="sm"
            c={active ? '#0038FF' : getBg(colorScheme, 'black', theme.colors.gray[3])}
          >
            {label}
          </Text>
        </Group>
        <IconChevronRight
          size={16}
          color={active ? '#0038FF' : getBg(colorScheme, '#ced4da', theme.colors.dark[3])}
        />
      </Group>
    </UnstyledButton>
  );
}

// Input styles function that depends on colorScheme
const inputStyles = (colorScheme, theme) => ({
  label: {
    marginBottom: 8,
    fontWeight: 700,
    fontSize: '14px',
    color: getBg(colorScheme, 'black', theme.colors.gray[3]),
  },
  input: {
    borderRadius: '8px',
    border: `1px solid ${getBg(colorScheme, '#ced4da', theme.colors.dark[5])}`,
    height: '45px',
    backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]),
    color: getBg(colorScheme, 'black', theme.colors.gray[3]),
  },
});