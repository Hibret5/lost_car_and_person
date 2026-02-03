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

// Zod validation schemas
const emailSchema = z.object({
  loginValue: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .min(1, { message: 'Email is required' }),
});

const phoneSchema = z.object({
  loginValue: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be less than 15 digits' })
    .regex(/^[\d\s\+\-]+$/, { 
      message: 'Please enter a valid phone number (digits, spaces, and + only)' 
    }),
});

export default function LoginPage() {
  const [type, setType] = useState('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery('(max-width: 576px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  // Dynamic schema based on login type
  const currentSchema = type === 'email' ? emailSchema : phoneSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    trigger,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onChange',
    defaultValues: {
      loginValue: '',
    },
  });

  const watchedValue = watch('loginValue');

  const showSuccessNotification = (message) => {
    notifications.show({
      title: 'Success!',
      message,
      color: 'green',
      icon: <IconCheck size="1rem" />,
      position: 'top-right',
      autoClose: 3000,
      withBorder: true,
      withCloseButton: true,
      style: { 
        position: 'fixed',
        top: rem(20),
        right: isMobile ? rem(10) : rem(20),
        zIndex: 9999,
        width: isMobile ? 'calc(100% - 20px)' : 'auto',
        maxWidth: rem(400),
      },
    });
  };

  const showErrorNotification = (message) => {
    notifications.show({
      title: 'Error',
      message,
      color: 'red',
      icon: <IconX size="1rem" />,
      position: 'top-right',
      autoClose: 4000,
      withBorder: true,
      withCloseButton: true,
      style: { 
        position: 'fixed',
        top: rem(20),
        right: isMobile ? rem(10) : rem(20),
        zIndex: 9999,
        width: isMobile ? 'calc(100% - 20px)' : 'auto',
        maxWidth: rem(400),
      },
    });
  };

  const handleTypeSwitch = () => {
    const newType = type === 'email' ? 'phone' : 'email';
    setType(newType);
    
    // Clear the current value when switching types
    setValue('loginValue', '', { shouldValidate: false });
    
    // Reset form validation
    reset({ loginValue: '' });
  };

  // Validate the field on blur
  const handleBlur = async () => {
    const isValid = await trigger('loginValue');
    
    if (!isValid && errors.loginValue) {
      showErrorNotification(errors.loginValue?.message);
    } else if (isValid && watchedValue.trim() !== '') {
      notifications.show({
        title: 'Valid',
        message: `${type === 'email' ? 'Email' : 'Phone number'} looks good!`,
        color: 'teal',
        icon: <IconCheck size="0.8rem" />,
        position: 'top-right',
        autoClose: 2000,
        style: { 
          position: 'fixed',
          top: rem(20),
          right: isMobile ? rem(10) : rem(20),
          zIndex: 9999,
        },
      });
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Validate the field
      const isValid = await trigger('loginValue');
      if (!isValid) {
        showErrorNotification('Please fix the validation error before continuing');
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success notification
      showSuccessNotification(type === 'email' 
        ? `Login link sent to ${data.loginValue}. Check your email!`
        : `Verification code sent to ${data.loginValue}. Check your phone!`
      );
      
      // Log success
      console.log('Login initiated:', {
        type,
        value: data.loginValue,
        timestamp: new Date().toISOString(),
      });
      
      // Reset form
      reset();
      
    } catch (error) {
      // Show error notification
      showErrorNotification(
        error.message || 
        'An error occurred during login. Please try again.'
      );
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the form is ready for submission
  const isFormReady = () => {
    if (!watchedValue || watchedValue.trim() === '') return false;
    if (errors.loginValue) return false;
    return true;
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: '#EAF2FF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? rem(16) : rem(24),
      }}
    >
<<<<<<< HEAD
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
=======
      <Container 
        size={isMobile ? "sm" : isTablet ? 500 : 500}
        px={isMobile ? rem(16) : rem(20)}
      >
        <Paper 
          radius="lg" 
          p={isMobile ? "md" : "xl"} 
          shadow="md" 
          bg="#dbeafe"
          style={{
            width: '100%',
          }}
        >
          <Box style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginBottom: rem(12) 
          }}>
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={isMobile ? 80 : 100} // Increased width for normal ratio
              height={isMobile ? 60 : 75} // Adjusted height for normal ratio (3:4 aspect ratio)
              style={{ 
                objectFit: 'contain', // Preserve aspect ratio
                borderRadius: '8px', // Optional: slight rounding
              }}
              priority // Optional: load priority for LCP
            />
          </Box>
>>>>>>> 645b69caa010e61d3944239dda492c84d9aaf6fb

          <Title 
            order={isMobile ? 4 : 3} 
            ta="center" 
            fw={700}
            mb="xs"
          >
            WELCOME !!
          </Title>

          <Title 
            order={isMobile ? 5 : 4} 
            ta="center" 
            mb="md"
          >
            Login
          </Title>

          <Text 
            size={isMobile ? "sm" : "md"} 
            fw={500} 
            mb={6}
            ta="center"
          >
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
              size={isMobile ? "sm" : "md"}
              radius="md"
              mb="md"
              required
              onBlur={handleBlur}
              styles={{
                input: {
                  height: isMobile ? rem(44) : rem(48),
                }
              }}
            />

<<<<<<< HEAD
          <Button 
            fullWidth 
            mt="md" 
            component={Link} 
            href="/about"
          >
            Continue
          </Button>
=======
            <Button 
              fullWidth 
              mt="md"
              type="submit"
              loading={isSubmitting}
              size={isMobile ? "sm" : "md"}
              radius="md"
              disabled={!isFormReady() || isSubmitting}
              styles={{
                root: {
                  height: isMobile ? rem(44) : rem(48),
                }
              }}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </Button>
          </form>
>>>>>>> 645b69caa010e61d3944239dda492c84d9aaf6fb

          <Text
            ta="center"
            size={isMobile ? "sm" : "md"}
            mt="sm"
            c="blue"
            style={{ 
              cursor: 'pointer',
              fontWeight: 500,
            }}
            onClick={handleTypeSwitch}
          >
            {type === 'email'
              ? 'Login using phone number'
              : 'Login using email'}
          </Text>

          <Text 
            ta="center" 
            size={isMobile ? "sm" : "md"} 
            mt={6}
          >
            Dont have an account?{' '}
            <Link 
              href="/signup" 
              style={{ 
                color: '#2563EB', 
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: isMobile ? rem(13) : 'inherit',
              }}
            >
              Signup
            </Link>
          </Text>

          <Divider 
            my="md" 
            label="or sign in using" 
            labelPosition="center"
            size="sm"
            labelProps={{
              size: isMobile ? "sm" : "md",
              style: { padding: isMobile ? '0 12px' : '0 16px' }
            }}
          />

<<<<<<< HEAD
          <SocialLoginIcons />
=======
          <SocialLoginIcons isMobile={isMobile} />
>>>>>>> 645b69caa010e61d3944239dda492c84d9aaf6fb

          <Text 
            size={isMobile ? "xs" : "sm"} 
            ta="center" 
            mt="md" 
            c="dimmed"
            style={{ lineHeight: 1.5 }}
          >
            By continuing, you agree to our{' '}
            <Text 
              span 
              c="blue" 
              style={{ 
                cursor: 'pointer',
                fontWeight: 500,
              }}
              onClick={() => showSuccessNotification('Terms of Service')}
            >
              Terms of Service
            </Text>{' '}
            and{' '}
            <Text 
              span 
              c="blue" 
              style={{ 
                cursor: 'pointer',
                fontWeight: 500,
              }}
              onClick={() => showSuccessNotification('Privacy Policy')}
            >
              Privacy Policy
            </Text>.
          </Text>
        </Paper>
      </Container>
    </Box>
  );
}