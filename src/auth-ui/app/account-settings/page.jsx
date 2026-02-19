"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Paper,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Select,
  Switch,
  Button,
  Group,
  Stack,
  Alert,
  Grid,
  Divider,
  Box,
  Avatar,
  FileInput,
  SimpleGrid,
  Radio,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconInfoCircle,
  IconCheck,
  IconX,
  IconUser,
  IconMail,
  IconLock,
  IconBell,
  IconEye,
  IconWorld,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";

export default function UserSettingsPage() {
  const [formData, setFormData] = useState({
    // Profile
    displayName: "",
    email: "",
    avatar: null, // file object or URL
    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    // Preferences
    language: "en",
    theme: "system", // 'light', 'dark', 'system'
    timezone: "UTC",
    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    // Privacy
    profileVisibility: "public", // 'public', 'private', 'friends'
    showEmail: false,
    allowDataCollection: true,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Password visibility toggles
  const [visibleCurrent, { toggle: toggleCurrent }] = useDisclosure(false);
  const [visibleNew, { toggle: toggleNew }] = useDisclosure(false);
  const [visibleConfirm, { toggle: toggleConfirm }] = useDisclosure(false);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle avatar separately (can't store file in localStorage)
        setFormData((prev) => ({ ...prev, ...parsed, avatar: null }));
      } catch (e) {
        console.error("Failed to parse saved settings");
      }
    }
  }, []);

  // Track unsaved changes
  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Compare without avatar
        const { avatar: savedAvatar, ...savedRest } = parsed;
        const { avatar: currentAvatar, ...currentRest } = formData;
        setHasUnsavedChanges(JSON.stringify(savedRest) !== JSON.stringify(currentRest));
      } catch (e) {
        setHasUnsavedChanges(true);
      }
    } else {
      // If no saved data, check if form has been modified from defaults
      const defaultData = {
        displayName: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        language: "en",
        theme: "system",
        timezone: "UTC",
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        profileVisibility: "public",
        showEmail: false,
        allowDataCollection: true,
      };
      const { avatar, ...currentRest } = formData;
      setHasUnsavedChanges(JSON.stringify(currentRest) !== JSON.stringify(defaultData));
    }
  }, [formData]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Display name required
    if (!formData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Password validation (if changing password)
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "Current password is required to change password";
      }
      if (!formData.newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = "Password must be at least 6 characters";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setNotification({ type: "error", message: "Please fix the errors above" });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Prepare data to save (exclude avatar for now)
      const { avatar, ...dataToSave } = formData;
      localStorage.setItem("userSettings", JSON.stringify(dataToSave));

      setNotification({ type: "success", message: "Settings saved successfully!" });
      setHasUnsavedChanges(false);
    } catch (error) {
      setNotification({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Language options
  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "zh", label: "Chinese" },
  ];

  // Timezone options (simplified)
  const timezones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Shanghai",
  ];

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Box mb="lg" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <img src="/logo.jpg" alt="Logo" style={{ width: 96, height: 'auto' }} />
        <div>
          <Title order={1} c="blue.8">User Settings</Title>
          <Text c="dimmed" size="sm">Manage your profile, security, preferences, and privacy.</Text>
        </div>
      </Box>

      {/* Notification */}
      {notification && (
        <Alert
          mb="md"
          variant="light"
          color={notification.type === "success" ? "green" : "red"}
          title={notification.type === "success" ? "Success" : "Error"}
          icon={notification.type === "success" ? <IconCheck size={16} /> : <IconX size={16} />}
          withCloseButton
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Alert>
      )}

      {/* Form */}
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            {/* Profile Section */}
            <Box>
              <Text fw={600} size="md" mb="xs">Profile</Text>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Stack align="center" gap="xs">
                    <Avatar
                      size={120}
                      radius={120}
                      src={formData.avatar ? URL.createObjectURL(formData.avatar) : null}
                      color="blue"
                    >
                      {!formData.avatar && formData.displayName ? (
                        formData.displayName.charAt(0).toUpperCase()
                      ) : (
                        <IconUser size={40} />
                      )}
                    </Avatar>
                    <FileInput
                      placeholder="Upload avatar"
                      accept="image/png,image/jpeg,image/gif"
                      value={formData.avatar}
                      onChange={(file) => handleChange("avatar", file)}
                      size="xs"
                      w="100%"
                    />
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 8 }}>
                  <Stack gap="md">
                    <TextInput
                      label="Display name"
                      placeholder="Your name"
                      value={formData.displayName}
                      onChange={(e) => handleChange("displayName", e.target.value)}
                      error={errors.displayName}
                      required
                      leftSection={<IconUser size={16} />}
                    />
                    <TextInput
                      label="Email address"
                      placeholder="you@example.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={errors.email}
                      required
                      leftSection={<IconMail size={16} />}
                    />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Box>

            <Divider />

            {/* Security Section */}
            <Box>
              <Text fw={600} size="md" mb="xs">Security</Text>
              <Text size="sm" c="dimmed" mb="md">
                Leave blank if you dont want to change your password.
              </Text>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <PasswordInput
                    label="Current password"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={(e) => handleChange("currentPassword", e.target.value)}
                    error={errors.currentPassword}
                    visible={visibleCurrent}
                    onVisibilityChange={toggleCurrent}
                    leftSection={<IconLock size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <PasswordInput
                    label="New password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    error={errors.newPassword}
                    visible={visibleNew}
                    onVisibilityChange={toggleNew}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <PasswordInput
                    label="Confirm new password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    error={errors.confirmPassword}
                    visible={visibleConfirm}
                    onVisibilityChange={toggleConfirm}
                  />
                </Grid.Col>
              </Grid>
            </Box>

            <Divider />

            {/* Preferences Section */}
            <Box>
              <Text fw={600} size="md" mb="xs">Preferences</Text>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Select
                    label="Language"
                    placeholder="Select language"
                    data={languages}
                    value={formData.language}
                    onChange={(value) => handleChange("language", value)}
                    leftSection={<IconWorld size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Select
                    label="Timezone"
                    placeholder="Select timezone"
                    data={timezones}
                    value={formData.timezone}
                    onChange={(value) => handleChange("timezone", value)}
                    searchable
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Radio.Group
                    label="Theme"
                    value={formData.theme}
                    onChange={(value) => handleChange("theme", value)}
                  >
                    <Group mt="xs">
                      <Radio value="light" label="Light" icon={IconSun} />
                      <Radio value="dark" label="Dark" icon={IconMoon} />
                      <Radio value="system" label="System" />
                    </Group>
                  </Radio.Group>
                </Grid.Col>
              </Grid>
            </Box>

            <Divider />

            {/* Notifications Section */}
            <Box>
              <Text fw={600} size="md" mb="xs">Notifications</Text>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Switch
                  label="Email notifications"
                  description="Receive updates via email"
                  checked={formData.emailNotifications}
                  onChange={(e) => handleChange("emailNotifications", e.currentTarget.checked)}
                  size="md"
                  leftSection={<IconMail size={16} />}
                />
                <Switch
                  label="Push notifications"
                  description="Receive browser push notifications"
                  checked={formData.pushNotifications}
                  onChange={(e) => handleChange("pushNotifications", e.currentTarget.checked)}
                  size="md"
                  leftSection={<IconBell size={16} />}
                />
                <Switch
                  label="Marketing emails"
                  description="Receive newsletters and promotions"
                  checked={formData.marketingEmails}
                  onChange={(e) => handleChange("marketingEmails", e.currentTarget.checked)}
                  size="md"
                />
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Privacy Section */}
            <Box>
              <Text fw={600} size="md" mb="xs">Privacy</Text>
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Select
                    label="Profile visibility"
                    data={[
                      { value: "public", label: "Public (anyone can see)" },
                      { value: "private", label: "Private (only you)" },
                      { value: "friends", label: "Friends only" },
                    ]}
                    value={formData.profileVisibility}
                    onChange={(value) => handleChange("profileVisibility", value)}
                    leftSection={<IconEye size={16} />}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Switch
                    label="Show email on profile"
                    description="Display your email address publicly"
                    checked={formData.showEmail}
                    onChange={(e) => handleChange("showEmail", e.currentTarget.checked)}
                    mt="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <Switch
                    label="Allow data collection"
                    description="Help us improve by sharing anonymous usage data"
                    checked={formData.allowDataCollection}
                    onChange={(e) => handleChange("allowDataCollection", e.currentTarget.checked)}
                    mt="md"
                  />
                </Grid.Col>
              </Grid>
            </Box>

            <Divider my="sm" />

            {/* Form Actions */}
            <Group justify="flex-end" gap="sm">
              <Button
                variant="default"
                component={Link}
                href="/dashboard"
                size="md"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading || !hasUnsavedChanges}
                size="md"
              >
                {isLoading ? "Saving..." : "Save settings"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      {/* Info Card */}
      <Alert
        mt="lg"
        variant="light"
        color="blue"
        icon={<IconInfoCircle size={16} />}
        title="About your data"
      >
        Your settings are stored locally in this demo. In a real app, they would be saved to our servers securely.
      </Alert>
    </Container>
  );
}