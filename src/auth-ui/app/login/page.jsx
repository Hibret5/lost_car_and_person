'use client';

import {
  Container,
  Paper,
  TextInput,
  Button,
  Title,
  Text,
  Divider,
  Box,
  rem,
} from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import SocialLoginIcons from '../../components/SocialLoginIcons';

/* ---------------- Validation schemas ---------------- */
const emailSchema = z.object({
  loginValue: z.string().email('Please enter a valid email').min(1),
});

const phoneSchema = z.object({
  loginValue: z
    .string()
    .min(10)
    .max(15)
    .regex(/^[\d\s\+\-]+$/, 'Invalid phone number'),
});

export default function LoginPage() {
  const [type, setType] = useState('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery('(max-width: 576px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const currentSchema = type === 'email' ? emailSchema : phoneSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onChange',
    defaultValues: { loginValue: '' },
  });

  const watchedValue = watch('loginValue');

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

  const handleTypeSwitch = () => {
    setType(type === 'email' ? 'phone' : 'email');
    setValue('loginValue', '');
    reset();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    notify(
      'Success',
      type === 'email'
        ? `Login link sent to ${data.loginValue}`
        : `Code sent to ${data.loginValue}`,
      'green',
      <IconCheck />
    );

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
      <Container size={isMobile ? 'sm' : isTablet ? 500 : 500}>
        <Paper radius="lg" p={isMobile ? 'md' : 'xl'} shadow="md" bg="#dbeafe">
          <Box ta="center" mb="sm">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={isMobile ? 80 : 100}
              height={isMobile ? 60 : 75}
              style={{ objectFit: 'contain', borderRadius: 8 }}
              priority
            />
          </Box>

          <Title ta="center" fw={700}>
            WELCOME !!
          </Title>

          <Title ta="center" order={4} mb="md">
            Login
          </Title>

          <Text ta="center" mb="sm">
            {type === 'email'
              ? 'Please insert your email'
              : 'Please insert your phone number'}
          </Text>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
              label={type === 'email' ? 'Email' : 'Phone number'}
              placeholder={
                type === 'email'
                  ? 'example@email.com'
                  : '+251 9xx xxx xxx'
              }
              {...register('loginValue')}
              error={errors.loginValue?.message}
              onBlur={() => trigger('loginValue')}
            />

            <Button
              fullWidth
              mt="md"
              type="submit"
              loading={isSubmitting}
              disabled={!watchedValue || !!errors.loginValue}
            >
              Continue
            </Button>
          </form>

          <Text ta="center" mt="sm" c="blue" onClick={handleTypeSwitch} style={{ cursor: 'pointer' }}>
            {type === 'email'
              ? 'Login using phone number'
              : 'Login using email'}
          </Text>

          <Text ta="center" mt="xs">
            Don’t have an account? <Link href="/signup">Signup</Link>
          </Text>

          <Divider my="md" label="or sign in using" labelPosition="center" />

          <SocialLoginIcons isMobile={isMobile} />
        </Paper>
      </Container>
    </Box>
  );
}
