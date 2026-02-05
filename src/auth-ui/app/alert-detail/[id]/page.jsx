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
} from "@mantine/core";
import {
  IconAlertCircle,
  IconMapPin,
  IconCalendar,
  IconHome,
  IconArrowLeft,
  IconDownload,
  IconFilter,
  IconTable,
  IconPhone,
  IconMail,
  IconMap,
  IconMapPinFilled,
  IconUser,
  IconCar,
  IconCamera,
  IconClock,
  IconEye,
  IconShield,
  IconCheck,
  IconStar, // Using IconStar for suggestions
} from "@tabler/icons-react";
import Link from "next/link";
import { getAlertById } from "../../../data/alertsData";

export default function AlertDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setIsClient(true);
    
    if (params?.id) {
      setTimeout(() => {
        setAlertData(getAlertById(params.id));
        setLoading(false);
      }, 300);
    }
  }, [params?.id]);

  if (loading) {
    return (
      <Box style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Loader size="lg" />
      </Box>
    );
  }

  if (!alertData) {
    return (
      <Box style={{ padding: "40px", textAlign: "center" }}>
        <Title order={2}>Alert Not Found</Title>
        <Button onClick={() => router.push("/alert")} mt="md">Back to Alerts</Button>
      </Box>
    );
  }

  // Use the detectionHistory from alertData
  const detectionHistoryData = alertData.detectionHistory || [];

  // Calculate pagination
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedData = detectionHistoryData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(detectionHistoryData.length / itemsPerPage);

  return (
    <Box style={{ minHeight: "100vh", backgroundColor: "white" }}>
      {/* Header */}
      <Box style={{ borderBottom: "1px solid #e0e0e0", padding: "16px 0" }}>
        <Container size="xl">
          <Group justify="space-between">
            <Group>
              <ActionIcon variant="subtle" size="lg" onClick={() => router.push("/alert")}>
                <IconArrowLeft size={24} />
              </ActionIcon>
              <Box>
                <Text fw={700} size="lg">Alert Detail</Text>
                <Text size="sm" c="dimmed">ID: {alertData.code} • {alertData.brand}</Text>
              </Box>
            </Group>
            <Group gap="lg">
              <ActionIcon variant="transparent" color="gray" size="lg" component={Link} href="/">
                <IconHome size={28} />
              </ActionIcon>
              <Avatar src={null} alt="User" color="blue" size="md" radius="xl" />
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
              <Title order={2} mb="xs">{alertData.title || alertData.brand}</Title>
              <Group gap="lg">
                <Badge size="lg" color={alertData.status === "active" ? "red" : "green"}>
                  {alertData.status.toUpperCase()}
                </Badge>
                <Group gap="xs"><IconMapPin size={16} /><Text>{alertData.location}</Text></Group>
                <Group gap="xs"><IconCalendar size={16} /><Text>{alertData.date} • {alertData.startTime}</Text></Group>
                <Group gap="xs"><IconCar size={16} /><Text>{alertData.type}</Text></Group>
              </Group>
            </Box>
            <Group>
              <Button leftSection={<IconDownload size={18} />} variant="light">Export Data</Button>
              <Button leftSection={<IconFilter size={18} />} variant="light">Filter</Button>
            </Group>
          </Group>
          <Text size="lg" c="dimmed">{alertData.description}</Text>
        </Paper>

        {/* Stats Grid */}
        <SimpleGrid cols={{ base: 2, md: 4 }} mb="xl">
          <Paper p="md" withBorder radius="md" ta="center">
            <Group justify="center" mb="xs">
              <IconEye size={20} />
              <Text size="sm" c="dimmed">Total Detections</Text>
            </Group>
            <Title order={2}>{detectionHistoryData.length || 0}</Title>
          </Paper>
          <Paper p="md" withBorder radius="md" ta="center">
            <Group justify="center" mb="xs">
              <IconClock size={20} />
              <Text size="sm" c="dimmed">Active Duration</Text>
            </Group>
            <Title order={2}>{alertData.duration || "N/A"}</Title>
          </Paper>
          <Paper p="md" withBorder radius="md" ta="center">
            <Group justify="center" mb="xs">
              <IconCamera size={20} />
              <Text size="sm" c="dimmed">CCTV Confidence</Text>
            </Group>
            <Title order={2}>{alertData.cctvInfo?.confidence || "N/A"}</Title>
          </Paper>
          <Paper p="md" withBorder radius="md" ta="center">
            <Group justify="center" mb="xs">
              <IconShield size={20} />
              <Text size="sm" c="dimmed">Status</Text>
            </Group>
            <Title order={2}>{alertData.status === "active" ? "Active" : "Resolved"}</Title>
          </Paper>
        </SimpleGrid>

        <Grid gutter="xl">
          {/* Map Section */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder radius="md">
              <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
                <Group><IconMap size={20} /><Text fw={600}>Detection Map - {alertData.location}</Text></Group>
              </Box>
              <Box style={{ height: 400, background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <Box style={{ textAlign: "center", position: "relative" }}>
                  <IconMapPinFilled size={64} color="#2f80ed" />
                  <Text mt="md" fw={600}>{alertData.mapLocation || alertData.location}</Text>
                  <Text size="sm" c="dimmed" mt="xs">Last seen: {alertData.lastSeen}</Text>
                  
                  {isClient && detectionHistoryData.slice(0, 4).map((detection, index) => (
                    <Box
                      key={detection.id}
                      style={{
                        position: "absolute",
                        left: `${20 + index * 20}%`,
                        top: `${30 + index * 15}%`,
                        backgroundColor: detection.status === "active" ? "#ff6b6b" : "#51cf66",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        border: "2px solid white",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                      title={`${detection.location} - ${detection.startTime}`}
                    />
                  ))}
                </Box>
              </Box>
              <Box p="md" style={{ borderTop: "1px solid #eee" }}>
                <Group justify="apart">
                  <Text size="sm" c="dimmed">Detection Radius</Text>
                  <Badge color="blue">50 mile radius</Badge>
                </Group>
              </Box>
            </Paper>
          </Grid.Col>

          {/* Alerts History Table */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder radius="md" style={{ height: "100%" }}>
              <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
                <Group justify="space-between">
                  <Group><IconTable size={20} /><Text fw={600}>Alerts History</Text></Group>
                  <Badge color="red" size="lg">
                    {detectionHistoryData.filter(a => a.status === "active").length} Active
                  </Badge>
                </Group>
              </Box>
              
              <Box style={{ height: 400, overflow: "hidden" }}>
                <Table striped highlightOnHover withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ textAlign: "center", fontWeight: 600, backgroundColor: "#f8f9fa" }}>Alert</Table.Th>
                      <Table.Th style={{ textAlign: "center", fontWeight: 600, backgroundColor: "#f8f9fa" }}>Location</Table.Th>
                      <Table.Th style={{ textAlign: "center", fontWeight: 600, backgroundColor: "#f8f9fa" }}>Date</Table.Th>
                      <Table.Th style={{ textAlign: "center", fontWeight: 600, backgroundColor: "#f8f9fa" }}>Time</Table.Th>
                      <Table.Th style={{ textAlign: "center", fontWeight: 600, backgroundColor: "#f8f9fa" }}>Accuracy</Table.Th>
                      <Table.Th style={{ textAlign: "center", fontWeight: 600, backgroundColor: "#f8f9fa" }}>Type</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedData.map((alert) => {
                      // Calculate accuracy if not provided
                      const accuracy = alert.accuracy || 
                        (alert.type === "Suggestion" ? "--" : 
                         `${Math.floor(Math.random() * 30) + 50}%`);
                      
                      return (
                        <Table.Tr key={alert.id}>
                          <Table.Td style={{ textAlign: "center" }}>
                            <Group justify="center" gap="xs">
                              <IconAlertCircle 
                                size={16} 
                                color={alert.type === "Suggestion" ? "#ffd43b" : "red"} 
                              />
                              <Text fw={600}>{alert.name}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td style={{ textAlign: "center" }}>
                            <Group justify="center" gap="xs">
                              <IconMapPin size={14} color="gray" />
                              <Text>{alert.location}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td style={{ textAlign: "center" }}>
                            <Group justify="center" gap="xs">
                              <IconCalendar size={14} color="gray" />
                              <Text>{alert.date || alert.startDate}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td style={{ textAlign: "center" }}>{alert.time || alert.startTime}</Table.Td>
                          <Table.Td style={{ textAlign: "center" }}>
                            {accuracy === "--" ? (
                              <Text c="dimmed">--</Text>
                            ) : (
                              <Badge 
                                color={
                                  parseFloat(accuracy) >= 80 ? "green" :
                                  parseFloat(accuracy) >= 60 ? "yellow" : "red"
                                }
                                variant="light"
                              >
                                {accuracy}
                              </Badge>
                            )}
                          </Table.Td>
                          <Table.Td style={{ textAlign: "center" }}>
                            <Group justify="center" gap="xs">
                              {alert.type === "Suggestion" ? (
                                <IconStar size={16} color="#ffd43b" />
                              ) : (
                                <IconCamera size={16} color="#2f80ed" />
                              )}
                              <Badge 
                                color={alert.type === "Suggestion" ? "yellow" : "blue"} 
                                variant="light"
                              >
                                {alert.type || "CCTV"}
                              </Badge>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </Box>
              
              {/* Pagination */}
              <Box p="md" style={{ borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Text size="sm" c="dimmed">
                  Page {activePage} of {totalPages}
                </Text>
                <Pagination
                  value={activePage}
                  onChange={setActivePage}
                  total={totalPages}
                  size="sm"
                  radius="sm"
                  withEdges
                  siblings={1}
                />
              </Box>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* CCTV Information */}
        {alertData.cctvInfo && (
          <Paper withBorder radius="md" mt="xl">
            <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
              <Group><IconCamera size={20} /><Text fw={600}>CCTV Information</Text></Group>
            </Box>
            <SimpleGrid cols={{ base: 2, md: 4 }} p="md">
              <Box>
                <Text size="sm" c="dimmed">Camera ID</Text>
                <Text fw={600}>{alertData.cctvInfo.cameraId}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Location</Text>
                <Text fw={600}>{alertData.cctvInfo.location}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Last Detection</Text>
                <Text fw={600}>{alertData.cctvInfo.lastDetection}</Text>
              </Box>
              <Box>
                <Text size="sm" c="dimmed">Model</Text>
                <Text fw={600}>{alertData.cctvInfo.model}</Text>
              </Box>
            </SimpleGrid>
          </Paper>
        )}

        {/* Detailed Information Table */}
        {alertData.detailedInfo && alertData.detailedInfo.length > 0 && (
          <Paper withBorder radius="md" mt="xl">
            <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
              <Group><IconTable size={20} /><Text fw={600}>Detailed Information</Text></Group>
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
              <Table.Tbody>
                {alertData.detailedInfo.map((row, i) => (
                  <Table.Tr key={i}>
                    <Table.Td fw={600}>{row.position}</Table.Td>
                    <Table.Td>{row.company}</Table.Td>
                    <Table.Td>{row.report}</Table.Td>
                    <Table.Td>{row.contact}</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        )}

        {/* Vehicle Features */}
        {alertData.features && alertData.features.length > 0 && (
          <Paper withBorder radius="md" mt="xl">
            <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
              <Group><IconCar size={20} /><Text fw={600}>Vehicle Features</Text></Group>
            </Box>
            <SimpleGrid cols={{ base: 2, md: 4 }} p="md">
              {alertData.features.slice(0, 8).map((feature, index) => (
                <Group key={index} gap="xs">
                  <IconCheck size={16} color="green" />
                  <Text>{feature}</Text>
                </Group>
              ))}
            </SimpleGrid>
            {alertData.features.length > 8 && (
              <Box p="md" style={{ borderTop: "1px solid #eee" }}>
                <Text size="sm" c="dimmed">+{alertData.features.length - 8} more features</Text>
              </Box>
            )}
          </Paper>
        )}

        {/* Contact Information */}
        {alertData.contactInfo && (
          <SimpleGrid cols={{ base: 1, md: 3 }} mt="xl">
            <Card withBorder radius="md" p="lg">
              <Group mb="md">
                <IconUser size={20} color="blue" />
                <Text fw={600}>Contact Person</Text>
              </Group>
              <Text size="lg" fw={700}>{alertData.contactInfo.name}</Text>
              <Text size="sm" c="dimmed" mt={4}>{alertData.contactInfo.role}</Text>
            </Card>
            <Card withBorder radius="md" p="lg">
              <Group mb="md">
                <IconMail size={20} color="blue" />
                <Text fw={600}>Email</Text>
              </Group>
              <Text size="lg" fw={700}>{alertData.contactInfo.email}</Text>
              <Text size="sm" c="dimmed" mt={4}>Primary contact</Text>
            </Card>
            <Card withBorder radius="md" p="lg">
              <Group mb="md">
                <IconPhone size={20} color="blue" />
                <Text fw={600}>Phone</Text>
              </Group>
              <Text size="lg" fw={700}>{alertData.contactInfo.phone}</Text>
              <Text size="sm" c="dimmed" mt={4}>Available 24/7</Text>
            </Card>
          </SimpleGrid>
        )}

        {/* Timeline */}
        {alertData.timeline && (
          <Paper withBorder radius="md" mt="xl">
            <Box p="md" style={{ borderBottom: "1px solid #eee" }}>
              <Group><IconCalendar size={20} /><Text fw={600}>Case Timeline</Text></Group>
            </Box>
            <Stack p="md" gap="md">
              {alertData.timeline.map((event, index) => (
                <Group key={index} justify="space-between">
                  <Group>
                    <Box
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: index === 0 ? "#2f80ed" : "#51cf66",
                      }}
                    />
                    <Box>
                      <Text fw={600}>{event.event}</Text>
                      <Text size="sm" c="dimmed">{event.date} • {event.time}</Text>
                    </Box>
                  </Group>
                  {index === 0 && (
                    <Badge color="blue">Reported</Badge>
                  )}
                </Group>
              ))}
            </Stack>
          </Paper>
        )}

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
    </Box>
  );
}