"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  Box, Title, Text, Paper, SimpleGrid, Group, Button,
  Table, Badge, ActionIcon, Tooltip, Select, TextInput,
  Modal, Stack, Grid, Divider, Avatar, Pagination,
  Menu, UnstyledButton, Textarea, Alert, Chip,
  ThemeIcon, Loader, Checkbox, Timeline, Progress,
  Image, Card, Flex, Stepper, Radio
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  IconFileCheck, IconFileAlert, IconFileDescription,
  IconDownload, IconEdit, IconTrash,
  IconEye, IconDotsVertical, IconCheck, IconX,
  IconSearch, IconSettings, IconSend,
  IconClock, IconCalendar, IconUsers, IconUser,
  IconCopy, IconSend2, IconDeviceFloppy,
  IconAlertCircle, IconFile, IconPhoto,
  IconId, IconCar, IconLicense, IconFileText,
  IconFilter, IconRefresh, IconArrowRight,
  IconArrowLeft, IconCheckbox
} from '@tabler/icons-react';
import Link from 'next/link';

dayjs.extend(relativeTime);

// ---------- MOCK DATA ----------
const DOCUMENT_TYPES = [
  { value: 'id_card', label: 'ID Card', icon: IconId },
  { value: 'passport', label: 'Passport', icon: IconLicense },
  { value: 'drivers_license', label: 'Driver’s License', icon: IconLicense },
  { value: 'vehicle_registration', label: 'Vehicle Registration', icon: IconCar },
  { value: 'insurance', label: 'Insurance Certificate', icon: IconFileText },
  { value: 'permit', label: 'Permit', icon: IconFileDescription },
  { value: 'other', label: 'Other', icon: IconFile },
];

const INITIAL_DOCUMENTS = [
  {
    id: 1,
    userId: 101,
    userName: 'John Smith',
    userEmail: 'john.smith@gmail.com',
    userAvatar: null,
    documentType: 'id_card',
    documentName: 'ID Card - Front',
    fileName: 'id_front_john.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-02-15T09:30:00',
    status: 'pending',
    reviewedBy: null,
    reviewDate: null,
    rejectionReason: null,
    notes: 'Please verify identity',
    priority: 'high',
  },
  {
    id: 2,
    userName: 'Olivia Bennett',
    userEmail: 'ollyben@gmail.com',
    // ... (keep all mock data from previous version)
  },
  // ... rest of INITIAL_DOCUMENTS (same as before)
];

// ---------- HELPER FUNCTIONS ----------
const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  return dayjs(dateString).format('MMM D, YYYY · h:mm A');
};

const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).fromNow();
};

const getStatusColor = (status) => {
  switch (status) {
    case 'approved': return 'green';
    case 'rejected': return 'red';
    case 'pending': return 'yellow';
    default: return 'gray';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved': return IconCheck;
    case 'rejected': return IconX;
    case 'pending': return IconClock;
    default: return IconFileDescription;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'red';
    case 'normal': return 'blue';
    case 'low': return 'gray';
    default: return 'gray';
  }
};

const getDocumentTypeDetails = (type) => {
  return DOCUMENT_TYPES.find(dt => dt.value === type) || { label: type, icon: IconFile };
};

