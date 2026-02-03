"use client";

import {
  Box,
  Container,
  Title,
  Text,
  Card,
  Group,
  Button,
  Paper,
  Stack,
  Avatar,
  Badge,
  SimpleGrid,
  ActionIcon,
  Menu,
  UnstyledButton,
  TextInput,
  ScrollArea,
  Divider,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChevronRight,
  IconMapPin,
  IconCalendar,
  IconCar,
  IconSearch,
  IconHome,
  IconUser,
  IconBell,
  IconHistory,
  IconSettings,
  IconLogout,
  IconShieldCheck,
  IconChevronLeft,
  IconX,
  IconCheck,
  IconInfoCircle,
  IconMapPinFilled,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import MainFooter from "../../components/MainFooter";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";

// Sample data with LOTS of content for scrolling
const alerts = [
  {
    id: 1,
    code: "5h7",
    type: "car",
    brand: "Toyota Corolla",
    details: "Diesel equipped",
    location: "Mexico/AZ",
    time: "Last year",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500",
    fullDescription: `Gara, Toyota Corolla car vakugad vusur fiyatgaib vijerghasluq hr ru. Additional details about the vehicle condition, special features, and history. This is a longer description that will require vertical scrolling. More details about the vehicle's history, condition report, and special features.

The vehicle was last serviced at 50,000 miles with full maintenance records available. Includes premium audio system, leather seats, and advanced safety features. GPS tracking was installed but may not be active.

Vehicle identification number: JTDBU4EE7AJ123456
Engine serial number: 2AZ123456789
Transmission type: Automatic 6-speed
Fuel type: Diesel
Color: Silver Metallic
Year: 2018
Mileage: 65,432
Interior color: Black

Additional Notes:
The vehicle was last seen with minor damage to the rear bumper. The license plate frame is broken on the right side. There is a distinctive sticker on the rear windshield depicting a mountain landscape.

Recent Activity:
- Last serviced: 2023-08-15
- Insurance valid until: 2024-06-30
- Registration expires: 2024-12-31
- Reported stolen: 2023-10-15

The owner has provided additional information about custom modifications including aftermarket wheels and a custom exhaust system. The vehicle may be difficult to identify due to these modifications.`,
    features: [
      "Diesel Engine",
      "Automatic Transmission",
      "Air Conditioning",
      "Power Windows",
      "Alloy Wheels",
      "Bluetooth Connectivity",
      "Leather Seats",
      "Sunroof",
      "Navigation System",
      "Backup Camera",
      "Heated Seats",
      "Premium Audio System",
      "Keyless Entry",
      "Push Button Start",
      "Lane Departure Warning",
      "Automatic Emergency Braking",
      "Adaptive Cruise Control",
      "Blind Spot Monitoring",
      "Rear Cross Traffic Alert",
      "Parking Sensors",
    ],
    lastSeen: "Downtown Area, Main Street near Central Park, intersection of 5th Avenue and Broadway. The vehicle was parked outside the main shopping mall entrance.",
    contact: {
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      email: "report@example.com",
      additional: "Available for contact Monday-Friday, 9AM-5PM. Please mention case number 5h7 when calling.",
    },
    reportDate: "2023-10-15",
    additionalInfo: {
      insuranceCompany: "StateFarm Insurance",
      policyNumber: "SF-789456123",
      vin: "JTDBU4EE7AJ123456",
      engineSize: "2.0L",
      fuelCapacity: "13.2 gallons",
      seatingCapacity: "5",
      weight: "2,900 lbs",
    },
  },
  {
    id: 2,
    code: "8k3",
    type: "car",
    brand: "Santa Cordilla",
    details: "PARC AR: 761",
    location: "California/LA",
    time: "2 months ago",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=500",
    fullDescription: "Santa Cordilla with special features and custom modifications. This vehicle was last seen in the downtown area.",
    features: [
      "Premium Package",
      "Leather Seats",
      "Navigation System",
      "Sunroof",
      "Backup Camera",
    ],
    lastSeen: "Main Boulevard",
    contact: {
      name: "Maria Garcia",
      phone: "+1 (555) 987-6543",
      email: "maria@example.com",
    },
    reportDate: "2023-11-20",
  },
  {
    id: 3,
    code: "2j9",
    type: "car",
    brand: "Toyota Corolla",
    details: "Blk., Pink A/C 615",
    location: "Mexico/AZ",
    time: "Last year",
    status: "resolved",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=500",
    fullDescription: "Black Toyota Corolla with pink accents. Found and returned to owner.",
    features: [
      "Custom Paint",
      "Sport Package",
      "Premium Sound System",
    ],
    lastSeen: "Airport Area",
    contact: {
      name: "Robert Smith",
      phone: "+1 (555) 456-7890",
      email: "robert@example.com",
    },
    reportDate: "2023-09-10",
  },
  
  {
    id: 5,
    code: "6n8",
    type: "car",
    brand: "Ford Mustang",
    details: "Red, Black A/C 321",
    location: "Texas/Dallas",
    time: "1 week ago",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=500",
    fullDescription: "Red Ford Mustang with black stripes. High-performance vehicle.",
    features: [
      "V8 Engine",
      "Manual Transmission",
      "Performance Package",
      "Track Mode",
    ],
    lastSeen: "Highway 75",
    contact: {
      name: "Mike Johnson",
      phone: "+1 (555) 876-5432",
      email: "mike@example.com",
    },
    reportDate: "2024-01-15",
  },
  {
    id: 6,
    code: "9p2",
    type: "car",
    brand: "BMW X5",
    details: "Black, Gray A/C 654",
    location: "New York/NYC",
    time: "3 days ago",
    status: "resolved",
    imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=500",
    fullDescription: "Black BMW X5 SUV with gray interior. Vehicle has been recovered.",
    features: [
      "xDrive AWD",
      "M Sport Package",
      "Heated Seats",
      "Panoramic Sunroof",
    ],
    lastSeen: "Financial District",
    contact: {
      name: "David Brown",
      phone: "+1 (555) 345-6789",
      email: "david@example.com",
    },
    reportDate: "2024-01-10",
  },
];

export default function AlertPage() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Freeze background scrolling when popup is open
  useEffect(() => {
    if (selectedAlert) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedAlert]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const handleViewDetail = (alert) => {
    setSelectedAlert(alert);
  };

  const handleCloseDetail = () => {
    setSelectedAlert(null);
  };

  const handleBackgroundClick = (e) => {
    e.stopPropagation();
    handleCloseDetail();
  };

  return (
    <Box bg="white" style={{ minHeight: "100vh", position: 'relative' }}>
      {/* Header */}
      <Box
        bg="white"
        py="sm"
        style={{
          borderBottom: "1px solid #E9ECEF",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="xl">
          <Group justify="space-between">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={0}
              height={50}
              sizes="100vw"
              style={{ width: "auto", height: "50px", borderRadius: "8px" }}
            />

            <TextInput
              placeholder="Search..."
              leftSection={<IconSearch size={16} />}
              style={{ width: "40%" }}
              radius="xl"
            />

            <Group gap="lg">
              <ActionIcon
                variant="transparent"
                color="gray"
                size="lg"
                component={Link}
                href="/"
              >
                <IconHome size={28} />
              </ActionIcon>

              <Menu
                shadow="md"
                width={320}
                radius="md"
                transitionProps={{ transition: "pop-top-right" }}
              >
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap="sm">
                      <Box ta="right" visibleFrom="xs">
                        <Text fw={800} size="md">
                          Feleke
                        </Text>
                        <Text size="xs" c="dimmed">
                          Personal account
                        </Text>
                      </Box>
                      <Avatar
                        src={null}
                        alt="User"
                        color="blue"
                        size="md"
                        radius="xl"
                      />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown p="md">
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={700}>
                      Personal account
                    </Text>
                    <ActionIcon variant="subtle" size="sm" color="gray">
                      <IconLogout size={14} />
                    </ActionIcon>
                  </Group>
                  <Stack gap={4}>
                    <Menu.Item leftSection={<IconUser size={20} />}>
                      Person
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconBell size={20} />}
                      onClick={() => router.push("/alert")}
                    >
                      Notification
                    </Menu.Item>
                    <Menu.Item leftSection={<IconShieldCheck size={20} />}>
                      Privacy and Policy
                    </Menu.Item>
                    <Menu.Item leftSection={<IconBell size={20} />}>
                      Alerts
                    </Menu.Item>
                    <Menu.Item leftSection={<IconHistory size={20} />}>
                      History
                    </Menu.Item>
                    <Menu.Item leftSection={<IconSettings size={20} />}>
                      Settings
                    </Menu.Item>
                  </Stack>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout size={20} />}
                    component={Link}
                    href="/login"
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Main Content */}
      <Container size="xl" py={40}>
        <Paper p="md" mb="xl" bg="blue.0" radius="md">
          <Group>
            <IconAlertCircle size={24} color="#2f80ed" />
            <div>
              <Text fw={600}>Alert Notifications</Text>
              <Text size="sm" c="dimmed">
                You have {alerts.filter(a => a.status === "active").length} active alerts
              </Text>
            </div>
          </Group>
        </Paper>

        <Group justify="space-between" align="center" mb="md">
          <ActionIcon variant="light" radius="xl" color="blue" size="lg" onClick={scrollLeft}>
            <IconChevronLeft />
          </ActionIcon>
          
          <Title order={2} style={{ textAlign: 'center' }}>
            Reported Informations
          </Title>
          
          <ActionIcon variant="light" radius="xl" color="blue" size="lg" onClick={scrollRight}>
            <IconChevronRight />
          </ActionIcon>
        </Group>

        <Box style={{ position: 'relative', marginBottom: 40 }}>
          <ActionIcon
            variant="filled"
            color="gray"
            radius="xl"
            size="xl"
            style={{
              position: 'absolute',
              left: -25,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onClick={scrollLeft}
          >
            <IconChevronLeft size={20} />
          </ActionIcon>

          <ScrollArea 
            w="100%" 
            type="hover"
            viewportRef={scrollRef}
            scrollbarSize={0}
            styles={{ scrollbar: { display: 'none' } }}
          >
            <Group wrap="nowrap" gap="lg" p="md">
              {alerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  withBorder 
                  shadow="sm" 
                  radius="md" 
                  p={0} 
                  style={{ 
                    overflow: 'hidden',
                    minWidth: 320,
                    flexShrink: 0,
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Box style={{ height: 180, position: 'relative' }}>
                    <Image
                      src={alert.imageUrl}
                      alt={alert.brand}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Box>
                  
                  <Box p="lg">
                    <Group justify="space-between" mb="md">
                      <Badge
                        color={alert.status === "active" ? "red" : "green"}
                        variant="light"
                      >
                        {alert.status === "active" ? "ACTIVE" : "RESOLVED"}
                      </Badge>
                      <Text fw={700} size="lg" c="blue.6">
                        {alert.code}
                      </Text>
                    </Group>

                    <Stack gap="xs">
                      <Group gap="xs">
                        <IconCar size={16} color="blue" />
                        <Text fw={700} size="lg">
                          {alert.brand}
                        </Text>
                      </Group>

                      <Text size="md" fw={500}>
                        {alert.details}
                      </Text>

                      <Group gap="xs">
                        <IconMapPin size={16} color="gray" />
                        <Text size="sm">{alert.location}</Text>
                      </Group>

                      <Group gap="xs">
                        <IconCalendar size={16} color="gray" />
                        <Text size="sm">{alert.time}</Text>
                      </Group>
                    </Stack>

                    <Button
                      fullWidth
                      mt="md"
                      variant="light"
                      color="blue"
                      rightSection={<IconChevronRight size={16} />}
                      onClick={() => handleViewDetail(alert)}
                    >
                      View Detail
                    </Button>
                  </Box>
                </Card>
              ))}
            </Group>
          </ScrollArea>

          <ActionIcon
            variant="filled"
            color="black"
            radius="xl"
            size="xl"
            style={{
              position: 'absolute',
              right: -25,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            onClick={scrollRight}
          >
            <IconChevronRight size={20} />
          </ActionIcon>
        </Box>

        <Paper withBorder p="lg" mt="xl" radius="md">
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <Stack align="center" gap={0}>
              <Text size="xl" fw={800} c="blue.6">
                {alerts.length}
              </Text>
              <Text size="sm" c="dimmed">
                Total Alerts
              </Text>
            </Stack>
            <Stack align="center" gap={0}>
              <Text size="xl" fw={800} c="green.6">
                {alerts.filter((a) => a.status === "resolved").length}
              </Text>
              <Text size="sm" c="dimmed">
                Resolved
              </Text>
            </Stack>
            <Stack align="center" gap={0}>
              <Text size="xl" fw={800} c="red.6">
                {alerts.filter((a) => a.status === "active").length}
              </Text>
              <Text size="sm" c="dimmed">
                Active
              </Text>
            </Stack>
          </SimpleGrid>
        </Paper>
      </Container>

      {/* POPUP DETAIL CARD - FIXED SCROLLING */}
      {selectedAlert && (
        <>
          {/* Overlay */}
          <Box
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 1000,
            }}
            onClick={handleBackgroundClick}
          />
          
          {/* Detail Card Container - FIXED POSITION WITH SCROLL */}
          <Box
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95%',
              maxWidth: '900px',
              height: '90vh', // Fixed height
              backgroundColor: 'white',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <ActionIcon
              variant="filled"
              color="dark"
              radius="xl"
              size="lg"
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 1002,
              }}
              onClick={handleCloseDetail}
            >
              <IconX size={20} />
            </ActionIcon>

            {/* SCROLLABLE CONTENT - THIS IS WHAT SCROLLS */}
            <Box style={{ 
              flex: 1, 
              overflowY: 'auto', // Enables vertical scrolling
              paddingBottom: '20px', // Space for shadow
            }}>
              {/* Main Image */}
              <Box style={{ height: 300, position: 'relative' }}>
                <Image
                  src={selectedAlert.imageUrl}
                  alt={selectedAlert.brand}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="100vw"
                  priority
                />
              </Box>

              {/* Content */}
              <Box p="xl">
                <Group justify="space-between" mb="xl">
                  <Badge size="xl" color={selectedAlert.status === "active" ? "red" : "green"}>
                    {selectedAlert.status === "active" ? "ACTIVE ALERT" : "RESOLVED"}
                  </Badge>
                  <Text fw={800} size="2rem" c="blue.6">{selectedAlert.code}</Text>
                </Group>

                <Box mb="xl">
                  <Text fw={800} size="2rem" mb="xs">{selectedAlert.brand}</Text>
                  <Text size="xl" c="dimmed" fw={500}>{selectedAlert.details}</Text>
                </Box>

                <Divider mb="xl" />

                {/* Description Section */}
                <Box mb="xl">
                  <Group mb="md">
                    <IconInfoCircle size={24} />
                    <Text fw={700} size="xl">Full Description</Text>
                  </Group>
                  <Paper p="xl" withBorder radius="md" bg="gray.0">
                    <Text size="lg" style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {selectedAlert.fullDescription}
                    </Text>
                  </Paper>
                </Box>

                {/* Features Grid */}
                <Box mb="xl">
                  <Text fw={700} size="xl" mb="lg">Vehicle Features</Text>
                  <SimpleGrid cols={3} spacing="lg">
                    {selectedAlert.features?.map((feature, index) => (
                      <Group key={index} gap="sm">
                        <IconCheck size={20} color="green" />
                        <Text fw={500}>{feature}</Text>
                      </Group>
                    ))}
                  </SimpleGrid>
                </Box>

                {/* Additional Info */}
                {selectedAlert.additionalInfo && (
                  <Box mb="xl">
                    <Text fw={700} size="xl" mb="lg">Technical Specifications</Text>
                    <Paper p="xl" withBorder radius="md">
                      <SimpleGrid cols={2} spacing="lg">
                        <Box>
                          <Text fw={600} mb="xs">VIN Number</Text>
                          <Text>{selectedAlert.additionalInfo.vin}</Text>
                        </Box>
                        <Box>
                          <Text fw={600} mb="xs">Engine Size</Text>
                          <Text>{selectedAlert.additionalInfo.engineSize}</Text>
                        </Box>
                        <Box>
                          <Text fw={600} mb="xs">Insurance Company</Text>
                          <Text>{selectedAlert.additionalInfo.insuranceCompany}</Text>
                        </Box>
                        <Box>
                          <Text fw={600} mb="xs">Policy Number</Text>
                          <Text>{selectedAlert.additionalInfo.policyNumber}</Text>
                        </Box>
                        <Box>
                          <Text fw={600} mb="xs">Fuel Capacity</Text>
                          <Text>{selectedAlert.additionalInfo.fuelCapacity}</Text>
                        </Box>
                        <Box>
                          <Text fw={600} mb="xs">Seating Capacity</Text>
                          <Text>{selectedAlert.additionalInfo.seatingCapacity}</Text>
                        </Box>
                      </SimpleGrid>
                    </Paper>
                  </Box>
                )}

                {/* Location & Time */}
                <SimpleGrid cols={2} mb="xl">
                  <Paper p="xl" withBorder radius="md">
                    <Group mb="md">
                      <IconMapPinFilled size={24} color="blue" />
                      <Text fw={700} size="lg">Last Known Location</Text>
                    </Group>
                    <Text size="md">{selectedAlert.lastSeen}</Text>
                  </Paper>
                  <Paper p="xl" withBorder radius="md">
                    <Group mb="md">
                      <IconCalendar size={24} color="blue" />
                      <Text fw={700} size="lg">Report Timeline</Text>
                    </Group>
                    <Text size="md">Reported: {selectedAlert.reportDate}</Text>
                    <Text size="md" mt="sm">Last Updated: Today</Text>
                  </Paper>
                </SimpleGrid>

                {/* Contact Information */}
                <Paper p="xl" withBorder radius="md" bg="blue.0" mb="xl">
                  <Text fw={700} size="xl" mb="lg">Contact Information</Text>
                  <Stack gap="xl">
                    <Box>
                      <Group mb="sm">
                        <IconUser size={22} />
                        <Text fw={600} size="lg">Reported By</Text>
                      </Group>
                      <Text size="md">{selectedAlert.contact.name}</Text>
                      {selectedAlert.contact.additional && (
                        <Text size="sm" c="dimmed" mt={4}>{selectedAlert.contact.additional}</Text>
                      )}
                    </Box>
                    <Box>
                      <Group mb="sm">
                        <IconPhone size={22} />
                        <Text fw={600} size="lg">Contact Number</Text>
                      </Group>
                      <Text size="md">{selectedAlert.contact.phone}</Text>
                    </Box>
                    <Box>
                      <Group mb="sm">
                        <IconMail size={22} />
                        <Text fw={600} size="lg">Email Address</Text>
                      </Group>
                      <Text size="md">{selectedAlert.contact.email}</Text>
                    </Box>
                  </Stack>
                </Paper>

                {/* Additional Images */}
                <Box mb="xl">
                  <Text fw={700} size="xl" mb="lg">Additional Evidence</Text>
                  <Group gap="lg">
                    {[1, 2, 3, 4].map((i) => (
                      <Box 
                        key={i} 
                        style={{ 
                          width: 150, 
                          height: 150, 
                          position: 'relative', 
                          borderRadius: '12px', 
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: '3px solid #e9ecef',
                        }}
                      >
                        <Image
                          src={selectedAlert.imageUrl}
                          alt={`Evidence ${i}`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                    ))}
                  </Group>
                </Box>

                {/* Vehicle History */}
                <Paper p="xl" withBorder radius="md" mb="xl">
                  <Text fw={700} size="xl" mb="lg">Search History</Text>
                  <Stack gap="md">
                    <Group justify="apart">
                      <Text fw={600}>Search Radius</Text>
                      <Badge color="blue" size="lg">50 mile radius</Badge>
                    </Group>
                    <Group justify="apart">
                      <Text fw={600}>Search Duration</Text>
                      <Text>Ongoing</Text>
                    </Group>
                    <Group justify="apart">
                      <Text fw={600}>Search Team</Text>
                      <Text>Local Police & Volunteer Group</Text>
                    </Group>
                  </Stack>
                </Paper>
              </Box>
            </Box>

            {/* Fixed Bottom Buttons */}
            <Box p="xl" style={{ 
              borderTop: '2px solid #e0e0e0', 
              background: 'white',
              flexShrink: 0, // Prevents shrinking
            }}>
              <Group justify="space-between">
                <Button
                  size="lg"
                  variant="light"
                  color="gray"
                  leftSection={<IconX size={20} />}
                  onClick={handleCloseDetail}
                  radius="md"
                >
                  Close Details
                </Button>
                <Group>
                  <Button
                    size="lg"
                    variant="outline"
                    color="blue"
                    leftSection={<IconBell size={20} />}
                    onClick={() => alert('Notifications sent!')}
                    radius="md"
                  >
                    Notify Me
                  </Button>
                  <Button
                    size="lg"
                    color="blue"
                    leftSection={<IconCheck size={20} />}
                    onClick={() => {
                      alert('Marked as reviewed!');
                      handleCloseDetail();
                    }}
                    radius="md"
                  >
                    Mark as Reviewed
                  </Button>
                </Group>
              </Group>
            </Box>
          </Box>
        </>
      )}

      <MainFooter />
    </Box>
  );
}