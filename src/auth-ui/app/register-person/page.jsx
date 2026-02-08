'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Container, Box, Title, Text, TextInput, Select, NumberInput, 
  Textarea, SimpleGrid, Paper, Button, Group, FileInput, Stack,
  Loader, Alert, Badge, Divider, Flex, Stepper, Progress,
  Card, Tabs, Transition, Collapse, ActionIcon, Tooltip,
  Avatar, Modal, useMantineTheme, Overlay, Center,
  Radio, Checkbox
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { 
  IconUpload, IconMapPin, IconInfoCircle, IconAlertCircle, 
  IconCheck, IconBrandTelegram, IconPhone, IconMail, 
  IconUser, IconCalendar, IconClock, IconCamera,
  IconChevronRight, IconChevronLeft, IconQuestionMark,
  IconMap, IconCar, IconUserPlus, IconPhoto,
  IconLock, IconWorld, IconMessageCircle,
  IconArrowRight, IconRefresh, IconExternalLink,
  IconShieldCheck, IconEye, IconEyeOff, IconStar,
  IconHome, IconDashboard
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainFooter from '../../components/MainFooter';
import carData from '../data/carData';
import { useMediaQuery } from '@mantine/hooks';

// JSON Server URLs
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const MISSING_PERSONS_API = `${API_BASE_URL}/missingPersons`;
const MISSING_VEHICLES_API = `${API_BASE_URL}/missingVehicles`;
const USERS_API = `${API_BASE_URL}/users`;

// Primary Color Constants
const PRIMARY_COLOR = '#0034D1';
const PRIMARY_LIGHT = '#4d79ff';
const PRIMARY_DARK = '#0029a8';
const PRIMARY_GRADIENT = `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #0066ff 100%)`;
const PRIMARY_GRADIENT_HOVER = `linear-gradient(135deg, ${PRIMARY_DARK} 0%, #0052d4 100%)`;
const LIGHT_BG = '#f0f5ff';
const CARD_BG = '#f8fbff';

// Animation styles
const fadeIn = {
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
};

const slideIn = {
  from: { opacity: 0, transform: 'translateX(-10px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
};

export default function UnifiedRegisterPage() {
  const router = useRouter();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const isTablet = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  
  const [regType, setRegType] = useState('Person');
  const [loading, setLoading] = useState(true);
  const [showSubscriptionRedirect, setShowSubscriptionRedirect] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Vehicle selection states
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSubmodel, setSelectedSubmodel] = useState(null);
  
  // Data for dropdowns
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [submodels, setSubmodels] = useState([]);

  // Color options
  const colorOptions = [
    'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 
    'Orange', 'Brown', 'Gold', 'Beige', 'Maroon', 'Purple', 'Pink'
  ];

  // Region options (Ethiopian regions)
  const regionOptions = [
    'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
    'Gambela', 'Harari', 'Oromia', 'Sidama', 'Somali', 
    'Southern Nations, Nationalities, and Peoples', 'South West Ethiopia',
    'Tigray'
  ];

  // Stepper steps
  const steps = [
    { label: 'Basic Info', icon: <IconUser size={18} /> },
    { label: regType === 'Person' ? 'Person Details' : 'Vehicle Details', icon: regType === 'Person' ? <IconUserPlus size={18} /> : <IconCar size={18} /> },
    { label: 'Last Seen', icon: <IconMap size={18} /> },
    { label: 'Contact Info', icon: <IconMessageCircle size={18} /> },
    { label: 'Review & Submit', icon: <IconCheck size={18} /> },
  ];

  // Check registration count and authentication on page load
  useEffect(() => {
    const checkRegistrationAndAuth = async () => {
      try {
        // Check if user is logged in by checking localStorage (matching your login page)
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userData = localStorage.getItem('currentUser');
        
        console.log('Auth check:', { isAuthenticated, userData });
        
        if (!isAuthenticated || !userData || isAuthenticated !== 'true') {
          // User is not logged in, save current URL and redirect to login
          sessionStorage.setItem('redirectUrl', window.location.pathname);
          notifications.show({
            title: 'Login Required',
            message: 'Please login to submit a report',
            color: 'yellow',
            icon: <IconAlertCircle size={20} />,
            autoClose: 3000,
            styles: { root: { borderColor: PRIMARY_COLOR } }
          });
          router.push('/login');
          return;
        }

        // Parse user data
        const parsedUser = JSON.parse(userData);
        
        // Fetch updated user data from server to get registration count
        const response = await fetch(`${USERS_API}/${parsedUser.id}`);
        if (response.ok) {
          const userFromServer = await response.json();
          setCurrentUser(userFromServer);
          
          // Check if user is active
          if (!userFromServer.isActive) {
            notifications.show({
              title: 'Account Inactive',
              message: 'Your account has been deactivated. Please contact support.',
              color: 'red',
              icon: <IconAlertCircle size={20} />,
              autoClose: 5000,
            });
            router.push('/login');
            return;
          }

          // Check registration count from user data
          const registrationCount = userFromServer.registrations || 0;
          
          console.log("Current registration count:", registrationCount);
          
          if (registrationCount >= 1) {
            // This is 2nd+ registration, check if user has paid subscription
            const hasPaid = userFromServer.hasPaidSubscription || false;
            
            console.log("Has paid subscription:", hasPaid);
            
            if (!hasPaid) {
              // Show subscription redirect warning
              setShowSubscriptionRedirect(true);
              
              // Redirect to subscription page after 3 seconds
              const timer = setTimeout(() => {
                router.push("/subscribe");
              }, 3000);
              
              setLoading(false);
              return () => clearTimeout(timer);
            }
          }
        } else {
          throw new Error('Failed to fetch user data');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error checking registration and auth:', error);
        setLoading(false);
      }
    };

    checkRegistrationAndAuth();
  }, [router]);

  // Update progress based on active step
  useEffect(() => {
    setProgress(((activeStep + 1) / steps.length) * 100);
  }, [activeStep, steps.length]);

  // Initialize brands from carData
  useEffect(() => {
    const brandList = Object.keys(carData);
    setBrands(brandList);
  }, []);

  // Update models when brand changes
  useEffect(() => {
    if (selectedBrand && carData[selectedBrand]) {
      const modelList = Object.keys(carData[selectedBrand]);
      setModels(modelList);
      setSelectedModel(null);
      setSelectedSubmodel(null);
    } else {
      setModels([]);
      setSubmodels([]);
    }
  }, [selectedBrand]);

  // Update submodels when model changes
  useEffect(() => {
    if (selectedBrand && selectedModel && carData[selectedBrand]) {
      const brandData = carData[selectedBrand];
      if (brandData[selectedModel]) {
        const submodelList = brandData[selectedModel];
        setSubmodels(submodelList);
        setSelectedSubmodel(null);
      }
    } else {
      setSubmodels([]);
    }
  }, [selectedBrand, selectedModel]);

  // Handle image upload preview
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to save data to JSON Server
  const saveToJsonServer = async (data) => {
    try {
      const endpoint = regType === 'Person' ? MISSING_PERSONS_API : MISSING_VEHICLES_API;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to save data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving to JSON Server:', error);
      throw error;
    }
  };

  // Function to update user registration count on JSON Server
  const updateUserRegistrationCount = async (userId, newCount) => {
    try {
      const response = await fetch(`${USERS_API}/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrations: newCount,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user registration count');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get form data
      const formData = new FormData(e.target);
      const formObject = Object.fromEntries(formData.entries());
      
      // Generate case ID
      const caseId = `CASE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      // Prepare report data
      const reportData = {
        ...formObject,
        type: regType,
        caseId,
        reportedBy: {
          userId: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          phone: currentUser.phone,
          role: currentUser.role,
          telegramUsername: formObject.telegramUsername || null,
        },
        reportDate: new Date().toISOString(),
        status: 'Active',
        lastUpdated: new Date().toISOString(),
        verified: false,
        matches: [],
        notes: [],
        contactMethods: {
          email: currentUser.email,
          phone: currentUser.phone,
          telegram: formObject.telegramUsername || null,
        }
      };

      // Save report to JSON Server
      const savedData = await saveToJsonServer(reportData);

      // Update user registration count
      const currentRegistrations = currentUser.registrations || 0;
      const newCount = currentRegistrations + 1;
      
      // Update in JSON Server
      const updatedUser = await updateUserRegistrationCount(currentUser.id, newCount);
      
      // Update local state and localStorage
      const newUserData = { 
        ...currentUser, 
        registrations: newCount,
        updatedAt: updatedUser.updatedAt 
      };
      setCurrentUser(newUserData);
      localStorage.setItem('currentUser', JSON.stringify(newUserData));

      // Show success notification with confetti effect
      notifications.show({
        title: '🎉 Report Submitted Successfully!',
        message: (
          <div>
            <p><strong>Case ID:</strong> {caseId}</p>
            <p>
              {regType === 'Person' 
                ? `Person: ${formObject.firstName} ${formObject.lastName}`
                : `Vehicle: ${formObject.brand} ${formObject.model} - ${formObject.plateNumber}`
              }
            </p>
            <Text size="sm" c="dimmed" mt={5}>
              We will contact you if we find any matches.
              {formObject.telegramUsername && ` You can also be contacted via Telegram: @${formObject.telegramUsername}`}
            </Text>
          </div>
        ),
        color: 'blue',
        icon: <IconCheck size={20} />,
        autoClose: 10000,
        withCloseButton: true,
        withBorder: true,
        position: 'top-right',
        styles: (theme) => ({
          root: {
            backgroundColor: LIGHT_BG,
            borderColor: PRIMARY_COLOR,
            borderWidth: 2,
          },
          title: { color: PRIMARY_COLOR, fontWeight: 700 },
          description: { color: PRIMARY_DARK },
        }),
      });

      console.log("New registration count:", newCount);
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push("/");
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting report:', error);
      
      notifications.show({
        title: 'Submission Failed',
        message: 'Failed to submit report. Please try again.',
        color: 'red',
        icon: <IconAlertCircle size={20} />,
        autoClose: 8000,
        withCloseButton: true,
        withBorder: true,
        position: 'top-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: PRIMARY_GRADIENT
      }}>
        <Flex direction="column" align="center" gap="md">
          <Loader size="xl" color="white" variant="dots" />
          <Text c="white" size="lg" fw={600}>Loading your registration...</Text>
          <Text c="white" size="sm" opacity={0.8}>Please wait while we prepare your form</Text>
        </Flex>
      </Box>
    );
  }

  // Subscription redirect warning
  if (showSubscriptionRedirect) {
    return (
      <Box style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: PRIMARY_GRADIENT
      }}>
        <Container size="sm">
          <Alert
            icon={<IconAlertCircle size={24} />}
            title="Subscription Required"
            color="blue"
            variant="filled"
            radius="lg"
            p="xl"
            style={{ 
              backdropFilter: 'blur(10px)', 
              backgroundColor: 'rgba(0, 52, 209, 0.95)',
              border: '2px solid white'
            }}
          >
            <Stack gap="md">
              <Flex align="center" gap="md">
                <IconStar size={32} color="gold" />
                <Box>
                  <Text c="white" size="lg" fw={700}>
                    Upgrade to Premium
                  </Text>
                  <Text c="white" opacity={0.9}>
                    You have already registered 1 {regType.toLowerCase()}.
                  </Text>
                </Box>
              </Flex>
              
              <Text c="white">
                To register additional {regType === 'Person' ? 'people' : 'vehicles'}, you need to subscribe to a premium plan.
              </Text>
              
              <Box style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: 'md', 
                borderRadius: 'md',
                border: '1px dashed rgba(255, 255, 255, 0.3)'
              }}>
                <Text c="white" size="sm" fw={600} ta="center">Premium Benefits:</Text>
                <SimpleGrid cols={2} spacing="xs" mt="xs">
                  <Flex align="center" gap="xs">
                    <IconCheck size={14} color="#4dff4d" />
                    <Text c="white" size="xs">Unlimited Reports</Text>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <IconCheck size={14} color="#4dff4d" />
                    <Text c="white" size="xs">Priority Support</Text>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <IconCheck size={14} color="#4dff4d" />
                    <Text c="white" size="xs">Advanced Search</Text>
                  </Flex>
                  <Flex align="center" gap="xs">
                    <IconCheck size={14} color="#4dff4d" />
                    <Text c="white" size="xs">Real-time Updates</Text>
                  </Flex>
                </SimpleGrid>
              </Box>
              
              <Text c="white" size="sm" ta="center">
                Redirecting to subscription page in 3 seconds...
              </Text>
              
              <Button
                color="yellow"
                size="lg"
                radius="xl"
                onClick={() => router.push("/subscribe")}
                mt="md"
                rightSection={<IconArrowRight size={20} />}
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
                  fontWeight: 700,
                  color: '#0034D1'
                }}
              >
                View Premium Plans
              </Button>
            </Stack>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ 
      minHeight: '100vh',
      background: isMobile ? LIGHT_BG : `radial-gradient(circle at 10% 20%, rgba(0, 52, 209, 0.05) 0%, rgba(255, 255, 255, 1) 100%)`,
      position: 'relative'
    }}>
      {/* Floating Help Button */}
      <Tooltip label="Quick Help & Tips" position="left" withArrow>
        <ActionIcon
          size="lg"
          radius="xl"
          variant="filled"
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 100,
            background: PRIMARY_GRADIENT,
            boxShadow: `0 6px 20px ${PRIMARY_COLOR}40`,
            border: `2px solid white`,
            transition: 'all 0.3s ease',
            ':hover': {
              transform: 'scale(1.1)',
              background: PRIMARY_GRADIENT_HOVER,
              boxShadow: `0 8px 25px ${PRIMARY_COLOR}60`,
            }
          }}
          onClick={() => setIsHelpVisible(!isHelpVisible)}
        >
          <IconQuestionMark size={22} color="white" />
        </ActionIcon>
      </Tooltip>

      {/* Help Panel */}
      <Collapse in={isHelpVisible}>
        <Paper
          p="md"
          radius="lg"
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            zIndex: 99,
            maxWidth: 350,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `2px solid ${PRIMARY_COLOR}`,
            boxShadow: `0 10px 40px rgba(0, 52, 209, 0.2)`,
          }}
        >
          <Flex justify="space-between" align="center" mb="xs">
            <Text size="sm" fw={700} c={PRIMARY_COLOR}>
              <IconInfoCircle size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Quick Guide
            </Text>
            <Badge color="blue" variant="light" size="sm">
              Step {activeStep + 1} of {steps.length}
            </Badge>
          </Flex>
          
          <Divider my="xs" color={PRIMARY_COLOR} />
          
          <Stack gap="xs">
            <Text size="xs" c="dimmed">
              • All fields marked with <Text span c={PRIMARY_COLOR} fw={700}>*</Text> are required
            </Text>
            <Text size="xs" c="dimmed">
              • Use clear photos for better identification
            </Text>
            <Text size="xs" c="dimmed">
              • Provide accurate last seen location
            </Text>
            <Text size="xs" c="dimmed">
              • Add Telegram for faster communication
            </Text>
          </Stack>
          
          <Button
            size="xs"
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            leftSection={<IconExternalLink size={14} />}
            style={{ border: `1px solid ${PRIMARY_COLOR}` }}
          >
            View Detailed Guide
          </Button>
        </Paper>
      </Collapse>

      {/* TOP HEADER WITH LOGO */}
      <Box
        style={{
          backgroundColor: 'white',
          borderBottom: `2px solid ${LIGHT_BG}`,
          boxShadow: `0 2px 15px rgba(0, 52, 209, 0.1)`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="lg">
          <Flex 
            justify="space-between" 
            align="center" 
            py="sm"
            direction={isMobile ? 'column' : 'row'}
            gap={isMobile ? 'md' : 'xs'}
          >
            {/* Logo Section */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Flex align="center" gap="md">
                <Box
                  style={{
                    position: 'relative',
                    width: isMobile ? 50 : 60,
                    height: isMobile ? 50 : 60,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `2px solid ${PRIMARY_COLOR}`,
                    boxShadow: `0 4px 12px ${PRIMARY_COLOR}30`,
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="FindR Logo"
                    fill
                    style={{ 
                      objectFit: 'cover',
                      padding: 4,
                    }}
                    priority
                  />
                </Box>
                <Box>
                  <Text 
                    size={isMobile ? "lg" : "xl"} 
                    fw={900} 
                    style={{ 
                      color: PRIMARY_COLOR,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    FindR
                  </Text>
                  <Text 
                    size="xs" 
                    c={PRIMARY_DARK} 
                    fw={600}
                    style={{ letterSpacing: '1px' }}
                  >
                    Missing Persons & Vehicles Registry
                  </Text>
                </Box>
              </Flex>
            </Link>

            {/* User Info & Navigation */}
            <Flex align="center" gap="lg">
              {/* Navigation Buttons */}
              <Flex gap="xs">
                <Tooltip label="Dashboard" position="bottom">
                  <ActionIcon
                    size="lg"
                    radius="md"
                    variant="light"
                    color="blue"
                    onClick={() => router.push('/')}
                    style={{ border: `1px solid ${PRIMARY_COLOR}30` }}
                  >
                    <IconDashboard size={20} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Home" position="bottom">
                  <ActionIcon
                    size="lg"
                    radius="md"
                    variant="light"
                    color="blue"
                    onClick={() => router.push('/')}
                    style={{ border: `1px solid ${PRIMARY_COLOR}30` }}
                  >
                    <IconHome size={20} />
                  </ActionIcon>
                </Tooltip>
              </Flex>

              {/* User Profile */}
              <Flex 
                align="center" 
                gap="sm" 
                style={{ 
                  padding: '8px 16px',
                  background: LIGHT_BG,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    background: `${PRIMARY_COLOR}10`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${PRIMARY_COLOR}20`,
                  }
                }}
                onClick={() => setShowContactModal(true)}
              >
                <Avatar
                  size="sm"
                  radius="xl"
                  src={currentUser?.avatar}
                  style={{ 
                    background: PRIMARY_GRADIENT,
                    border: `2px solid white`,
                  }}
                >
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </Avatar>
                <Box>
                  <Text size="sm" fw={600} style={{ color: PRIMARY_DARK }}>
                    {currentUser?.firstName} {currentUser?.lastName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    Report #{currentUser?.registrations ? currentUser.registrations + 1 : 1}
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Progress Bar */}
      

      <Container size="lg" py={isMobile ? 20 : 40}>

        {/* Main Form Container */}
        <Paper
          radius="lg"
          p={isMobile ? 'md' : 'xl'}
          style={{
            background: 'white',
            border: `2px solid ${LIGHT_BG}`,
            boxShadow: `0 8px 30px rgba(0, 52, 209, 0.08)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Corner */}
          <Box style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 100,
            height: 100,
            background: PRIMARY_GRADIENT,
            borderBottomLeftRadius: '100%',
            opacity: 0.05,
          }} />

          {/* Form Title with Icon */}
          <Flex justify="space-between" align="center" mb="xl" wrap="wrap" gap="md">
            <Flex align="center" gap="md">
              <Box
                style={{
                  background: PRIMARY_GRADIENT,
                  padding: '14px',
                  borderRadius: '14px',
                  color: 'white',
                  boxShadow: `0 6px 20px ${PRIMARY_COLOR}40`,
                }}
              >
                {regType === 'Person' ? (
                  <IconUserPlus size={32} />
                ) : (
                  <IconCar size={32} />
                )}
              </Box>
              <Box>
                <Title order={2} style={{ color: PRIMARY_DARK, fontWeight: 800 }}>
                  Register Missing {regType === 'Person' ? 'Person' : 'Vehicle'}
                </Title>
                <Text c="dimmed" size="sm">
                  Complete all sections below. Required fields are marked with 
                  <Text span c={PRIMARY_COLOR} fw={700} mx={4}>*</Text>
                </Text>
              </Box>
            </Flex>

            {/* Registration Type Toggle */}
            <Tabs 
              value={regType} 
              onChange={setRegType}
              variant="pills"
              radius="xl"
              style={{ minWidth: isMobile ? '100%' : 'auto' }}
            >
              <Tabs.List grow={isMobile} bg={LIGHT_BG}>
                <Tabs.Tab 
                  value="Person" 
                  leftSection={<IconUserPlus size={18} />}
                  style={{
                    background: regType === 'Person' ? PRIMARY_GRADIENT : 'transparent',
                    color: regType === 'Person' ? 'white' : PRIMARY_COLOR,
                    fontWeight: regType === 'Person' ? 700 : 500,
                    border: regType === 'Person' ? 'none' : `1px solid ${PRIMARY_COLOR}40`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  Missing Person
                </Tabs.Tab>
                <Tabs.Tab 
                  value="Vehicle" 
                  leftSection={<IconCar size={18} />}
                  style={{
                    background: regType === 'Vehicle' ? PRIMARY_GRADIENT : 'transparent',
                    color: regType === 'Vehicle' ? 'white' : PRIMARY_COLOR,
                    fontWeight: regType === 'Vehicle' ? 700 : 500,
                    border: regType === 'Vehicle' ? 'none' : `1px solid ${PRIMARY_COLOR}40`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  Missing Vehicle
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Flex>

          {/* Stepper Navigation */}
          <Stepper
            active={activeStep}
            onStepClick={setActiveStep}
            size={isMobile ? 'sm' : 'md'}
            mb="xl"
            styles={{
              step: {
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ':hover': {
                  transform: 'translateY(-2px)',
                }
              },
              stepIcon: {
                borderWidth: 3,
                backgroundColor: 'white',
              },
              stepCompleted: {
                backgroundColor: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR,
              }
            }}
            color={PRIMARY_COLOR}
          >
            {steps.map((step, index) => (
              <Stepper.Step
                key={index}
                label={!isMobile && step.label}
                icon={step.icon}
                color={index <= activeStep ? PRIMARY_COLOR : 'gray'}
                completedIcon={<IconCheck size={16} />}
              />
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            <Stack gap="xl">
              {/* Type Selection Card - Step 0 */}
              {activeStep === 0 && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        style={{
                          borderLeft: `4px solid ${PRIMARY_COLOR}`,
                          transition: 'transform 0.3s ease',
                          background: CARD_BG,
                          ':hover': { 
                            transform: 'translateY(-4px)',
                            boxShadow: `0 12px 30px ${PRIMARY_COLOR}15`,
                          }
                        }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box
                            style={{
                              background: PRIMARY_GRADIENT,
                              padding: '10px',
                              borderRadius: '10px',
                              color: 'white',
                            }}
                          >
                            <IconInfoCircle size={24} />
                          </Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>
                              Select Report Type
                            </Title>
                            <Text c="dimmed" size="sm">
                              Choose the type of report you want to submit
                            </Text>
                          </Box>
                        </Flex>
                        
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                          <Card
                            withBorder
                            padding="xl"
                            radius="md"
                            style={{
                              cursor: 'pointer',
                              borderColor: regType === 'Person' ? PRIMARY_COLOR : LIGHT_BG,
                              borderWidth: regType === 'Person' ? 3 : 1,
                              transition: 'all 0.3s ease',
                              background: regType === 'Person' ? `${PRIMARY_COLOR}08` : 'white',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                            onClick={() => setRegType('Person')}
                          >
                            {regType === 'Person' && (
                              <Box style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: PRIMARY_COLOR,
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 700,
                              }}>
                                SELECTED
                              </Box>
                            )}
                            <Flex align="center" gap="md">
                              <Box
                                style={{
                                  background: regType === 'Person' ? PRIMARY_GRADIENT : LIGHT_BG,
                                  padding: '16px',
                                  borderRadius: '12px',
                                  color: regType === 'Person' ? 'white' : PRIMARY_COLOR,
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                <IconUserPlus size={28} />
                              </Box>
                              <Box>
                                <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }}>
                                  Missing Person
                                </Text>
                                <Text size="sm" c="dimmed" mt={4}>
                                  Report a missing individual with personal details
                                </Text>
                              </Box>
                            </Flex>
                            <Divider my="md" color={LIGHT_BG} />
                            <Text size="xs" c="dimmed">
                              • Personal identification details
                              <br />
                              • Physical description
                              <br />
                              • Last known location
                              <br />
                              • Contact information
                            </Text>
                          </Card>

                          <Card
                            withBorder
                            padding="xl"
                            radius="md"
                            style={{
                              cursor: 'pointer',
                              borderColor: regType === 'Vehicle' ? PRIMARY_COLOR : LIGHT_BG,
                              borderWidth: regType === 'Vehicle' ? 3 : 1,
                              transition: 'all 0.3s ease',
                              background: regType === 'Vehicle' ? `${PRIMARY_COLOR}08` : 'white',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                            onClick={() => setRegType('Vehicle')}
                          >
                            {regType === 'Vehicle' && (
                              <Box style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: PRIMARY_COLOR,
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 700,
                              }}>
                                SELECTED
                              </Box>
                            )}
                            <Flex align="center" gap="md">
                              <Box
                                style={{
                                  background: regType === 'Vehicle' ? PRIMARY_GRADIENT : LIGHT_BG,
                                  padding: '16px',
                                  borderRadius: '12px',
                                  color: regType === 'Vehicle' ? 'white' : PRIMARY_COLOR,
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                <IconCar size={28} />
                              </Box>
                              <Box>
                                <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }}>
                                  Missing Vehicle
                                </Text>
                                <Text size="sm" c="dimmed" mt={4}>
                                  Report a stolen or missing vehicle with details
                                </Text>
                              </Box>
                            </Flex>
                            <Divider my="md" color={LIGHT_BG} />
                            <Text size="xs" c="dimmed">
                              • Vehicle identification
                              <br />
                              • License plate information
                              <br />
                              • Vehicle description
                              <br />
                              • Last seen location
                            </Text>
                          </Card>
                        </SimpleGrid>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* CONDITIONAL CONTENT - Person - Step 1 */}
              {activeStep === 1 && regType === 'Person' && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        style={{
                          borderLeft: `4px solid ${PRIMARY_COLOR}`,
                          background: CARD_BG,
                        }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box
                            style={{
                              background: PRIMARY_GRADIENT,
                              padding: '10px',
                              borderRadius: '10px',
                              color: 'white',
                            }}
                          >
                            <IconUserPlus size={24} />
                          </Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>
                              Personal Information
                            </Title>
                            <Text c="dimmed" size="sm">
                              Provide details about the missing person
                            </Text>
                          </Box>
                        </Flex>
                        
                        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="lg">
                          <TextInput
                            name="firstName"
                            label={
                              <Text fw={600} size="sm">
                                First name <Text span c={PRIMARY_COLOR}>*</Text>
                              </Text>
                            }
                            placeholder="Enter first name"
                            radius="md"
                            required
                            styles={{
                              input: {
                                borderColor: LIGHT_BG,
                                transition: 'all 0.2s ease',
                                ':focus': {
                                  borderColor: PRIMARY_COLOR,
                                  boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                                }
                              }
                            }}
                          />
                          <TextInput
                            name="middleName"
                            label={
                              <Text fw={600} size="sm">
                                Middle name
                              </Text>
                            }
                            placeholder="Enter middle name"
                            radius="md"
                          />
                          <TextInput
                            name="lastName"
                            label={
                              <Text fw={600} size="sm">
                                Last name <Text span c={PRIMARY_COLOR}>*</Text>
                              </Text>
                            }
                            placeholder="Enter last name"
                            radius="md"
                            required
                          />
                        </SimpleGrid>
                        
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="lg">
                          <Select
                            name="gender"
                            label={
                              <Text fw={600} size="sm">
                                Gender <Text span c={PRIMARY_COLOR}>*</Text>
                              </Text>
                            }
                            data={['Male', 'Female', 'Other']}
                            radius="md"
                            required
                            styles={{
                              input: {
                                borderColor: LIGHT_BG,
                                ':focus': {
                                  borderColor: PRIMARY_COLOR,
                                  boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                                }
                              }
                            }}
                          />
                          <NumberInput
                            name="age"
                            label={
                              <Text fw={600} size="sm">
                                Age <Text span c={PRIMARY_COLOR}>*</Text>
                              </Text>
                            }
                            placeholder="Enter age"
                            radius="md"
                            min={0}
                            required
                            styles={{
                              input: {
                                borderColor: LIGHT_BG,
                                ':focus': {
                                  borderColor: PRIMARY_COLOR,
                                  boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                                }
                              }
                            }}
                          />
                          <NumberInput
                            name="height"
                            label={
                              <Text fw={600} size="sm">
                                Height (cm)
                              </Text>
                            }
                            placeholder="Height in cm"
                            radius="md"
                            min={0}
                          />
                          <NumberInput
                            name="weight"
                            label={
                              <Text fw={600} size="sm">
                                Weight (kg)
                              </Text>
                            }
                            placeholder="Weight in kg"
                            radius="md"
                            min={0}
                          />
                        </SimpleGrid>
                        
                        <Textarea
                          name="description"
                          label={
                            <Text fw={600} size="sm">
                              Additional Description
                            </Text>
                          }
                          placeholder="Add any distinguishing features, clothing description, last seen with, medical conditions, etc."
                          minRows={4}
                          radius="md"
                          mb="lg"
                          styles={{
                            input: {
                              borderColor: LIGHT_BG,
                              ':focus': {
                                borderColor: PRIMARY_COLOR,
                                boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                              }
                            }
                          }}
                        />

                        {/* Image Upload Section */}
                        <Card
                          withBorder
                          radius="lg"
                          padding="xl"
                          style={{
                            borderStyle: 'dashed',
                            borderColor: PRIMARY_LIGHT,
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            borderWidth: 2,
                            ':hover': {
                              borderColor: PRIMARY_COLOR,
                              backgroundColor: LIGHT_BG,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 8px 25px ${PRIMARY_COLOR}15`,
                            }
                          }}
                          onClick={() => document.getElementById('person-image-upload').click()}
                        >
                          <input
                            type="file"
                            id="person-image-upload"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                          <Flex direction="column" align="center" gap="md">
                            {imagePreview ? (
                              <>
                                <Box style={{ position: 'relative', width: 120, height: 120 }}>
                                  <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    style={{ 
                                      borderRadius: '12px', 
                                      objectFit: 'cover',
                                      border: `3px solid ${PRIMARY_COLOR}`,
                                    }}
                                  />
                                </Box>
                                <Flex gap="sm">
                                  <Button
                                    size="sm"
                                    variant="light"
                                    color="blue"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      document.getElementById('person-image-upload').click();
                                    }}
                                    leftSection={<IconRefresh size={14} />}
                                  >
                                    Change
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="light"
                                    color="red"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setImagePreview(null);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </Flex>
                              </>
                            ) : (
                              <>
                                <Box
                                  style={{
                                    background: PRIMARY_GRADIENT,
                                    padding: '20px',
                                    borderRadius: '50%',
                                    color: 'white',
                                    marginBottom: '8px',
                                  }}
                                >
                                  <IconCamera size={40} />
                                </Box>
                                <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }}>
                                  Upload Persons Photo
                                </Text>
                                <Text c="dimmed" size="sm" ta="center">
                                  Click or drag & drop to upload a clear recent photo
                                </Text>
                                <Text size="xs" c={PRIMARY_COLOR} fw={600} mt="xs">
                                  Recommended: Front-facing, good lighting, recent photo
                                </Text>
                                <Badge color="blue" variant="light" size="sm" mt="xs">
                                  Max 5MB • JPG, PNG, WebP
                                </Badge>
                              </>
                            )}
                          </Flex>
                        </Card>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* CONDITIONAL CONTENT - Vehicle - Step 1 */}
              {activeStep === 1 && regType === 'Vehicle' && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      {/* Vehicle Information Card */}
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        style={{
                          borderLeft: `4px solid ${PRIMARY_COLOR}`,
                          background: CARD_BG,
                        }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box
                            style={{
                              background: PRIMARY_GRADIENT,
                              padding: '10px',
                              borderRadius: '10px',
                              color: 'white',
                            }}
                          >
                            <IconCar size={24} />
                          </Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>
                              Vehicle Information
                            </Title>
                            <Text c="dimmed" size="sm">
                              Provide detailed information about the vehicle
                            </Text>
                          </Box>
                        </Flex>
                        
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="lg">
                          <Select
                            name="brand"
                            label={
                              <Text fw={600} size="sm">
                                Brand <Text span c={PRIMARY_COLOR}>*</Text>
                              </Text>
                            }
                            placeholder="Select vehicle brand"
                            data={brands}
                            value={selectedBrand}
                            onChange={setSelectedBrand}
                            radius="md"
                            searchable
                            clearable
                            required
                            leftSection={<IconCar size={16} color={PRIMARY_COLOR} />}
                            styles={{
                              input: {
                                borderColor: LIGHT_BG,
                                ':focus': {
                                  borderColor: PRIMARY_COLOR,
                                  boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                                }
                              }
                            }}
                          />
                          <Select
                            name="model"
                            label={
                              <Text fw={600} size="sm">
                                Model <Text span c={PRIMARY_COLOR}>*</Text>
                              </Text>
                            }
                            placeholder="Select vehicle model"
                            data={models}
                            value={selectedModel}
                            onChange={setSelectedModel}
                            radius="md"
                            disabled={!selectedBrand}
                            searchable
                            clearable
                            required
                            styles={{
                              input: {
                                borderColor: LIGHT_BG,
                                ':focus': {
                                  borderColor: PRIMARY_COLOR,
                                  boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                                }
                              }
                            }}
                          />
                          <Select
                            name="submodel"
                            label={
                              <Text fw={600} size="sm">
                                Sub Model
                              </Text>
                            }
                            placeholder="Select sub model"
                            data={submodels}
                            value={selectedSubmodel}
                            onChange={setSelectedSubmodel}
                            radius="md"
                            disabled={!selectedModel}
                            searchable
                            clearable
                          />
                          <Select
                            name="color"
                            label={
                              <Text fw={600} size="sm">
                                Color <Text span c={PRIMARY_COLOR}>*</Text>
                              </Text>
                            }
                            placeholder="Select vehicle color"
                            data={colorOptions}
                            radius="md"
                            searchable
                            required
                          />
                        </SimpleGrid>
                        
                        <Textarea
                          name="vehicleDescription"
                          label={
                            <Text fw={600} size="sm">
                              Additional Vehicle Description
                            </Text>
                          }
                          placeholder="Add additional information about the vehicle (damages, modifications, special features, stickers, dents, unique characteristics, etc.)"
                          radius="md"
                          minRows={4}
                          mb="lg"
                          styles={{
                            input: {
                              borderColor: LIGHT_BG,
                              ':focus': {
                                borderColor: PRIMARY_COLOR,
                                boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                              }
                            }
                          }}
                        />

                        {/* License Plate Section */}
                        <Card
                          withBorder
                          radius="lg"
                          padding="xl"
                          mb="lg"
                          style={{
                            background: 'white',
                            borderColor: PRIMARY_COLOR,
                            borderWidth: 2,
                          }}
                        >
                          <Flex align="center" gap="md" mb="lg">
                            <Box
                              style={{
                                background: PRIMARY_GRADIENT,
                                padding: '8px',
                                borderRadius: '8px',
                                color: 'white',
                              }}
                            >
                              <IconInfoCircle size={20} />
                            </Box>
                            <Box>
                              <Title order={5} style={{ color: PRIMARY_DARK }}>
                                License Plate Information
                              </Title>
                              <Text c="dimmed" size="sm">
                                Ethiopian license plate format details
                              </Text>
                            </Box>
                          </Flex>
                          
                          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
                            <Select
                              name="plateType"
                              label={
                                <Text fw={600} size="sm">
                                  Plate Type <Text span c={PRIMARY_COLOR}>*</Text>
                                </Text>
                              }
                              data={['National', 'Diplomatic', 'Government', 'Police', 'Military', 'Temporary']}
                              radius="md"
                              placeholder="Select type"
                              required
                            />
                            <Select
                              name="region"
                              label={
                                <Text fw={600} size="sm">
                                  Region <Text span c={PRIMARY_COLOR}>*</Text>
                                </Text>
                              }
                              data={regionOptions}
                              radius="md"
                              placeholder="Select region"
                              searchable
                              required
                            />
                            <Select
                              name="code"
                              label={
                                <Text fw={600} size="sm">
                                  Code <Text span c={PRIMARY_COLOR}>*</Text>
                                </Text>
                              }
                              data={Array.from({ length: 10 }, (_, i) => (i + 1).toString())}
                              radius="md"
                              placeholder="Select code"
                              required
                            />
                          </SimpleGrid>
                          
                          <TextInput
                            name="plateNumber"
                            label={
                              <Text fw={600} size="sm">
                                Plate Number <Text span c={PRIMARY_COLOR}>*</Text>
                              </Text>
                            }
                            placeholder="Enter plate number (e.g., AA-12345)"
                            radius="md"
                            description="Format: RegionCode-Number (e.g., AA-12345 for Addis Ababa)"
                            required
                            styles={{
                              input: {
                                borderColor: LIGHT_BG,
                                fontFamily: 'monospace',
                                fontSize: '1.1em',
                                fontWeight: 700,
                                letterSpacing: '1px',
                                color: PRIMARY_DARK,
                                ':focus': {
                                  borderColor: PRIMARY_COLOR,
                                  boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                                }
                              },
                              description: {
                                color: PRIMARY_COLOR,
                                fontWeight: 500,
                              }
                            }}
                          />
                        </Card>

                        {/* Vehicle Images Upload */}
                        <Card
                          withBorder
                          radius="lg"
                          padding="xl"
                          style={{
                            borderStyle: 'dashed',
                            borderColor: PRIMARY_LIGHT,
                            background: 'white',
                            borderWidth: 2,
                          }}
                        >
                          <Flex direction="column" align="center" gap="md">
                            <Box
                              style={{
                                background: PRIMARY_GRADIENT,
                                padding: '20px',
                                borderRadius: '50%',
                                color: 'white',
                              }}
                            >
                              <IconPhoto size={40} />
                            </Box>
                            <Box ta="center">
                              <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }} mb="xs">
                                Vehicle Images
                              </Text>
                              <Text c="dimmed" size="sm">
                                Upload clear images from multiple angles for better identification
                              </Text>
                            </Box>
                            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" w="100%">
                              {['Front', 'Back', 'Left Side', 'Right Side'].map((angle, idx) => (
                                <Card
                                  key={idx}
                                  withBorder
                                  padding="lg"
                                  radius="md"
                                  style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    borderColor: LIGHT_BG,
                                    ':hover': {
                                      borderColor: PRIMARY_COLOR,
                                      backgroundColor: LIGHT_BG,
                                      transform: 'translateY(-4px)',
                                      boxShadow: `0 8px 20px ${PRIMARY_COLOR}15`,
                                    }
                                  }}
                                >
                                  <Flex direction="column" align="center" gap="xs">
                                    <Box
                                      style={{
                                        background: LIGHT_BG,
                                        padding: '12px',
                                        borderRadius: '10px',
                                        color: PRIMARY_COLOR,
                                      }}
                                    >
                                      <IconCamera size={24} />
                                    </Box>
                                    <Text size="sm" fw={600} style={{ color: PRIMARY_DARK }}>
                                      {angle} View
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                      Click to upload
                                    </Text>
                                  </Flex>
                                </Card>
                              ))}
                            </SimpleGrid>
                            <Badge color="blue" variant="light" size="sm" mt="sm">
                              Up to 10 images allowed • Max 5MB each
                            </Badge>
                          </Flex>
                        </Card>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* Last Seen Information - Step 2 */}
              {activeStep === 2 && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        style={{
                          borderLeft: `4px solid ${PRIMARY_COLOR}`,
                          background: CARD_BG,
                        }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box
                            style={{
                              background: PRIMARY_GRADIENT,
                              padding: '10px',
                              borderRadius: '10px',
                              color: 'white',
                            }}
                          >
                            <IconMap size={24} />
                          </Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>
                              Last Known Information
                            </Title>
                            <Text c="dimmed" size="sm">
                              Where and when was the {regType.toLowerCase()} last seen?
                            </Text>
                          </Box>
                        </Flex>
                        
                        <TextInput
                          name="location"
                          label={
                            <Text fw={600} size="sm">
                              Last Seen Location <Text span c={PRIMARY_COLOR}>*</Text>
                            </Text>
                          }
                          placeholder="Enter city, specific address, or landmark"
                          leftSection={<IconMapPin size={18} color={PRIMARY_COLOR} />}
                          radius="md"
                          mb="lg"
                          required
                          styles={{
                            input: {
                              borderColor: LIGHT_BG,
                              ':focus': {
                                borderColor: PRIMARY_COLOR,
                                boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                              }
                            }
                          }}
                        />
                        
                        {/* Interactive Map Placeholder */}
                        <Card
                          withBorder
                          radius="lg"
                          padding={0}
                          mb="lg"
                          style={{
                            height: isMobile ? 200 : 300,
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            borderColor: PRIMARY_LIGHT,
                            ':hover': {
                              borderColor: PRIMARY_COLOR,
                              boxShadow: `0 12px 30px ${PRIMARY_COLOR}20`,
                              transform: 'translateY(-2px)'
                            }
                          }}
                          onClick={() => {
                            notifications.show({
                              title: 'Map Integration',
                              message: 'Interactive map feature would open here',
                              color: 'blue',
                              styles: { root: { borderColor: PRIMARY_COLOR } }
                            });
                          }}
                        >
                          <Flex
                            direction="column"
                            align="center"
                            justify="center"
                            gap="md"
                            style={{ 
                              height: '100%', 
                              background: PRIMARY_GRADIENT,
                              padding: '20px',
                            }}
                          >
                            <IconMap size={isMobile ? 40 : 60} color="white" />
                            <Text c="white" fw={700} size={isMobile ? "md" : "lg"}>
                              Interactive Location Map
                            </Text>
                            <Text c="white" size="sm" ta="center" opacity={0.9}>
                              Click to select exact location on map
                              <br />
                              <Text span size="xs">(GPS coordinates will be captured)</Text>
                            </Text>
                            <Badge 
                              color="white" 
                              variant="filled" 
                              size="lg"
                              style={{ color: PRIMARY_COLOR, fontWeight: 700 }}
                            >
                              CLICK TO OPEN MAP
                            </Badge>
                          </Flex>
                        </Card>
                        
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                          <TextInput
                            name="lastSeenDate"
                            label={
                              <Text fw={600} size="sm">
                                Last Seen Date <Text span c={PRIMARY_COLOR}>*</Text>
                              </Text>
                            }
                            placeholder="YYYY-MM-DD"
                            radius="md"
                            required
                            type="date"
                            max={new Date().toISOString().split('T')[0]}
                            leftSection={<IconCalendar size={18} color={PRIMARY_COLOR} />}
                            styles={{
                              input: {
                                borderColor: LIGHT_BG,
                                ':focus': {
                                  borderColor: PRIMARY_COLOR,
                                  boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                                }
                              }
                            }}
                          />
                          <TextInput
                            name="lastSeenTime"
                            label={
                              <Text fw={600} size="sm">
                                Approximate Time
                              </Text>
                            }
                            placeholder="HH:MM (24-hour format)"
                            radius="md"
                            type="time"
                            leftSection={<IconClock size={18} color={PRIMARY_COLOR} />}
                            styles={{
                              input: {
                                borderColor: LIGHT_BG,
                                ':focus': {
                                  borderColor: PRIMARY_COLOR,
                                  boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                                }
                              }
                            }}
                          />
                        </SimpleGrid>
                        
                        <Alert
                          icon={<IconInfoCircle size={18} color={PRIMARY_COLOR} />}
                          title="Accuracy Matters"
                          color="blue"
                          variant="light"
                          radius="md"
                          mt="lg"
                          style={{ borderColor: PRIMARY_LIGHT }}
                        >
                          <Text size="sm">
                            The more accurate your location and time information, the better chance we have 
                            of finding the missing {regType.toLowerCase()}.
                          </Text>
                        </Alert>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* Contact Information - Step 3 */}
              {activeStep === 3 && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        style={{
                          borderLeft: `4px solid ${PRIMARY_COLOR}`,
                          background: CARD_BG,
                        }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box
                            style={{
                              background: PRIMARY_GRADIENT,
                              padding: '10px',
                              borderRadius: '10px',
                              color: 'white',
                            }}
                          >
                            <IconMessageCircle size={24} />
                          </Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>
                              Contact Information
                            </Title>
                            <Text c="dimmed" size="sm">
                              How can people contact you with information?
                            </Text>
                          </Box>
                        </Flex>

                        {/* Primary Contact Cards */}
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="lg">
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            style={{
                              background: 'white',
                              borderColor: PRIMARY_LIGHT,
                              transition: 'all 0.3s ease',
                              ':hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 20px ${PRIMARY_COLOR}10`,
                              }
                            }}
                          >
                            <Flex align="center" gap="md">
                              <Avatar color={PRIMARY_COLOR} radius="xl" style={{ background: PRIMARY_GRADIENT }}>
                                <IconUser size={20} />
                              </Avatar>
                              <Box>
                                <Text size="xs" c="dimmed" fw={600}>Name</Text>
                                <Text fw={700} style={{ color: PRIMARY_DARK }}>
                                  {currentUser?.firstName} {currentUser?.lastName}
                                </Text>
                              </Box>
                            </Flex>
                          </Card>
                          
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            style={{
                              background: 'white',
                              borderColor: PRIMARY_LIGHT,
                              transition: 'all 0.3s ease',
                              ':hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 20px ${PRIMARY_COLOR}10`,
                              }
                            }}
                          >
                            <Flex align="center" gap="md">
                              <Avatar color="green" radius="xl" style={{ background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)' }}>
                                <IconMail size={20} />
                              </Avatar>
                              <Box>
                                <Text size="xs" c="dimmed" fw={600}>Email</Text>
                                <Text fw={700} style={{ color: PRIMARY_DARK }}>
                                  {currentUser?.email}
                                </Text>
                              </Box>
                            </Flex>
                          </Card>
                          
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            style={{
                              background: 'white',
                              borderColor: PRIMARY_LIGHT,
                              transition: 'all 0.3s ease',
                              ':hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 20px ${PRIMARY_COLOR}10`,
                              }
                            }}
                          >
                            <Flex align="center" gap="md">
                              <Avatar color="red" radius="xl" style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' }}>
                                <IconPhone size={20} />
                              </Avatar>
                              <Box>
                                <Text size="xs" c="dimmed" fw={600}>Phone</Text>
                                <Text fw={700} style={{ color: PRIMARY_DARK }}>
                                  {currentUser?.phone}
                                </Text>
                              </Box>
                            </Flex>
                          </Card>
                          
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            style={{
                              background: 'white',
                              borderColor: PRIMARY_LIGHT,
                              transition: 'all 0.3s ease',
                              ':hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 8px 20px ${PRIMARY_COLOR}10`,
                              }
                            }}
                          >
                            <Flex align="center" gap="md">
                              <Avatar color="grape" radius="xl" style={{ background: 'linear-gradient(135deg, #cc66ff 0%, #9933ff 100%)' }}>
                                <IconWorld size={20} />
                              </Avatar>
                              <Box>
                                <Text size="xs" c="dimmed" fw={600}>Role</Text>
                                <Badge 
                                  color="blue" 
                                  variant="light" 
                                  size="sm"
                                  style={{ 
                                    background: `${PRIMARY_COLOR}15`,
                                    color: PRIMARY_COLOR,
                                    fontWeight: 700,
                                    border: `1px solid ${PRIMARY_COLOR}30`,
                                  }}
                                >
                                  {currentUser?.role || 'User'}
                                </Badge>
                              </Box>
                            </Flex>
                          </Card>
                        </SimpleGrid>

                        {/* Telegram Section */}
                        <Card
                          withBorder
                          padding="lg"
                          radius="lg"
                          mb="md"
                          style={{
                            background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                            borderColor: '#0088cc',
                            borderWidth: 2,
                          }}
                        >
                          <Flex align="center" gap="md" mb="md">
                            <IconBrandTelegram size={28} color="#0088cc" />
                            <Box>
                              <Text fw={700} size="lg" style={{ color: '#0088cc' }}>
                                Telegram Contact (Optional)
                              </Text>
                              <Text size="sm" c="dimmed">
                                Add your Telegram username for faster, secure communication
                              </Text>
                            </Box>
                          </Flex>
                          
                          <TextInput
                            name="telegramUsername"
                            placeholder="username (without @ symbol)"
                            radius="md"
                            leftSection={<Text c="#0088cc" fw={700}>@</Text>}
                            description="People with information can contact you quickly via Telegram"
                            styles={{
                              root: { marginBottom: 8 },
                              input: {
                                borderColor: '#0088cc',
                                ':focus': {
                                  borderColor: '#0088cc',
                                  boxShadow: '0 0 0 2px rgba(0, 136, 204, 0.2)'
                                }
                              },
                              description: {
                                color: '#0088cc',
                                fontWeight: 500,
                              }
                            }}
                          />
                          <Text size="xs" c="dimmed" mt="xs">
                            • Telegram provides end-to-end encryption for privacy
                            <br />
                            • Faster than email for urgent communications
                            <br />
                            • You can share photos and location easily
                          </Text>
                        </Card>

                        {/* Additional Contact Info */}
                        <Textarea
                          name="additionalContactInfo"
                          label={
                            <Text fw={600} size="sm">
                              Additional Contact Methods
                            </Text>
                          }
                          placeholder="Any other ways people can contact you (e.g., other social media profiles, alternative phone numbers, WhatsApp, etc.)"
                          description="Optional: Add any other contact methods or special instructions"
                          minRows={3}
                          radius="md"
                          mb="lg"
                          styles={{
                            input: {
                              borderColor: LIGHT_BG,
                              ':focus': {
                                borderColor: PRIMARY_COLOR,
                                boxShadow: `0 0 0 2px ${PRIMARY_COLOR}20`,
                              }
                            }
                          }}
                        />

                        {/* Privacy Notice */}
                        <Alert
                          icon={<IconLock size={20} color={PRIMARY_COLOR} />}
                          title="Your Privacy & Security"
                          color="blue"
                          variant="light"
                          radius="md"
                          style={{ 
                            borderColor: PRIMARY_COLOR,
                            background: `${PRIMARY_COLOR}08`,
                          }}
                        >
                          <Stack gap="xs">
                            <Text size="sm">
                              <IconShieldCheck size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: PRIMARY_COLOR }} />
                              Your contact information is protected with end-to-end encryption
                            </Text>
                            <Text size="sm">
                              <IconEyeOff size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: PRIMARY_COLOR }} />
                              Only verified users with relevant information can see your contact details
                            </Text>
                            <Text size="sm">
                              <IconInfoCircle size={16} style={{ marginRight: 8, verticalAlign: 'middle', color: PRIMARY_COLOR }} />
                              We never share your personal data with third parties or advertisers
                            </Text>
                          </Stack>
                        </Alert>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* Review & Submit - Step 4 */}
              {activeStep === 4 && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        style={{
                          borderLeft: `4px solid ${PRIMARY_COLOR}`,
                          background: CARD_BG,
                        }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box
                            style={{
                              background: PRIMARY_GRADIENT,
                              padding: '10px',
                              borderRadius: '10px',
                              color: 'white',
                            }}
                          >
                            <IconCheck size={24} />
                          </Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>
                              Review & Submit Your Report
                            </Title>
                            <Text c="dimmed" size="sm">
                              Please review all information before final submission
                            </Text>
                          </Box>
                        </Flex>
                        
                        <Text size="sm" c="dimmed" mb="xl" ta="center">
                          Youre almost done! Take a moment to verify all details are correct.
                        </Text>

                        {/* Summary Cards */}
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb="xl">
                          <Card 
                            withBorder 
                            padding="lg" 
                            radius="md"
                            style={{
                              background: 'white',
                              borderColor: PRIMARY_LIGHT,
                            }}
                          >
                            <Text size="sm" c="dimmed" mb="xs">Report Type</Text>
                            <Badge
                              size="lg"
                              style={{ 
                                background: PRIMARY_GRADIENT,
                                color: 'white',
                                fontWeight: 700,
                                padding: '8px 16px',
                              }}
                              leftSection={regType === 'Person' ? <IconUserPlus size={16} /> : <IconCar size={16} />}
                            >
                              Missing {regType}
                            </Badge>
                          </Card>
                          
                          <Card 
                            withBorder 
                            padding="lg" 
                            radius="md"
                            style={{
                              background: 'white',
                              borderColor: PRIMARY_LIGHT,
                            }}
                          >
                            <Text size="sm" c="dimmed" mb="xs">Reporter</Text>
                            <Text fw={700} style={{ color: PRIMARY_DARK }}>
                              {currentUser?.firstName} {currentUser?.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">{currentUser?.email}</Text>
                          </Card>
                          
                          <Card 
                            withBorder 
                            padding="lg" 
                            radius="md"
                            style={{
                              background: 'white',
                              borderColor: PRIMARY_LIGHT,
                            }}
                          >
                            <Text size="sm" c="dimmed" mb="xs">Report Status</Text>
                            <Badge 
                              color="green" 
                              variant="light" 
                              size="lg"
                              style={{ 
                                background: '#d4edda',
                                color: '#155724',
                                fontWeight: 700,
                              }}
                            >
                              Ready to Submit
                            </Badge>
                          </Card>
                        </SimpleGrid>

                        {/* Confirmation Check */}
                        <Card
                          withBorder
                          padding="lg"
                          radius="md"
                          mb="xl"
                          style={{
                            background: 'white',
                            borderColor: '#40c057',
                            borderWidth: 2,
                            boxShadow: '0 4px 20px rgba(64, 192, 87, 0.1)',
                          }}
                        >
                          <Flex align="center" gap="md">
                            <IconCheck color="#40c057" size={24} />
                            <Box style={{ flex: 1 }}>
                              <Text fw={700} style={{ color: '#155724' }}>Final Confirmation</Text>
                              <Text size="sm" c="dimmed">
                                I confirm that all information provided is accurate to the best of my knowledge
                              </Text>
                            </Box>
                            <Checkbox
                              size="lg"
                              color="green"
                              defaultChecked
                              styles={{
                                input: {
                                  borderColor: '#40c057',
                                  backgroundColor: 'white',
                                  ':checked': {
                                    backgroundColor: '#40c057',
                                    borderColor: '#40c057',
                                  }
                                }
                              }}
                            />
                          </Flex>
                        </Card>

                        {/* Final Submit Button with Animation */}
                        <Button
                          type="submit"
                          size="lg"
                          radius="xl"
                          loading={isSubmitting}
                          disabled={isSubmitting}
                          fullWidth
                          style={{
                            background: isSubmitting 
                              ? PRIMARY_COLOR 
                              : PRIMARY_GRADIENT,
                            border: 'none',
                            boxShadow: `0 8px 30px ${PRIMARY_COLOR}40`,
                            transition: 'all 0.3s ease',
                            height: '60px',
                            fontSize: '18px',
                            fontWeight: 800,
                            letterSpacing: '0.5px',
                            ':hover': !isSubmitting ? {
                              transform: 'translateY(-3px)',
                              boxShadow: `0 12px 40px ${PRIMARY_COLOR}60`,
                              background: PRIMARY_GRADIENT_HOVER,
                            } : {},
                            ':active': !isSubmitting ? {
                              transform: 'translateY(-1px)',
                            } : {},
                          }}
                          rightSection={!isSubmitting && (
                            <Box
                              style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                padding: '8px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <IconArrowRight size={22} />
                            </Box>
                          )}
                        >
                          {isSubmitting ? (
                            <Flex align="center" justify="center" gap="sm">
                              <Loader size="sm" color="white" />
                              <span>Submitting Your Report...</span>
                            </Flex>
                          ) : (
                            <Flex align="center" justify="center" gap="sm">
                              <IconShieldCheck size={22} />
                              <span>SUBMIT REPORT NOW</span>
                            </Flex>
                          )}
                        </Button>
                        
                        <Text size="xs" c="dimmed" ta="center" mt="md">
                          <IconLock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                          Your submission is secure and encrypted
                        </Text>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* Navigation Buttons */}
              <Flex justify="space-between" mt="xl" gap="md" wrap="wrap">
                <Button
                  variant="light"
                  color="gray"
                  size="md"
                  radius="xl"
                  leftSection={<IconChevronLeft size={18} />}
                  onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
                  disabled={activeStep === 0 || isSubmitting}
                  style={{
                    padding: '12px 24px',
                    border: `1px solid ${LIGHT_BG}`,
                    fontWeight: 600,
                  }}
                >
                  Previous Step
                </Button>
                
                <Flex gap="md" style={{ flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                  <Button
                    variant="outline"
                    color="gray"
                    size="md"
                    radius="xl"
                    leftSection={<IconRefresh size={16} />}
                    onClick={() => {
                      setActiveStep(0);
                      setImagePreview(null);
                      setSelectedBrand(null);
                      setSelectedModel(null);
                      setSelectedSubmodel(null);
                      notifications.show({
                        title: 'Form Reset',
                        message: 'All form data has been cleared',
                        color: 'blue',
                        icon: <IconRefresh size={16} />,
                      });
                    }}
                    disabled={isSubmitting}
                    style={{
                      padding: '12px 24px',
                      borderColor: LIGHT_BG,
                      fontWeight: 600,
                    }}
                  >
                    Reset Form
                  </Button>
                  
                  {activeStep < steps.length - 1 ? (
                    <Button
                      size="md"
                      radius="xl"
                      rightSection={<IconChevronRight size={18} />}
                      onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
                      disabled={isSubmitting}
                      style={{
                        padding: '12px 30px',
                        background: PRIMARY_GRADIENT,
                        border: 'none',
                        fontWeight: 700,
                        ':hover': {
                          background: PRIMARY_GRADIENT_HOVER,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${PRIMARY_COLOR}40`,
                        }
                      }}
                    >
                      Continue to {steps[activeStep + 1]?.label}
                    </Button>
                  ) : null}
                </Flex>
              </Flex>

              <Divider my="md" color={LIGHT_BG} />

              <Text size="xs" c="dimmed" ta="center">
                <IconInfoCircle size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Need assistance? Contact support@findr.com | Your data is protected with 256-bit SSL encryption
                <br />
                <Text span size="xs" c={PRIMARY_COLOR} fw={600}>
                  Report ID will be generated upon successful submission
                </Text>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Container>

      {/* Contact Information Modal */}
      <Modal
        opened={showContactModal}
        onClose={() => setShowContactModal(false)}
        title={
          <Flex align="center" gap="sm">
            <IconShieldCheck size={20} color={PRIMARY_COLOR} />
            <Text style={{ color: PRIMARY_DARK, fontWeight: 700 }}>
              Your Contact & Security Settings
            </Text>
          </Flex>
        }
        size="md"
        radius="lg"
        centered
        styles={{
          header: { borderBottom: `2px solid ${LIGHT_BG}` },
          content: { border: `2px solid ${PRIMARY_COLOR}` }
        }}
      >
        <Stack gap="md">
          <Flex align="center" gap="md">
            <Avatar
              size="lg"
              radius="xl"
              src={currentUser?.avatar}
              style={{ 
                background: PRIMARY_GRADIENT,
                border: `3px solid ${LIGHT_BG}`,
              }}
            >
              {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
            </Avatar>
            <Box>
              <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }}>
                {currentUser?.firstName} {currentUser?.lastName}
              </Text>
              <Text size="sm" c="dimmed">{currentUser?.role || 'Registered User'}</Text>
            </Box>
          </Flex>
          
          <Divider color={LIGHT_BG} />
          
          <SimpleGrid cols={2} spacing="md">
            <Box>
              <Text size="xs" c="dimmed" fw={600}>Email Address</Text>
              <Text fw={600} size="sm" style={{ color: PRIMARY_DARK }}>
                {currentUser?.email}
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" fw={600}>Phone Number</Text>
              <Text fw={600} size="sm" style={{ color: PRIMARY_DARK }}>
                {currentUser?.phone}
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" fw={600}>Total Reports</Text>
              <Badge 
                color="blue" 
                variant="light" 
                size="sm"
                style={{ 
                  background: `${PRIMARY_COLOR}15`,
                  color: PRIMARY_COLOR,
                  fontWeight: 700,
                }}
              >
                {currentUser?.registrations || 0} submitted
              </Badge>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" fw={600}>Account Status</Text>
              <Badge 
                color={currentUser?.isActive ? 'green' : 'red'} 
                variant="light"
                size="sm"
                style={{ fontWeight: 700 }}
              >
                {currentUser?.isActive ? '✓ Active' : '✗ Inactive'}
              </Badge>
            </Box>
          </SimpleGrid>
          
          <Alert
            icon={<IconLock size={16} color={PRIMARY_COLOR} />}
            title="Security Status"
            color="blue"
            variant="light"
            radius="md"
            style={{ borderColor: PRIMARY_LIGHT }}
          >
            <Text size="xs">
              Your account is protected with:
              <br />
              • Two-factor authentication available
              <br />
              • End-to-end encrypted communications
              <br />
              • Regular security audits
            </Text>
          </Alert>
          
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            onClick={() => router.push('/profile')}
            rightSection={<IconExternalLink size={16} />}
            style={{
              background: `${PRIMARY_COLOR}10`,
              border: `1px solid ${PRIMARY_COLOR}30`,
              fontWeight: 600,
            }}
          >
            Update Profile & Settings
          </Button>
        </Stack>
      </Modal>

      {/* Custom CSS for Enhanced Animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 10px ${PRIMARY_COLOR}40;
          }
          50% {
            box-shadow: 0 0 20px ${PRIMARY_COLOR}80, 0 0 30px ${PRIMARY_COLOR}40;
          }
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px ${PRIMARY_COLOR}20;
        }
        
        .gradient-text {
          background: ${PRIMARY_GRADIENT};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .primary-border {
          border-color: ${PRIMARY_COLOR} !important;
        }
        
        .primary-bg {
          background: ${PRIMARY_GRADIENT} !important;
        }
        
        .light-bg {
          background: ${LIGHT_BG} !important;
        }
        
        .card-bg {
          background: ${CARD_BG} !important;
        }
        
        .glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .mobile-stack {
            flex-direction: column !important;
          }
          
          .mobile-full-width {
            width: 100% !important;
          }
          
          .mobile-center {
            text-align: center !important;
          }
          
          .mobile-padding {
            padding: 16px !important;
          }
        }
        
        /* Smooth transitions for form elements */
        input, select, textarea {
          transition: all 0.2s ease !important;
        }
        
        /* Enhanced focus styles */
        input:focus, select:focus, textarea:focus {
          border-color: ${PRIMARY_COLOR} !important;
          box-shadow: 0 0 0 3px ${PRIMARY_COLOR}20 !important;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: ${LIGHT_BG};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: ${PRIMARY_COLOR};
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: ${PRIMARY_DARK};
        }
        
        /* Selection color */
        ::selection {
          background: ${PRIMARY_COLOR}40;
          color: ${PRIMARY_DARK};
        }
        
        /* Button animations */
        .btn-pulse {
          animation: pulse 2s infinite;
        }
        
        /* Floating animation */
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Loading skeleton */
        .skeleton {
          background: linear-gradient(90deg, ${LIGHT_BG} 25%, #f8fbff 50%, ${LIGHT_BG} 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <MainFooter />
    </Box>
  );
}