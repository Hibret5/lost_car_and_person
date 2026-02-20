"use client";
import { notifications } from "@mantine/notifications";

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
  useMantineTheme,
  useMantineColorScheme,
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
  IconDots,
  IconEdit,
  IconTrash,
  IconBike,
  IconTruck,
  IconBattery,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import MainFooter from "../../components/MainFooter.jsx";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { getAllAlerts, getStats } from "../../data/alertsData";

// Helper to get dynamic background/color values
const getBg = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);
const getBorderColor = (colorScheme, light, dark) => (colorScheme === 'dark' ? dark : light);

export default function AlertPage() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Get all alerts from our data file
  const allAlerts = getAllAlerts();
  const stats = getStats();

  // Initialize filtered alerts
  useEffect(() => {
    setFilteredAlerts(allAlerts);
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAlerts(allAlerts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allAlerts.filter(alert =>
      alert.brand.toLowerCase().includes(query) ||
      alert.code.toLowerCase().includes(query) ||
      alert.location.toLowerCase().includes(query) ||
      alert.details.toLowerCase().includes(query) ||
      alert.status.toLowerCase().includes(query)
    );
    setFilteredAlerts(filtered);
  }, [searchQuery, allAlerts]);

  // Get icon based on vehicle type
  const getVehicleIcon = (type) => {
    switch (type) {
      case 'motorcycle': return <IconBike size={16} color="blue" />;
      case 'truck': return <IconTruck size={16} color="blue" />;
      case 'electric': return <IconBattery size={16} color="blue" />;
      default: return <IconCar size={16} color="blue" />;
    }
  };

  // Freeze background scrolling when popup is open
  useEffect(() => {
    if (selectedAlert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedAlert]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: "smooth" });
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

  const handleDeleteAlert = (alertId, alertCode) => {
    const alertToDelete = filteredAlerts.find((alert) => alert.id === alertId);

    const confirmed = window.confirm(
      `Are you sure you want to delete alert "${alertCode}"?\n\n` +
        `Brand: ${alertToDelete?.brand}\n` +
        `Location: ${alertToDelete?.location}\n\n` +
        `This action cannot be undone!`,
    );

    if (confirmed) {
      // In a real app, this would be an API call
      setFilteredAlerts((prevAlerts) =>
        prevAlerts.filter((alert) => alert.id !== alertId),
      );

      if (selectedAlert && selectedAlert.id === alertId) {
        setSelectedAlert(null);
      }

      notifications.show({
        title: "Alert Deleted",
        message: `Alert "${alertCode}" has been successfully deleted.`,
        color: "red",
        icon: <IconTrash size={16} />,
      });
    }
  };

  // Dynamic colors
  const mainBg = getBg(colorScheme, 'white', theme.colors.dark[7]);
  const headerBg = getBg(colorScheme, 'white', theme.colors.dark[6]);
  const borderColor = getBorderColor(colorScheme, '#E9ECEF', theme.colors.dark[5]);
  const paperBg = getBg(colorScheme, 'white', theme.colors.dark[6]);
  const blueLightBg = getBg(colorScheme, 'blue.0', theme.colors.blue[9]);
  const grayLightBg = getBg(colorScheme, 'gray.0', theme.colors.dark[5]);
  const overlayBg = colorScheme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.75)';
  const cardBorder = colorScheme === 'dark' ? theme.colors.dark[4] : '#e0e0e0';

  return (
    <Box bg={mainBg} style={{ minHeight: "100vh", position: "relative" }}>
      {/* Header */}
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
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={0}
              height={50}
              sizes="100vw"
              style={{ width: "auto", height: "50px", borderRadius: "8px" }}
            />

            <TextInput
              placeholder="Search alerts by brand, code, location..."
              leftSection={<IconSearch size={16} />}
              style={{ width: "40%" }}
              radius="xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
        <Paper p="md" mb="xl" bg={blueLightBg} radius="md">
          <Group>
            <IconAlertCircle size={24} color={theme.colors.blue[6]} />
            <div>
              <Text fw={600}>Alert Notifications</Text>
              <Text size="sm" c="dimmed">
                You have {filteredAlerts.filter((a) => a.status === "active").length}{" "}
                active alerts {searchQuery && `matching "${searchQuery}"`}
              </Text>
            </div>
          </Group>
        </Paper>

        <Title order={2} style={{ textAlign: "center", marginBottom: 20 }}>
          Reported Vehicles ({filteredAlerts.length} found)
        </Title>

        <Box style={{ position: "relative", marginBottom: 40 }}>
          {filteredAlerts.length > 3 && (
            <ActionIcon
              variant="filled"
              color="gray"
              radius="xl"
              size="xl"
              style={{
                position: "absolute",
                left: -25,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              onClick={scrollLeft}
            >
              <IconChevronLeft size={20} />
            </ActionIcon>
          )}

          <ScrollArea
            w="100%"
            type="hover"
            viewportRef={scrollRef}
            scrollbarSize={0}
            styles={{ scrollbar: { display: "none" } }}
          >
            <Group wrap="nowrap" gap="lg" p="md">
              {filteredAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  withBorder
                  shadow="sm"
                  radius="md"
                  p={0}
                  style={{
                    overflow: "hidden",
                    minWidth: 320,
                    flexShrink: 0,
                    border: `1px solid ${cardBorder}`,
                    position: "relative",
                  }}
                >
                  {/* Vehicle Image with Overlay Icons */}
                  <Box style={{ height: 180, position: "relative" }}>
                    <Image
                      src={alert.imageUrl}
                      alt={alert.brand}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Overlay Icons Container */}
                    <Box
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        right: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        zIndex: 2,
                      }}
                    >
                      {/* Bell Icon - Left side */}
                      <ActionIcon
                        variant="filled"
                        color="white"
                        size="md"
                        radius="xl"
                        style={{
                          backgroundColor: "rgba(0, 0, 0, 0.4)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                        onClick={() => router.push(`/alert-detail/${alert.code}`)}
                      >
                        <IconBell size={18} />
                      </ActionIcon>

                      {/* Menu Icon - Right side */}
                      <Menu
                        shadow="md"
                        width={120}
                        position="bottom-end"
                        withArrow
                        arrowPosition="center"
                        transitionProps={{ transition: "pop-top-right" }}
                      >
                        <Menu.Target>
                          <ActionIcon
                            variant="filled"
                            color="white"
                            size="md"
                            radius="xl"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.4)",
                              backdropFilter: "blur(4px)",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                            }}
                          >
                            <IconDots size={18} />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={16} />}
                            onClick={() => {
                              notifications.show({
                                title: "Edit Alert",
                                message: `Edit functionality for ${alert.code} would open here`,
                                color: "blue",
                              });
                            }}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={() =>
                              handleDeleteAlert(alert.id, alert.code)
                            }
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Box>

                    {/* Dark gradient overlay at top for better icon visibility */}
                    <Box
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "50px",
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)",
                        zIndex: 1,
                      }}
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
                        {getVehicleIcon(alert.type)}
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

                      <Group gap="xs">
                        <IconAlertCircle size={16} color={alert.status === "active" ? "red" : "green"} />
                        <Text size="sm" c={alert.status === "active" ? "red" : "green"}>
                          {alert.status === "active" ? `${alert.detectionHistory?.length || 0} detections` : "Case resolved"}
                        </Text>
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

          {filteredAlerts.length > 3 && (
            <ActionIcon
              variant="filled"
              color="black"
              radius="xl"
              size="xl"
              style={{
                position: "absolute",
                right: -25,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              onClick={scrollRight}
            >
              <IconChevronRight size={20} />
            </ActionIcon>
          )}
        </Box>

        <Paper withBorder p="lg" mt="xl" radius="md" bg={paperBg}>
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <Stack align="center" gap={0}>
              <Text size="xl" fw={800} c="blue.6">
                {stats.total}
              </Text>
              <Text size="sm" c="dimmed">
                Total Alerts
              </Text>
            </Stack>
            <Stack align="center" gap={0}>
              <Text size="xl" fw={800} c="green.6">
                {stats.resolved}
              </Text>
              <Text size="sm" c="dimmed">
                Resolved
              </Text>
            </Stack>
            <Stack align="center" gap={0}>
              <Text size="xl" fw={800} c="red.6">
                {stats.active}
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
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: overlayBg,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              zIndex: 1000,
            }}
            onClick={handleBackgroundClick}
          />

          {/* Detail Card Container */}
          <Box
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "95%",
              maxWidth: "900px",
              height: "90vh",
              backgroundColor: paperBg,
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)",
              zIndex: 1001,
              display: "flex",
              flexDirection: "column",
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
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 1002,
              }}
              onClick={handleCloseDetail}
            >
              <IconX size={20} />
            </ActionIcon>

            {/* SCROLLABLE CONTENT */}
            <Box
              style={{
                flex: 1,
                overflowY: "auto",
                paddingBottom: "20px",
              }}
            >
              {/* Main Image */}
              <Box style={{ height: 300, position: "relative" }}>
                <Image
                  src={selectedAlert.imageUrl}
                  alt={selectedAlert.brand}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="100vw"
                  priority
                />
              </Box>

              {/* Content */}
              <Box p="xl">
                <Group justify="space-between" mb="xl">
                  <Badge
                    size="xl"
                    color={selectedAlert.status === "active" ? "red" : "green"}
                  >
                    {selectedAlert.status === "active"
                      ? "ACTIVE ALERT"
                      : "RESOLVED"}
                  </Badge>
                  <Text fw={800} size="2rem" c="blue.6">
                    {selectedAlert.code}
                  </Text>
                </Group>

                <Box mb="xl">
                  <Group gap="md" mb="xs">
                    {getVehicleIcon(selectedAlert.type)}
                    <Text fw={800} size="2rem">
                      {selectedAlert.brand}
                    </Text>
                  </Group>
                  <Text size="xl" c="dimmed" fw={500}>
                    {selectedAlert.details}
                  </Text>
                </Box>

                <Divider mb="xl" color={borderColor} />

                {/* Description Section */}
                <Box mb="xl">
                  <Group mb="md">
                    <IconInfoCircle size={24} />
                    <Text fw={700} size="xl">
                      Full Description
                    </Text>
                  </Group>
                  <Paper p="xl" withBorder radius="md" bg={grayLightBg}>
                    <Text
                      size="lg"
                      style={{ lineHeight: 1.6, whiteSpace: "pre-line" }}
                    >
                      {selectedAlert.fullDescription}
                    </Text>
                  </Paper>
                </Box>

                {/* Features Grid */}
                {selectedAlert.features && selectedAlert.features.length > 0 && (
                  <Box mb="xl">
                    <Text fw={700} size="xl" mb="lg">
                      Vehicle Features
                    </Text>
                    <SimpleGrid cols={3} spacing="lg">
                      {selectedAlert.features.map((feature, index) => (
                        <Group key={index} gap="sm">
                          <IconCheck size={20} color="green" />
                          <Text fw={500}>{feature}</Text>
                        </Group>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                {/* Technical Specifications */}
                {selectedAlert.technicalSpecs && (
                  <Box mb="xl">
                    <Text fw={700} size="xl" mb="lg">
                      Technical Specifications
                    </Text>
                    <Paper p="xl" withBorder radius="md" bg={grayLightBg}>
                      <SimpleGrid cols={2} spacing="lg">
                        {Object.entries(selectedAlert.technicalSpecs).map(([key, value]) => (
                          <Box key={key}>
                            <Text fw={600} mb="xs" tt="capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </Text>
                            <Text>{value}</Text>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Paper>
                  </Box>
                )}

                {/* Location & Time */}
                <SimpleGrid cols={2} mb="xl">
                  <Paper p="xl" withBorder radius="md" bg={grayLightBg}>
                    <Group mb="md">
                      <IconMapPinFilled size={24} color="blue" />
                      <Text fw={700} size="lg">
                        Last Known Location
                      </Text>
                    </Group>
                    <Text size="md">{selectedAlert.lastSeen}</Text>
                    <Text size="sm" c="dimmed" mt="sm">
                      {selectedAlert.mapLocation}
                    </Text>
                  </Paper>
                  <Paper p="xl" withBorder radius="md" bg={grayLightBg}>
                    <Group mb="md">
                      <IconCalendar size={24} color="blue" />
                      <Text fw={700} size="lg">
                        Report Timeline
                      </Text>
                    </Group>
                    <Text size="md">Reported: {selectedAlert.reportDate || selectedAlert.date}</Text>
                    <Text size="md" mt="sm">
                      Duration: {selectedAlert.duration}
                    </Text>
                    <Text size="sm" c="dimmed" mt="sm">
                      Last Updated: Today
                    </Text>
                  </Paper>
                </SimpleGrid>

                {/* Contact Information */}
                {selectedAlert.contactInfo && (
                  <Paper p="xl" withBorder radius="md" bg={blueLightBg} mb="xl">
                    <Text fw={700} size="xl" mb="lg">
                      Contact Information
                    </Text>
                    <Stack gap="xl">
                      <Box>
                        <Group mb="sm">
                          <IconUser size={22} />
                          <Text fw={600} size="lg">
                            Reported By
                          </Text>
                        </Group>
                        <Text size="md">{selectedAlert.contactInfo.name}</Text>
                        <Text size="sm" c="dimmed" mt={4}>
                          {selectedAlert.contactInfo.role}
                        </Text>
                        {selectedAlert.contactInfo.additional && (
                          <Text size="sm" c="dimmed" mt={4}>
                            {selectedAlert.contactInfo.additional}
                          </Text>
                        )}
                      </Box>
                      <Box>
                        <Group mb="sm">
                          <IconPhone size={22} />
                          <Text fw={600} size="lg">
                            Contact Number
                          </Text>
                        </Group>
                        <Text size="md">{selectedAlert.contactInfo.phone}</Text>
                      </Box>
                      <Box>
                        <Group mb="sm">
                          <IconMail size={22} />
                          <Text fw={600} size="lg">
                            Email Address
                          </Text>
                        </Group>
                        <Text size="md">{selectedAlert.contactInfo.email}</Text>
                      </Box>
                    </Stack>
                  </Paper>
                )}

                {/* Additional Images */}
                {selectedAlert.additionalImages && selectedAlert.additionalImages.length > 0 && (
                  <Box mb="xl">
                    <Text fw={700} size="xl" mb="lg">
                      Additional Evidence
                    </Text>
                    <Group gap="lg">
                      {selectedAlert.additionalImages.slice(0, 4).map((img, i) => (
                        <Box
                          key={i}
                          style={{
                            width: 150,
                            height: 150,
                            position: "relative",
                            borderRadius: "12px",
                            overflow: "hidden",
                            cursor: "pointer",
                            border: `3px solid ${borderColor}`,
                          }}
                        >
                          <Image
                            src={img}
                            alt={`Evidence ${i + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                      ))}
                    </Group>
                  </Box>
                )}

                {/* Detection Statistics */}
                {selectedAlert.stats && (
                  <Paper p="xl" withBorder radius="md" mb="xl" bg={grayLightBg}>
                    <Text fw={700} size="xl" mb="lg">
                      Detection Statistics
                    </Text>
                    <SimpleGrid cols={3} spacing="lg">
                      <Box ta="center">
                        <Text size="sm" c="dimmed" mb="xs">
                          Total Detections
                        </Text>
                        <Title order={2}>{selectedAlert.stats.totalDetections || 0}</Title>
                      </Box>
                      <Box ta="center">
                        <Text size="sm" c="dimmed" mb="xs">
                          Active Duration
                        </Text>
                        <Title order={2}>{selectedAlert.duration || "N/A"}</Title>
                      </Box>
                      <Box ta="center">
                        <Text size="sm" c="dimmed" mb="xs">
                          CCTV Confidence
                        </Text>
                        <Title order={2}>{selectedAlert.cctvInfo?.confidence || "N/A"}</Title>
                      </Box>
                    </SimpleGrid>
                  </Paper>
                )}
              </Box>
            </Box>

            {/* Fixed Bottom Buttons */}
            <Box
              p="xl"
              style={{
                borderTop: `2px solid ${borderColor}`,
                background: paperBg,
                flexShrink: 0,
              }}
            >
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
                    onClick={() => {
                      notifications.show({
                        title: "Notifications Sent",
                        message: `Updates will be sent for alert ${selectedAlert.code}`,
                        color: "blue",
                      });
                    }}
                    radius="md"
                  >
                    Notify Me
                  </Button>
                  <Button
                    size="lg"
                    color="blue"
                    leftSection={<IconCheck size={20} />}
                    onClick={() => {
                      notifications.show({
                        title: "Marked as Reviewed",
                        message: `Alert ${selectedAlert.code} has been reviewed`,
                        color: "green",
                      });
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