"use client";

import { 
  Box, Container, Title, Text, Button, Group, TextInput, 
  Avatar, Paper, SimpleGrid, ScrollArea, Card, Grid, ActionIcon, Menu, UnstyledButton, Stack,
  Badge, useMantineTheme, Flex
} from '@mantine/core';
import { 
  IconSearch, IconChevronRight, IconArrowRight, IconBell, 
  IconUser, IconHistory, IconSettings, IconLogout, IconShieldCheck, IconStarFilled,
  IconChevronLeft, IconMail, IconPhone, IconCalendar, IconMapPin,
  IconLogin, IconUserPlus, IconQuote, IconCar, IconUser as IconUserPerson,
  IconCheck, IconHeart, IconGlobe, IconTarget, IconChartBar
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MainFooter from '../components/MainFooter';
import { useMediaQuery } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const items = [1, 2, 3, 4, 5, 6];
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('currentUser');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    checkAuth();

    const handleStorageChange = (e) => {
      if (e.key === 'currentUser') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const getUserInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <Box 
        style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <Text size="lg">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" style={{ minHeight: "100vh" }}>
      {/* --- HEADER --- */}
      <Box
        bg="white"
        py={{ base: 'xs', md: 'sm' }}
        style={{
          borderBottom: "1px solid #E9ECEF",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="xl">
          <Group justify="space-between" wrap="nowrap">
            {/* Logo */}
            <Link href="/" style={{ flexShrink: 0 }}>
              <Image 
                src="/logo.jpg" 
                alt="Logo" 
                width={120}
                height={40}
                style={{ width: 'auto', height: '40px', borderRadius: '8px', cursor: 'pointer' }} 
              />
            </Link>
            
            <TextInput 
              placeholder="Search lost items, cars, or people..." 
              leftSection={<IconSearch size={16} />}
              style={{ 
                flex: 1,
                maxWidth: isMobile ? '200px' : '400px',
                minWidth: isMobile ? '150px' : '300px'
              }}
              radius="xl"
              size={isMobile ? 'sm' : 'md'}
            />
            
            <Group gap={isMobile ? 'xs' : 'md'} wrap="nowrap">
              <ActionIcon
                variant="transparent"
                color="gray"
                size={isMobile ? 'md' : 'lg'}
                component={Link}
                href={user ? "/alert" : "/login"}
              >
                <IconBell size={isMobile ? 20 : 24} />
              </ActionIcon>
              
              {user ? (
                <Menu
                  shadow="md"
                  width={320}
                  radius="md"
                  transitionProps={{ transition: "pop-top-right" }}
                >
                  <Menu.Target>
                    <UnstyledButton>
                      <Group gap="sm" wrap="nowrap">
                        {!isMobile && (
                          <Box ta="right">
                            <Text fw={800} size="sm" truncate>
                              {user.firstName} {user.lastName}
                            </Text>
                            <Text size="xs" c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <IconMail size={10} />
                              {user.email}
                            </Text>
                          </Box>
                        )}
                        <Avatar
                          src={null}
                          alt={`${user.firstName} ${user.lastName}`}
                          color="blue"
                          size={isMobile ? 'sm' : 'md'}
                          radius="xl"
                        >
                          {getUserInitials(user.firstName, user.lastName)}
                        </Avatar>
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown p="md">
                    <Box mb="md" pb="md" style={{ borderBottom: '1px solid #e9ecef' }}>
                      <Group mb="xs">
                        <Avatar
                          src={null}
                          alt={`${user.firstName} ${user.lastName}`}
                          color="blue"
                          size="lg"
                          radius="xl"
                        >
                          {getUserInitials(user.firstName, user.lastName)}
                        </Avatar>
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <Text size="md" fw={700} truncate>
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text size="sm" c="dimmed" truncate>
                            {user.email}
                          </Text>
                          <Badge 
                            size="xs" 
                            color={user.role === 'admin' ? 'red' : 'blue'} 
                            variant="light"
                            mt={4}
                          >
                            {user.role}
                          </Badge>
                        </Box>
                      </Group>
                      <Button 
                        fullWidth 
                        variant="light" 
                        component={Link} 
                        href="/profile"
                        leftSection={<IconUser size={16} />}
                        size="sm"
                      >
                        View Profile
                      </Button>
                    </Box>

                    <Stack gap={4}>
                      <Menu.Item 
                        leftSection={<IconUser size={18} />}
                        component={Link}
                        href="/profile"
                      >
                        My Profile
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconBell size={18} />}
                        onClick={() => router.push("/alert")}
                      >
                        My Notifications
                      </Menu.Item>
                      <Menu.Item 
                        leftSection={<IconHistory size={18} />}
                        component={Link}
                        href="/history"
                      >
                        Search History
                      </Menu.Item>
                      <Menu.Item 
                        leftSection={<IconSettings size={18} />}
                        component={Link}
                        href="/settings"
                      >
                        Account Settings
                      </Menu.Item>
                    </Stack>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={18} />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Group gap={isMobile ? 'xs' : 'sm'} wrap="nowrap">
                  <Button
                    variant="outline"
                    color="blue"
                    leftSection={<IconLogin size={16} />}
                    component={Link}
                    href="/login"
                    radius="xl"
                    size={isMobile ? 'xs' : 'sm'}
                  >
                    {isMobile ? 'Login' : 'Sign In'}
                  </Button>
                  <Button
                    color="blue"
                    leftSection={<IconUserPlus size={16} />}
                    component={Link}
                    href="/signup"
                    radius="xl"
                    size={isMobile ? 'xs' : 'sm'}
                  >
                    {isMobile ? 'Join' : 'Sign Up'}
                  </Button>
                </Group>
              )}
            </Group>
          </Group>
        </Container>
      </Box>

      {/* --- HERO SECTION --- */}
      <Box bg="#2f80ed" style={{ overflow: 'hidden' }}>
        <Container size="xl" p={0}>
          <Grid gutter={0} align="stretch">
            <Grid.Col span={{ base: 12, md: 7 }} p={{ base: 40, md: 60 }}>
              <Stack gap="md" style={{ height: '100%', justifyContent: 'center' }}>
                {user ? (
                  <>
                    <Title order={1} size={{ base: 32, md: 48, lg: 52 }} fw={900} mb={5} c="white">
                      Welcome back, {user.firstName}!
                    </Title>
                    <Title order={2} size={{ base: 24, md: 36, lg: 42 }} fw={800} mb={5} c="black">
                      If you lost it we will find it
                    </Title>
                  </>
                ) : (
                  <>
                    <Title order={1} size={{ base: 32, md: 48, lg: 52 }} fw={900} mb={5} c="black">
                      If you lost it we will find it
                    </Title>
                    <Title order={2} size={{ base: 24, md: 36, lg: 42 }} fw={800} mb={5} c="white">
                      Join thousands who found their lost items
                    </Title>
                  </>
                )}
                <Text size={{ base: 'md', md: 'lg', lg: 'xl' }} mb="xl" fw={600} c="white" maw={600}>
                  Returning items is easier than ever with Flega's™ Black Lion's™
                  cloud based platform, accessible from any device.
                </Text>
                <Group mb="xl" wrap={isMobile ? 'wrap' : 'nowrap'}>
                  {user ? (
                    <Button
                      component={Link}
                      href="/register-person"
                      size={isMobile ? 'md' : 'xl'}
                      bg="black" 
                      color="white" 
                      radius="xl" 
                      rightSection={<IconArrowRight size={20} />}
                      fullWidth={isMobile}
                    >
                      Report Missing Item
                    </Button>
                  ) : (
                    <Button
                      component={Link}
                      href="/signup"
                      size={isMobile ? 'md' : 'xl'}
                      bg="black" 
                      color="white" 
                      radius="xl" 
                      rightSection={<IconArrowRight size={20} />}
                      fullWidth={isMobile}
                    >
                      Get Started Free
                    </Button>
                  )}
                  <Button
                    size={isMobile ? 'md' : 'xl'}
                    variant="outline"
                    color="white"
                    radius="xl"
                    rightSection={<IconArrowRight size={20} />}
                    component={Link}
                    href="/how-it-works"
                    fullWidth={isMobile}
                  >
                    How it works
                  </Button>
                </Group>
                {user && (
                  <Group gap="md" wrap="wrap">
                    <Text size="sm" fw={500} c="white" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconCalendar size={14} />
                      Member since: {new Date(user.createdAt).toLocaleDateString()}
                    </Text>
                    <Badge color="green" variant="light">
                      {user.isActive ? 'Active Account' : 'Inactive'}
                    </Badge>
                  </Group>
                )}
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Box
                style={{ 
                  height: "100%", 
                  minHeight: isMobile ? 300 : 450,
                  position: "relative" 
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1000"
                  alt="City"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* --- USER STATS DASHBOARD --- */}
      {user && (
        <Container size="xl" py={{ base: 30, md: 40 }}>
          <Paper p={{ base: 'lg', md: 'xl' }} radius="lg" bg="blue.0" mb="xl">
            <Title order={3} mb="md">Your Dashboard Stats</Title>
            <SimpleGrid cols={{ base: 2, sm: 2, md: 4 }} spacing="lg">
              <Paper p="md" bg="white" radius="md" withBorder h="100%">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Reports Filed</Text>
                  <Title order={2}>12</Title>
                </Stack>
              </Paper>
              <Paper p="md" bg="white" radius="md" withBorder h="100%">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Items Found</Text>
                  <Title order={2}>8</Title>
                </Stack>
              </Paper>
              <Paper p="md" bg="white" radius="md" withBorder h="100%">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Active Searches</Text>
                  <Title order={2}>4</Title>
                </Stack>
              </Paper>
              <Paper p="md" bg="white" radius="md" withBorder h="100%">
                <Stack gap="xs">
                  <Text size="sm" c="dimmed">Community Help</Text>
                  <Title order={2}>27</Title>
                </Stack>
              </Paper>
            </SimpleGrid>
          </Paper>
        </Container>
      )}

      {/* --- MAIN CONTENT --- */}
      <Container size="xl" py={{ base: 30, md: 40 }}>
        {/* Cars Section */}
        <Paper mb={{ base: 40, md: 60 }} p={{ base: 'md', md: 'lg' }} withBorder radius="lg">
          <Group justify="space-between" mb="lg">
            <Flex align="center" gap="sm">
              <IconCar size={24} color="var(--mantine-color-blue-6)" />
              <Title order={2} size="h3">
                Have you seen this car?
              </Title>
            </Flex>
            <ActionIcon variant="light" radius="xl" color="blue" component={Link} href="/cars">
              <IconChevronRight />
            </ActionIcon>
          </Group>
          <ScrollArea w="100%" pb="xl">
            <Group wrap="nowrap" gap="lg">
              {items.map((i) => (
                <Card 
                  key={i} 
                  radius="md" 
                  w={{ base: 180, sm: 220 }} 
                  p={0} 
                  withBorder 
                  style={{ flexShrink: 0 }}
                >
                  <Box style={{ position: 'relative', height: 140, width: '100%' }}>
                    <Image
                      src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500"
                      fill
                      alt="Car"
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 180px, 220px"
                    />
                  </Box>
                  <Box p="xs" ta="center">
                    <Text size="xs" c="dimmed">
                      Car #{i}
                    </Text>
                  </Box>
                </Card>
              ))}
            </Group>
          </ScrollArea>
        </Paper>

        {/* People Section */}
        <Paper mb={{ base: 40, md: 60 }} p={{ base: 'md', md: 'lg' }} withBorder radius="lg">
          <Group justify="space-between" mb="lg">
            <Flex align="center" gap="sm">
              <IconUserPerson size={24} color="var(--mantine-color-blue-6)" />
              <Title order={2} size="h3">
                Have you seen this person?
              </Title>
            </Flex>
            <ActionIcon variant="light" radius="xl" color="blue" component={Link} href="/people">
              <IconChevronRight />
            </ActionIcon>
          </Group>
          <ScrollArea w="100%" pb="xl">
            <Group wrap="nowrap" gap="lg">
              {items.map((i) => (
                <Card 
                  key={i} 
                  radius="md" 
                  w={{ base: 160, sm: 200 }} 
                  p={0} 
                  withBorder 
                  style={{ flexShrink: 0 }}
                >
                  <Box style={{ position: 'relative', height: 200, width: '100%' }}>
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500"
                      fill
                      alt="Person"
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 160px, 200px"
                    />
                  </Box>
                  <Box p="xs" ta="center">
                    <Text size="xs" c="dimmed">
                      Person #{i}
                    </Text>
                  </Box>
                </Card>
              ))}
            </Group>
          </ScrollArea>
        </Paper>

        {/* Call to Action for Non-logged Users */}
        {!user && (
          <Paper
            bg="blue.0"
            p={{ base: 'lg', md: 40 }}
            radius="lg"
            mb={{ base: 40, md: 60 }}
          >
            <Title order={2} mb="md">
              Join our community today
            </Title>
            <Text mb="xl" c="dark" size={{ base: 'sm', md: 'md' }}>
              Sign up now to report lost items, help others, and access advanced search features.
            </Text>
            <Grid gutter="lg">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="xs">
                  <Flex align="center" gap="xs">
                    <IconCheck size={16} color="green" />
                    <Text size="sm">Report lost cars and people</Text>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <IconCheck size={16} color="green" />
                    <Text size="sm">Get real-time notifications</Text>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <IconCheck size={16} color="green" />
                    <Text size="sm">Help others in your community</Text>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <IconCheck size={16} color="green" />
                    <Text size="sm">Access advanced search tools</Text>
                  </Flex>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Flex 
                  gap="md" 
                  justify={{ base: 'flex-start', md: 'flex-end' }}
                  wrap={{ base: 'wrap', md: 'nowrap' }}
                >
                  <Button
                    variant="outline"
                    color="blue"
                    leftSection={<IconLogin size={18} />}
                    component={Link}
                    href="/login"
                    size={isMobile ? 'sm' : 'md'}
                    fullWidth={isMobile}
                  >
                    Login
                  </Button>
                  <Button
                    bg="blue.6"
                    size={isMobile ? 'sm' : 'md'}
                    radius="md"
                    rightSection={<IconArrowRight size={18} />}
                    component={Link}
                    href="/signup"
                    fullWidth={isMobile}
                  >
                    SIGN UP FREE
                  </Button>
                </Flex>
              </Grid.Col>
            </Grid>
          </Paper>
        )}

        {/* Our Company Section */}
        <Box py={{ base: 40, md: 60 }}>
          <Title order={2} mb={{ base: 30, md: 50 }} ta="center">
            Our Company
          </Title>
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper shadow="md" p={0} radius="lg" withBorder h="100%">
                <Box py="md" px="lg" style={{ borderBottom: "1px solid #eee" }}>
                  <Flex align="center" gap="sm">
                    <IconTarget size={24} color="var(--mantine-color-blue-6)" />
                    <Title order={3}>AIM</Title>
                  </Flex>
                </Box>
                <Box p="xl" bg="blue.0" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text ta="center" c="dimmed">Our mission to reunite people with their lost items</Text>
                </Box>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper shadow="md" p={0} radius="lg" withBorder h="100%">
                <Box py="md" px="lg" style={{ borderBottom: "1px solid #eee" }}>
                  <Flex align="center" gap="sm">
                    <IconChartBar size={24} color="var(--mantine-color-blue-6)" />
                    <Title order={3}>Vision</Title>
                  </Flex>
                </Box>
                <Box p="xl" bg="blue.0" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text ta="center" c="dimmed">Creating a world where nothing is ever truly lost</Text>
                </Box>
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
              <Paper
                shadow="md"
                p={0}
                radius="lg"
                withBorder
                maw={800}
                mx="auto"
              >
                <Box py="md" px="lg" style={{ borderBottom: "1px solid #eee" }}>
                  <Flex align="center" gap="sm">
                    <IconGlobe size={24} color="var(--mantine-color-blue-6)" />
                    <Title order={3}>Strategy</Title>
                  </Flex>
                </Box>
                <Box p="xl" bg="blue.0" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text ta="center" c="dimmed">Leveraging technology and community for faster recoveries</Text>
                </Box>
              </Paper>
            </Grid.Col>
          </Grid>
        </Box>

        {/* Action Section */}
        <Box mt={{ base: 40, md: 60 }}>
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Paper
                bg="blue.0"
                p={{ base: 'lg', md: 40 }}
                radius="lg"
                h="100%"
              >
                <Title order={2} mb="xl">
                  {user ? 'Ready to help someone today?' : 'Want to help others?'}
                </Title>
                <Flex justify={{ base: 'flex-start', md: 'flex-end' }}>
                  <Button
                    component={Link}
                    href={user ? "/help" : "/signup"}
                    bg="blue.6"
                    size={isMobile ? 'md' : 'lg'}
                    radius="md"
                    rightSection={<IconArrowRight size={18} />}
                    fullWidth={isMobile}
                  >
                    {user ? 'HELP OTHERS' : 'JOIN TO HELP'}
                  </Button>
                </Flex>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper 
                bg="blue.0" 
                p={30} 
                radius="lg" 
                h="100%"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <Title order={3} size={{ base: 24, md: 28 }} fw={700} ta="center" w="100%">
                  If you lost it we will find it
                </Title>
              </Paper>
            </Grid.Col>
          </Grid>
        </Box>

        {/* Enhanced Real Stories Section */}
        <Box py={{ base: 40, md: 60, lg: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Title order={2} fw={800} mb={5} ta="center">
              Real Stories, Real Results
            </Title>
            <Text size="sm" c="dimmed" mb={40} maw={600} mx="auto" ta="center">
              Hear from families and individuals who have successfully recovered
              their loved ones and vehicles through our advanced detection system
            </Text>
          </motion.div>

          {/* Enhanced Reviews Carousel */}
          <Box px={{ base: 0, md: 20 }} mb={60}>
            <Carousel
              slideSize={{ base: '100%', sm: '50%', md: '33.333%' }}
              slideGap={{ base: 'sm', md: 'lg' }}
              align="start"
              loop
              withIndicators
              dragFree
              speed={300}
              styles={{
                indicator: {
                  width: 12,
                  height: 4,
                  transition: 'width 250ms ease',
                  '&[data-active]': {
                    width: 40,
                  },
                },
                controls: {
                  opacity: 0.7,
                }
              }}
            >
              {[
                {
                  id: 1,
                  name: "Sara Johnson",
                  role: "Found Car in 24 Hours",
                  avatarColor: "blue",
                  quote: "I found my car within 24 hours of posting here. The AI detection is incredible!",
                  rating: 5,
                  date: "2 weeks ago"
                },
                {
                  id: 2,
                  name: "Kebede M.",
                  role: "Found Missing Brother",
                  avatarColor: "green",
                  quote: "The alert system is so fast. Thank you for helping me find my brother.",
                  rating: 5,
                  date: "1 month ago"
                },
                {
                  id: 3,
                  name: "Michael Chen",
                  role: "Recovered Family Heirloom",
                  avatarColor: "orange",
                  quote: "I thought I lost my grandmother's necklace forever. Community found it in 48 hours.",
                  rating: 5,
                  date: "3 weeks ago"
                },
                {
                  id: 4,
                  name: "Amina Hassan",
                  role: "Found Stolen Phone",
                  avatarColor: "pink",
                  quote: "My phone was stolen. Using location tracking, police recovered it same day.",
                  rating: 5,
                  date: "1 week ago"
                },
                {
                  id: 5,
                  name: "David Wilson",
                  role: "Business Documents",
                  avatarColor: "grape",
                  quote: "Left important contracts in a taxi. Driver found me through this platform.",
                  rating: 5,
                  date: "2 months ago"
                },
                {
                  id: 6,
                  name: "Maria Rodriguez",
                  role: "Pet Found After Storm",
                  avatarColor: "teal",
                  quote: "Our dog ran away. Neighbors spotted him through the app.",
                  rating: 5,
                  date: "3 days ago"
                }
              ].map((review) => (
                <Carousel.Slide key={review.id}>
                  <Paper 
                    p={{ base: 'lg', md: 'xl' }}
                    radius="lg" 
                    withBorder 
                    shadow="sm" 
                    h="100%"
                    style={{ 
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      }
                    }}
                  >
                    <Box mb="md">
                      <Group gap={2} mb="xs">
                        {[...Array(review.rating)].map((_, i) => (
                          <IconStarFilled key={i} size={16} color="#FAB005" />
                        ))}
                      </Group>
                      <IconQuote size={24} color="var(--mantine-color-blue-3)" style={{ opacity: 0.3, margin: '10px 0' }} />
                      <Text size="sm" mb="md" style={{ lineHeight: 1.6, fontStyle: 'italic' }}>
                        "{review.quote}"
                      </Text>
                    </Box>
                    <Group gap="sm" align="center">
                      <Avatar 
                        size="md" 
                        color={review.avatarColor} 
                        radius="xl"
                        variant="filled"
                      >
                        {review.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box style={{ flex: 1 }}>
                        <Text size="sm" fw={700}>{review.name}</Text>
                        <Text size="xs" c="dimmed">{review.role}</Text>
                        <Text size="xs" c="dimmed">{review.date}</Text>
                      </Box>
                    </Group>
                  </Paper>
                </Carousel.Slide>
              ))}
            </Carousel>
          </Box>

          {/* Stats Section */}
          <Grid gutter="lg" align="center" justify="center">
            <Grid.Col span={{ base: 6, sm: 3 }}>
              <Stack align="center" gap={5}>
                <Title order={1} c="blue.6" size={42}>
                  2,467
                </Title>
                <Text size="sm" fw={700} ta="center">
                  People Found
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 3 }}>
              <Stack align="center" gap={5}>
                <Title order={1} c="blue.6" size={42}>
                  1,534
                </Title>
                <Text size="sm" fw={700} ta="center">
                  Vehicles Recovered
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 3 }}>
              <Stack align="center" gap={5}>
                <Title order={1} c="blue.6" size={42}>
                  98.3%
                </Title>
                <Text size="sm" fw={700} ta="center">
                  Success Rate
                </Text>
              </Stack>
            </Grid.Col>
            <Grid.Col span={{ base: 6, sm: 3 }}>
              <Stack align="center" gap={5}>
                <Title order={1} c="blue.6" size={42}>
                  42
                </Title>
                <Text size="sm" fw={700} ta="center">
                  Countries
                </Text>
              </Stack>
            </Grid.Col>
          </Grid>

          {/* Gallery Section */}
          <Box mt={40}>
            <Title order={3} size="h4" mb="lg" c="dimmed" ta="center">
              Success Stories Gallery
            </Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {[
                { 
                  img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=500", 
                  title: "Family Reunion",
                  description: "Emotional reunions with loved ones"
                },
                { 
                  img: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?q=80&w=500", 
                  title: "Car Recovery",
                  description: "Vehicles returned to owners"
                },
                { 
                  img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=500", 
                  title: "Happy Moments",
                  description: "Joyful recovery stories"
                },
              ].map((item, idx) => (
                <Paper
                  key={idx}
                  radius="md"
                  style={{ 
                    overflow: 'hidden',
                    position: 'relative',
                    aspectRatio: '16/9'
                  }}
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <Box
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      padding: '12px',
                    }}
                  >
                    <Text size="sm" c="white" fw={600}>
                      {item.title}
                    </Text>
                    <Text size="xs" c="white">
                      {item.description}
                    </Text>
                  </Box>
                </Paper>
              ))}
            </SimpleGrid>
          </Box>
        </Box>

        {/* Final Call to Action */}
        {!user && (
          <Box py={{ base: 40, md: 60 }}>
            <Paper
              shadow="lg"
              p={{ base: 'lg', md: 50 }}
              radius="lg"
              bg="linear-gradient(135deg, #2f80ed 0%, #1e56a0 100%)"
              ta="center"
            >
              <Title order={2} c="white" mb="md">
                Ready to get started?
              </Title>
              <Text size={{ base: 'md', md: 'lg' }} c="white" mb="xl" maw={600} mx="auto">
                Join thousands of users who have successfully found their lost items
                and helped others in the community.
              </Text>
              <Flex 
                gap="md" 
                justify="center"
                direction={{ base: 'column', sm: 'row' }}
                align="center"
              >
                <Button
                  size={isMobile ? 'md' : 'xl'}
                  variant="white"
                  color="blue"
                  radius="xl"
                  leftSection={<IconLogin size={20} />}
                  component={Link}
                  href="/login"
                  fullWidth={isMobile}
                >
                  Login
                </Button>
                <Button
                  size={isMobile ? 'md' : 'xl'}
                  bg="black"
                  color="white"
                  radius="xl"
                  rightSection={<IconArrowRight size={20} />}
                  component={Link}
                  href="/signup"
                  fullWidth={isMobile}
                >
                  Create Free Account
                </Button>
              </Flex>
            </Paper>
          </Box>
        )}
      </Container>

      <MainFooter />
    </Box>
  );
}