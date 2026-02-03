'use client';

import { Container, Text, SimpleGrid, Box, Anchor, Divider, Group, Stack } from '@mantine/core';
import { 
  IconBrandFacebook, 
  IconBrandTwitter, 
  IconBrandInstagram, 
  IconBrandLinkedin, 
  IconBrandYoutube 
} from '@tabler/icons-react';

export default function MainFooter() {
  return (
    <Box bg="white" pt={80} pb={40} style={{ borderTop: '1px solid #f0f0f0', position: 'relative', zIndex: 20 }}>
      <Container size="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }} spacing={40} mb={50}>
          {/* Brand & Socials */}
          <Stack gap="md">
            <Group gap="xs">
               <Box style={{ width: 30, height: 30, borderRadius: 8, background: '#6366F1' }} />
               <Text fw={800} size="xl" c="#1A1B1E">Flega</Text>
            </Group>
            <Text size="sm" c="dimmed">Lorem ipsum dolor sit amet consectetur adipiscing elit aliquam.</Text>
            
            {/* Linked Social Icons */}
            <Group gap="sm">
              <Anchor href="https://facebook.com" target="_blank" c="dimmed"><IconBrandFacebook size={20} /></Anchor>
              <Anchor href="https://twitter.com" target="_blank" c="dimmed"><IconBrandTwitter size={20} /></Anchor>
              <Anchor href="https://instagram.com" target="_blank" c="dimmed"><IconBrandInstagram size={20} /></Anchor>
              <Anchor href="https://linkedin.com" target="_blank" c="dimmed"><IconBrandLinkedin size={20} /></Anchor>
              <Anchor href="https://youtube.com" target="_blank" c="dimmed"><IconBrandYoutube size={20} /></Anchor>
            </Group>
          </Stack>

          {/* Product Links */}
          <Stack gap="sm">
            <Text fw={700} c="#1A1B1E">Product</Text>
            {['Features', 'Pricing', 'Case studies', 'Reviews', 'Updates'].map(link => (
              <Anchor key={link} href="#" size="sm" c="dimmed" underline="never">{link}</Anchor>
            ))}
          </Stack>

          {/* Company Links */}
          <Stack gap="sm">
            <Text fw={700} c="#1A1B1E">Company</Text>
            {['About', 'Contact us', 'Careers', 'Culture', 'Blog'].map(link => (
              <Anchor key={link} href="#" size="sm" c="dimmed" underline="never">{link}</Anchor>
            ))}
          </Stack>

          {/* Support Links */}
          <Stack gap="sm">
            <Text fw={700} c="#1A1B1E">Support</Text>
            {['Getting started', 'Help center', 'Server status', 'Report a bug', 'Chat support'].map(link => (
              <Anchor key={link} href="#" size="sm" c="dimmed" underline="never">{link}</Anchor>
            ))}
          </Stack>

          {/* Contact Info */}
          <Stack gap="sm">
            <Text fw={700} c="#1A1B1E">Contacts us</Text>
            <Anchor href="mailto:contact@company.com" size="sm" c="dimmed" underline="never">✉️ contact@company.com</Anchor>
            <Text size="sm" c="dimmed">📞 (414) 687 - 5892</Text>
            <Text size="sm" c="dimmed">📍 794 McAllister St San Francisco, 94102</Text>
          </Stack>
        </SimpleGrid>
        
        <Divider mb="xl" color="#eee" />
        
        <Group justify="space-between">
          <Text size="xs" c="dimmed">Copyright © 2026 BRIX Templates</Text>
          <Group gap="xs">
            <Text size="xs" c="dimmed">All Rights Reserved |</Text>
            <Anchor href="#" size="xs" c="blue">Terms and Conditions</Anchor>
            <Text size="xs" c="dimmed">|</Text>
            <Anchor href="#" size="xs" c="blue">Privacy Policy</Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}