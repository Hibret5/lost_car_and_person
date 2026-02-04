"use client";

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
  Menu,
  UnstyledButton,
  ScrollArea,
  Divider,
  Table,
  Grid,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconMapPin,
  IconCalendar,
  IconHome,
  IconUser,
  IconBell,
  IconHistory,
  IconSettings,
  IconLogout,
  IconShieldCheck,
  IconArrowLeft,
  IconDownload,
  IconFilter,
  IconMap,
  IconTable,
  IconPhone,
  IconMail,
} from "@tabler/icons-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

// Sample data for alert details
const alertDetails = {
  "5h7": {
    id: "5h7",
    title: "Toyota Corolla - Diesel equipped",
    type: "car",
    status: "active",
    location: "Addis Ababa",
    date: "10/11/2023",
    time: "8:11 pm",
    duration: "40.7h",
    lastSeen: "Medellin Area",
    description:
      "Vehicle detected by CCTV camera #CAM-4512 near central market",
    mapLocation: "Addis Ababa, Ethiopia",
    alerts: [
      {
        id: "Alert 1",
        name: "Alert 1",
        location: "Medellin",
        startDate: "10/11/2023",
        startTime: "8:11 pm",
        duration: "40.7h",
        lastSeen: "0:27h ago",
        status: "active",
      },
      {
        id: "Alert 2",
        name: "Alert 2",
        location: "Bogota",
        startDate: "10/11/2023",
        startTime: "6:12 pm",
        duration: "38.4h",
        lastSeen: "0:27h ago",
        status: "active",
      },
      {
        id: "Alert 3",
        name: "Alert 3",
        location: "San Antonio",
        startDate: "10/11/2023",
        startTime: "8:15 am",
        duration: "41.9h",
        lastSeen: "0:27h ago",
        status: "active",
      },
      {
        id: "Alert 4",
        name: "Alert 4",
        location: "Santiago",
        startDate: "10/11/2023",
        startTime: "11:30 pm",
        duration: "71.2h",
        lastSeen: "0:27h ago",
        status: "resolved",
      },
      {
        id: "Alert 5",
        name: "Alert 5",
        location: "Medellin",
        startDate: "10/11/2023",
        startTime: "36:00 am",
        duration: "-",
        lastSeen: "Support",
        status: "pending",
      },
    ],
    tableData: [
      {
        position: "Person",
        company: "Alwin",
        report: "Getting started",
        contact: "alwin@example.com",
      },
      {
        position: "Role",
        company: "Manager",
        report: "Help users",
        contact: "+55 (0)555 - 3456",
      },
      {
        position: "Date",
        company: "October",
        report: "Terms of use",
        contact: "www.example.com",
      },
      {
        position: "Message",
        company: "Thank you for your support!",
        report: "Report with",
        contact: "",
      },
      {
        position: "Subject",
        company: "Challenge",
        report: "",
        contact: "",
      },
    ],
    contactInfo: {
      name: "Alwin Manager",
      email: "alwin@example.com",
      phone: "+55 (0)555 - 3456",
      website: "www.example.com",
    },
    cctvInfo: {
      cameraId: "CAM-4512",
      location: "Central Market, Addis Ababa",
      lastDetection: "2 hours ago",
      confidence: "92%",
    },
  },
  "8k3": {
    id: "8k3",
    title: "Santa Cordilla - PARC AR: 761",
    type: "car",
    status: "active",
    location: "Mexico/AZ",
    date: "10/10/2023",
    time: "6:30 pm",
    duration: "32.5h",
    lastSeen: "Downtown Area",
    description: "Vehicle detected by multiple CCTV cameras in the area",
    mapLocation: "Mexico City, Mexico",
    alerts: [
      {
        id: "Alert 1",
        name: "Alert 1",
        location: "Downtown",
        startDate: "10/10/2023",
        startTime: "6:30 pm",
        duration: "32.5h",
        lastSeen: "1:15h ago",
        status: "active",
      },
    ],
    tableData: [
      {
        position: "Person",
        company: "Santa Manager",
        report: "Initial Report",
        contact: "santa@example.com",
      },
    ],
    contactInfo: {
      name: "Santa Manager",
      email: "santa@example.com",
      phone: "+55 (0)555 - 7890",
    },
    cctvInfo: {
      cameraId: "CAM-7890",
      location: "Downtown Area",
      lastDetection: "3 hours ago",
      confidence: "88%",
    },
  },
};

