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
  ScrollArea,
  Table,
  Grid,
  Loader,
  Card,
  Divider,
  Pagination,
  TextInput,
  Menu,
  UnstyledButton,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconMapPin,
  IconCalendar,
  IconArrowLeft,
  IconDownload,
  IconFilter,
  IconTable,
  IconMap,
  IconMapPinFilled,
  IconCar,
  IconCamera,
  IconClock,
  IconEye,
  IconShield,
  IconCheck,
  IconStar,
  IconChevronRight,
  IconSearch,
  IconHome,
  IconUser,
  IconBell,
  IconShieldCheck,
  IconHistory,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { getAlertById } from "../../../data/alertsData";
import MainFooter from "../../../components/MainFooter.jsx";

// Helper to get dynamic background/color values
const getBg = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);
const getTextColor = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);

export default function AlertDetailPage() {
  const router = useRouter();
  const params = useParams();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedDetection, setSelectedDetection] = useState(null);
  const itemsPerPage = 10;

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
  const tableHeaderBg = getBg(colorScheme, '#dbeafe', theme.colors.blue[9]);
  const tableHeaderText = getBg(colorScheme, '#1e40af', theme.colors.blue[2]);
  const paginationBg = getBg(colorScheme, '#dbeafe', theme.colors.blue[9]);
  const paginationText = getBg(colorScheme, '#1e40af', theme.colors.blue[2]);
  const backButtonBg = '#399afc'; // keep accent
  const selectedRowBg = getBg(colorScheme, '#f0f9ff', theme.colors.blue[9] + '30');
  const selectedRowBorder = '#3b82f6'; // accent

  useEffect(() => {
    setIsClient(true);

    if (params?.id) {
      setTimeout(() => {
        const data = getAlertById(params.id);
        setAlertData(data);
        // Set the first detection as selected by default
        if (data?.detectionHistory?.length > 0) {
          setSelectedDetection(data.detectionHistory[0]);
        }
        setLoading(false);
      }, 300);
    }
  }, [params?.id]);

  const handleDetectionClick = (detection) => {
    setSelectedDetection(detection);
  };

  const handleRowClick = (detection, e) => {
    // Only trigger if not clicking the arrow button
    if (!e.target.closest(".arrow-button")) {
      handleDetectionClick(detection);
    }
  };

  const handleArrowClick = (detection, e) => {
    e.stopPropagation(); // Prevent row click from triggering
    // TODO: Add navigation to detail page
     router.push(`/alert-detail/${params.id}/detection/${detection.id}`);
    
  };

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

  if (!alertData) {
    return (
      <Box style={{ padding: "40px", textAlign: "center", backgroundColor: mainBg }}>
        <Title order={2}>Alert Not Found</Title>
        <Button onClick={() => router.push("/alert")} mt="md">
          Back to Alerts
        </Button>
      </Box>
    );
  }

  const detectionHistoryData = alertData.detectionHistory || [];
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedData = detectionHistoryData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(detectionHistoryData.length / itemsPerPage);

  // Get marker positions for the map
  const getMarkerPositions = () => {
    const positions = [];

    // Add selected detection as main marker
    if (selectedDetection) {
      positions.push({
        ...selectedDetection,
        isSelected: true,
        position: { left: "50%", top: "50%" },
      });
    }

    // Add other detections as secondary markers
    detectionHistoryData.slice(0, 5).forEach((detection, index) => {
      if (selectedDetection && detection.id === selectedDetection.id) return;

      positions.push({
        ...detection,
        isSelected: false,
        position: {
          left: `${20 + index * 15}%`,
          top: `${30 + index * 10}%`,
        },
      });
    });

    return positions;
  };

  const markerPositions = getMarkerPositions();

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: mainBg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header - EXACTLY LIKE AlertPage */}
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

              {/* User Menu - EXACTLY LIKE AlertPage */}
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

      {/* Back to Alerts Section - BELOW the navigation bar */}
      <Box style={{ 
        padding: "24px 0 16px 0", 
      }}>
        <Container size="xl">
          <Group>
            <Button
              variant="subtle"
              color="white"
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => router.push("/alert")}
              size="md"
              style={{
                backgroundColor: backButtonBg,
                padding: "10px"
              }}
            >
              
            </Button>
            <Box style={{ marginLeft: "16px" }}>
              <Text fw={800} size="xl" style={{ color: getTextColor(colorScheme, '#212529', theme.colors.gray[3]) }}>
                Alert Detail
              </Text>
              <Text size="sm" c="dimmed">
                ID: {alertData.code} • {alertData.brand} • {alertData.location}
              </Text>
            </Box>
          </Group>
        </Container>
      </Box>

      {/* Main Content */}
      <Container size="xl" py={40} style={{ flex: 1 }}>
        {/* Alert Header */}
        <Paper p="xl" mb="xl" withBorder radius="md" bg={paperBg}>
          <Group justify="space-between" mb="md">
            <Box>
              <Title order={2} mb="xs">
                {alertData.title || alertData.brand}
              </Title>
              <Group gap="lg">
                <Badge
                  size="lg"
                  color={alertData.status === "active" ? "red" : "green"}
                >
                  {alertData.status.toUpperCase()}
                </Badge>
                <Group gap="xs">
                  <IconMapPin size={16} />
                  <Text>{alertData.location}</Text>
                </Group>
                <Group gap="xs">
                  <IconCalendar size={16} />
                  <Text>
                    {alertData.date} • {alertData.startTime}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconCar size={16} />
                  <Text>{alertData.type}</Text>
                </Group>
              </Group>
            </Box>
            <Group>
              <Button leftSection={<IconDownload size={18} />} variant="light">
                Export Data
              </Button>
              <Button leftSection={<IconFilter size={18} />} variant="light">
                Filter
              </Button>
            </Group>
          </Group>
          <Text size="lg" c="dimmed">
            {alertData.description}
          </Text>
        </Paper>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 2, md: 4 }} mb="xl">
          <Paper p="md" withBorder radius="md" ta="center">
            <Group justify="center" mb="xs">
              <IconEye size={20} />
              <Text size="sm" c="dimmed">
                Total Detections
              </Text>
            </Group>
            <Title order={2}>{detectionHistoryData.length || 0}</Title>
          </Paper>
          <Paper p="md" withBorder radius="md" ta="center">
            <Group justify="center" mb="xs">
              <IconClock size={20} />
              <Text size="sm" c="dimmed">
                Active Duration
              </Text>
            </Group>
            <Title order={2}>{alertData.duration || "N/A"}</Title>
          </Paper>
          <Paper p="md" withBorder radius="md" ta="center">
            <Group justify="center" mb="xs">
              <IconCamera size={20} />
              <Text size="sm" c="dimmed">
                CCTV Confidence
              </Text>
            </Group>
            <Title order={2}>{alertData.cctvInfo?.confidence || "N/A"}</Title>
          </Paper>
          <Paper p="md" withBorder radius="md" ta="center">
            <Group justify="center" mb="xs">
              <IconShield size={20} />
              <Text size="sm" c="dimmed">
                Status
              </Text>
            </Group>
            <Title order={2}>
              {alertData.status === "active" ? "Active" : "Resolved"}
            </Title>
          </Paper>
        </SimpleGrid>

        {/* Split Layout: Map (Top Half) and Table (Bottom Half) */}
        <Grid gutter="xl">
          {/* TOP HALF: Map Section */}
          <Grid.Col span={12}>
            <Paper withBorder radius="md" style={{ height: "400px" }}>
              <Box
                p="md"
                style={{
                  borderBottom: `1px solid ${borderColor}`,
                  backgroundColor: "#1e40af", // keep accent
                  color: "white",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Group>
                  <IconMap size={20} />
                  <Text fw={600}>
                    Detection Map -{" "}
                    {selectedDetection
                      ? selectedDetection.location
                      : alertData.location}
                  </Text>
                </Group>
                {selectedDetection && (
                  <Badge color="white" variant="filled" size="lg">
                    Selected: {selectedDetection.name}
                  </Badge>
                )}
              </Box>
              <Box
                style={{
                  height: "calc(400px - 72px)",
                  background: lightBlueBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                <Box
                  style={{
                    textAlign: "center",
                    position: "relative",
                    width: "100%",
                    padding: "20px",
                  }}
                >
                  {/* Map visualization */}
                  <Box
                    style={{
                      width: "100%",
                      height: "250px",
                      background: mapGradient,
                      borderRadius: "8px",
                      position: "relative",
                      marginBottom: "15px",
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
                        title={`${marker.location} - ${marker.startTime}\nClick to view details`}
                        onClick={() => handleDetectionClick(marker)}
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
                    {selectedDetection && (
                      <Box
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: getBg(colorScheme, 'rgba(255,255,255,0.9)', 'rgba(0,0,0,0.8)'),
                          padding: "8px 16px",
                          borderRadius: "20px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Text size="sm" fw={600} color={getBg(colorScheme, '#1e40af', theme.colors.blue[2])}>
                          {selectedDetection.location}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {selectedDetection.date} • {selectedDetection.time}
                        </Text>
                      </Box>
                    )}
                  </Box>

                  <Text mt="md" fw={600}>
                    {selectedDetection
                      ? selectedDetection.location
                      : alertData.mapLocation || alertData.location}
                  </Text>
                  <Text size="sm" c="dimmed" mt="xs">
                    {selectedDetection
                      ? `Last seen: ${selectedDetection.time} • Accuracy: ${selectedDetection.accuracy || "N/A"}`
                      : `Last seen: ${alertData.lastSeen}`}
                  </Text>
                </Box>
              </Box>
            </Paper>
          </Grid.Col>

          {/* BOTTOM HALF: Interactive Alerts Table */}
          <Grid.Col span={12}>
            <Paper
              withBorder
              radius="md"
              style={{
                height: "400px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Table Header */}
              <Box
                p="md"
                style={{
                  borderBottom: `1px solid ${borderColor}`,
                  backgroundColor: "#3b82f6", // keep accent
                  color: "white",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                }}
              >
                <Group justify="space-between">
                  <Group>
                    <IconTable size={20} />
                    <Text fw={600}>Alerts History</Text>
                  </Group>
                  <Group>
                    <Badge color="white" variant="filled" size="lg">
                      {
                        detectionHistoryData.filter(
                          (a) => a.status === "active",
                        ).length
                      }{" "}
                      Active
                    </Badge>
                    <Badge color="white" variant="filled" size="lg">
                      {detectionHistoryData.length} Total
                    </Badge>
                  </Group>
                </Group>
              </Box>

              {/* Table Container */}
              <Box style={{ flex: 1, overflow: "hidden" }}>
                <ScrollArea style={{ height: "100%" }}>
                  <Table striped highlightOnHover>
                    <Table.Thead style={{ backgroundColor: tableHeaderBg }}>
                      <Table.Tr>
                        <Table.Th
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            color: tableHeaderText,
                          }}
                        >
                          Alert
                        </Table.Th>
                        <Table.Th
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            color: tableHeaderText,
                          }}
                        >
                          Location
                        </Table.Th>
                        <Table.Th
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            color: tableHeaderText,
                          }}
                        >
                          Date
                        </Table.Th>
                        <Table.Th
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            color: tableHeaderText,
                          }}
                        >
                          Time
                        </Table.Th>
                        <Table.Th
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            color: tableHeaderText,
                          }}
                        >
                          Accuracy
                        </Table.Th>
                        <Table.Th
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            color: tableHeaderText,
                          }}
                        >
                          Type
                        </Table.Th>
                        <Table.Th
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            color: tableHeaderText,
                          }}
                        >
                          Status
                        </Table.Th>
                        <Table.Th
                          style={{
                            textAlign: "center",
                            fontWeight: 700,
                            color: tableHeaderText,
                          }}
                        >
                          Actions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {paginatedData.map((detection) => {
                        const accuracy =
                          detection.accuracy ||
                          (detection.type === "Suggestion"
                            ? "--"
                            : `${Math.floor(Math.random() * 30) + 50}%`);

                        const isSelected =
                          selectedDetection?.id === detection.id;

                        return (
                          <Table.Tr
                            key={detection.id}
                            style={{
                              backgroundColor: isSelected ? selectedRowBg : undefined,
                              cursor: "pointer",
                              borderLeft: isSelected
                                ? `4px solid ${selectedRowBorder}`
                                : "none",
                            }}
                            onClick={(e) => handleRowClick(detection, e)}
                          >
                            <Table.Td style={{ textAlign: "center" }}>
                              <Group justify="center" gap="xs">
                                <IconAlertCircle
                                  size={16}
                                  color={
                                    detection.type === "Suggestion"
                                      ? "#f59e0b"
                                      : "#ef4444"
                                  }
                                />
                                <Text fw={600}>{detection.name}</Text>
                              </Group>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              <Group justify="center" gap="xs">
                                <IconMapPin size={14} color="#3b82f6" />
                                <Text>{detection.location}</Text>
                              </Group>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              <Group justify="center" gap="xs">
                                <IconCalendar size={14} color="#3b82f6" />
                                <Text>
                                  {detection.date || detection.startDate}
                                </Text>
                              </Group>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              {detection.time || detection.startTime}
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              {accuracy === "--" ? (
                                <Text c="dimmed">--</Text>
                              ) : (
                                <Badge
                                  color={
                                    parseFloat(accuracy) >= 80
                                      ? "green"
                                      : parseFloat(accuracy) >= 60
                                        ? "yellow"
                                        : "red"
                                  }
                                  variant="light"
                                  size="sm"
                                >
                                  {accuracy}
                                </Badge>
                              )}
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              <Group justify="center" gap="xs">
                                {detection.type === "Suggestion" ? (
                                  <IconStar size={14} color="#f59e0b" />
                                ) : (
                                  <IconCamera size={14} color="#3b82f6" />
                                )}
                                <Badge
                                  color={
                                    detection.type === "Suggestion"
                                      ? "yellow"
                                      : "blue"
                                  }
                                  variant="light"
                                  size="sm"
                                >
                                  {detection.type || "CCTV"}
                                </Badge>
                              </Group>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              <Badge
                                color={
                                  detection.status === "active"
                                    ? "red"
                                    : "green"
                                }
                                variant="filled"
                                size="sm"
                              >
                                {detection.status === "active"
                                  ? "ACTIVE"
                                  : "RESOLVED"}
                              </Badge>
                            </Table.Td>
                            <Table.Td style={{ textAlign: "center" }}>
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                size="lg"
                                className="arrow-button"
                                onClick={(e) => handleArrowClick(detection, e)}
                                style={{
                                  backgroundColor: isSelected
                                    ? getBg(colorScheme, '#dbeafe', theme.colors.blue[9])
                                    : "transparent",
                                  borderRadius: "50%",
                                }}
                              >
                                <IconChevronRight size={18} />
                              </ActionIcon>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </ScrollArea>
              </Box>

              {/* Pagination */}
              <Box
                p="md"
                style={{
                  borderTop: `1px solid ${borderColor}`,
                  backgroundColor: paginationBg,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text size="sm" c={paginationText} fw={500}>
                  Page {activePage} of {totalPages} •{" "}
                  {detectionHistoryData.length} total alerts
                  {selectedDetection &&
                    ` • Selected: ${selectedDetection.name}`}
                </Text>
                <Pagination
                  value={activePage}
                  onChange={setActivePage}
                  total={totalPages}
                  size="sm"
                  radius="sm"
                  withEdges
                  siblings={1}
                  color="blue"
                />
              </Box>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Actions */}
        <Group justify="center" mt="xl">
          <Button
            size="lg"
            variant="light"
            color="gray"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => router.push("/alert")}
          >
            Back to Alerts
          </Button>
          <Button
            size="lg"
            color="blue"
            leftSection={<IconDownload size={18} />}
          >
            Download Full Report
          </Button>
        </Group>
      </Container>

      <MainFooter />
    </Box>
  );
}