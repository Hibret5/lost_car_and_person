'use client';

import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Grid,
  Text,
} from '@mantine/core';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();

  return (
    <Container size={420} my={40}>
      <Paper radius="lg" p="xl" bg="#dbeafe">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={80}
          height={80}
          style={{ display: 'block', margin: '0 auto 16px' }}
        />

        <Title order={2} ta="center" mb="lg">
          Sign up
        </Title>

        <Grid>
          <Grid.Col span={6}>
            <TextInput label="First name" required />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput label="Last name" required />
          </Grid.Col>
        </Grid>

        <TextInput label="Email" mt="md" required />
        <TextInput label="Phone number" mt="md" required />
        <PasswordInput label="Password" mt="md" required />
        <PasswordInput label="Confirm password" mt="md" required />

        <Button fullWidth mt="xl" color="blue">
          Create account
        </Button>

        <Text ta="center" mt="md" size="sm">
          Already have an account?{' '}
          <Text
            span
            c="blue"
            style={{ cursor: 'pointer' }}
            onClick={() => router.push('/login')}
          >
            Login
          </Text>
        </Text>
      </Paper>
    </Container>
  );
}
