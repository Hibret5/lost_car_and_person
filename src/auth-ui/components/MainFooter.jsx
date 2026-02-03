'use client';

import { Container, Text, SimpleGrid, Box, Anchor, Divider, Group, Stack } from '@mantine/core';
import { 
  IconBrandFacebook, IconBrandTwitter, IconBrandInstagram, 
  IconBrandLinkedin, IconBrandYoutube 
} from '@tabler/icons-react';
import Link from 'next/link';

export default function MainFooter() {
  return (
    <Box bg="white" pt={80} pb={40} style={{ borderTop: '1px solid #f0f0f0', position: 'relative', zIndex: 20 }}>
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing={40} mb={50}>
          <Stack gap="md">
            <Group gap="xs" component={Link} href="/" style={{ textDecoration: 'none' }}>
               <Box style={{ width: 30, height: 30, borderRadius: 8, background: '#2f80ed' }} />
               <Text fw={800} size="xl" c="#1A1B1E">Flega</Text>
            </Group>
            <Text size="sm" c="dimmed">Ethiopian based platform that is made for local and global use.</Text>
            <Group gap="sm">
              <Anchor href="#" c="dimmed"><IconBrandFacebook size={20} /></Anchor>
              <Anchor href="#" c="dimmed"><IconBrandTwitter size={20} /></Anchor>
              <Anchor href="#" c="dimmed"><IconBrandInstagram size={20} /></Anchor>
            </Group>
          </Stack>

          <Stack gap="sm">
            <Text fw={700} c="#1A1B1E">Product</Text>
            {['Features', 'Pricing', 'Updates'].map(link => (
              <Anchor key={link} href="#" size="sm" c="dimmed" underline="never">{link}</Anchor>
            ))}
          </Stack>

          <Stack gap="sm">
            <Text fw={700} c="#1A1B1E">Company</Text>
            {/* FIXED LINKS */}
            <Anchor component={Link} href="/about" size="sm" c="dimmed" underline="never">About</Anchor>
            <Anchor component={Link} href="/about" size="sm" c="dimmed" underline="never">Contact us</Anchor>
            <Anchor href="#" size="sm" c="dimmed" underline="never">Blog</Anchor>
          </Stack>

          <Stack gap="sm">
            <Text fw={700} c="#1A1B1E">Support</Text>
            {['Help center', 'Report a bug', 'Chat support'].map(link => (
              <Anchor key={link} href="#" size="sm" c="dimmed" underline="never">{link}</Anchor>
            ))}
          </Stack>

          <Stack gap="sm">
            <Text fw={700} c="#1A1B1E">Contact us</Text>
            <Anchor href="mailto:contact@flega.com" size="sm" c="dimmed" underline="never">✉️ contact@flega.com</Anchor>
            <Text size="sm" c="dimmed">📍 Adama, Ethiopia</Text>
          </Stack>
        </SimpleGrid>
        <Divider mb="xl" color="#eee" />
        <Group justify="space-between">
          <Text size="xs" c="dimmed">Copyright © 2026 Flega™</Text>
        </Group>
      </Container>
    </Box>
  );
}