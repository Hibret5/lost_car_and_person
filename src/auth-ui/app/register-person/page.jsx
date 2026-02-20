'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Container, Box, Title, Text, TextInput, Select, NumberInput,
  Textarea, SimpleGrid, Paper, Button, Group, FileInput, Stack,
  Loader, Alert, Badge, Divider, Flex, Stepper, Progress,
  Card, Tabs, Transition, Collapse, ActionIcon, Tooltip,
  Avatar, Modal, useMantineTheme, Overlay, Center,
  Radio, Checkbox, useMantineColorScheme
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
  IconHome, IconDashboard, IconFileDescription,
  IconAlertTriangle
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

// Theme constants (primary color stays the same in both modes)
const PRIMARY_COLOR = '#0034D1';
const PRIMARY_LIGHT = '#4d79ff';
const PRIMARY_DARK = '#0029a8';
const PRIMARY_GRADIENT = `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #0066ff 100%)`;
const PRIMARY_GRADIENT_HOVER = `linear-gradient(135deg, ${PRIMARY_DARK} 0%, #0052d4 100%)`;

// Helper to get dynamic background/text colors
const getBg = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);
const getTextColor = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);

// Reusable style objects (will be used inside component where theme & colorScheme are available)
const cardBorderLeft = (colorScheme) => ({ borderLeft: `4px solid ${PRIMARY_COLOR}` });
const gradientIconBox = { background: PRIMARY_GRADIENT, padding: '10px', borderRadius: '10px', color: 'white' };

