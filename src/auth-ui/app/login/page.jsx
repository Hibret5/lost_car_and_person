'use client';

import {
  Container,
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  Divider,
} from '@mantine/core';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import SocialLoginIcons from '../../components/SocialLoginIcons';

export default function LoginPage() {
  const [type, setType] = useState('email');
  const [value, setValue] = useState('');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#EAF2FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container size={420}>
        <Paper radius="lg" p="xl" shadow="md" bg="#dbeafe">
          {/* ✅ Logo adjusted for original aspect ratio */}
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={0}
            height={70}
            sizes="100vw"
            style={{ 
              display: 'block', 
              margin: '0 auto 12px', 
              width: 'auto', 
              height: '70px',
              borderRadius: '8px' 
            }}
          />

          <Title order={3} ta="center" fw={700}>
            WELCOME !!
          </Title>

          <Title order={4} ta="center" mb="md">
            Login
          </Title>

          <Text size="sm" fw={500} mb={6}>
            {type === 'email'
              ? 'Please insert your email'
              : 'Please insert your phone number'}
          </Text>

          <TextInput
            label={type === 'email' ? 'Email' : 'Phone number'}
            placeholder={
              type === 'email'
                ? 'example@email.com'
                : '+251 9xx xxx xxx'
            }
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />

          <Button 
            fullWidth 
            mt="md" 
            component={Link} 
            href="/about"
          >
            Continue
          </Button>

          <Text
            ta="center"
            size="xs"
            mt="sm"
            c="dimmed"
            style={{ cursor: 'pointer' }}
            onClick={() =>
              setType(type === 'email' ? 'phone' : 'email')
            }
          >
            {type === 'email'
              ? 'login using phone number'
              : 'login using email'}
          </Text>

          <Text ta="center" size="sm" mt={6}>
            Don’t have an account?{' '}
            <Link href="/signup" style={{ color: '#2563EB', fontWeight: 600 }}>
              Signup
            </Link>
          </Text>

          <Divider my="md" label="or sign in using" />

          <SocialLoginIcons />

          <Text size="xs" ta="center" mt="md" c="dimmed">
            By continuing, you agree to Flega’s{' '}
            <Text span c="blue">Terms of Service</Text> and{' '}
            <Text span c="blue">Privacy Policy</Text>.
          </Text>
        </Paper>
      </Container>
    </div>
  );
}