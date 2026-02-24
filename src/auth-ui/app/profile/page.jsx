"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Container, Title, Text, Button, TextInput, 
  Textarea, Avatar, Paper, Stack, Divider, 
  ActionIcon, Flex, UnstyledButton, Group, Switch, Modal, PasswordInput, Select, Table, Badge,
  useMantineColorScheme, useMantineTheme, Skeleton, Transition, Tooltip, Affix,
  PinInput, Collapse
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { 
  IconUser, IconBell, IconShield, IconHistory, 
  IconSettings, IconLogout, IconCamera, IconChevronRight, IconArrowLeft,
  IconWorld, IconLock, IconCheck, IconX, IconDeviceFloppy
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Helper to get dynamic background colors
const getBg = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);

// Background gradient helper
const getBackgroundGradient = (colorScheme) => {
  if (colorScheme === 'dark') {
    return 'radial-gradient(circle at 10% 20%, rgba(30, 35, 45, 0.95) 0%, #1A1B1E 90%)';
  }
  return 'radial-gradient(circle at 10% 20%, rgba(240, 248, 255, 0.9) 0%, #f0f5fa 100%)';
};

// Subtle noise texture SVG
const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E")`;

// Zod schema for change password
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[a-z]/, 'Must contain lowercase')
    .regex(/\d/, 'Must contain number')
    .regex(/[!@#$%^&*]/, 'Must contain special character'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Simple hash function for demo (using Web Crypto)
const simpleHash = async (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const theme = useMantineTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  
  const [activeTab, setActiveTab] = useState('Person');
  const [user, setUser] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '' });
  const [originalUser, setOriginalUser] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [dirty, setDirty] = useState(false);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorPinHash, setTwoFactorPinHash] = useState(null);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [setupMode, setSetupMode] = useState('setup'); // 'setup' or 'disable'
  const [pinValue, setPinValue] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');
  const [pinError, setPinError] = useState('');

  const [pwdOpened, { open: openPwd, close: closePwd }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  // Form for change password
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' }
  });

  // Load 2FA state from localStorage
  useEffect(() => {
    const load2FA = async () => {
      const enabled = localStorage.getItem('twoFactorEnabled') === 'true';
      const pinHash = localStorage.getItem('twoFactorPinHash');
      setTwoFactorEnabled(enabled);
      setTwoFactorPinHash(pinHash);
    };
    load2FA();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn'); 
    router.push('/');
    router.refresh();
  };

  // Handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setDirty(true);
    }
  };

  // Fetch user data and alerts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem('currentUser');
        if (!userData) {
          router.push('/');
          return;
        }

        const parsedUser = JSON.parse(userData);
        if (!parsedUser.id) throw new Error('User ID not found');
        setUserId(parsedUser.id);

        const userResponse = await fetch(`http://localhost:3001/users/${parsedUser.id}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user');
        const userFromServer = await userResponse.json();
        const userObj = {
          firstName: userFromServer.firstName || '',
          lastName: userFromServer.lastName || '',
          email: userFromServer.email || '',
          phone: userFromServer.phone || '',
          address: userFromServer.address || '',
        };
        setUser(userObj);
        setOriginalUser(userObj);

        const alertsResponse = await fetch('http://localhost:3001/alerts');
        if (!alertsResponse.ok) throw new Error('Failed to fetch alerts');
        const alertsData = await alertsResponse.json();
        setAlerts(alertsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        const fallbackUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userObj = {
          firstName: fallbackUser.firstName || '',
          lastName: fallbackUser.lastName || '',
          email: fallbackUser.email || '',
          phone: fallbackUser.phone || '',
          address: fallbackUser.address || '',
        };
        setUser(userObj);
        setOriginalUser(userObj);
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

  // Track dirty state
  useEffect(() => {
    setDirty(JSON.stringify(user) !== JSON.stringify(originalUser) || !!profileImage);
  }, [user, originalUser, profileImage]);

  const handleSaveChanges = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address,
        }),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      const updatedUser = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setOriginalUser(user);
      setDirty(false);
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
        icon: <IconCheck size={18} />,
        position: 'top-right',
        style: { borderRadius: '8px' },
        withBorder: true,
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update profile',
        color: 'red',
        icon: <IconX size={18} />,
        position: 'top-right',
        style: { borderRadius: '8px' },
        withBorder: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = async (data) => {
    // Simulate password change
    notifications.show({
      title: 'Password Updated',
      message: 'Your password has been changed successfully',
      color: 'green',
      icon: <IconCheck size={18} />,
    });
    closePwd();
    passwordForm.reset();
  };

  // 2FA handlers
  const handleTwoFactorToggle = (checked) => {
    if (checked && !twoFactorEnabled) {
      // Turning on
      setSetupMode('setup');
      setShow2FASetup(true);
    } else if (!checked && twoFactorEnabled) {
      // Turning off
      setSetupMode('disable');
      setShow2FASetup(true);
    }
  };

  const handleEnable2FA = async () => {
    if (pinValue.length !== 6 || !/^\d+$/.test(pinValue)) {
      setPinError('PIN must be 6 digits');
      return;
    }
    if (pinValue !== confirmPinValue) {
      setPinError('PINs do not match');
      return;
    }
    const hash = await simpleHash(pinValue);
    localStorage.setItem('twoFactorEnabled', 'true');
    localStorage.setItem('twoFactorPinHash', hash);
    setTwoFactorEnabled(true);
    setTwoFactorPinHash(hash);
    setShow2FASetup(false);
    setPinValue('');
    setConfirmPinValue('');
    setPinError('');
    notifications.show({
      title: '2FA Enabled',
      message: 'Two-factor authentication has been enabled.',
      color: 'green',
    });
  };

  const handleDisable2FA = () => {
    localStorage.removeItem('twoFactorEnabled');
    localStorage.removeItem('twoFactorPinHash');
    setTwoFactorEnabled(false);
    setTwoFactorPinHash(null);
    setShow2FASetup(false);
    notifications.show({
      title: '2FA Disabled',
      message: 'Two-factor authentication has been disabled.',
      color: 'blue',
    });
  };

  const cancel2FASetup = () => {
    setShow2FASetup(false);
    setPinValue('');
    setConfirmPinValue('');
    setPinError('');
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `${getBackgroundGradient(colorScheme)}, ${noiseTexture}`,
          backgroundBlendMode: 'overlay',
        }}
      >
        <Container size="xl" py="xl">
          <Stack gap="lg">
            <Skeleton height={120} circle mb="lg" style={{ alignSelf: 'center' }} animate />
            <Skeleton height={45} radius="md" animate />
            <Skeleton height={45} radius="md" animate />
            <Skeleton height={45} radius="md" animate />
            <Skeleton height={45} radius="md" animate />
            <Skeleton height={80} radius="md" animate />
            <Skeleton height={45} radius="md" animate />
          </Stack>
        </Container>
      </Box>
    );
  }

  // Helper to get validation icon for Person fields (basic validation)
  const getValidationIcon = (field, value) => {
    if (!value) return null;
    const valid = field === 'phone' 
      ? /^[0-9+\-\s()]{10,}$/.test(value)
      : value.length >= 2;
    return valid 
      ? <IconCheck size={18} color={theme.colors.green[5]} />
      : <IconX size={18} color={theme.colors.red[5]} />;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Person':
        return (
          <Transition mounted={!loading} transition="slide-up" duration={400} timingFunction="ease">
            {(styles) => (
              <Stack gap="lg" style={styles}>
                <Stack align="center" mb={20}>
                  <Box style={{ position: 'relative' }}>
                    <Avatar
                      size={120}
                      radius={100}
                      src={profileImage}
                      bg={getBg(colorScheme, '#D0EBFF', theme.colors.blue[9])}
                      color="blue"
                      style={{
                        border: `3px solid ${getBg(colorScheme, '#fff', theme.colors.dark[5])}`,
                        boxShadow: theme.shadows.md,
                      }}
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
                    <Tooltip label="Change profile picture" position="bottom" withArrow>
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
                          transition: 'transform 0.2s ease',
                        }}
                        sx={{
                          '&:hover': { transform: 'scale(1.1)' },
                          '&:active': { transform: 'scale(0.95)' },
                        }}
                      >
                        <IconCamera size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Box>
                </Stack>
                <TextInput
                  label="First Name"
                  value={user.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  styles={inputStyles(colorScheme, theme)}
                  rightSection={getValidationIcon('firstName', user.firstName)}
                  withAsterisk
                />
                <TextInput
                  label="Last Name"
                  value={user.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  styles={inputStyles(colorScheme, theme)}
                  rightSection={getValidationIcon('lastName', user.lastName)}
                  withAsterisk
                />
                <TextInput
                  label="Phone Number"
                  value={user.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+ 251 XXXXXXX"
                  styles={inputStyles(colorScheme, theme)}
                  rightSection={getValidationIcon('phone', user.phone)}
                />
                <TextInput
                  label="Email"
                  value={user.email}
                  disabled
                  styles={inputStyles(colorScheme, theme)}
                />
                <TextInput
                  label="Address"
                  value={user.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Adama, Ethiopia"
                  styles={inputStyles(colorScheme, theme)}
                />
                <Button
                  fullWidth
                  size="lg"
                  radius="md"
                  mt="xl"
                  bg="#0038FF"
                  onClick={handleSaveChanges}
                  loading={saving}
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.shadows.md },
                    '&:active': { transform: 'translateY(0)' },
                  }}
                >
                  Save Changes
                </Button>
              </Stack>
            )}
          </Transition>
        );
      
      case 'Notification':
        return (
          <Transition mounted={!loading} transition="slide-up" duration={400}>
            {(styles) => (
              <Stack gap="xl" maw={650} mx="auto" style={styles}>
                <Paper
                  p="xl"
                  radius="md"
                  bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: theme.shadows.md },
                  }}
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
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: theme.shadows.md },
                  }}
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
            )}
          </Transition>
        );

      case 'Security':
        return (
          <Transition mounted={!loading} transition="slide-up" duration={400}>
            {(styles) => (
              <Stack gap="xl" maw={650} mx="auto" style={styles}>
                <Paper
                  p="xl"
                  radius="md"
                  bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: theme.shadows.md },
                  }}
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
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: theme.shadows.md },
                  }}
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
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: theme.shadows.md },
                  }}
                >
                  <Text fw={700} mb="md">Data & Storage</Text>
                  <Stack gap="sm">
                    <ActionCard
                      label="Clear Cache"
                      colorScheme={colorScheme}
                      theme={theme}
                    />
                    <ActionCard
                      label="Export Data"
                      colorScheme={colorScheme}
                      theme={theme}
                    />
                  </Stack>
                </Paper>
              </Stack>
            )}
          </Transition>
        );

      case 'Privacy and Policy':
        return (
          <Transition mounted={!loading} transition="slide-up" duration={400}>
            {(styles) => (
              <Stack gap="xl" maw={650} mx="auto" style={styles}>
                <Paper
                  p="xl"
                  radius="md"
                  bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: theme.shadows.md },
                  }}
                >
                  <Text fw={700} mb="md">Account Security</Text>
                  <Stack gap="sm">
                    <ActionCard
                      label="Change Password"
                      onClick={openPwd}
                      colorScheme={colorScheme}
                      theme={theme}
                    />
                    
                    {/* Two-Factor Authentication Card with Slide-Down */}
                    <Paper
                      withBorder
                      p="sm"
                      radius="md"
                      bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                      sx={{ overflow: 'hidden' }}
                    >
                      <Stack gap="xs">
                        <Group justify="space-between" wrap="nowrap">
                          <Box>
                            <Text fw={600} size="sm" c={getBg(colorScheme, 'black', theme.colors.gray[3])}>
                              Two-Factor Authentication
                            </Text>
                            <Text size="xs" c="dimmed">Add extra security to your account</Text>
                          </Box>
                          <Switch 
                            size="md" 
                            color="blue" 
                            checked={twoFactorEnabled} 
                            onChange={(e) => handleTwoFactorToggle(e.currentTarget.checked)}
                          />
                        </Group>

                        <Collapse in={show2FASetup}>
                          <Box pt="md" pb="xs">
                            {setupMode === 'setup' ? (
                              <Stack gap="md">
                                <Text size="sm">Set up a 6-digit PIN for two-factor authentication.</Text>
                                <PinInput
                                  length={6}
                                  type="number"
                                  value={pinValue}
                                  onChange={setPinValue}
                                  placeholder=""
                                  inputMode="numeric"
                                  styles={{
                                    input: {
                                      backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]),
                                      color: getBg(colorScheme, 'black', theme.colors.gray[3]),
                                      borderColor: getBg(colorScheme, '#ced4da', theme.colors.dark[5]),
                                    },
                                  }}
                                />
                                <Text size="sm">Confirm PIN</Text>
                                <PinInput
                                  length={6}
                                  type="number"
                                  value={confirmPinValue}
                                  onChange={setConfirmPinValue}
                                  placeholder=""
                                  inputMode="numeric"
                                  styles={{
                                    input: {
                                      backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]),
                                      color: getBg(colorScheme, 'black', theme.colors.gray[3]),
                                      borderColor: getBg(colorScheme, '#ced4da', theme.colors.dark[5]),
                                    },
                                  }}
                                />
                                {pinError && <Text c="red" size="sm">{pinError}</Text>}
                                <Group grow>
                                  <Button variant="default" onClick={cancel2FASetup}>Cancel</Button>
                                  <Button
                                    bg="#0038FF"
                                    onClick={handleEnable2FA}
                                    disabled={pinValue.length !== 6 || confirmPinValue.length !== 6}
                                  >
                                    Enable
                                  </Button>
                                </Group>
                              </Stack>
                            ) : (
                              <Stack gap="md">
                                <Text size="sm">Are you sure you want to disable two-factor authentication?</Text>
                                <Group grow>
                                  <Button variant="default" onClick={cancel2FASetup}>Cancel</Button>
                                  <Button color="red" onClick={handleDisable2FA}>Disable</Button>
                                </Group>
                              </Stack>
                            )}
                          </Box>
                        </Collapse>
                      </Stack>
                    </Paper>
                  </Stack>
                </Paper>

                <Paper
                  p="xl"
                  radius="md"
                  bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: theme.shadows.md },
                  }}
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
            )}
          </Transition>
        );

      case 'Alert History':
        return (
          <Transition mounted={!loading} transition="slide-up" duration={400}>
            {(styles) => (
              <Stack gap="md" style={styles}>
                <Title order={4}>Recent Activity Logs</Title>
                <Paper
                  withBorder
                  radius="md"
                  bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                  sx={{
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: theme.shadows.md },
                  }}
                >
                  <Table striped highlightOnHover verticalSpacing="md">
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
                        <Table.Tr key={item.id} style={{ transition: 'background-color 0.2s' }}>
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
                            {item.status === 'New' ? (
                              <Badge
                                variant="light"
                                color="blue"
                                sx={{
                                  animation: 'pulse 1.5s infinite',
                                  '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.6 },
                                    '100%': { opacity: 1 },
                                  },
                                }}
                              >
                                {item.status}
                              </Badge>
                            ) : (
                              <Badge variant="light" color="gray">{item.status}</Badge>
                            )}
                          </Table.Td>
                          <Table.Td>
                            <Tooltip label="View details" withArrow>
                              <ActionIcon variant="subtle" color="gray" sx={{ '&:hover': { color: theme.colors.blue[5] } }}>
                                <IconChevronRight size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Paper>
              </Stack>
            )}
          </Transition>
        );

      case 'Settings':
        return (
          <Transition mounted={!loading} transition="slide-up" duration={400}>
            {(styles) => (
              <Stack gap="xl" maw={650} mx="auto" style={styles}>
                <Paper
                  p="xl"
                  radius="md"
                  bg={getBg(colorScheme, '#F8F9FA', theme.colors.dark[6])}
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': { transform: 'scale(1.02)', boxShadow: theme.shadows.md },
                  }}
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
            )}
          </Transition>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `${getBackgroundGradient(colorScheme)}, ${noiseTexture}`,
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Change Password Modal */}
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
        transitionProps={{ transition: 'scale', duration: 300 }}
      >
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              {...passwordForm.register('currentPassword')}
              error={passwordForm.formState.errors.currentPassword?.message}
              styles={inputStyles(colorScheme, theme)}
            />
            <PasswordInput
              label="New Password"
              {...passwordForm.register('newPassword')}
              error={passwordForm.formState.errors.newPassword?.message}
              styles={inputStyles(colorScheme, theme)}
            />
            <PasswordInput
              label="Confirm Password"
              {...passwordForm.register('confirmPassword')}
              error={passwordForm.formState.errors.confirmPassword?.message}
              styles={inputStyles(colorScheme, theme)}
            />
            <Button 
              fullWidth 
              bg="#0038FF" 
              type="submit"
              disabled={!passwordForm.formState.isValid}
              sx={{
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' },
                '&:active': { transform: 'scale(0.98)' },
              }}
            >
              Update Password
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* Delete Account Modal */}
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
        transitionProps={{ transition: 'scale', duration: 300 }}
      >
        <Text size="sm">This action is permanent. Are you sure?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={closeDelete} sx={{ transition: 'background-color 0.2s' }}>
            Cancel
          </Button>
          <Button 
            color="red" 
            onClick={handleLogout} 
            sx={{
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' },
              '&:active': { transform: 'scale(0.98)' },
            }}
          >
            Delete Account
          </Button>
        </Group>
      </Modal>

      {/* Sticky Header */}
      <Box
        p="md"
        style={{
          borderBottom: `1px solid ${getBg(colorScheme, '#eee', theme.colors.dark[5])}`,
          backdropFilter: 'blur(8px)',
          backgroundColor: getBg(colorScheme, 'rgba(255,255,255,0.8)', 'rgba(0,0,0,0.8)'),
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="xl">
          <Group>
            <Tooltip label="Go back" withArrow>
              <ActionIcon
                variant="subtle"
                color={getBg(colorScheme, 'black', theme.colors.gray[3])}
                onClick={() => router.back()}
                sx={{ transition: 'background-color 0.2s' }}
              >
                <IconArrowLeft size={24} />
              </ActionIcon>
            </Tooltip>
            <Title order={3} fw={700}>
              {activeTab === 'Person' ? 'My Profile' : activeTab}
            </Title>
          </Group>
        </Container>
      </Box>

      {/* Main Layout */}
      <Flex direction={{ base: 'column', md: 'row' }} style={{ minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar - Now Sticky on Desktop */}
        <Box
          w={{ base: '100%', md: 320 }}
          bg={getBg(colorScheme, '#A5C9F3', theme.colors.blue[9])}
          p="md"
          sx={{
            position: { base: 'relative', md: 'sticky' },
            top: { md: 0 },
            alignSelf: { md: 'flex-start' },
            maxHeight: { md: 'calc(100vh - 70px)' },
            overflowY: { md: 'auto' },
            borderRight: { md: `1px solid ${getBg(colorScheme, '#dee2e6', theme.colors.dark[5])}` },
            borderBottom: { base: `1px solid ${getBg(colorScheme, '#dee2e6', theme.colors.dark[5])}`, md: 'none' },
            zIndex: { md: 10 },
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
            <Tooltip label="Logout" withArrow position="right">
              <UnstyledButton
                p="md"
                bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                sx={{
                  borderRadius: '12px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows.md,
                  },
                  '&:active': { transform: 'translateY(0)' },
                }}
                onClick={handleLogout}
              >
                <Group>
                  <IconLogout size={20} color="red" />
                  <Text fw={600} c="red">
                    Log Out
                  </Text>
                </Group>
              </UnstyledButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Content Area - Scrollable */}
        <Box style={{ flex: 1, overflowY: 'auto' }} p={{ base: 'md', md: 50 }}>
          <Container size={activeTab === 'Alert History' ? 'lg' : 'sm'}>
            {renderContent()}
          </Container>
        </Box>
      </Flex>

      {/* Floating Save Button */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition mounted={dirty} transition="slide-up" duration={400}>
          {(styles) => (
            <Tooltip label="Save changes" withArrow position="left">
              <Button
                style={styles}
                leftSection={<IconDeviceFloppy size={18} />}
                bg="#0038FF"
                radius="xl"
                size="lg"
                onClick={handleSaveChanges}
                loading={saving}
                sx={{
                  boxShadow: theme.shadows.xl,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)' },
                  '&:active': { transform: 'scale(0.95)' },
                }}
              >
                Save Changes
              </Button>
            </Tooltip>
          )}
        </Transition>
      </Affix>
    </Box>
  );
}

// Helper Components

function ActionCard({ label, description, hasSwitch = false, switchChecked, onSwitchChange, isDanger = false, onClick, colorScheme, theme }) {
  return (
    <Paper
      withBorder
      p="sm"
      radius="md"
      bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
      onClick={!hasSwitch ? onClick : undefined}
      sx={{
        cursor: hasSwitch ? 'default' : 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        '&:hover': hasSwitch ? {} : {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows.md,
          borderColor: isDanger ? theme.colors.red[5] : theme.colors.blue[5],
        },
        '&:active': hasSwitch ? {} : { transform: 'translateY(0)' },
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Box>
          <Text fw={600} size="sm" c={isDanger ? 'red' : getBg(colorScheme, 'black', theme.colors.gray[3])}>
            {label}
          </Text>
          {description && <Text size="xs" c="dimmed">{description}</Text>}
        </Box>
        {hasSwitch ? (
          <Switch 
            size="md" 
            color="blue" 
            checked={switchChecked} 
            onChange={(e) => onSwitchChange?.(e.currentTarget.checked)}
          />
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
  const bgColor = active 
    ? `linear-gradient(135deg, ${theme.colors.blue[7]} 0%, ${theme.colors.blue[5]} 100%)`
    : getBg(colorScheme, 'white', theme.colors.dark[7]);

  return (
    <Tooltip label={label} position="right" withArrow disabled={active}>
      <UnstyledButton
        p="md"
        w="100%"
        bg={bgColor}
        onClick={onClick}
        sx={{
          borderRadius: '12px',
          border: active ? 'none' : `1px solid ${getBg(colorScheme, '#dee2e6', theme.colors.dark[5])}`,
          transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows.md,
            background: active 
              ? `linear-gradient(135deg, ${theme.colors.blue[6]} 0%, ${theme.colors.blue[4]} 100%)`
              : getBg(colorScheme, '#f8f9fa', theme.colors.dark[6]),
          },
          '&:active': { transform: 'translateY(0)' },
        }}
      >
        <Group justify="space-between">
          <Group gap="sm">
            {React.cloneElement(icon, { 
              color: active 
                ? 'white' 
                : getBg(colorScheme, '#495057', theme.colors.gray[5]) 
            })}
            <Text
              fw={600}
              size="sm"
              c={active ? 'white' : getBg(colorScheme, 'black', theme.colors.gray[3])}
            >
              {label}
            </Text>
          </Group>
          <IconChevronRight
            size={16}
            color={active ? 'white' : getBg(colorScheme, '#ced4da', theme.colors.dark[3])}
          />
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
}

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
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '&:focus': {
      borderColor: theme.colors.blue[5],
      boxShadow: `0 0 0 2px ${theme.colors.blue[5]}`,
    },
  },
});