export default function UnifiedRegisterPage() {
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
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
  const [ownershipDoc, setOwnershipDoc] = useState(null);

  // Special case states
  const [specialCategory, setSpecialCategory] = useState(null);
  const [doctorReport, setDoctorReport] = useState(null);
  const [criminalRecord, setCriminalRecord] = useState(null);

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
    { 
      label: regType === 'Person' ? 'Person Details' : 
              regType === 'Vehicle' ? 'Vehicle Details' : 
              'Special Case Details', 
      icon: regType === 'Person' ? <IconUserPlus size={18} /> : 
            regType === 'Vehicle' ? <IconCar size={18} /> : 
            <IconAlertTriangle size={18} />
    },
    { label: 'Last Seen', icon: <IconMap size={18} /> },
    { label: 'Contact Info', icon: <IconMessageCircle size={18} /> },
    { label: 'Review & Submit', icon: <IconCheck size={18} /> },
  ];

  // Check registration count and authentication on page load
  useEffect(() => {
    const checkRegistrationAndAuth = async () => {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userData = localStorage.getItem('currentUser');

        if (!isAuthenticated || !userData || isAuthenticated !== 'true') {
          sessionStorage.setItem('redirectUrl', window.location.pathname);
          notifications.show({ title: 'Login Required', message: 'Please login to submit a report', color: 'yellow', icon: <IconAlertCircle size={20} /> });
          router.push('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        const response = await fetch(`${USERS_API}/${parsedUser.id}`);
        if (response.ok) {
          const userFromServer = await response.json();
          setCurrentUser(userFromServer);
          if (!userFromServer.isActive) {
            notifications.show({ title: 'Account Inactive', message: 'Your account has been deactivated. Please contact support.', color: 'red', icon: <IconAlertCircle size={20} /> });
            router.push('/login');
            return;
          }
          const registrationCount = userFromServer.registrations || 0;
          if (registrationCount >= 1 && !userFromServer.hasPaidSubscription) {
            setShowSubscriptionRedirect(true);
            setTimeout(() => router.push('/subscribe'), 3000);
            setLoading(false);
            return;
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
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Function to save data to JSON Server
  const saveToJsonServer = async (data) => {
    try {
      const endpoint = regType === 'Vehicle' ? MISSING_VEHICLES_API : MISSING_PERSONS_API;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`Failed to save data: ${response.statusText}`);
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrations: newCount, updatedAt: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error('Failed to update user registration count');
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
      const formData = new FormData(e.target);
      const formObject = Object.fromEntries(formData.entries());

      // Add file names to formObject (actual file upload would be handled separately)
      if (ownershipDoc) formObject.ownershipDocument = ownershipDoc.name;
      if (doctorReport) formObject.doctorReport = doctorReport.name;
      if (criminalRecord) formObject.criminalRecord = criminalRecord.name;

      const caseId = `CASE-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
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

      const savedData = await saveToJsonServer(reportData);
      const currentRegistrations = currentUser.registrations || 0;
      const newCount = currentRegistrations + 1;
      const updatedUser = await updateUserRegistrationCount(currentUser.id, newCount);
      const newUserData = { ...currentUser, registrations: newCount, updatedAt: updatedUser.updatedAt };
      setCurrentUser(newUserData);
      localStorage.setItem('currentUser', JSON.stringify(newUserData));

      notifications.show({
        title: '🎉 Report Submitted Successfully!',
        message: (
          <div>
            <p><strong>Case ID:</strong> {caseId}</p>
            <p>
              {regType === 'Person' && `Person: ${formObject.firstName} ${formObject.lastName}`}
              {regType === 'Vehicle' && `Vehicle: ${formObject.brand} ${formObject.model} - ${formObject.plateNumber}`}
              {regType === 'Special' && `Special Case: ${formObject.firstName} ${formObject.lastName} (${formObject.specialCategory === 'mentally-ill' ? 'Mentally Ill' : 'Criminal Background'})`}
            </p>
            <Text size="sm" c="dimmed" mt={5}>We will contact you if we find any matches. {formObject.telegramUsername && `You can also be contacted via Telegram: @${formObject.telegramUsername}`}</Text>
          </div>
        ),
        color: 'blue',
        icon: <IconCheck size={20} />,
        autoClose: 10000,
        withCloseButton: true,
        withBorder: true,
        position: 'top-right',
      });

      setTimeout(() => router.push('/'), 1500);
    } catch (error) {
      console.error('Error submitting report:', error);
      notifications.show({ title: 'Submission Failed', message: 'Failed to submit report. Please try again.', color: 'red', icon: <IconAlertCircle size={20} /> });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
        style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: PRIMARY_GRADIENT }}
      >
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
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: PRIMARY_GRADIENT }}>
        <Container size="sm">
          <Alert icon={<IconAlertCircle size={24} />} title="Subscription Required" color="blue" variant="filled" radius="lg" p="xl" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 52, 209, 0.95)', border: '2px solid white' }}>
            <Stack gap="md">
              <Flex align="center" gap="md">
                <IconStar size={32} color="gold" />
                <Box>
                  <Text c="white" size="lg" fw={700}>Upgrade to Premium</Text>
                  <Text c="white" opacity={0.9}>You have already registered 1 {regType.toLowerCase()}.</Text>
                </Box>
              </Flex>
              <Text c="white">To register additional {regType === 'Person' ? 'people' : 'vehicles'}, you need to subscribe to a premium plan.</Text>
              <Box style={{ background: 'rgba(255, 255, 255, 0.1)', padding: 'md', borderRadius: 'md', border: '1px dashed rgba(255, 255, 255, 0.3)' }}>
                <Text c="white" size="sm" fw={600} ta="center">Premium Benefits:</Text>
                <SimpleGrid cols={2} spacing="xs" mt="xs">
                  <Flex align="center" gap="xs"><IconCheck size={14} color="#4dff4d" /><Text c="white" size="xs">Unlimited Reports</Text></Flex>
                  <Flex align="center" gap="xs"><IconCheck size={14} color="#4dff4d" /><Text c="white" size="xs">Priority Support</Text></Flex>
                  <Flex align="center" gap="xs"><IconCheck size={14} color="#4dff4d" /><Text c="white" size="xs">Advanced Search</Text></Flex>
                  <Flex align="center" gap="xs"><IconCheck size={14} color="#4dff4d" /><Text c="white" size="xs">Real-time Updates</Text></Flex>
                </SimpleGrid>
              </Box>
              <Text c="white" size="sm" ta="center">Redirecting to subscription page in 3 seconds...</Text>
              <Button color="yellow" size="lg" radius="xl" onClick={() => router.push('/subscribe')} mt="md" rightSection={<IconArrowRight size={20} />} style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)', fontWeight: 700, color: '#0034D1' }}>View Premium Plans</Button>
            </Stack>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: isMobile
          ? getBg(colorScheme, '#f0f5ff', theme.colors.dark[7])
          : colorScheme === 'dark'
            ? `radial-gradient(circle at 10% 20%, rgba(0, 52, 209, 0.3) 0%, ${theme.colors.dark[7]} 100%)`
            : `radial-gradient(circle at 10% 20%, rgba(0, 52, 209, 0.05) 0%, #ffffff 100%)`,
        position: 'relative',
      }}
    >
      {/* Floating Help Button */}
      <Tooltip label="Quick Help & Tips" position="left" withArrow>
        <ActionIcon
          size="lg"
          radius="xl"
          variant="filled"
          style={{
            position: 'fixed', bottom: 20, right: 20, zIndex: 100,
            background: PRIMARY_GRADIENT,
            boxShadow: `0 6px 20px ${PRIMARY_COLOR}40`,
            border: `2px solid white`,
            transition: 'all 0.3s ease',
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
          bg={getBg(colorScheme, 'white', theme.colors.dark[6])}
          style={{
            position: 'fixed', bottom: 80, right: 20, zIndex: 99, maxWidth: 350,
            backdropFilter: 'blur(10px)',
            border: `2px solid ${PRIMARY_COLOR}`,
            boxShadow: `0 10px 40px rgba(0, 52, 209, 0.2)`,
          }}
        >
          <Flex justify="space-between" align="center" mb="xs">
            <Text size="sm" fw={700} c={PRIMARY_COLOR}><IconInfoCircle size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />Quick Guide</Text>
            <Badge color="blue" variant="light" size="sm">Step {activeStep + 1} of {steps.length}</Badge>
          </Flex>
          <Divider my="xs" color={getBg(colorScheme, theme.colors.gray[2], theme.colors.dark[5])} />
          <Stack gap="xs">
            <Text size="xs" c="dimmed">• All fields marked with <Text span c={PRIMARY_COLOR} fw={700}>*</Text> are required</Text>
            <Text size="xs" c="dimmed">• Use clear photos for better identification</Text>
            <Text size="xs" c="dimmed">• Provide accurate last seen location</Text>
            <Text size="xs" c="dimmed">• Add Telegram for faster communication</Text>
          </Stack>
          <Button size="xs" variant="light" color="blue" fullWidth mt="md" leftSection={<IconExternalLink size={14} />} style={{ border: `1px solid ${PRIMARY_COLOR}` }}>View Detailed Guide</Button>
        </Paper>
      </Collapse>

      {/* TOP HEADER WITH LOGO */}
      <Box
        bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
        style={{
          borderBottom: `2px solid ${getBg(colorScheme, '#f0f5ff', theme.colors.dark[5])}`,
          boxShadow: `0 2px 15px rgba(0, 52, 209, 0.1)`,
          position: 'sticky', top: 0, zIndex: 100,
        }}
      >
        <Container size="lg">
          <Flex justify="space-between" align="center" py="sm" direction={isMobile ? 'column' : 'row'} gap={isMobile ? 'md' : 'xs'}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Flex align="center" gap="md">
                <Box style={{ display: 'inline-block', height: '40px', width: 'auto', overflow: 'hidden' }}>
                  <Image src="/logo.jpg" alt="Logo" width={2040} height={952} style={{ height: '100%', width: 'auto' }} />
                </Box>
                <Box>
                  <Text size={isMobile ? 'lg' : 'xl'} fw={900} style={{ color: PRIMARY_COLOR, letterSpacing: '-0.5px' }}>Report</Text>
                  <Text size="xs" c={PRIMARY_DARK} fw={600} style={{ letterSpacing: '1px' }}>Missing Persons & Vehicles Registry</Text>
                </Box>
              </Flex>
            </Link>
            <Flex align="center" gap="lg">
              <Flex gap="xs">
                <Tooltip label="Dashboard" position="bottom">
                  <ActionIcon size="lg" radius="md" variant="light" color="blue" onClick={() => router.push('/')} style={{ border: `1px solid ${PRIMARY_COLOR}30` }}><IconDashboard size={20} /></ActionIcon>
                </Tooltip>
                <Tooltip label="Home" position="bottom">
                  <ActionIcon size="lg" radius="md" variant="light" color="blue" onClick={() => router.push('/')} style={{ border: `1px solid ${PRIMARY_COLOR}30` }}><IconHome size={20} /></ActionIcon>
                </Tooltip>
              </Flex>
              <Flex
                align="center"
                gap="sm"
                style={{
                  padding: '8px 16px',
                  background: getBg(colorScheme, '#f0f5ff', theme.colors.dark[6]),
                  borderRadius: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setShowContactModal(true)}
              >
                <Avatar
                  size="sm"
                  radius="xl"
                  src={currentUser?.avatar}
                  style={{ background: PRIMARY_GRADIENT, border: `2px solid white` }}
                >
                  {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
                </Avatar>
                <Box>
                  <Text size="sm" fw={600} style={{ color: PRIMARY_DARK }}>{currentUser?.firstName} {currentUser?.lastName}</Text>
                  <Text size="xs" c="dimmed">Report #{currentUser?.registrations ? currentUser.registrations + 1 : 1}</Text>
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Container>
      </Box>

      <Container size="lg" py={isMobile ? 20 : 40}>
        {/* Main Form Container */}
        <Paper
          radius="lg"
          p={isMobile ? 'md' : 'xl'}
          bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
          style={{
            border: `2px solid ${getBg(colorScheme, '#f0f5ff', theme.colors.dark[5])}`,
            boxShadow: `0 8px 30px rgba(0, 52, 209, 0.08)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Corner */}
          <Box style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: PRIMARY_GRADIENT, borderBottomLeftRadius: '100%', opacity: 0.05 }} />

          {/* Form Title with Icon */}
          <Flex justify="space-between" align="center" mb="xl" wrap="wrap" gap="md">
            <Flex align="center" gap="md">
              <Box style={{ background: PRIMARY_GRADIENT, padding: '14px', borderRadius: '14px', color: 'white', boxShadow: `0 6px 20px ${PRIMARY_COLOR}40` }}>
                {regType === 'Person' && <IconUserPlus size={32} />}
                {regType === 'Vehicle' && <IconCar size={32} />}
                {regType === 'Special' && <IconAlertTriangle size={32} />}
              </Box>
              <Box>
                <Title order={2} style={{ color: PRIMARY_DARK, fontWeight: 800 }}>
                  Register Missing {regType === 'Person' ? 'Person' : regType === 'Vehicle' ? 'Vehicle' : 'Special Case'}
                </Title>
                <Text c="dimmed" size="sm">Complete all sections below. Required fields are marked with <Text span c={PRIMARY_COLOR} fw={700} mx={4}>*</Text></Text>
              </Box>
            </Flex>

            {/* Registration Type Toggle with three tabs */}
            <Tabs
              value={regType}
              onChange={setRegType}
              variant="pills"
              radius="xl"
              style={{ minWidth: isMobile ? '100%' : 'auto' }}
            >
              <Tabs.List
                grow={isMobile}
                bg={getBg(colorScheme, '#f0f5ff', theme.colors.dark[6])}
              >
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
                <Tabs.Tab
                  value="Special"
                  leftSection={<IconAlertTriangle size={18} />}
                  style={{
                    background: regType === 'Special' ? PRIMARY_GRADIENT : 'transparent',
                    color: regType === 'Special' ? 'white' : PRIMARY_COLOR,
                    fontWeight: regType === 'Special' ? 700 : 500,
                    border: regType === 'Special' ? 'none' : `1px solid ${PRIMARY_COLOR}40`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  Special Case
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
              step: { cursor: 'pointer', transition: 'all 0.3s ease' },
              stepIcon: { borderWidth: 3, backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]) },
              stepCompleted: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
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
                        bg={getBg(colorScheme, '#f8fbff', theme.colors.dark[6])}
                        style={{ borderLeft: `4px solid ${PRIMARY_COLOR}`, transition: 'transform 0.3s ease' }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box style={gradientIconBox}><IconInfoCircle size={24} /></Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>Select Report Type</Title>
                            <Text c="dimmed" size="sm">Choose the type of report you want to submit</Text>
                          </Box>
                        </Flex>
                        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
                          {[
                            { type: 'Person', icon: <IconUserPlus size={28} />, label: 'Missing Person', desc: 'Report a missing individual' },
                            { type: 'Vehicle', icon: <IconCar size={28} />, label: 'Missing Vehicle', desc: 'Report a stolen/missing vehicle' },
                            { type: 'Special', icon: <IconAlertTriangle size={28} />, label: 'Special Case', desc: 'Report mentally ill / criminal persons' }
                          ].map(item => (
                            <Card
                              key={item.type}
                              withBorder
                              padding="xl"
                              radius="md"
                              bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                              style={{
                                cursor: 'pointer',
                                borderColor: regType === item.type ? PRIMARY_COLOR : getBg(colorScheme, '#f0f5ff', theme.colors.dark[5]),
                                borderWidth: regType === item.type ? 3 : 1,
                                transition: 'all 0.3s ease',
                                background: regType === item.type ? `${PRIMARY_COLOR}08` : getBg(colorScheme, 'white', theme.colors.dark[7]),
                                position: 'relative',
                                overflow: 'hidden',
                              }}
                              onClick={() => setRegType(item.type)}
                            >
                              {regType === item.type && (
                                <Box style={{ position: 'absolute', top: 10, right: 10, background: PRIMARY_COLOR, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                                  SELECTED
                                </Box>
                              )}
                              <Flex align="center" gap="md">
                                <Box
                                  style={{
                                    background: regType === item.type ? PRIMARY_GRADIENT : getBg(colorScheme, '#f0f5ff', theme.colors.dark[6]),
                                    padding: '16px',
                                    borderRadius: '12px',
                                    color: regType === item.type ? 'white' : PRIMARY_COLOR,
                                    transition: 'all 0.3s ease',
                                  }}
                                >
                                  {item.icon}
                                </Box>
                                <Box>
                                  <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }}>{item.label}</Text>
                                  <Text size="sm" c="dimmed" mt={4}>{item.desc}</Text>
                                </Box>
                              </Flex>
                              <Divider my="md" color={getBg(colorScheme, '#f0f5ff', theme.colors.dark[5])} />
                              <Text size="xs" c="dimmed">
                                {item.type === 'Person' && '• Personal details\n• Physical description\n• Last known location'}
                                {item.type === 'Vehicle' && '• Vehicle details\n• License plate\n• Last known location'}
                                {item.type === 'Special' && '• Person details\n• Special category (mentally ill/criminal)\n• Required documentation\n• Last known location'}
                              </Text>
                            </Card>
                          ))}
                        </SimpleGrid>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* Person Details - Step 1 */}
              {activeStep === 1 && regType === 'Person' && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        bg={getBg(colorScheme, '#f8fbff', theme.colors.dark[6])}
                        style={{ borderLeft: `4px solid ${PRIMARY_COLOR}` }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box style={gradientIconBox}><IconUserPlus size={24} /></Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>Personal Information</Title>
                            <Text c="dimmed" size="sm">Provide details about the missing person</Text>
                          </Box>
                        </Flex>
                        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="lg">
                          <TextInput
                            name="firstName"
                            label={<Text fw={600} size="sm">First name <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Enter first name"
                            radius="md"
                            required
                            variant="filled"
                          />
                          <TextInput
                            name="middleName"
                            label={<Text fw={600} size="sm">Middle name</Text>}
                            placeholder="Enter middle name"
                            radius="md"
                            variant="filled"
                          />
                          <TextInput
                            name="lastName"
                            label={<Text fw={600} size="sm">Last name <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Enter last name"
                            radius="md"
                            required
                            variant="filled"
                          />
                        </SimpleGrid>
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="lg">
                          <Select
                            name="gender"
                            label={<Text fw={600} size="sm">Gender <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            data={['Male', 'Female', 'Other']}
                            radius="md"
                            required
                            variant="filled"
                          />
                          <NumberInput
                            name="age"
                            label={<Text fw={600} size="sm">Age <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Enter age"
                            radius="md"
                            min={0}
                            required
                            variant="filled"
                          />
                          <NumberInput
                            name="height"
                            label={<Text fw={600} size="sm">Height (cm)</Text>}
                            placeholder="Height in cm"
                            radius="md"
                            min={0}
                            variant="filled"
                          />
                          <NumberInput
                            name="weight"
                            label={<Text fw={600} size="sm">Weight (kg)</Text>}
                            placeholder="Weight in kg"
                            radius="md"
                            min={0}
                            variant="filled"
                          />
                        </SimpleGrid>
                        <Textarea
                          name="description"
                          label={<Text fw={600} size="sm">Additional Description</Text>}
                          placeholder="Add any distinguishing features, clothing description, last seen with, medical conditions, etc."
                          minRows={4}
                          radius="md"
                          mb="lg"
                          variant="filled"
                        />

                        {/* Optional special case field for Person */}
                        <Select
                          name="specialCase"
                          label={<Text fw={600} size="sm">Special Case (if applicable)</Text>}
                          placeholder="Select if the person has special circumstances"
                          data={[
                            { value: 'none', label: 'None' },
                            { value: 'mentally-ill', label: 'Mentally Ill' },
                            { value: 'criminal', label: 'Criminal Background' }
                          ]}
                          radius="md"
                          clearable
                          mb="lg"
                          variant="filled"
                          styles={{
                            input: { borderColor: getBg(colorScheme, '#f0f5ff', theme.colors.dark[5]) },
                            description: { color: PRIMARY_COLOR, fontWeight: 500 }
                          }}
                        />

                        {/* Image Upload Section */}
                        <Card
                          withBorder
                          radius="lg"
                          padding="xl"
                          bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                          style={{
                            borderStyle: 'dashed',
                            borderColor: PRIMARY_LIGHT,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            borderWidth: 2,
                          }}
                          onClick={() => document.getElementById('person-image-upload').click()}
                        >
                          <input type="file" id="person-image-upload" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                          <Flex direction="column" align="center" gap="md">
                            {imagePreview ? (
                              <>
                                <Box style={{ position: 'relative', width: 120, height: 120 }}>
                                  <Image src={imagePreview} alt="Preview" fill style={{ borderRadius: '12px', objectFit: 'cover', border: `3px solid ${PRIMARY_COLOR}` }} />
                                </Box>
                                <Flex gap="sm">
                                  <Button size="sm" variant="light" color="blue" onClick={(e) => { e.stopPropagation(); document.getElementById('person-image-upload').click(); }} leftSection={<IconRefresh size={14} />}>Change</Button>
                                  <Button size="sm" variant="light" color="red" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}>Remove</Button>
                                </Flex>
                              </>
                            ) : (
                              <>
                                <Box style={{ background: PRIMARY_GRADIENT, padding: '20px', borderRadius: '50%', color: 'white', marginBottom: '8px' }}><IconCamera size={40} /></Box>
                                <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }}>Upload Persons Photo</Text>
                                <Text c="dimmed" size="sm" ta="center">Click or drag & drop to upload a clear recent photo</Text>
                                <Text size="xs" c={PRIMARY_COLOR} fw={600} mt="xs">Recommended: Front-facing, good lighting, recent photo</Text>
                                <Badge color="blue" variant="light" size="sm" mt="xs">Max 5MB • JPG, PNG, WebP</Badge>
                              </>
                            )}
                          </Flex>
                        </Card>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* Vehicle Details - Step 1 */}
              {activeStep === 1 && regType === 'Vehicle' && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        bg={getBg(colorScheme, '#f8fbff', theme.colors.dark[6])}
                        style={{ borderLeft: `4px solid ${PRIMARY_COLOR}` }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box style={gradientIconBox}><IconCar size={24} /></Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>Vehicle Information</Title>
                            <Text c="dimmed" size="sm">Provide detailed information about the vehicle</Text>
                          </Box>
                        </Flex>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="lg">
                          <Select
                            name="brand"
                            label={<Text fw={600} size="sm">Brand <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Select vehicle brand"
                            data={brands}
                            value={selectedBrand}
                            onChange={setSelectedBrand}
                            radius="md"
                            searchable
                            clearable
                            required
                            leftSection={<IconCar size={16} color={PRIMARY_COLOR} />}
                            variant="filled"
                          />
                          <Select
                            name="model"
                            label={<Text fw={600} size="sm">Model <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Select vehicle model"
                            data={models}
                            value={selectedModel}
                            onChange={setSelectedModel}
                            radius="md"
                            disabled={!selectedBrand}
                            searchable
                            clearable
                            required
                            variant="filled"
                          />
                          <Select
                            name="submodel"
                            label={<Text fw={600} size="sm">Sub Model</Text>}
                            placeholder="Select sub model"
                            data={submodels}
                            value={selectedSubmodel}
                            onChange={setSelectedSubmodel}
                            radius="md"
                            disabled={!selectedModel}
                            searchable
                            clearable
                            variant="filled"
                          />
                          <Select
                            name="color"
                            label={<Text fw={600} size="sm">Color <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Select vehicle color"
                            data={colorOptions}
                            radius="md"
                            searchable
                            required
                            variant="filled"
                          />
                        </SimpleGrid>
                        <Textarea
                          name="vehicleDescription"
                          label={<Text fw={600} size="sm">Additional Vehicle Description</Text>}
                          placeholder="Add additional information about the vehicle (damages, modifications, special features, stickers, dents, unique characteristics, etc.)"
                          radius="md"
                          minRows={4}
                          mb="lg"
                          variant="filled"
                        />

                        {/* Special Case Field for Vehicle (optional) */}
                        <Select
                          name="specialCase"
                          label={<Text fw={600} size="sm">Special Case (if applicable)</Text>}
                          placeholder="Select if the vehicle is linked to a person with special circumstances"
                          data={[
                            { value: 'none', label: 'None' },
                            { value: 'mentally-ill', label: 'Mentally Ill Owner/Driver' },
                            { value: 'criminal', label: 'Criminal Background Owner/Driver' }
                          ]}
                          radius="md"
                          clearable
                          mb="lg"
                          variant="filled"
                          styles={{
                            input: { borderColor: getBg(colorScheme, '#f0f5ff', theme.colors.dark[5]) },
                            description: { color: PRIMARY_COLOR, fontWeight: 500 }
                          }}
                        />

                        {/* License Plate Section */}
                        <Card
                          withBorder
                          radius="lg"
                          padding="xl"
                          mb="lg"
                          bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                          style={{
                            borderColor: PRIMARY_COLOR,
                            borderWidth: 2,
                          }}
                        >
                          <Flex align="center" gap="md" mb="lg">
                            <Box style={{ background: PRIMARY_GRADIENT, padding: '8px', borderRadius: '8px', color: 'white' }}><IconInfoCircle size={20} /></Box>
                            <Box>
                              <Title order={5} style={{ color: PRIMARY_DARK }}>License Plate Information</Title>
                              <Text c="dimmed" size="sm">Ethiopian license plate format details</Text>
                            </Box>
                          </Flex>
                          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
                            <Select
                              name="plateType"
                              label={<Text fw={600} size="sm">Plate Type <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                              data={['National', 'Diplomatic', 'Government', 'Police', 'Military', 'Temporary']}
                              radius="md"
                              placeholder="Select type"
                              required
                              variant="filled"
                            />
                            <Select
                              name="region"
                              label={<Text fw={600} size="sm">Region <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                              data={regionOptions}
                              radius="md"
                              placeholder="Select region"
                              searchable
                              required
                              variant="filled"
                            />
                            <Select
                              name="code"
                              label={<Text fw={600} size="sm">Code <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                              data={Array.from({ length: 10 }, (_, i) => (i + 1).toString())}
                              radius="md"
                              placeholder="Select code"
                              required
                              variant="filled"
                            />
                          </SimpleGrid>
                          <TextInput
                            name="plateNumber"
                            label={<Text fw={600} size="sm">Plate Number <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Enter plate number (e.g., AA-12345)"
                            radius="md"
                            description="Format: RegionCode-Number (e.g., AA-12345 for Addis Ababa)"
                            required
                            variant="filled"
                            styles={{
                              input: { fontFamily: 'monospace', fontSize: '1.1em', fontWeight: 700, letterSpacing: '1px', color: PRIMARY_DARK },
                              description: { color: PRIMARY_COLOR, fontWeight: 500 }
                            }}
                          />
                        </Card>

                        {/* Ownership Documentation Upload */}
                        <Card
                          withBorder
                          radius="lg"
                          padding="xl"
                          mb="lg"
                          bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                          style={{
                            borderColor: PRIMARY_LIGHT,
                            borderWidth: 2,
                          }}
                        >
                          <Flex align="center" gap="md" mb="md">
                            <Box style={{ background: PRIMARY_GRADIENT, padding: '8px', borderRadius: '8px', color: 'white' }}>
                              <IconFileDescription size={20} />
                            </Box>
                            <Box>
                              <Title order={5} style={{ color: PRIMARY_DARK }}>Ownership Documentation (Optional)</Title>
                              <Text c="dimmed" size="sm">Upload proof of ownership (e.g., title, registration)</Text>
                            </Box>
                          </Flex>
                          <FileInput
                            name="ownershipDoc"
                            placeholder="Choose file..."
                            accept="image/*,application/pdf"
                            onChange={setOwnershipDoc}
                            value={ownershipDoc}
                            radius="md"
                            clearable
                            leftSection={<IconUpload size={16} color={PRIMARY_COLOR} />}
                            description="Accepted formats: JPG, PNG, PDF (max 10MB)"
                            variant="filled"
                            styles={{
                              input: { borderColor: getBg(colorScheme, '#f0f5ff', theme.colors.dark[5]) },
                              description: { color: PRIMARY_COLOR, fontWeight: 500 }
                            }}
                          />
                          {/* TODO: Handle file upload to server when submitting */}
                        </Card>

                        {/* Vehicle Images Upload */}
                        <Card
                          withBorder
                          radius="lg"
                          padding="xl"
                          bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                          style={{
                            borderStyle: 'dashed',
                            borderColor: PRIMARY_LIGHT,
                            borderWidth: 2,
                          }}
                        >
                          <Flex direction="column" align="center" gap="md">
                            <Box style={{ background: PRIMARY_GRADIENT, padding: '20px', borderRadius: '50%', color: 'white' }}><IconPhoto size={40} /></Box>
                            <Box ta="center">
                              <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }} mb="xs">Vehicle Images</Text>
                              <Text c="dimmed" size="sm">Upload clear images from multiple angles for better identification</Text>
                            </Box>
                            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md" w="100%">
                              {['Front', 'Back', 'Left Side', 'Right Side'].map((angle, idx) => (
                                <Card
                                  key={idx}
                                  withBorder
                                  padding="lg"
                                  radius="md"
                                  bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                                  style={{
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    borderColor: getBg(colorScheme, '#f0f5ff', theme.colors.dark[5]),
                                  }}
                                >
                                  <Flex direction="column" align="center" gap="xs">
                                    <Box style={{ background: getBg(colorScheme, '#f0f5ff', theme.colors.dark[6]), padding: '12px', borderRadius: '10px', color: PRIMARY_COLOR }}><IconCamera size={24} /></Box>
                                    <Text size="sm" fw={600} style={{ color: PRIMARY_DARK }}>{angle} View</Text>
                                    <Text size="xs" c="dimmed">Click to upload</Text>
                                  </Flex>
                                </Card>
                              ))}
                            </SimpleGrid>
                            <Badge color="blue" variant="light" size="sm" mt="sm">Up to 10 images allowed • Max 5MB each</Badge>
                          </Flex>
                        </Card>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* Special Case Details - Step 1 */}
              {activeStep === 1 && regType === 'Special' && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        bg={getBg(colorScheme, '#f8fbff', theme.colors.dark[6])}
                        style={{ borderLeft: `4px solid ${PRIMARY_COLOR}` }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box style={gradientIconBox}><IconAlertTriangle size={24} /></Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>Special Case Information</Title>
                            <Text c="dimmed" size="sm">Provide details about the person with special circumstances</Text>
                          </Box>
                        </Flex>
                        
                        {/* Required special category field */}
                        <Select
                          name="specialCategory"
                          label={<Text fw={600} size="sm">Special Category <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                          placeholder="Select the category"
                          data={[
                            { value: 'mentally-ill', label: 'Mentally Ill' },
                            { value: 'criminal', label: 'Criminal Background' }
                          ]}
                          radius="md"
                          required
                          value={specialCategory}
                          onChange={setSpecialCategory}
                          mb="lg"
                          variant="filled"
                          styles={{
                            input: { borderColor: getBg(colorScheme, '#f0f5ff', theme.colors.dark[5]) },
                            description: { color: PRIMARY_COLOR, fontWeight: 500 }
                          }}
                        />

                        {/* Conditional file uploads */}
                        {specialCategory === 'mentally-ill' && (
                          <Card
                            withBorder
                            radius="lg"
                            padding="xl"
                            mb="lg"
                            bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                            style={{
                              borderColor: PRIMARY_LIGHT,
                              borderWidth: 2,
                            }}
                          >
                            <Flex align="center" gap="md" mb="md">
                              <Box style={{ background: PRIMARY_GRADIENT, padding: '8px', borderRadius: '8px', color: 'white' }}>
                                <IconFileDescription size={20} />
                              </Box>
                              <Box>
                                <Title order={5} style={{ color: PRIMARY_DARK }}>Doctors Report <Text span c={PRIMARY_COLOR}>*</Text></Title>
                                <Text c="dimmed" size="sm">Upload a medical report or documentation</Text>
                              </Box>
                            </Flex>
                            <FileInput
                              name="doctorReport"
                              placeholder="Choose file..."
                              accept="image/*,application/pdf"
                              onChange={setDoctorReport}
                              value={doctorReport}
                              radius="md"
                              required
                              clearable
                              leftSection={<IconUpload size={16} color={PRIMARY_COLOR} />}
                              description="Accepted formats: JPG, PNG, PDF (max 10MB)"
                              variant="filled"
                              styles={{
                                input: { borderColor: getBg(colorScheme, '#f0f5ff', theme.colors.dark[5]) },
                                description: { color: PRIMARY_COLOR, fontWeight: 500 }
                              }}
                            />
                          </Card>
                        )}

                        {specialCategory === 'criminal' && (
                          <Card
                            withBorder
                            radius="lg"
                            padding="xl"
                            mb="lg"
                            bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                            style={{
                              borderColor: PRIMARY_LIGHT,
                              borderWidth: 2,
                            }}
                          >
                            <Flex align="center" gap="md" mb="md">
                              <Box style={{ background: PRIMARY_GRADIENT, padding: '8px', borderRadius: '8px', color: 'white' }}>
                                <IconFileDescription size={20} />
                              </Box>
                              <Box>
                                <Title order={5} style={{ color: PRIMARY_DARK }}>Arrest Warrant / Criminal Record <Text span c={PRIMARY_COLOR}>*</Text></Title>
                                <Text c="dimmed" size="sm">Upload official documentation</Text>
                              </Box>
                            </Flex>
                            <FileInput
                              name="criminalRecord"
                              placeholder="Choose file..."
                              accept="image/*,application/pdf"
                              onChange={setCriminalRecord}
                              value={criminalRecord}
                              radius="md"
                              required
                              clearable
                              leftSection={<IconUpload size={16} color={PRIMARY_COLOR} />}
                              description="Accepted formats: JPG, PNG, PDF (max 10MB)"
                              variant="filled"
                              styles={{
                                input: { borderColor: getBg(colorScheme, '#f0f5ff', theme.colors.dark[5]) },
                                description: { color: PRIMARY_COLOR, fontWeight: 500 }
                              }}
                            />
                          </Card>
                        )}

                        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="lg">
                          <TextInput
                            name="firstName"
                            label={<Text fw={600} size="sm">First name <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Enter first name"
                            radius="md"
                            required
                            variant="filled"
                          />
                          <TextInput
                            name="middleName"
                            label={<Text fw={600} size="sm">Middle name</Text>}
                            placeholder="Enter middle name"
                            radius="md"
                            variant="filled"
                          />
                          <TextInput
                            name="lastName"
                            label={<Text fw={600} size="sm">Last name <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Enter last name"
                            radius="md"
                            required
                            variant="filled"
                          />
                        </SimpleGrid>
                        
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="lg">
                          <Select
                            name="gender"
                            label={<Text fw={600} size="sm">Gender <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            data={['Male', 'Female', 'Other']}
                            radius="md"
                            required
                            variant="filled"
                          />
                          <NumberInput
                            name="age"
                            label={<Text fw={600} size="sm">Age <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="Enter age"
                            radius="md"
                            min={0}
                            required
                            variant="filled"
                          />
                          <NumberInput
                            name="height"
                            label={<Text fw={600} size="sm">Height (cm)</Text>}
                            placeholder="Height in cm"
                            radius="md"
                            min={0}
                            variant="filled"
                          />
                          <NumberInput
                            name="weight"
                            label={<Text fw={600} size="sm">Weight (kg)</Text>}
                            placeholder="Weight in kg"
                            radius="md"
                            min={0}
                            variant="filled"
                          />
                        </SimpleGrid>
                        
                        <Textarea
                          name="description"
                          label={<Text fw={600} size="sm">Additional Description</Text>}
                          placeholder="Add any distinguishing features, clothing description, last seen with, medical conditions, etc."
                          minRows={4}
                          radius="md"
                          mb="lg"
                          variant="filled"
                        />

                        {/* Image Upload Section */}
                        <Card
                          withBorder
                          radius="lg"
                          padding="xl"
                          bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                          style={{
                            borderStyle: 'dashed',
                            borderColor: PRIMARY_LIGHT,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            borderWidth: 2,
                          }}
                          onClick={() => document.getElementById('special-image-upload').click()}
                        >
                          <input type="file" id="special-image-upload" style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                          <Flex direction="column" align="center" gap="md">
                            {imagePreview ? (
                              <>
                                <Box style={{ position: 'relative', width: 120, height: 120 }}>
                                  <Image src={imagePreview} alt="Preview" fill style={{ borderRadius: '12px', objectFit: 'cover', border: `3px solid ${PRIMARY_COLOR}` }} />
                                </Box>
                                <Flex gap="sm">
                                  <Button size="sm" variant="light" color="blue" onClick={(e) => { e.stopPropagation(); document.getElementById('special-image-upload').click(); }} leftSection={<IconRefresh size={14} />}>Change</Button>
                                  <Button size="sm" variant="light" color="red" onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}>Remove</Button>
                                </Flex>
                              </>
                            ) : (
                              <>
                                <Box style={{ background: PRIMARY_GRADIENT, padding: '20px', borderRadius: '50%', color: 'white', marginBottom: '8px' }}><IconCamera size={40} /></Box>
                                <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }}>Upload Persons Photo</Text>
                                <Text c="dimmed" size="sm" ta="center">Click or drag & drop to upload a clear recent photo</Text>
                                <Text size="xs" c={PRIMARY_COLOR} fw={600} mt="xs">Recommended: Front-facing, good lighting, recent photo</Text>
                                <Badge color="blue" variant="light" size="sm" mt="xs">Max 5MB • JPG, PNG, WebP</Badge>
                              </>
                            )}
                          </Flex>
                        </Card>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* Last Seen Information - Step 2 (same for all types) */}
              {activeStep === 2 && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        bg={getBg(colorScheme, '#f8fbff', theme.colors.dark[6])}
                        style={{ borderLeft: `4px solid ${PRIMARY_COLOR}` }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box style={gradientIconBox}><IconMap size={24} /></Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>Last Known Information</Title>
                            <Text c="dimmed" size="sm">Where and when was the {regType.toLowerCase()} last seen?</Text>
                          </Box>
                        </Flex>
                        <TextInput
                          name="location"
                          label={<Text fw={600} size="sm">Last Seen Location <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                          placeholder="Enter city, specific address, or landmark"
                          leftSection={<IconMapPin size={18} color={PRIMARY_COLOR} />}
                          radius="md"
                          mb="lg"
                          required
                          variant="filled"
                        />
                        <Card
                          withBorder
                          radius="lg"
                          padding={0}
                          mb="lg"
                          bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                          style={{
                            height: isMobile ? 200 : 300,
                            position: 'relative',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            borderColor: PRIMARY_LIGHT,
                          }}
                          onClick={() => notifications.show({ title: 'Map Integration', message: 'Interactive map feature would open here', color: 'blue' })}
                        >
                          <Flex direction="column" align="center" justify="center" gap="md" style={{ height: '100%', background: PRIMARY_GRADIENT, padding: '20px' }}>
                            <IconMap size={isMobile ? 40 : 60} color="white" />
                            <Text c="white" fw={700} size={isMobile ? 'md' : 'lg'}>Interactive Location Map</Text>
                            <Text c="white" size="sm" ta="center" opacity={0.9}>Click to select exact location on map<br /><Text span size="xs">(GPS coordinates will be captured)</Text></Text>
                            <Badge color="white" variant="filled" size="lg" style={{ color: PRIMARY_COLOR, fontWeight: 700 }}>CLICK TO OPEN MAP</Badge>
                          </Flex>
                        </Card>
                        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                          <TextInput
                            name="lastSeenDate"
                            label={<Text fw={600} size="sm">Last Seen Date <Text span c={PRIMARY_COLOR}>*</Text></Text>}
                            placeholder="YYYY-MM-DD"
                            radius="md"
                            required
                            type="date"
                            max={new Date().toISOString().split('T')[0]}
                            leftSection={<IconCalendar size={18} color={PRIMARY_COLOR} />}
                            variant="filled"
                          />
                          <TextInput
                            name="lastSeenTime"
                            label={<Text fw={600} size="sm">Approximate Time</Text>}
                            placeholder="HH:MM (24-hour format)"
                            radius="md"
                            type="time"
                            leftSection={<IconClock size={18} color={PRIMARY_COLOR} />}
                            variant="filled"
                          />
                        </SimpleGrid>
                        <Alert
                          icon={<IconInfoCircle size={18} color={PRIMARY_COLOR} />}
                          title="Accuracy Matters"
                          color="blue"
                          variant="light"
                          radius="md"
                          mt="lg"
                          style={{
                            borderColor: PRIMARY_LIGHT,
                            backgroundColor: getBg(colorScheme, `${PRIMARY_COLOR}08`, theme.colors.dark[6]),
                          }}
                        >
                          <Text size="sm">The more accurate your location and time information, the better chance we have of finding the missing {regType.toLowerCase()}.</Text>
                        </Alert>
                      </Card>
                    </div>
                  )}
                </Transition>
              )}

              {/* Contact Information - Step 3 (same for all types) */}
              {activeStep === 3 && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        bg={getBg(colorScheme, '#f8fbff', theme.colors.dark[6])}
                        style={{ borderLeft: `4px solid ${PRIMARY_COLOR}` }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box style={gradientIconBox}><IconMessageCircle size={24} /></Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>Contact Information</Title>
                            <Text c="dimmed" size="sm">How can people contact you with information?</Text>
                          </Box>
                        </Flex>
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="lg">
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                            style={{ borderColor: PRIMARY_LIGHT }}
                          >
                            <Flex align="center" gap="md">
                              <Avatar color={PRIMARY_COLOR} radius="xl" style={{ background: PRIMARY_GRADIENT }}>
                                <IconUser size={20} />
                              </Avatar>
                              <Box>
                                <Text size="xs" c="dimmed" fw={600}>Name</Text>
                                <Text fw={700} style={{ color: PRIMARY_DARK }}>{currentUser?.firstName} {currentUser?.lastName}</Text>
                              </Box>
                            </Flex>
                          </Card>
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                            style={{ borderColor: PRIMARY_LIGHT }}
                          >
                            <Flex align="center" gap="md">
                              <Avatar color="green" radius="xl" style={{ background: 'linear-gradient(135deg, #00b894 0%, #00a085 100%)' }}>
                                <IconMail size={20} />
                              </Avatar>
                              <Box>
                                <Text size="xs" c="dimmed" fw={600}>Email</Text>
                                <Text fw={700} style={{ color: PRIMARY_DARK }}>{currentUser?.email}</Text>
                              </Box>
                            </Flex>
                          </Card>
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                            style={{ borderColor: PRIMARY_LIGHT }}
                          >
                            <Flex align="center" gap="md">
                              <Avatar color="red" radius="xl" style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' }}>
                                <IconPhone size={20} />
                              </Avatar>
                              <Box>
                                <Text size="xs" c="dimmed" fw={600}>Phone</Text>
                                <Text fw={700} style={{ color: PRIMARY_DARK }}>{currentUser?.phone}</Text>
                              </Box>
                            </Flex>
                          </Card>
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                            style={{ borderColor: PRIMARY_LIGHT }}
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
                        <Card
                          withBorder
                          padding="lg"
                          radius="lg"
                          mb="md"
                          bg={getBg(
                            colorScheme,
                            'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
                            `linear-gradient(135deg, ${theme.colors.dark[5]} 0%, ${theme.colors.dark[7]} 100%)`
                          )}
                          style={{ borderColor: '#0088cc', borderWidth: 2 }}
                        >
                          <Flex align="center" gap="md" mb="md">
                            <IconBrandTelegram size={28} color="#0088cc" />
                            <Box>
                              <Text fw={700} size="lg" style={{ color: '#0088cc' }}>Telegram Contact (Optional)</Text>
                              <Text size="sm" c="dimmed">Add your Telegram username for faster, secure communication</Text>
                            </Box>
                          </Flex>
                          <TextInput
                            name="telegramUsername"
                            placeholder="username (without @ symbol)"
                            radius="md"
                            leftSection={<Text c="#0088cc" fw={700}>@</Text>}
                            description="People with information can contact you quickly via Telegram"
                            variant="filled"
                            styles={{
                              root: { marginBottom: 8 },
                              input: { borderColor: '#0088cc' },
                              description: { color: '#0088cc', fontWeight: 500 }
                            }}
                          />
                          <Text size="xs" c="dimmed" mt="xs">
                            • Telegram provides end-to-end encryption for privacy<br />
                            • Faster than email for urgent communications<br />
                            • You can share photos and location easily
                          </Text>
                        </Card>
                        <Textarea
                          name="additionalContactInfo"
                          label={<Text fw={600} size="sm">Additional Contact Methods</Text>}
                          placeholder="Any other ways people can contact you (e.g., other social media profiles, alternative phone numbers, WhatsApp, etc.)"
                          description="Optional: Add any other contact methods or special instructions"
                          minRows={3}
                          radius="md"
                          mb="lg"
                          variant="filled"
                        />
                        <Alert
                          icon={<IconLock size={20} color={PRIMARY_COLOR} />}
                          title="Your Privacy & Security"
                          color="blue"
                          variant="light"
                          radius="md"
                          style={{
                            borderColor: PRIMARY_COLOR,
                            background: getBg(colorScheme, `${PRIMARY_COLOR}08`, theme.colors.dark[6]),
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

              {/* Review & Submit - Step 4 (same for all types) */}
              {activeStep === 4 && (
                <Transition mounted transition="pop" duration={400}>
                  {(styles) => (
                    <div style={styles}>
                      <Card
                        withBorder
                        radius="lg"
                        padding="xl"
                        bg={getBg(colorScheme, '#f8fbff', theme.colors.dark[6])}
                        style={{ borderLeft: `4px solid ${PRIMARY_COLOR}` }}
                      >
                        <Flex align="center" gap="md" mb="lg">
                          <Box style={gradientIconBox}><IconCheck size={24} /></Box>
                          <Box>
                            <Title order={4} style={{ color: PRIMARY_DARK }}>Review & Submit Your Report</Title>
                            <Text c="dimmed" size="sm">Please review all information before final submission</Text>
                          </Box>
                        </Flex>
                        <Text size="sm" c="dimmed" mb="xl" ta="center">Youre almost done! Take a moment to verify all details are correct.</Text>
                        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb="xl">
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                            style={{ borderColor: PRIMARY_LIGHT }}
                          >
                            <Text size="sm" c="dimmed" mb="xs">Report Type</Text>
                            <Badge
                              size="lg"
                              style={{ background: PRIMARY_GRADIENT, color: 'white', fontWeight: 700, padding: '8px 16px' }}
                              leftSection={regType === 'Person' ? <IconUserPlus size={16} /> : regType === 'Vehicle' ? <IconCar size={16} /> : <IconAlertTriangle size={16} />}
                            >
                              Missing {regType === 'Special' ? 'Special Case' : regType}
                            </Badge>
                          </Card>
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                            style={{ borderColor: PRIMARY_LIGHT }}
                          >
                            <Text size="sm" c="dimmed" mb="xs">Reporter</Text>
                            <Text fw={700} style={{ color: PRIMARY_DARK }}>{currentUser?.firstName} {currentUser?.lastName}</Text>
                            <Text size="xs" c="dimmed">{currentUser?.email}</Text>
                          </Card>
                          <Card
                            withBorder
                            padding="lg"
                            radius="md"
                            bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                            style={{ borderColor: PRIMARY_LIGHT }}
                          >
                            <Text size="sm" c="dimmed" mb="xs">Report Status</Text>
                            <Badge
                              color="green"
                              variant="light"
                              size="lg"
                              style={{
                                background: getBg(colorScheme, '#d4edda', theme.colors.dark[5]),
                                color: getBg(colorScheme, '#155724', theme.colors.green[3]),
                                fontWeight: 700,
                              }}
                            >
                              Ready to Submit
                            </Badge>
                          </Card>
                        </SimpleGrid>
                        <Card
                          withBorder
                          padding="lg"
                          radius="md"
                          mb="xl"
                          bg={getBg(colorScheme, 'white', theme.colors.dark[7])}
                          style={{
                            borderColor: '#40c057',
                            borderWidth: 2,
                            boxShadow: '0 4px 20px rgba(64, 192, 87, 0.1)',
                          }}
                        >
                          <Flex align="center" gap="md">
                            <IconCheck color="#40c057" size={24} />
                            <Box style={{ flex: 1 }}>
                              <Text fw={700} style={{ color: getBg(colorScheme, '#155724', theme.colors.green[3]) }}>Final Confirmation</Text>
                              <Text size="sm" c="dimmed">I confirm that all information provided is accurate to the best of my knowledge</Text>
                            </Box>
                            <Checkbox
                              size="lg"
                              color="green"
                              defaultChecked
                              styles={{
                                input: {
                                  borderColor: '#40c057',
                                  backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]),
                                  ':checked': { backgroundColor: '#40c057', borderColor: '#40c057' },
                                },
                              }}
                            />
                          </Flex>
                        </Card>
                        <Button
                          type="submit"
                          size="lg"
                          radius="xl"
                          loading={isSubmitting}
                          disabled={isSubmitting}
                          fullWidth
                          style={{
                            background: isSubmitting ? PRIMARY_COLOR : PRIMARY_GRADIENT,
                            border: 'none',
                            boxShadow: `0 8px 30px ${PRIMARY_COLOR}40`,
                            transition: 'all 0.3s ease',
                            height: '60px',
                            fontSize: '18px',
                            fontWeight: 800,
                            letterSpacing: '0.5px',
                          }}
                          rightSection={
                            !isSubmitting && (
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
                            )
                          }
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
                    border: `1px solid ${getBg(colorScheme, '#f0f5ff', theme.colors.dark[5])}`,
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
                      setOwnershipDoc(null);
                      setSpecialCategory(null);
                      setDoctorReport(null);
                      setCriminalRecord(null);
                      notifications.show({ title: 'Form Reset', message: 'All form data has been cleared', color: 'blue', icon: <IconRefresh size={16} /> });
                    }}
                    disabled={isSubmitting}
                    style={{
                      padding: '12px 24px',
                      borderColor: getBg(colorScheme, '#f0f5ff', theme.colors.dark[5]),
                      fontWeight: 600,
                    }}
                  >
                    Reset Form
                  </Button>
                  {activeStep < steps.length - 1 && (
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
                      }}
                    >
                      Continue to {steps[activeStep + 1]?.label}
                    </Button>
                  )}
                </Flex>
              </Flex>

              <Divider my="md" color={getBg(colorScheme, '#f0f5ff', theme.colors.dark[5])} />
              <Text size="xs" c="dimmed" ta="center">
                <IconInfoCircle size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                Need assistance? Contact support@findr.com | Your data is protected with 256-bit SSL encryption<br />
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
            <Text style={{ color: PRIMARY_DARK, fontWeight: 700 }}>Your Contact & Security Settings</Text>
          </Flex>
        }
        size="md"
        radius="lg"
        centered
        styles={{
          header: { borderBottom: `2px solid ${getBg(colorScheme, '#f0f5ff', theme.colors.dark[5])}` },
          content: { border: `2px solid ${PRIMARY_COLOR}`, backgroundColor: getBg(colorScheme, 'white', theme.colors.dark[7]) },
        }}
      >
        <Stack gap="md">
          <Flex align="center" gap="md">
            <Avatar
              size="lg"
              radius="xl"
              src={currentUser?.avatar}
              style={{ background: PRIMARY_GRADIENT, border: `3px solid ${getBg(colorScheme, '#f0f5ff', theme.colors.dark[5])}` }}
            >
              {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
            </Avatar>
            <Box>
              <Text fw={700} size="lg" style={{ color: PRIMARY_DARK }}>{currentUser?.firstName} {currentUser?.lastName}</Text>
              <Text size="sm" c="dimmed">{currentUser?.role || 'Registered User'}</Text>
            </Box>
          </Flex>
          <Divider color={getBg(colorScheme, '#f0f5ff', theme.colors.dark[5])} />
          <SimpleGrid cols={2} spacing="md">
            <Box>
              <Text size="xs" c="dimmed" fw={600}>Email Address</Text>
              <Text fw={600} size="sm" style={{ color: PRIMARY_DARK }}>{currentUser?.email}</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" fw={600}>Phone Number</Text>
              <Text fw={600} size="sm" style={{ color: PRIMARY_DARK }}>{currentUser?.phone}</Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" fw={600}>Total Reports</Text>
              <Badge color="blue" variant="light" size="sm" style={{ background: `${PRIMARY_COLOR}15`, color: PRIMARY_COLOR, fontWeight: 700 }}>
                {currentUser?.registrations || 0} submitted
              </Badge>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" fw={600}>Account Status</Text>
              <Badge color={currentUser?.isActive ? 'green' : 'red'} variant="light" size="sm" style={{ fontWeight: 700 }}>
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
            style={{
              borderColor: PRIMARY_LIGHT,
              backgroundColor: getBg(colorScheme, `${PRIMARY_COLOR}08`, theme.colors.dark[6]),
            }}
          >
            <Text size="xs">
              Your account is protected with:<br />
              • Two-factor authentication available<br />
              • End-to-end encrypted communications<br />
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
              background: getBg(colorScheme, `${PRIMARY_COLOR}10`, theme.colors.dark[6]),
              border: `1px solid ${PRIMARY_COLOR}30`,
              fontWeight: 600,
            }}
          >
            Update Profile & Settings
          </Button>
        </Stack>
      </Modal>

      <MainFooter />
    </Box>
  );
}