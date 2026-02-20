"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Container,
  Title,
  Text,
  Group,
  Button,
  Paper,
  Stack,
  Avatar,
  Badge,
  SimpleGrid,
  ActionIcon,
  Loader,
  Card,
  TextInput,
  Menu,
  UnstyledButton,
  Checkbox,
  Image as MantineImage,
  Grid,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconMapPin,
  IconCalendar,
  IconArrowLeft,
  IconDownload,
  IconCamera,
  IconCheck,
  IconSearch,
  IconHome,
  IconUser,
  IconBell,
  IconShieldCheck,
  IconHistory,
  IconSettings,
  IconLogout,
  IconPhoto,
  IconMap,
  IconMapPinFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { getAlertById } from "../../../../../data/alertsData";
import MainFooter from "../../../../../components/MainFooter.jsx";

// Helper to get dynamic background/color values
const getBg = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);
const getTextColor = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);

export default function SingleDetectionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [alertData, setAlertData] = useState(null);
  const [detectionData, setDetectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isFalseAlert, setIsFalseAlert] = useState(false);

  // Dynamic colors
  const mainBg = getBg(colorScheme, 'white', theme.colors.dark[7]);
  const headerBg = getBg(colorScheme, 'white', theme.colors.dark[6]);
  const borderColor = getBg(colorScheme, '#E9ECEF', theme.colors.dark[5]);
  const paperBg = getBg(colorScheme, 'white', theme.colors.dark[6]);
  const lightBlueBg = getBg(colorScheme, '#f0f9ff', theme.colors.blue[9] + '40');
  const mapGradient = colorScheme === 'dark'
    ? 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)'
    : 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)';
  const mapBorder = getBg(colorScheme, '#bfdbfe', theme.colors.blue[8]);
  const backButtonBg = '#399afc'; // keep accent
  const detectionMetadataHeaderBg = getBg(colorScheme, '#f8f9fa', theme.colors.dark[5]);
  const detectionMetadataText = getTextColor(colorScheme, '#212529', theme.colors.gray[3]);

  useEffect(() => {
    if (params?.id && params?.detection_id) {
      setTimeout(() => {
        const data = getAlertById(params.id);
        setAlertData(data);
        
        // Find the specific detection from history
        if (data?.detectionHistory) {
          const detection = data.detectionHistory.find(
            d => d.id === params.detection_id
          );
          setDetectionData(detection || data.detectionHistory[0]);
        }
        
        setLoading(false);
      }, 300);
    }
  }, [params?.id, params?.detection_id]);

  const handleConfirmation = (type) => {
    if (type === 'owner') {
      setIsOwner(true);
      setIsFalseAlert(false);
    } else if (type === 'false') {
      setIsOwner(false);
      setIsFalseAlert(true);
    }
    
    // Here you would typically send this to your backend
    console.log(`Confirmation: ${type}`);
  };

  // Get marker positions for the map
  const getMarkerPositions = () => {
    const positions = [];

    // Add main marker for this detection
    if (detectionData) {
      positions.push({
        ...detectionData,
        isSelected: true,
        position: { left: "50%", top: "50%" },
      });
    }

    // Add a few other markers from the alert's detection history
    if (alertData?.detectionHistory) {
      alertData.detectionHistory.slice(0, 3).forEach((detection, index) => {
        if (detectionData && detection.id === detectionData.id) return;

        positions.push({
          ...detection,
          isSelected: false,
          position: {
            left: `${30 + index * 20}%`,
            top: `${20 + index * 25}%`,
          },
        });
      });
    }

    return positions;
  };

  const markerPositions = getMarkerPositions();

  if (loading) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: mainBg,
        }}
      >
        <Loader size="lg" />
      </Box>
    );
  }

  if (!alertData || !detectionData) {
    return (
      <Box style={{ padding: "40px", textAlign: "center", backgroundColor: mainBg }}>
        <Title order={2}>Detection Not Found</Title>
        <Button onClick={() => router.push(`/alert-detail/${params.id}`)} mt="md">
          Back to Alert
        </Button>
      </Box>
    );
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: mainBg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header - Same as AlertDetailPage */}
      <Box
        bg={headerBg}
        py="sm"
        style={{
          borderBottom: `1px solid ${borderColor}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="xl">
          <Group justify="space-between">
            {/* Logo */}
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={0}
              height={50}
              sizes="100vw"
              style={{ width: "auto", height: "50px", borderRadius: "8px" }}
            />

            {/* Search Bar */}
            <TextInput
              placeholder="Search alerts by brand, code, location..."
              leftSection={<IconSearch size={16} />}
              style={{ width: "40%" }}
              radius="xl"
            />

            {/* Right Side Navigation */}
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

              {/* User Menu */}
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

      {/* Back Navigation */}
      <Box style={{ padding: "24px 0 16px 0" }}>
        <Container size="xl">
          <Group>
            <Button
              variant="subtle"
              color="white"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => router.push(`/alert-detail/${params.id}`)}
              size="md"
              style={{
                backgroundColor: backButtonBg,
                padding: "10px"
              }}
            >
              
            </Button>
            <Box style={{ marginLeft: "16px" }}>
              <Text fw={800} size="xl" style={{ color: detectionMetadataText }}>
                Detection Detail
              </Text>
              <Text size="sm" c="dimmed">
                Alert: {alertData.code} • Detection: {detectionData.name} • {detectionData.location}
              </Text>
            </Box>
          </Group>
        </Container>
      </Box>

      {/* Main Content - WITH REAL MAP VISUALIZATION */}
      <Container size="xl" py={40} style={{ flex: 1 }}>
        {/* Header Title */}
        <Box mb="xl">
          <Title order={1} style={{ color: detectionMetadataText }}>{detectionData.name}</Title>
        </Box>

        <Grid gutter="xl">
          {/* LEFT COLUMN: Map Visualization (Full Height) */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper withBorder radius="md" style={{ height: "500px" }}> 
              <Box
                p="md"
                style={{
                  borderBottom: `1px solid ${borderColor}`,
                  backgroundColor: "#1e40af", // keep accent
                  color: "white",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <Group>
                  <IconMap size={20} />
                  <Text fw={600} size="lg">Detection Map - {detectionData.location}</Text>
                </Group>
              </Box>
              
              {/* Map Visualization Area - LIKE IN AlertDetailPage */}
              <Box 
                style={{ 
                  height: "calc(100% - 65px)",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                {/* Actual Map Visualization */}
                <Box
                  style={{
                    flex: 1,
                    background: lightBlueBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    cursor: "pointer",
                    padding: "20px",
                  }}
                >
                  <Box
                    style={{
                      width: "100%",
                      height: "100%",
                      background: mapGradient,
                      borderRadius: "8px",
                      position: "relative",
                      border: `1px solid ${mapBorder}`,
                    }}
                  >
                    {/* Display markers */}
                    {markerPositions.map((marker, index) => (
                      <Box
                        key={marker.id}
                        style={{
                          position: "absolute",
                          left: marker.position.left,
                          top: marker.position.top,
                          transform: marker.isSelected
                            ? "translate(-50%, -50%)"
                            : "translate(-50%, -50%)",
                          backgroundColor: marker.isSelected
                            ? "#ef4444"
                            : marker.status === "active"
                              ? "#10b981"
                              : "#6b7280",
                          width: marker.isSelected ? "20px" : "14px",
                          height: marker.isSelected ? "20px" : "14px",
                          borderRadius: "50%",
                          border: marker.isSelected
                            ? "3px solid white"
                            : "2px solid white",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          zIndex: marker.isSelected ? 10 : 1,
                          transition: "all 0.2s",
                        }}
                        title={`${marker.location} - ${marker.time}\nClick to view details`}
                      >
                        {marker.isSelected ? (
                          <IconMapPinFilled size={12} color="white" />
                        ) : (
                          <Text
                            size={marker.isSelected ? "10px" : "8px"}
                            fw={700}
                            color="white"
                          >
                            {index + 1}
                          </Text>
                        )}
                      </Box>
                    ))}

                    {/* Selected location label */}
                    {detectionData && (
                      <Box
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: getBg(colorScheme, 'rgba(255, 255, 255, 0.9)', 'rgba(0, 0, 0, 0.8)'),
                          padding: "8px 16px",
                          borderRadius: "20px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Text size="sm" fw={600} color={getBg(colorScheme, '#1e40af', theme.colors.blue[2])}>
                          {detectionData.location}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {detectionData.date} • {detectionData.time}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid.Col>

          {/* RIGHT COLUMN: Beautiful Colorful Info Cards */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="lg">
              {/* Accuracy Card - Colorful */}
              <Paper 
                withBorder 
                radius="md"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                  borderLeft: "4px solid #3b82f6",
                }}
              >
                <Box
                  p="md"
                  style={{
                    background: getBg(colorScheme, "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)"),
                  }}
                >
                  <Group justify="space-between" align="center">
                    <Box>
                      <Text fw={700} size="lg" style={{ color: getBg(colorScheme, "#0369a1", theme.colors.blue[2]) }}>
                        🎯 Accuracy
                      </Text>
                      <Text size="sm" c="dimmed">
                        Detection confidence
                      </Text>
                    </Box>
                    <Badge
                      size="xl"
                      variant="filled"
                      color="blue"
                      style={{ 
                        fontWeight: 800,
                        fontSize: "16px",
                        padding: "8px 12px",
                        borderRadius: "8px",
                      }}
                    >
                      {detectionData.accuracy || alertData.accuracy}
                    </Badge>
                  </Group>
                </Box>
              </Paper>

              {/* Category Card - Green Theme */}
              <Paper 
                withBorder 
                radius="md"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                  borderLeft: "4px solid #10b981",
                }}
              >
                <Box
                  p="md"
                  style={{
                    background: getBg(colorScheme, "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", "linear-gradient(135deg, #14532d 0%, #166534 100%)"),
                  }}
                >
                  <Text fw={700} size="lg" style={{ color: getBg(colorScheme, "#047857", theme.colors.green[2]) }} mb="12px">
                    🚗 Category
                  </Text>
                  <Stack gap="md">
                    <Box pl="md">
                      <Text size="sm" fw={600} style={{ color: getBg(colorScheme, "#065f46", theme.colors.green[2]) }}>
                        Type: <span style={{ color: getBg(colorScheme, "#374151", theme.colors.gray[3]) }}>{alertData.category?.type || "Car"}</span>
                      </Text>
                      <Box pl="md" mt="xs">
                        <Text size="sm" fw={600} style={{ color: getBg(colorScheme, "#065f46", theme.colors.green[2]) }}>
                          Brand: <span style={{ color: getBg(colorScheme, "#374151", theme.colors.gray[3]) }}>{alertData.category?.brandName || "Toyota"}</span>
                        </Text>
                        <Box pl="md" mt="xs">
                          <Text size="sm" fw={600} style={{ color: getBg(colorScheme, "#065f46", theme.colors.green[2]) }}>
                            Plate:
                          </Text>
                          <Box 
                            p="xs" 
                            mt="xs" 
                            style={{ 
                              backgroundColor: "#10b981", 
                              borderRadius: "6px",
                              display: "inline-block",
                            }}
                          >
                            <Text size="sm" fw={800} style={{ color: "white", letterSpacing: "1px" }}>
                              {alertData.category?.plateNumber || "A.A 2 11111"}
                            </Text>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box pl="md">
                      <Text size="sm" fw={600} style={{ color: getBg(colorScheme, "#065f46", theme.colors.green[2]) }}>
                        Color:
                      </Text>
                      <Group gap="xs" mt="xs">
                        <Box
                          style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: alertData.color === "Silver" ? "#d1d5db" : 
                                           alertData.color === "White" ? "#ffffff" :
                                           alertData.color === "Black" ? "#000000" :
                                           alertData.color === "Red" ? "#ef4444" : "#d1d5db",
                            borderRadius: "4px",
                            border: "1px solid #9ca3af",
                          }}
                        />
                        <Text size="sm" fw={600} style={{ color: getBg(colorScheme, "#374151", theme.colors.gray[3]) }}>
                          {alertData.color || "Silver"}
                        </Text>
                      </Group>
                    </Box>
                  </Stack>
                </Box>
              </Paper>

              {/* Registered Location Card - Purple Theme */}
              <Paper 
                withBorder 
                radius="md"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                  borderLeft: "4px solid #8b5cf6",
                }}
              >
                <Box
                  p="md"
                  style={{
                    background: getBg(colorScheme, "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)", "linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)"),
                  }}
                >
                  <Group align="flex-start">
                    <Box
                      style={{
                        backgroundColor: "#8b5cf6",
                        padding: "8px",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    >
                      <IconMapPin size={20} />
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <Text fw={700} size="lg" style={{ color: getBg(colorScheme, "#7c3aed", theme.colors.violet[2]) }}>
                        Registered Location
                      </Text>
                      <Text size="sm" style={{ color: getBg(colorScheme, "#6b7280", theme.colors.gray[3]) }} mt="4px">
                        {alertData.registeredLocation || "Address Abebe, Mexico Itoswerit at"}
                      </Text>
                    </Box>
                  </Group>
                </Box>
              </Paper>

              {/* Registered Date Card - Orange Theme */}
              <Paper 
                withBorder 
                radius="md"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                  borderLeft: "4px solid #f59e0b",
                }}
              >
                <Box
                  p="md"
                  style={{
                    background: getBg(colorScheme, "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)", "linear-gradient(135deg, #92400e 0%, #b45309 100%)"),
                  }}
                >
                  <Group align="flex-start">
                    <Box
                      style={{
                        backgroundColor: "#f59e0b",
                        padding: "8px",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    >
                      <IconCalendar size={20} />
                    </Box>
                    <Box style={{ flex: 1 }}>
                      <Text fw={700} size="lg" style={{ color: getBg(colorScheme, "#d97706", theme.colors.orange[2]) }}>
                        Registered Date
                      </Text>
                      <Stack gap="xs" mt="xs">
                        <Group gap="xs">
                          <Badge color="orange" variant="light" size="sm">
                            Date
                          </Badge>
                          <Text size="sm" fw={600} style={{ color: getBg(colorScheme, "#374151", theme.colors.gray[3]) }}>
                            {alertData.registeredDate || "10/11/2023"}
                          </Text>
                        </Group>
                        <Group gap="xs">
                          <Badge color="orange" variant="light" size="sm">
                            Time
                          </Badge>
                          <Text size="sm" fw={600} style={{ color: getBg(colorScheme, "#374151", theme.colors.gray[3]) }}>
                            {alertData.registeredTime || "8:11 PM"}
                          </Text>
                        </Group>
                      </Stack>
                    </Box>
                  </Group>
                </Box>
              </Paper>

              {/* Captured Media Card - Pink Theme */}
              <Paper 
                withBorder 
                radius="md"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                  borderLeft: "4px solid #ec4899",
                }}
              >
                <Box
                  p="md"
                  style={{
                    background: getBg(colorScheme, "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)", "linear-gradient(135deg, #831843 0%, #9d174d 100%)"),
                  }}
                >
                  <Group justify="space-between" align="center" mb="md">
                    <Group>
                      <Box
                        style={{
                          backgroundColor: "#ec4899",
                          padding: "8px",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      >
                        <IconCamera size={20} />
                      </Box>
                      <Box>
                        <Text fw={700} size="lg" style={{ color: getBg(colorScheme, "#db2777", theme.colors.pink[2]) }}>
                          Captured Media
                        </Text>
                        <Text size="sm" c="dimmed">
                          Photos & Videos
                        </Text>
                      </Box>
                    </Group>
                    <Badge color="pink" variant="light">
                      {alertData.capturedMedia?.photos?.length || alertData.additionalImages?.length || 0} items
                    </Badge>
                  </Group>

                  {alertData.capturedMedia?.photos?.length > 0 || alertData.additionalImages?.length > 0 ? (
                    <SimpleGrid cols={2} spacing="sm">
                      {(alertData.capturedMedia?.photos || alertData.additionalImages || []).slice(0, 4).map((img, index) => (
                        <Box
                          key={index}
                          style={{
                            aspectRatio: "1/1",
                            overflow: "hidden",
                            borderRadius: "8px",
                            border: `2px solid ${getBg(colorScheme, '#fbcfe8', theme.colors.pink[7])}`,
                            position: "relative",
                          }}
                        >
                          <MantineImage
                            src={img}
                            alt={`Evidence ${index + 1}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <Box
                            style={{
                              position: "absolute",
                              bottom: "0",
                              left: "0",
                              right: "0",
                              background: "rgba(236, 72, 153, 0.8)",
                              padding: "4px",
                              textAlign: "center",
                            }}
                          >
                            <Text size="10px" fw={700} color="white">
                              Photo {index + 1}
                            </Text>
                          </Box>
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box 
                      style={{ 
                        textAlign: "center", 
                        padding: "20px",
                        border: `2px dashed ${getBg(colorScheme, '#fbcfe8', theme.colors.pink[7])}`,
                        borderRadius: "8px",
                        backgroundColor: getBg(colorScheme, 'rgba(252, 231, 243, 0.5)', 'rgba(157, 23, 77, 0.2)'),
                      }}
                    >
                      <IconPhoto size={48} color={getBg(colorScheme, '#f472b6', theme.colors.pink[5])} />
                      <Text mt="md" c="dimmed">No photos or videos available</Text>
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* Confirmation Card - Red/Green Theme */}
              <Paper 
                withBorder 
                radius="md"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  overflow: "hidden",
                  borderLeft: "4px solid #ef4444",
                }}
              >
                <Box
                  p="md"
                  style={{
                    background: getBg(colorScheme, "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)", "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)"),
                  }}
                >
                  <Text fw={700} size="lg" style={{ color: getBg(colorScheme, "#dc2626", theme.colors.red[2]) }} mb="16px">
                    ❓ Is this your car?
                  </Text>
                  
                  <Stack gap="md">
                    {/* Yes Option */}
                    <Card
                      withBorder
                      style={{
                        cursor: "pointer",
                        backgroundColor: isOwner 
                          ? getBg(colorScheme, "#dcfce7", theme.colors.green[9]) 
                          : getBg(colorScheme, "white", theme.colors.dark[6]),
                        borderColor: isOwner 
                          ? "#22c55e" 
                          : getBg(colorScheme, "#e5e7eb", theme.colors.dark[4]),
                        borderLeft: isOwner 
                          ? "4px solid #22c55e" 
                          : `4px solid ${getBg(colorScheme, "#e5e7eb", theme.colors.dark[4])}`,
                        transition: "all 0.2s",
                      }}
                      onClick={() => handleConfirmation('owner')}
                    >
                      <Group justify="space-between">
                        <Group>
                          <Checkbox 
                            checked={isOwner}
                            onChange={() => handleConfirmation('owner')}
                            color="green"
                            size="lg"
                          />
                          <Box>
                            <Text fw={700} style={{ color: isOwner ? getBg(colorScheme, "#166534", theme.colors.green[3]) : getBg(colorScheme, "#374151", theme.colors.gray[3]) }}>
                              ✅ Yes, it is my car
                            </Text>
                            <Text size="sm" c="dimmed">
                              Confirm ownership of this vehicle
                            </Text>
                          </Box>
                        </Group>
                        {isOwner && (
                          <Badge color="green" variant="filled" size="lg">
                            Selected
                          </Badge>
                        )}
                      </Group>
                    </Card>

                    {/* No Option */}
                    <Card
                      withBorder
                      style={{
                        cursor: "pointer",
                        backgroundColor: isFalseAlert 
                          ? getBg(colorScheme, "#fee2e2", theme.colors.red[9]) 
                          : getBg(colorScheme, "white", theme.colors.dark[6]),
                        borderColor: isFalseAlert 
                          ? "#ef4444" 
                          : getBg(colorScheme, "#e5e7eb", theme.colors.dark[4]),
                        borderLeft: isFalseAlert 
                          ? "4px solid #ef4444" 
                          : `4px solid ${getBg(colorScheme, "#e5e7eb", theme.colors.dark[4])}`,
                        transition: "all 0.2s",
                      }}
                      onClick={() => handleConfirmation('false')}
                    >
                      <Group justify="space-between">
                        <Group>
                          <Checkbox 
                            checked={isFalseAlert}
                            onChange={() => handleConfirmation('false')}
                            color="red"
                            size="lg"
                          />
                          <Box>
                            <Text fw={700} style={{ color: isFalseAlert ? getBg(colorScheme, "#dc2626", theme.colors.red[3]) : getBg(colorScheme, "#374151", theme.colors.gray[3]) }}>
                              ❌ No, false alert
                            </Text>
                            <Text size="sm" c="dimmed">
                              Report this as incorrect detection
                            </Text>
                          </Box>
                        </Group>
                        {isFalseAlert && (
                          <Badge color="red" variant="filled" size="lg">
                            Selected
                          </Badge>
                        )}
                      </Group>
                    </Card>

                    {/* Submit Button */}
                    <Button
                      fullWidth
                      size="lg"
                      color={isOwner ? "green" : isFalseAlert ? "red" : "blue"}
                      leftSection={<IconCheck size={20} />}
                      mt="md"
                      disabled={!isOwner && !isFalseAlert}
                      style={{
                        fontWeight: 700,
                        fontSize: "16px",
                        padding: "12px",
                        borderRadius: "8px",
                      }}
                    >
                      {isOwner ? "✅ Confirm Ownership" : 
                       isFalseAlert ? "❌ Report False Alert" : 
                       "Select an option above"}
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>

        {/* Detection Metadata */}
        <Paper withBorder radius="md" mt="xl" bg={paperBg}>
          <Box
            p="md"
            style={{
              borderBottom: `1px solid ${borderColor}`,
              backgroundColor: detectionMetadataHeaderBg,
            }}
          >
            <Text fw={600} size="lg">Detection Details</Text>
          </Box>
          <Box p="md">
            <SimpleGrid cols={{ base: 2, md: 4 }}>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Detection ID</Text>
                <Text fw={600}>{detectionData.id}</Text>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Location</Text>
                <Text fw={600}>{detectionData.location}</Text>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Date & Time</Text>
                <Text fw={600}>{detectionData.date} • {detectionData.time}</Text>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" c="dimmed">Type</Text>
                <Badge
                  color={detectionData.type === "Suggestion" ? "yellow" : "blue"}
                  variant="light"
                >
                  {detectionData.type}
                </Badge>
              </Stack>
            </SimpleGrid>
          </Box>
        </Paper>

        {/* Action Buttons */}
        <Group justify="space-between" mt="xl">
          <Button
            variant="light"
            color="gray"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => router.push(`/alert-detail/${params.id}`)}
          >
            Back to Alert
          </Button>
          
          <Group>
            <Button
              variant="light"
              color="blue"
              leftSection={<IconDownload size={18} />}
            >
              Export Details
            </Button>
            <Button
              color="blue"
              leftSection={<IconCheck size={18} />}
              onClick={() => handleConfirmation(isOwner ? 'owner' : 'false')}
              disabled={!isOwner && !isFalseAlert}
            >
              Submit Response
            </Button>
          </Group>
        </Group>
      </Container>

      <MainFooter />
    </Box>
  );
}