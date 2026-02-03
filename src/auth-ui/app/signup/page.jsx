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
  Box,
  Group,
  Alert,
  rem,
} from '@mantine/core';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

/* ---------------- Zod schema ---------------- */
const signupSchema = z.object({
  firstName: z.string().min(2).max(50).regex(/^[A-Za-z\s]+$/),
  lastName: z.string().min(2).max(50).regex(/^[A-Za-z\s]+$/),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/\d/)
    .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  path: ['confirmPassword'],
  message: "Passwords don't match",
});

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery('(max-width: 576px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const notify = (title, message, color, icon) =>
    notifications.show({
      title,
      message,
      color,
      icon,
      position: 'top-right',
      autoClose: 3000,
      withBorder: true,
    });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    notify('Success', 'Account created successfully!', 'green', <IconCheck />);
    console.log(data);
    reset();
    setIsSubmitting(false);
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: '#EAF2FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: rem(16),
      }}
    >
      <Container size={isMobile ? 'sm' : 500}>
        <Paper radius="lg" p={isMobile ? 'md' : 'xl'} shadow="md" bg="#dbeafe">
          <Box ta="center" mb="md">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={100}
              height={75}
              style={{ objectFit: 'contain', borderRadius: 8 }}
            />
          </Box>

          <Title ta="center" mb="md">
            Create Account
          </Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid>
              <Grid.Col span={6}>
                <TextInput label="First name" {...register('firstName')} error={errors.firstName?.message} />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Last name" {...register('lastName')} error={errors.lastName?.message} />
              </Grid.Col>
            </Grid>

            <TextInput mt="md" label="Email" {...register('email')} error={errors.email?.message} />
            <TextInput mt="md" label="Phone" {...register('phone')} error={errors.phone?.message} />
            <PasswordInput mt="md" label="Password" {...register('password')} error={errors.password?.message} />
            <PasswordInput mt="md" label="Confirm Password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />

            <Alert mt="md" icon={<IconAlertCircle />} color="blue">
              Password must be at least 8 characters with upper, lower, number & symbol.
            </Alert>

            <Button
              fullWidth
              mt="xl"
              type="submit"
              loading={isSubmitting}
              disabled={!isDirty || !isValid}
            >
              Create Account
            </Button>
          </form>

          <Text ta="center" mt="md">
            Already have an account? <Link href="/login">Sign in</Link>
          </Text>
        </Paper>
      </Container>
    </Box>
  );
}
