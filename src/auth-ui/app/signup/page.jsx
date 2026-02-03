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

// Zod validation schema
const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must be less than 50 characters' })
    .regex(/^[A-Za-z\s]+$/, { message: 'First name can only contain letters and spaces' }),

  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must be less than 50 characters' })
    .regex(/^[A-Za-z\s]+$/, { message: 'Last name can only contain letters and spaces' }),

  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .min(1, { message: 'Email is required' }),

  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be less than 15 digits' })
    .regex(/^[\d\s\+\-\(\)]+$/, { message: 'Please enter a valid phone number' }),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message: 'Password must contain at least one special character',
    }),

  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
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
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

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

  const showFieldValidationNotification = (isValid, fieldName, message) => {
    notifications.show({
      title: isValid ? 'Valid' : 'Validation Error',
      message: isValid ? `${fieldName.replace(/([A-Z])/g, ' $1')} looks good!` : message,
      color: isValid ? 'teal' : 'red',
      icon: isValid ? <IconCheck size="0.8rem" /> : <IconX size="0.8rem" />,
      position: 'top-right',
      autoClose: 2000,
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

  const handleFieldValidation = async (fieldName) => {
    const result = await trigger(fieldName);
    
    if (!result && errors[fieldName]) {
      showFieldValidationNotification(false, fieldName, errors[fieldName]?.message || `Invalid ${fieldName}`);
    } else if (result) {
      showFieldValidationNotification(true, fieldName, '');
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Validate all fields
      const formIsValid = await trigger();
      if (!formIsValid) {
        showErrorNotification('Please fix the form errors before submitting');
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success notification
      showSuccessNotification('Account created successfully! You can now login.');
      
      // Log success
      console.log('Signup successful:', data);
      
      // Reset form
      reset();
      
    } catch (error) {
      // Show error notification
      showErrorNotification(error.message || 'An error occurred during signup. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              margin: '0 auto 16px', 
              width: 'auto', 
              height: '70px',
              borderRadius: '8px' 
            }}
          />
=======
      <Container 
        size={isMobile ? "sm" : isTablet ? 500 : 500} // Same as login page: increased from 420 to 500
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
            marginBottom: rem(16) // Increased from 12px for better spacing
          }}>
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={isMobile ? 80 : 100} // Same as login page: normal ratio
              height={isMobile ? 60 : 75} // Same as login page: 4:3 aspect ratio
              style={{ 
                objectFit: 'contain', // Preserve aspect ratio
                borderRadius: '8px', // Optional: slight rounding
              }}
            />
          </Box>
>>>>>>> 645b69caa010e61d3944239dda492c84d9aaf6fb

          <Title 
            order={isMobile ? 4 : 3} 
            ta="center" 
            fw={700}
            mb="md"
          >
            Create Account
          </Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid gutter={isMobile ? "sm" : "md"}>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="First name"
                  placeholder="Enter your first name"
                  {...register('firstName', {
                    onBlur: () => handleFieldValidation('firstName'),
                  })}
                  error={errors.firstName?.message}
                  size={isMobile ? "sm" : "md"}
                  radius="md"
                  required
                  styles={{
                    input: {
                      height: isMobile ? rem(44) : rem(48), // Same as login page
                    }
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <TextInput
                  label="Last name"
                  placeholder="Enter your last name"
                  {...register('lastName', {
                    onBlur: () => handleFieldValidation('lastName'),
                  })}
                  error={errors.lastName?.message}
                  size={isMobile ? "sm" : "md"}
                  radius="md"
                  required
                  styles={{
                    input: {
                      height: isMobile ? rem(44) : rem(48), // Same as login page
                    }
                  }}
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Email"
              placeholder="example@email.com"
              mt="md"
              {...register('email', {
                onBlur: () => handleFieldValidation('email'),
              })}
              error={errors.email?.message}
              size={isMobile ? "sm" : "md"}
              radius="md"
              required
              styles={{
                input: {
                  height: isMobile ? rem(44) : rem(48), // Same as login page
                }
              }}
            />

            <TextInput
              label="Phone number"
              placeholder="+251 9xx xxx xxx"
              mt="md"
              {...register('phone', {
                onBlur: () => handleFieldValidation('phone'),
              })}
              error={errors.phone?.message}
              size={isMobile ? "sm" : "md"}
              radius="md"
              required
              styles={{
                input: {
                  height: isMobile ? rem(44) : rem(48), // Same as login page
                }
              }}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              mt="md"
              {...register('password', {
                onBlur: () => handleFieldValidation('password'),
              })}
              error={errors.password?.message}
              size={isMobile ? "sm" : "md"}
              radius="md"
              required
              styles={{
                input: {
                  height: isMobile ? rem(44) : rem(48), // Same as login page
                }
              }}
            />

            <PasswordInput
              label="Confirm password"
              placeholder="Confirm your password"
              mt="md"
              {...register('confirmPassword', {
                onBlur: () => handleFieldValidation('confirmPassword'),
              })}
              error={errors.confirmPassword?.message}
              size={isMobile ? "sm" : "md"}
              radius="md"
              required
              styles={{
                input: {
                  height: isMobile ? rem(44) : rem(48), // Same as login page
                }
              }}
            />

            {/* Password requirements info */}
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title="Password Requirements:"
              color="blue"
              radius="md"
              mt="md"
              p="sm"
              style={{ fontSize: isMobile ? rem(12) : rem(14) }}
            >
              <Group gap={isMobile ? 4 : 8} wrap="wrap">
                <Text size="xs" c={errors.password?.type === 'too_small' ? 'red' : 'dimmed'}>
                  • 8+ characters
                </Text>
                <Text size="xs" c={errors.password?.type === 'invalid_string' ? 'red' : 'dimmed'}>
                  • 1 uppercase letter
                </Text>
                <Text size="xs" c={errors.password?.type === 'invalid_string' ? 'red' : 'dimmed'}>
                  • 1 lowercase letter
                </Text>
                <Text size="xs" c={errors.password?.type === 'invalid_string' ? 'red' : 'dimmed'}>
                  • 1 number
                </Text>
                <Text size="xs" c={errors.password?.type === 'invalid_string' ? 'red' : 'dimmed'}>
                  • 1 special character
                </Text>
              </Group>
            </Alert>

            <Button 
              fullWidth 
              mt="xl" 
              type="submit"
              loading={isSubmitting}
              size={isMobile ? "sm" : "md"}
              radius="md"
              disabled={!isDirty || !isValid}
              styles={{
                root: {
                  height: isMobile ? rem(44) : rem(48), // Same as login page
                }
              }}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <Text 
            ta="center" 
            size={isMobile ? "xs" : "sm"} 
            mt="md"
          >
            Already have an account?{' '}
            <Link 
              href="/login" 
              style={{ 
                color: '#2563EB', 
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: isMobile ? rem(13) : 'inherit',
              }}
            >
              Sign In
            </Link>
          </Text>

          <Text 
            ta="center" 
            size="xs" 
            c="dimmed" 
            mt="md"
            style={{ lineHeight: 1.5 }}
          >
            By signing up, you agree to our{' '}
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