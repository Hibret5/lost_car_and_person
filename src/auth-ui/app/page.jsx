'use client';

import { 
  Box, Container, Title, Text, Button, Group, TextInput, 
  Avatar, Paper, SimpleGrid, ScrollArea, Card, Grid, ActionIcon, Menu, UnstyledButton, Stack
} from '@mantine/core';
import { 
  IconSearch, IconChevronRight, IconArrowRight, IconBell, 
  IconUser, IconHistory, IconSettings, IconLogout, IconShieldCheck, IconStarFilled,
  IconChevronLeft
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import MainFooter from '../components/MainFooter';

export default function Dashboard() {
  const items = [1, 2, 3, 4, 5, 6];

  return (
    <Box bg="white" style={{ minHeight: '100vh' }}>
      
      {/* --- HEADER --- */}
      <Box bg="white" py="sm" style={{ borderBottom: '1px solid #E9ECEF', position: 'sticky', top: 0, zIndex: 100 }}>
        <Container size="xl">
          <Group justify="space-between">
            {/* Logo adjusted for original aspect ratio */}
            <Link href="/">
              <Image 
                src="/logo.jpg" 
                alt="Logo" 
                width={0} 
                height={50} 
                sizes="100vw"
                style={{ width: 'auto', height: '50px', borderRadius: '8px', cursor: 'pointer' }} 
              />
            </Link>
            <TextInput 
              placeholder="Search..." 
              leftSection={<IconSearch size={16} />}
              style={{ width: '40%' }}
              radius="xl"
            />
            <Group gap="lg">
              <ActionIcon variant="transparent" color="gray" size="lg">
                <IconBell size={28} />
              </ActionIcon>
              <Menu shadow="md" width={320} radius="md" transitionProps={{ transition: 'pop-top-right' }}>
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap="sm">
                      <Box ta="right" visibleFrom="xs">
                        <Text fw={800} size="md">Feleke</Text>
                        <Text size="xs" c="dimmed">Personal account</Text>
                      </Box>
                      <Avatar src={null} alt="User" color="blue" size="md" radius="xl" />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown p="md">
                    <Group justify="space-between" mb="xs">
                        <Text size="sm" fw={700}>Personal account</Text>
                        <ActionIcon variant="subtle" size="sm" color="gray"><IconLogout size={14}/></ActionIcon>
                    </Group>
                    <Stack gap={4}>
                        <Menu.Item leftSection={<IconUser size={20} />}>Person</Menu.Item>
                        <Menu.Item leftSection={<IconBell size={20} />}>Notification</Menu.Item>
                        <Menu.Item leftSection={<IconShieldCheck size={20} />}>Privacy and Policy</Menu.Item>
                        <Menu.Item leftSection={<IconBell size={20} />}>Alerts</Menu.Item>
                        <Menu.Item leftSection={<IconHistory size={20} />}>History</Menu.Item>
                        <Menu.Item leftSection={<IconSettings size={20} />}>Settings</Menu.Item>
                    </Stack>
                    <Menu.Divider />
                    <Menu.Item color="red" leftSection={<IconLogout size={20} />} component={Link} href="/login">Logout</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* --- HERO SECTION --- */}
      <Box bg="#2f80ed">
        <Container size="xl" p={0}>
          <Grid gutter={0} align="stretch">
            <Grid.Col span={{ base: 12, md: 7 }} p={60}>
              <Title order={1} size={52} fw={900} mb={5} c="black">If you lost it we will find it</Title>
              <Text size="xl" mb="xl" fw={600} c="white" maw={500}>
                Returning items is easier than ever with Flega’s™ Black Lion's™ cloud based platform, accessible from any device.
              </Text>
              <Group mb="xl">
                <Button 
                  component={Link}
                  href="/register-person" // Changed from /signup to /register-person
                  size="xl" 
                  bg="black" 
                  color="white" 
                  radius="xl" 
                  rightSection={<IconArrowRight size={22} />}
                >
                  Get Started
                </Button>
                <Button 
                  size="xl" 
                  variant="outline" 
                  color="white" 
                  radius="xl"
                  rightSection={<IconArrowRight size={22} />}
                >
                  How it works
                </Button>
              </Group>
              <Text size="sm" fw={500} c="white">Ethiopian based platform that is made for local and global use.</Text>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
               <Box style={{ height: '100%', minHeight: 450, position: 'relative' }}>
                  <Image src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1000" alt="City" fill style={{ objectFit: 'cover' }} />
               </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* --- SCROLL SECTIONS --- */}
      <Container size="xl" py={60}>
        <Group justify="space-between" mb="lg">
          <Title order={2} size="h3">Have you seen this car?</Title>
          <ActionIcon variant="light" radius="xl" color="blue"><IconChevronRight /></ActionIcon>
        </Group>
        <ScrollArea w="100%" pb="xl">
          <Group wrap="nowrap" gap="lg">
            {items.map((i) => (
              <Card key={i} radius="md" w={220} p={0} withBorder bg="gray.1">
                <Image src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500" height={140} width={220} alt="Car" />
                <Box p="xs" ta="center"><Text size="xs" c="dimmed">{i}</Text></Box>
              </Card>
            ))}
          </Group>
        </ScrollArea>

        <Group justify="space-between" mb="lg" mt={40}>
          <Title order={2} size="h3">Have you seen this person?</Title>
          <ActionIcon variant="light" radius="xl" color="blue"><IconChevronRight /></ActionIcon>
        </Group>
        <ScrollArea w="100%" pb="xl">
          <Group wrap="nowrap" gap="lg">
            {items.map((i) => (
              <Card key={i} radius="md" w={200} p={0} withBorder bg="gray.1">
                <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500" height={200} width={200} alt="Person" />
                <Box p="xs" ta="center"><Text size="xs" c="dimmed">{i}</Text></Box>
              </Card>
            ))}
          </Group>
        </ScrollArea>

        {/* --- OUR COMPANY --- */}
        <Box py={60} ta="center">
          <Title order={2} mb={50}>Our Company</Title>
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper shadow="md" p={0} radius="lg" withBorder>
                <Box py="md" style={{ borderBottom: '1px solid #eee' }}><Title order={3}>AIM</Title></Box>
                <Box h={200} bg="blue.0" />
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper shadow="md" p={0} radius="lg" withBorder>
                <Box py="md" style={{ borderBottom: '1px solid #eee' }}><Title order={3}>Vision</Title></Box>
                <Box h={200} bg="blue.0" />
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
              <Paper shadow="md" p={0} radius="lg" withBorder maw={600} mx="auto">
                <Box py="md" style={{ borderBottom: '1px solid #eee' }}><Title order={3}>Strategy</Title></Box>
                <Box h={200} bg="blue.0" />
              </Paper>
            </Grid.Col>
          </Grid>
        </Box>

        {/* --- SIGNUP SECTION --- */}
        <Box mt={60}>
            <Paper bg="blue.0" p={40} radius="lg" style={{ position: 'relative' }}>
                <Title order={2} mb="xl">Signup For Free</Title>
                <Group justify="flex-end">
                    <Button 
                      component={Link} 
                      href="/signup" 
                      bg="blue.6" 
                      size="lg" 
                      radius="md" 
                      rightSection={<IconArrowRight size={18}/>}
                    >
                        SIGN UP
                    </Button>
                </Group>
            </Paper>

            <Paper bg="blue.0" p={30} radius="lg" mt="lg" maw={400}>
                <Title order={3} size={28} fw={700}>If you lost it we will find it</Title>
            </Paper>
        </Box>

        {/* --- REAL STORIES --- */}
        <Box py={80} ta="center">
          <Title order={2} fw={800} mb={5}>Real Stories, Real Results</Title>
          <Text size="xs" c="dimmed" mb={40} maw={500} mx="auto">
            Hear from families and individuals who have successfully recovered there loved ones and vehicle through our advanced detection system
          </Text>
          
          <Group justify="center" gap="xl" mb={60}>
            <Paper p="xl" radius="md" withBorder shadow="sm" w={280} ta="left">
               <Group gap={2} mb="xs">
                 {[1,2,3,4,5].map(s => <IconStarFilled key={s} size={14} color="#FAB005" />)}
               </Group>
               <Text size="sm" mb="md">"I found my car within 24 hours of posting here. The AI detection is incredible!"</Text>
               <Group gap="sm">
                  <Avatar size="sm" color="blue" radius="xl" />
                  <Text size="xs" fw={700}>Sara Johnson</Text>
               </Group>
            </Paper>
            <Paper p="xl" radius="md" withBorder shadow="sm" w={280} ta="left" opacity={0.6}>
               <Group gap={2} mb="xs">
                 {[1,2,3,4,5].map(s => <IconStarFilled key={s} size={14} color="#FAB005" />)}
               </Group>
               <Text size="sm" mb="md">"The alert system is so fast. Thank you for helping me find my brother."</Text>
               <Group gap="sm">
                  <Avatar size="sm" color="gray" radius="xl" />
                  <Text size="xs" fw={700}>Kebede M.</Text>
               </Group>
            </Paper>
          </Group>

          {/* STATS WITH NAV ARROWS */}
          <Group justify="center" gap={80} align="center">
            <ActionIcon variant="filled" color="gray" radius="xl" size="xl"><IconChevronLeft /></ActionIcon>
            <Stack align="center" gap={0}>
              <Title order={1} c="blue.6" size={42}>2,467</Title>
              <Text size="xs" fw={700}>People Found</Text>
            </Stack>
            <Stack align="center" gap={0}>
              <Title order={1} c="blue.6" size={42}>1,534</Title>
              <Text size="xs" fw={700}>Vehicles Recovered</Text>
            </Stack>
            <Stack align="center" gap={0}>
              <Title order={1} c="blue.6" size={42}>98.3%</Title>
              <Text size="xs" fw={700}>Success Rate</Text>
            </Stack>
            <ActionIcon variant="filled" color="black" radius="xl" size="xl"><IconChevronRight /></ActionIcon>
          </Group>
        </Box>
      </Container>

      <MainFooter />
    </Box>
  );
}