export default function AlertDetailPage() {
  const router = useRouter();
  const params = useParams();
  const alertId = params.id;
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    if (alertId && alertDetails[alertId]) {
      setSelectedAlert(alertDetails[alertId]);
    } else {
      // If alert not found, show a default one
      setSelectedAlert(alertDetails["5h7"]);
    }
  }, [alertId]);

  if (!selectedAlert) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Text>Loading alert details...</Text>
      </Box>
    );
  }

  const handleBack = () => {
    router.push("/alert");
  };

  const rows = selectedAlert.alerts.map((alert) => (
    <Table.Tr key={alert.id}>
      <Table.Td>
        <Group gap="sm">
          <IconAlertCircle
            size={16}
            color={alert.status === "active" ? "red" : "green"}
          />
          <Text fw={600}>{alert.name}</Text>
        </Group>
      </Table.Td>
      <Table.Td>{alert.location}</Table.Td>
      <Table.Td>{alert.startDate}</Table.Td>
      <Table.Td>{alert.startTime}</Table.Td>
      <Table.Td>
        <Badge
          color={
            alert.duration === "-"
              ? "gray"
              : parseFloat(alert.duration) > 50
                ? "red"
                : "yellow"
          }
          variant="light"
        >
          {alert.duration}
        </Badge>
      </Table.Td>
      <Table.Td>
        {alert.lastSeen === "Support" ? (
          <Button size="xs" variant="light" color="blue">
            Support
          </Button>
        ) : (
          <Text size="sm">{alert.lastSeen}</Text>
        )}
      </Table.Td>
    </Table.Tr>
  ));

  const tableRows = selectedAlert.tableData.map((row, index) => (
    <Table.Tr key={index}>
      <Table.Td fw={600}>{row.position}</Table.Td>
      <Table.Td>{row.company}</Table.Td>
      <Table.Td>{row.report}</Table.Td>
      <Table.Td>{row.contact}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Box bg="white" style={{ minHeight: "100vh" }}>
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
            <Group>
              <ActionIcon variant="subtle" size="lg" onClick={handleBack}>
                <IconArrowLeft size={24} />
              </ActionIcon>
              <Box>
                <Text fw={700} size="lg">
                  Alert Detail
                </Text>
                <Text size="sm" c="dimmed">
                  ID: {selectedAlert.id}
                </Text>
              </Box>
            </Group>

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
                  </Group>
                  <Stack gap={4}>
                    <Menu.Item leftSection={<IconUser size={20} />}>
                      Person
                    </Menu.Item>
                    <Menu.Item leftSection={<IconBell size={20} />}>
                      Notification
                    </Menu.Item>
                    <Menu.Item leftSection={<IconShieldCheck size={20} />}>
                      Privacy and Policy
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
        {/* Alert Header */}
        <Paper p="xl" mb="xl" withBorder radius="md">
          <Group justify="space-between" mb="md">
            <Box>
              <Title order={2} mb="xs">
                {selectedAlert.title}
              </Title>
              <Group gap="lg">
                <Badge
                  size="lg"
                  color={selectedAlert.status === "active" ? "red" : "green"}
                >
                  {selectedAlert.status.toUpperCase()}
                </Badge>
                <Group gap="xs">
                  <IconMapPin size={16} />
                  <Text>{selectedAlert.location}</Text>
                </Group>
                <Group gap="xs">
                  <IconCalendar size={16} />
                  <Text>
                    {selectedAlert.date} • {selectedAlert.time}
                  </Text>
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
            {selectedAlert.description}
          </Text>
        </Paper>

        {/* Stats */}
        <SimpleGrid cols={{ base: 2, md: 4 }} mb="xl">
          <Paper p="md" withBorder radius="md" ta="center">
            <Text size="sm" c="dimmed" mb="xs">
              Total Detections
            </Text>
            <Title order={2}>{selectedAlert.alerts.length}</Title>
          </Paper>
          <Paper p="md" withBorder radius="md" ta="center">
            <Text size="sm" c="dimmed" mb="xs">
              Active Duration
            </Text>
            <Title order={2}>{selectedAlert.duration}</Title>
          </Paper>
          <Paper p="md" withBorder radius="md" ta="center">
            <Text size="sm" c="dimmed" mb="xs">
              CCTV Confidence
            </Text>
            <Title order={2}>{selectedAlert.cctvInfo.confidence}</Title>
          </Paper>
          <Paper p="md" withBorder radius="md" ta="center">
            <Text size="sm" c="dimmed" mb="xs">
              Last Seen
            </Text>
            <Title order={2}>{selectedAlert.cctvInfo.lastDetection}</Title>
          </Paper>
        </SimpleGrid>

        <Grid gutter="xl">
          {/* Left Column - Map */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder radius="md" style={{ overflow: "hidden" }}>
              <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
                <Group>
                  <IconMap size={20} />
                  <Text fw={600}>Detection Map</Text>
                </Group>
              </Box>

              {/* Map Placeholder */}
              <Box
                style={{
                  height: 400,
                  position: "relative",
                  background: "#f8f9fa",
                }}
              >
                <Box
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <IconMap size={64} color="#ccc" />
                  <Text mt="md" c="dimmed">
                    Interactive Map
                  </Text>
                  <Text size="sm" c="dimmed">
                    {selectedAlert.mapLocation}
                  </Text>
                  <Button mt="md" variant="light" size="sm">
                    View Full Map
                  </Button>
                </Box>

                {/* Map markers */}
                <Box
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "40%",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "red",
                    border: "2px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "60%",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "blue",
                    border: "2px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                />
              </Box>

              <Box
                p="md"
                style={{ borderTop: "1px solid #eee", background: "#f8f9fa" }}
              >
                <Text size="sm" c="dimmed">
                  CCTV Camera: {selectedAlert.cctvInfo.cameraId} •{" "}
                  {selectedAlert.cctvInfo.location}
                </Text>
              </Box>
            </Paper>
          </Grid.Col>

          {/* Right Column - Detection List */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder radius="md">
              <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
                <Group justify="space-between">
                  <Group>
                    <IconBell size={20} />
                    <Text fw={600}>Detection History</Text>
                  </Group>
                  <Badge color="red" size="lg">
                    {
                      selectedAlert.alerts.filter((a) => a.status === "active")
                        .length
                    }{" "}
                    Active
                  </Badge>
                </Group>
              </Box>

              <ScrollArea h={400}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Alert</Table.Th>
                      <Table.Th>Location</Table.Th>
                      <Table.Th>Start</Table.Th>
                      <Table.Th>End</Table.Th>
                      <Table.Th>Duration</Table.Th>
                      <Table.Th>Last Seen</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>{rows}</Table.Tbody>
                </Table>
              </ScrollArea>

              <Box p="md" style={{ borderTop: "1px solid #eee" }}>
                <Text size="sm" c="dimmed">
                  Showing {selectedAlert.alerts.length} detections • Last
                  updated: Today
                </Text>
              </Box>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Information Table */}
        <Paper withBorder radius="md" mt="xl">
          <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
            <Group>
              <IconTable size={20} />
              <Text fw={600}>Detailed Information</Text>
            </Group>
          </Box>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Position</Table.Th>
                <Table.Th>Company</Table.Th>
                <Table.Th>Report</Table.Th>
                <Table.Th>Contact</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{tableRows}</Table.Tbody>
          </Table>

          <Box
            p="md"
            style={{ borderTop: "1px solid #eee", background: "#f8f9fa" }}
          >
            <Text size="sm">
              <strong>Message:</strong> Thank you for your support! •{" "}
              <strong>Subject:</strong> Challenge • <strong>Contact:</strong>{" "}
              {selectedAlert.contactInfo.phone}
            </Text>
          </Box>
        </Paper>

        {/* Contact Information */}
        <SimpleGrid cols={{ base: 1, md: 3 }} mt="xl">
          <Paper p="lg" withBorder radius="md">
            <Group mb="md">
              <IconUser size={20} />
              <Text fw={600}>Contact Person</Text>
            </Group>
            <Text size="lg" fw={700}>
              {selectedAlert.contactInfo.name}
            </Text>
            <Text size="sm" c="dimmed">
              Primary Contact
            </Text>
          </Paper>

          <Paper p="lg" withBorder radius="md">
            <Group mb="md">
              <IconMail size={20} />
              <Text fw={600}>Email</Text>
            </Group>
            <Text size="lg" fw={700}>
              {selectedAlert.contactInfo.email}
            </Text>
            <Text size="sm" c="dimmed">
              24/7 Support
            </Text>
          </Paper>

          <Paper p="lg" withBorder radius="md">
            <Group mb="md">
              <IconPhone size={20} />
              <Text fw={600}>Phone</Text>
            </Group>
            <Text size="lg" fw={700}>
              {selectedAlert.contactInfo.phone}
            </Text>
            <Text size="sm" c="dimmed">
              Emergency Line
            </Text>
          </Paper>
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Box mt={60} style={{ borderTop: "1px solid #eee" }}>
        <Container size="xl" py={40}>
          <SimpleGrid cols={{ base: 2, md: 4 }}>
            <Box>
              <Text fw={600} mb="sm">
                Privacy Policy
              </Text>
              <Text size="sm" c="dimmed">
                Learn about our data protection
              </Text>
            </Box>
            <Box>
              <Text fw={600} mb="sm">
                Cookie Policy
              </Text>
              <Text size="sm" c="dimmed">
                How we use cookies
              </Text>
            </Box>
            <Box>
              <Text fw={600} mb="sm">
                Terms & Conditions
              </Text>
              <Text size="sm" c="dimmed">
                Service terms and agreements
              </Text>
            </Box>
            <Box>
              <Text fw={600} mb="sm">
                Contact Us
              </Text>
              <Text size="sm" c="dimmed">
                Get in touch with support
              </Text>
            </Box>
          </SimpleGrid>
          <Divider my="xl" />
          <Text size="sm" c="dimmed" ta="center">
            © 2024 Lost & Found System. All rights reserved. Alert ID:{" "}
            {selectedAlert.id}
          </Text>
        </Container>
      </Box>
    </Box>
  );
}