export default function DocumentValidationPage() {
  // ---------- STATE ----------
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState('10');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  
  // ---------- MULTI‑STEP VALIDATION STATE ----------
  const [validationStep, setValidationStep] = useState(0);
  const [validationDecision, setValidationDecision] = useState(null); // 'approve' or 'reject'

  // ---------- MODALS ----------
  const [viewModalOpened, viewModalHandlers] = useDisclosure(false);
  const [validationModalOpened, validationModalHandlers] = useDisclosure(false);
  const [deleteModalOpened, deleteModalHandlers] = useDisclosure(false);

  // ---------- STATS ----------
  const stats = useMemo(() => {
    const total = documents.length;
    const pending = documents.filter(d => d.status === 'pending').length;
    const approved = documents.filter(d => d.status === 'approved').length;
    const rejected = documents.filter(d => d.status === 'rejected').length;
    const highPriority = documents.filter(d => d.priority === 'high' && d.status === 'pending').length;
    const today = dayjs().format('YYYY-MM-DD');
    const uploadedToday = documents.filter(d => dayjs(d.uploadDate).isSame(today, 'day')).length;
    return { total, pending, approved, rejected, highPriority, uploadedToday };
  }, [documents]);

  // ---------- FILTERED DOCUMENTS ----------
  const filteredDocuments = useMemo(() => {
    let result = [...documents];
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.userName.toLowerCase().includes(lower) ||
        d.userEmail.toLowerCase().includes(lower) ||
        d.documentName.toLowerCase().includes(lower)
      );
    }
    if (statusFilter && statusFilter !== 'All') {
      result = result.filter(d => d.status === statusFilter);
    }
    if (typeFilter && typeFilter !== 'All') {
      result = result.filter(d => d.documentType === typeFilter);
    }
    if (priorityFilter && priorityFilter !== 'All') {
      result = result.filter(d => d.priority === priorityFilter);
    }
    if (dateRange.start) {
      result = result.filter(d => dayjs(d.uploadDate).isAfter(dateRange.start));
    }
    if (dateRange.end) {
      result = result.filter(d => dayjs(d.uploadDate).isBefore(dayjs(dateRange.end).add(1, 'day')));
    }
    result.sort((a, b) => dayjs(b.uploadDate).unix() - dayjs(a.uploadDate).unix());
    return result;
  }, [documents, searchQuery, statusFilter, typeFilter, priorityFilter, dateRange]);

  // ---------- PAGINATION ----------
  const paginatedDocuments = useMemo(() => {
    const size = parseInt(pageSize);
    const start = (activePage - 1) * size;
    return filteredDocuments.slice(start, start + size);
  }, [filteredDocuments, activePage, pageSize]);

  const totalPages = useMemo(() => Math.ceil(filteredDocuments.length / parseInt(pageSize)), [filteredDocuments, pageSize]);

  useEffect(() => {
    setActivePage(1);
  }, [searchQuery, statusFilter, typeFilter, priorityFilter, dateRange, pageSize]);

  // ---------- VALIDATION FORM ----------
  const validationForm = useForm({
    initialValues: {
      decision: '',
      rejectionReason: '',
      internalNotes: '',
    },
    validate: {
      decision: (value) => (!value ? 'Please select approve or reject' : null),
      rejectionReason: (value, values) => 
        values.decision === 'reject' && !value ? 'Rejection reason is required' : null,
    },
  });

  // ---------- ACTIONS ----------
  const startValidation = (document) => {
    setSelectedDocument(document);
    setValidationStep(0);
    setValidationDecision(null);
    validationForm.reset();
    validationModalHandlers.open();
  };

  const submitValidation = (values) => {
    if (!selectedDocument) return;
    
    const isApproved = values.decision === 'approve';
    setDocuments(prev => prev.map(d =>
      d.id === selectedDocument.id
        ? {
            ...d,
            status: isApproved ? 'approved' : 'rejected',
            reviewedBy: 'admin@example.com',
            reviewDate: new Date().toISOString(),
            rejectionReason: isApproved ? null : values.rejectionReason,
            notes: values.internalNotes || d.notes,
          }
        : d
    ));
    
    notifications.show({
      title: isApproved ? 'Document approved' : 'Document rejected',
      message: `${selectedDocument.documentName} for ${selectedDocument.userName} has been ${isApproved ? 'approved' : 'rejected'}.`,
      color: isApproved ? 'green' : 'red',
      icon: isApproved ? <IconCheck size={18} /> : <IconX size={18} />,
    });
    
    validationModalHandlers.close();
    setSelectedDocument(null);
  };

  const deleteDocument = () => {
    if (!selectedDocument) return;
    setDocuments(prev => prev.filter(d => d.id !== selectedDocument.id));
    notifications.show({
      title: 'Document deleted',
      message: `${selectedDocument.documentName} has been removed.`,
      color: 'red',
      icon: <IconTrash size={18} />
    });
    deleteModalHandlers.close();
    setSelectedDocument(null);
  };

  // ---------- EXPORT CSV ----------
  const exportToCSV = () => {
    const headers = ['ID', 'User', 'Email', 'Document Type', 'Document Name', 'Status', 'Priority', 'Upload Date', 'Reviewer', 'Review Date', 'Rejection Reason'];
    const rows = filteredDocuments.map(d => [
      d.id,
      d.userName,
      d.userEmail,
      getDocumentTypeDetails(d.documentType).label,
      d.documentName,
      d.status,
      d.priority,
      dayjs(d.uploadDate).format('YYYY-MM-DD HH:mm'),
      d.reviewedBy || '',
      d.reviewDate ? dayjs(d.reviewDate).format('YYYY-MM-DD HH:mm') : '',
      d.rejectionReason || '',
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documents_${dayjs().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    notifications.show({
      title: 'Exported',
      message: `${filteredDocuments.length} documents exported`,
      color: 'green',
      icon: <IconDownload size={18} />
    });
  };

  // ---------- CLEAR FILTERS ----------
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
    setTypeFilter(null);
    setPriorityFilter(null);
    setDateRange({ start: null, end: null });
  };

  // ---------- STEP CONTROL ----------
  const nextStep = () => {
    if (validationStep === 1) {
      // Validate decision before moving to confirm
      const decisionValid = validationForm.validateField('decision').hasError === false;
      if (validationForm.values.decision === 'reject') {
        const reasonValid = validationForm.validateField('rejectionReason').hasError === false;
        if (!decisionValid || !reasonValid) return;
      } else {
        if (!decisionValid) return;
      }
    }
    setValidationStep((s) => s + 1);
  };

  const prevStep = () => setValidationStep((s) => s - 1);

  return (
    <Box p="xl" bg="#F4F7FE" style={{ minHeight: '100vh' }}>
      {/* HEADER (unchanged) */}
      <Group justify="space-between" mb="xl">
        <Box>
          <Title order={2} fw={700} c="#2B3674">Document Validation</Title>
          <Text size="sm" c="dimmed">Review and verify user‑uploaded documents</Text>
        </Box>
        <Group bg="white" p={8} style={{ borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Tooltip label="Settings">
            <ActionIcon variant="subtle" color="gray"><IconSettings size={20} /></ActionIcon>
          </Tooltip>
          <Tooltip label="Notifications">
            <ActionIcon variant="subtle" color="red"><IconFileAlert size={20} /></ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      {/* STATS CARDS (unchanged) */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" mb="xl">
        {/* ... same as before ... */}
        <Paper p="md" radius="lg" bg="linear-gradient(145deg, #4318FF, #7B61FF)" c="white" shadow="md">
          <Group justify="space-between" align="flex-start">
            <Box>
              <Text size="xl" fw={800} style={{ fontSize: '32px' }}>{stats.pending}</Text>
              <Text size="sm" fw={500}>Pending Review</Text>
              {stats.highPriority > 0 && (
                <Badge color="red" variant="filled" size="sm" mt="xs">
                  {stats.highPriority} high priority
                </Badge>
              )}
            </Box>
            <IconClock size={48} opacity={0.3} />
          </Group>
          <UnstyledButton
            w="100%"
            py={8}
            mt="md"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
            onClick={() => { setStatusFilter('pending'); notifications.show({ message: 'Showing pending documents', color: 'blue' }); }}
          >
            <Text size="xs" fw={600}>Review now →</Text>
          </UnstyledButton>
        </Paper>

        <Paper p="md" radius="lg" bg="linear-gradient(145deg, #20C997, #3BD6A4)" c="white" shadow="md">
          <Group justify="space-between" align="flex-start">
            <Box>
              <Text size="xl" fw={800} style={{ fontSize: '32px' }}>{stats.approved}</Text>
              <Text size="sm" fw={500}>Approved</Text>
            </Box>
            <IconCheck size={48} opacity={0.3} />
          </Group>
          <UnstyledButton
            w="100%"
            py={8}
            mt="md"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
            onClick={() => { setStatusFilter('approved'); notifications.show({ message: 'Showing approved documents', color: 'blue' }); }}
          >
            <Text size="xs" fw={600}>View →</Text>
          </UnstyledButton>
        </Paper>

        <Paper p="md" radius="lg" bg="linear-gradient(145deg, #F59E0B, #FBBF24)" c="white" shadow="md">
          <Group justify="space-between" align="flex-start">
            <Box>
              <Text size="xl" fw={800} style={{ fontSize: '32px' }}>{stats.rejected}</Text>
              <Text size="sm" fw={500}>Rejected</Text>
            </Box>
            <IconX size={48} opacity={0.3} />
          </Group>
          <UnstyledButton
            w="100%"
            py={8}
            mt="md"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
            onClick={() => { setStatusFilter('rejected'); notifications.show({ message: 'Showing rejected documents', color: 'blue' }); }}
          >
            <Text size="xs" fw={600}>View →</Text>
          </UnstyledButton>
        </Paper>

        <Paper p="md" radius="lg" bg="linear-gradient(145deg, #00B8D9, #00C7E6)" c="white" shadow="md">
          <Group justify="space-between" align="flex-start">
            <Box>
              <Text size="xl" fw={800} style={{ fontSize: '32px' }}>{stats.total}</Text>
              <Text size="sm" fw={500}>Total Documents</Text>
              <Text size="xs" mt="xs" opacity={0.9}>{stats.uploadedToday} uploaded today</Text>
            </Box>
            <IconFileDescription size={48} opacity={0.3} />
          </Group>
          <UnstyledButton
            w="100%"
            py={8}
            mt="md"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
            onClick={() => { clearFilters(); notifications.show({ message: 'Showing all documents', color: 'blue' }); }}
          >
            <Text size="xs" fw={600}>View all →</Text>
          </UnstyledButton>
        </Paper>
      </SimpleGrid>

      {/* FILTERS & ACTIONS (unchanged) */}
      <Paper p="md" radius="lg" mb="xl" shadow="xs" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Group>
              <TextInput
                placeholder="Search user or document"
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                radius="md"
                size="sm"
                w={220}
              />
              <Select
                placeholder="Status"
                data={['All', 'pending', 'approved', 'rejected']}
                value={statusFilter}
                onChange={setStatusFilter}
                clearable
                radius="md"
                size="sm"
                w={130}
              />
              <Select
                placeholder="Document Type"
                data={['All', ...DOCUMENT_TYPES.map(t => t.value)]}
                value={typeFilter}
                onChange={setTypeFilter}
                clearable
                radius="md"
                size="sm"
                w={150}
              />
              <Select
                placeholder="Priority"
                data={['All', 'high', 'normal', 'low']}
                value={priorityFilter}
                onChange={setPriorityFilter}
                clearable
                radius="md"
                size="sm"
                w={130}
              />
              <Menu shadow="md" width={300} position="bottom-start">
                <Menu.Target>
                  <Button variant="outline" color="gray" leftSection={<IconCalendar size={16} />} radius="md" size="sm">
                    Date Range
                  </Button>
                </Menu.Target>
                <Menu.Dropdown p="md">
                  <Stack>
                    <DatePicker
                      label="From"
                      placeholder="Start date"
                      value={dateRange.start}
                      onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                      clearable
                      radius="md"
                    />
                    <DatePicker
                      label="To"
                      placeholder="End date"
                      value={dateRange.end}
                      onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                      clearable
                      radius="md"
                    />
                    <Button size="xs" onClick={() => setDateRange({ start: null, end: null })} radius="md">
                      Clear
                    </Button>
                  </Stack>
                </Menu.Dropdown>
              </Menu>
              {(searchQuery || statusFilter || typeFilter || priorityFilter || dateRange.start || dateRange.end) && (
                <Button variant="subtle" color="gray" leftSection={<IconRefresh size={16} />} onClick={clearFilters} size="sm" radius="md">
                  Clear
                </Button>
              )}
            </Group>
            <Group>
              <Button
                variant="outline"
                color="gray"
                leftSection={<IconDownload size={16} />}
                onClick={exportToCSV}
                radius="md"
                size="sm"
              >
                Export
              </Button>
            </Group>
          </Group>
        </Stack>
      </Paper>

      {/* DOCUMENTS TABLE - UPDATED ACTIONS COLUMN */}
      <Paper radius="lg" shadow="sm" withBorder style={{ overflow: 'hidden' }}>
        <Table.ScrollContainer minWidth={1300}>
          <Table verticalSpacing="md" highlightOnHover striped>
            <Table.Thead bg="#4318FF">
              <Table.Tr>
                <Table.Th c="white">User</Table.Th>
                <Table.Th c="white">Document</Table.Th>
                <Table.Th c="white">Type</Table.Th>
                <Table.Th c="white">Status</Table.Th>
                <Table.Th c="white">Priority</Table.Th>
                <Table.Th c="white">Uploaded</Table.Th>
                <Table.Th c="white">Reviewed</Table.Th>
                <Table.Th c="white" style={{ width: 140 }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedDocuments.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <Text ta="center" py="xl" c="dimmed">No documents found</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                paginatedDocuments.map((doc) => {
                  const typeDetails = getDocumentTypeDetails(doc.documentType);
                  const StatusIcon = getStatusIcon(doc.status);
                  return (
                    <Table.Tr key={doc.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar size="sm" color="blue" radius="xl">
                            {doc.userName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Text size="sm" fw={500}>{doc.userName}</Text>
                            <Text size="xs" c="dimmed">{doc.userEmail}</Text>
                          </Box>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Box>
                          <Text size="sm" fw={500}>{doc.documentName}</Text>
                          <Text size="xs" c="dimmed">{doc.fileName} • {doc.fileSize}</Text>
                        </Box>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <ThemeIcon size="sm" variant="light" color="blue" radius="xl">
                            <typeDetails.icon size={14} />
                          </ThemeIcon>
                          <Text size="sm">{typeDetails.label}</Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={getStatusColor(doc.status)}
                          variant="light"
                          radius="xl"
                          leftSection={<StatusIcon size={12} />}
                        >
                          {doc.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getPriorityColor(doc.priority)} variant="outline" radius="xl">
                          {doc.priority}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Tooltip label={formatDateTime(doc.uploadDate)}>
                          <Text size="sm" style={{ cursor: 'help' }}>
                            {getRelativeTime(doc.uploadDate)}
                          </Text>
                        </Tooltip>
                      </Table.Td>
                      <Table.Td>
                        {doc.reviewDate ? (
                          <Tooltip label={formatDateTime(doc.reviewDate)}>
                            <Text size="sm" style={{ cursor: 'help' }}>
                              {getRelativeTime(doc.reviewDate)}
                            </Text>
                          </Tooltip>
                        ) : '—'}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4} justify="flex-end">
                          <Tooltip label="View document">
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={() => {
                                setViewingDocument(doc);
                                viewModalHandlers.open();
                              }}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          
                          {/* Unified Validate Button (replaces separate Approve/Reject) */}
                          {doc.status === 'pending' && (
                            <Tooltip label="Validate document">
                              <ActionIcon
                                variant="filled"
                                color="blue"
                                onClick={() => startValidation(doc)}
                              >
                                <IconCheckbox size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                          
                          <Menu shadow="md" width={160} position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  deleteModalHandlers.open();
                                }}
                              >
                                Delete
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {/* PAGINATION */}
        <Group justify="space-between" p="md" bg="white">
          <Group gap="xs">
            <Text size="sm" c="dimmed">Rows per page</Text>
            <Select
              size="xs"
              w={70}
              data={['5', '10', '20', '50']}
              value={pageSize}
              onChange={(val) => setPageSize(val || '10')}
              radius="md"
            />
            <Text size="sm" c="dimmed">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
            </Text>
          </Group>
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={setActivePage}
            size="sm"
            radius="xl"
            color="blue"
          />
        </Group>
      </Paper>

      {/* ---------- VIEW DOCUMENT MODAL (unchanged) ---------- */}
      <Modal
        opened={viewModalOpened}
        onClose={viewModalHandlers.close}
        title={<Text fw={700} size="lg">Document Details</Text>}
        centered
        size="lg"
        radius="md"
      >
        {/* ... same as before ... */}
        {viewingDocument && (
          <Stack gap="md">
            <Group justify="space-between">
              <Group>
                <Avatar size="lg" color="blue" radius="xl">
                  {viewingDocument.userName.charAt(0)}
                </Avatar>
                <Box>
                  <Text fw={700} size="lg">{viewingDocument.userName}</Text>
                  <Text size="sm" c="dimmed">{viewingDocument.userEmail}</Text>
                </Box>
              </Group>
              <Badge color={getStatusColor(viewingDocument.status)} size="lg" radius="xl">
                {viewingDocument.status}
              </Badge>
            </Group>
            <Divider />
            <Grid>
              {/* ... all document fields ... */}
            </Grid>
            <Group justify="flex-end">
              {viewingDocument.status === 'pending' && (
                <Button
                  variant="light"
                  color="blue"
                  leftSection={<IconCheckbox size={16} />}
                  onClick={() => {
                    viewModalHandlers.close();
                    startValidation(viewingDocument);
                  }}
                >
                  Validate Document
                </Button>
              )}
              <Button variant="subtle" onClick={viewModalHandlers.close}>Close</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* ---------- MULTI‑STEP VALIDATION MODAL ---------- */}
      <Modal
        opened={validationModalOpened}
        onClose={validationModalHandlers.close}
        title={<Text fw={700} size="lg">Validate Document</Text>}
        centered
        size="lg"
        radius="md"
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        {selectedDocument && (
          <form onSubmit={validationForm.onSubmit(submitValidation)}>
            <Stack gap="lg">
              {/* Stepper Header */}
              <Stepper active={validationStep} onStepClick={setValidationStep} allowNextStepsSelect={false} size="sm">
                <Stepper.Step label="Review" description="Document details" />
                <Stepper.Step label="Decision" description="Approve or reject" />
                <Stepper.Step label="Confirm" description="Final confirmation" />
              </Stepper>

              {/* Step 1: Review Document */}
              {validationStep === 0 && (
                <Stack gap="md">
                  <Group align="flex-start">
                    <Avatar size="lg" color="blue" radius="xl">
                      {selectedDocument.userName.charAt(0)}
                    </Avatar>
                    <Box style={{ flex: 1 }}>
                      <Text fw={600} size="lg">{selectedDocument.userName}</Text>
                      <Text size="sm" c="dimmed">{selectedDocument.userEmail}</Text>
                      <Badge color={getPriorityColor(selectedDocument.priority)} size="sm" mt={4}>
                        {selectedDocument.priority} priority
                      </Badge>
                    </Box>
                    <Badge color={getStatusColor(selectedDocument.status)} variant="light">
                      {selectedDocument.status}
                    </Badge>
                  </Group>

                  <Divider />

                  <Grid>
                    <Grid.Col span={6}>
                      <Text size="sm" c="dimmed">Document Type</Text>
                      <Group gap="xs" mt={4}>
                        {(() => {
                          const type = getDocumentTypeDetails(selectedDocument.documentType);
                          return (
                            <>
                              <ThemeIcon size="sm" variant="light" color="blue" radius="xl">
                                <type.icon size={14} />
                              </ThemeIcon>
                              <Text>{type.label}</Text>
                            </>
                          );
                        })()}
                      </Group>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" c="dimmed">Document Name</Text>
                      <Text>{selectedDocument.documentName}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" c="dimmed">Uploaded</Text>
                      <Text>{formatDateTime(selectedDocument.uploadDate)}</Text>
                      <Text size="xs" c="dimmed">{getRelativeTime(selectedDocument.uploadDate)}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Text size="sm" c="dimmed">File</Text>
                      <Text size="sm">{selectedDocument.fileName} ({selectedDocument.fileSize})</Text>
                    </Grid.Col>
                    {selectedDocument.notes && (
                      <Grid.Col span={12}>
                        <Text size="sm" c="dimmed">Notes</Text>
                        <Paper p="xs" bg="gray.0" radius="md">
                          <Text size="sm">{selectedDocument.notes}</Text>
                        </Paper>
                      </Grid.Col>
                    )}
                    <Grid.Col span={12}>
                      <Text size="sm" c="dimmed">Document Preview</Text>
                      <Paper
                        p="xl"
                        bg="gray.0"
                        radius="md"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}
                      >
                        <IconFile size={40} color="gray" opacity={0.5} />
                        <Text ml="sm" c="dimmed">Preview not available – download file</Text>
                      </Paper>
                    </Grid.Col>
                  </Grid>
                </Stack>
              )}

              {/* Step 2: Decision */}
              {validationStep === 1 && (
                <Stack gap="md">
                  <Radio.Group
                    label="Decision"
                    description="Choose whether to approve or reject this document"
                    {...validationForm.getInputProps('decision')}
                    required
                  >
                    <Group mt="xs">
                      <Radio value="approve" label="Approve" color="green" />
                      <Radio value="reject" label="Reject" color="red" />
                    </Group>
                  </Radio.Group>

                  {validationForm.values.decision === 'reject' && (
                    <Textarea
                      label="Rejection Reason"
                      description="This will be visible to the user"
                      placeholder="e.g. Document expired, illegible, incorrect format..."
                      {...validationForm.getInputProps('rejectionReason')}
                      required
                      minRows={3}
                    />
                  )}

                  <TextInput
                    label="Internal Notes (optional)"
                    placeholder="Additional notes for your team"
                    {...validationForm.getInputProps('internalNotes')}
                  />
                </Stack>
              )}

              {/* Step 3: Confirmation */}
              {validationStep === 2 && (
                <Stack gap="md">
                  <Alert
                    color={validationForm.values.decision === 'approve' ? 'green' : 'red'}
                    title="Please confirm your decision"
                    icon={validationForm.values.decision === 'approve' ? <IconCheck size={18} /> : <IconX size={18} />}
                  >
                    <Box>
                      <Text size="sm">You are about to <b>{validationForm.values.decision}</b> the document:</Text>
                      <Text size="sm" fw={500} mt="xs">{selectedDocument.documentName}</Text>
                      <Text size="sm" c="dimmed">User: {selectedDocument.userName}</Text>
                      
                      {validationForm.values.decision === 'reject' && (
                        <Box mt="md">
                          <Text size="sm" fw={500}>Rejection reason:</Text>
                          <Text size="sm" c="dimmed" fs="italic">"{validationForm.values.rejectionReason}"</Text>
                        </Box>
                      )}
                      
                      {validationForm.values.internalNotes && (
                        <Box mt="md">
                          <Text size="sm" fw={500}>Internal notes:</Text>
                          <Text size="sm" c="dimmed">{validationForm.values.internalNotes}</Text>
                        </Box>
                      )}
                    </Box>
                  </Alert>
                  <Text size="sm" c="dimmed" ta="center">
                    This action cannot be undone.
                  </Text>
                </Stack>
              )}

              {/* Navigation Buttons */}
              <Group justify="space-between" mt="md">
                {validationStep > 0 ? (
                  <Button variant="light" leftSection={<IconArrowLeft size={14} />} onClick={prevStep}>
                    Back
                  </Button>
                ) : (
                  <Button variant="light" disabled style={{ visibility: 'hidden' }}>
                    Back
                  </Button>
                )}
                
                {validationStep < 2 ? (
                  <Button rightSection={<IconArrowRight size={14} />} onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    color={validationForm.values.decision === 'approve' ? 'green' : 'red'}
                    leftSection={validationForm.values.decision === 'approve' ? <IconCheck size={14} /> : <IconX size={14} />}
                  >
                    Confirm {validationForm.values.decision === 'approve' ? 'Approval' : 'Rejection'}
                  </Button>
                )}
              </Group>
            </Stack>
          </form>
        )}
      </Modal>

      {/* ---------- DELETE MODAL (unchanged) ---------- */}
      <Modal
        opened={deleteModalOpened}
        onClose={deleteModalHandlers.close}
        title={<Text fw={700} size="lg">Delete Document</Text>}
        centered
        size="md"
        radius="md"
      >
        {selectedDocument && (
          <Stack gap="md">
            <Alert color="red" title="Warning" icon={<IconAlertCircle size={16} />}>
              Are you sure you want to delete this document? This action cannot be undone.
            </Alert>
            <Group justify="flex-end">
              <Button variant="subtle" onClick={deleteModalHandlers.close}>Cancel</Button>
              <Button color="red" onClick={deleteDocument}>Delete</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Box>
  );
}