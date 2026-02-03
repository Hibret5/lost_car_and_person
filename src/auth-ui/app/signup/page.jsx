'use client';

import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Grid,
} from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

export default function SignupPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!passwordRegex.test(password)) {
      setError(
        'Password must include 1 capital letter, 1 number, and 1 special character'
      );
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    console.log('Signup success ✅');
  };

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
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={70}
            height={70}
            style={{ display: 'block', margin: '0 auto 16px' }}
          />

          <Title order={3} ta="center" fw={700}>
            Signup
          </Title>

          <Grid mt="md">
            <Grid.Col span={6}>
              <TextInput label="First name" required />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Last name" required />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Email"
            placeholder="example@email.com"
            mt="md"
            required
          />

          <TextInput
            label="Phone number"
            placeholder="+251 9xx xxx xxx"
            mt="md"
            required
          />

          <PasswordInput
            label="Password"
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            error={error}
            required
          />

          <PasswordInput
            label="Confirm password"
            mt="md"
            value={confirm}
            onChange={(e) => setConfirm(e.currentTarget.value)}
            error={error}
            required
          />

          <Button fullWidth mt="xl" onClick={handleSubmit}>
            Submit
          </Button>

          <Text ta="center" size="sm" mt="md">
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#2563EB', fontWeight: 600 }}>
              Login
            </Link>
          </Text>
        </Paper>
      </Container>
    </div>
  );
}
