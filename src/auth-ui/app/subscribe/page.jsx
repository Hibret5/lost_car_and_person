"use client";

import {
  Box,
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  Stack,
  Badge,
  Divider,
  ThemeIcon,
  useMantineTheme,
  ActionIcon,
  Alert,
} from "@mantine/core";
import {
  IconCheck,
  IconCrown,
  IconShieldCheck,
  IconBell,
  IconStar,
  IconAlertCircle,
  IconCircle,
  IconCircleFilled,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";
import MainFooter from "../../components/MainFooter.jsx";
import { motion } from "framer-motion";

export default function SubscriptionPage() {
  const router = useRouter();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("annual");
  const [reportCount, setReportCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);

  // ADD THIS FUNCTION
  const handleClose = () => {
    router.back(); // Goes back to previous page
    // OR use: router.push("/dashboard"); // Goes to specific page
  };

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("currentUser");
      const reports = localStorage.getItem("userReports");

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setReportCount(parsedUser.reportCount || 0);
      }

      if (reports) {
        const parsedReports = JSON.parse(reports);
        setReportCount(parsedReports.length);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const plans = [
    {
      id: "monthly",
      name: "Monthly",
      price: "400.00",
      currency: "birr",
      period: "month",
      badge: "Basic Plan",
      badgeColor: "blue",
      features: [
        { text: "Free for every home you front with Deebot", included: true },
        { text: "Free for teleworking with client testing", included: true },
        { text: "2 Providers", included: true },
        { text: "Client billing", included: true },
        { text: "Free staging", included: true },
        { text: "Code licence", included: true },
        { text: "White labelling", included: true },
        { text: "Data powered protection", included: true },
        { text: "Priority support", included: false },
        { text: "Advanced analytics", included: false },
      ],
      color: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
    },
    {
      id: "annual",
      name: "Annual",
      price: "360.00",
      originalPrice: "400.00",
      currency: "birr",
      period: "month",
      badge: "10% OFF",
      badgeColor: "green",
      description: "0.00 birr when you have not yet to receive an invoice",
      features: [
        { text: "Everything in Monthly plan", included: true },
        { text: "Referral program", included: true },
        { text: "Web styling customization", included: true },
        { text: "Marketing tools", included: true },
        { text: "Data licensing", included: true },
        { text: "Code licence", included: true },
        { text: "White labelling", included: true },
        { text: "Data powered protection", included: true },
        { text: "Priority support 24/7", included: true },
        { text: "Advanced analytics dashboard", included: true },
        { text: "API access", included: true },
        { text: "Custom integrations", included: true },
      ],
      popular: true,
      color: "linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      currency: "",
      period: "",
      badge: "Custom",
      badgeColor: "violet",
      features: [
        { text: "Everything in Annual plan", included: true },
        { text: "Unlimited providers", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "Custom SLA agreements", included: true },
        { text: "On-premise deployment", included: true },
        { text: "Custom security protocols", included: true },
        { text: "Training & onboarding", included: true },
        { text: "Enterprise-grade support", included: true },
        { text: "Custom development", included: true },
        { text: "Brand customization", included: true },
        { text: "Volume discounts", included: true },
        { text: "Multi-team management", included: true },
      ],
      color: "linear-gradient(135deg, #3730a3 0%, #6366f1 100%)",
    },
  ];

  const handleDotClick = (index) => {
    setActiveIndex(index);
    setSelectedPlan(plans[index].id);
  };

  const handleUpgrade = () => {
    const selectedPlanData = plans.find((p) => p.id === selectedPlan);
    if (selectedPlanData.id === "enterprise") {
      router.push("/contact?plan=enterprise");
    } else {
      alert(`You selected the ${selectedPlanData.name} plan!`);
    }
  };

  // FIXED: Proper positioning without causing horizontal scroll
  const getCardTransform = (index) => {
    const offset = index - activeIndex;

    if (isMobile) {
      return {
        transform: `translateX(${offset * 100}%)`,
        opacity: Math.abs(offset) <= 1 ? 1 : 0,
        zIndex: 10 - Math.abs(offset),
      };
    }

    // Desktop - using viewport units for safe positioning
    const translatePercentage = offset * 80; // Reduced from 110 to 80

    if (offset === 0) {
      // Active card - center, bigger
      return {
        transform: `translateX(${translatePercentage}%) scale(1.1)`,
        zIndex: 30,
        opacity: 1,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      };
    } else if (Math.abs(offset) === 1) {
      // Adjacent cards - smaller
      return {
        transform: `translateX(${translatePercentage}%) scale(0.9)`,
        zIndex: 20,
        opacity: 0.8,
      };
    } else {
      // Far cards - hidden
      return {
        transform: `translateX(${translatePercentage}%) scale(0.7)`,
        zIndex: 10,
        opacity: 0.3,
      };
    }
  };

  const getPlanPriceDisplay = (plan) => {
    if (plan.id === "enterprise") {
      return (
        <Title order={2} fw={800} c="white">
          Custom Pricing
        </Title>
      );
    }

    if (plan.originalPrice) {
      return (
        <Stack gap={0}>
          <Text size="sm" c="white" td="line-through" opacity={0.8}>
            {plan.originalPrice} {plan.currency}/{plan.period}
          </Text>
          <Group gap={4} align="center">
            <Title order={2} fw={800} c="white">
              {plan.price}
            </Title>
            <Text size="lg" fw={600} c="white">
              {plan.currency}/{plan.period}
            </Text>
          </Group>
        </Stack>
      );
    }

    return (
      <Group gap={4} align="center">
        <Title order={2} fw={800} c="white">
          {plan.price}
        </Title>
        <Text size="lg" fw={600} c="white">
          {plan.currency}/{plan.period}
        </Text>
      </Group>
    );
  };

  if (loading) {
    return (
      <Box
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text size="lg">Loading subscription plans...</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" style={{ minHeight: "100vh", overflowX: "hidden" }}>
      {" "}
      {/* ADDED overflowX: "hidden" */}
      {/* Header */}
      <Box
        bg="white"
        py={{ base: "xs", md: "sm" }}
        style={{
          borderBottom: "1px solid #E9ECEF",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="xl" style={{ overflowX: "hidden" }}>
          <Group justify="space-between">
            <Link href="/" style={{ flexShrink: 0 }}>
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={120}
                height={40}
                style={{
                  width: "auto",
                  height: "40px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              />
            </Link>
          </Group>
        </Container>
      </Box>
      {/* ADD THIS: Close Button Section - Below Navbar */}
     
  <Container size="xl" style={{ marginTop: 20 }}>
    
      <Group justify="flex-end">
        <ActionIcon
          variant="light"
          color="blue"
          size={55}
          radius="xs" // Very rectangular
          onClick={handleClose}
          style={{
            cursor: "pointer",
            border: "2px solid #2f80ed",
          }}
        >
          <IconX 
            size={30}
            stroke={4}
            color="#2f80ed"
          />
        </ActionIcon>
      </Group>
    
  </Container>
      {/* Main Content */}
      <Container
        size="xl"
        py={{ base: 30, md: 50 }}
        style={{ overflowX: "hidden" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Report Warning Banner */}
          {reportCount >= 1 && (
            <Alert
              icon={<IconAlertCircle size={24} />}
              title={`This is your ${reportCount > 1 ? `${reportCount}th` : "second"} missing item report`}
              color="orange"
              variant="filled"
              mb="xl"
              radius="md"
            >
              <Text c="white">
                Premium subscribers get priority handling for missing item
                reports.
              </Text>
            </Alert>
          )}

          <Stack gap={40} align="center">
            {/* Page Header */}
            <Stack gap="md" align="center" maw={800} mx="auto">
              <Title order={1} size={{ base: 48, md: 48 }} fw={900} ta="center">
                Choose Your Plan
              </Title>
              <Text size={{ base: "md", md: "lg" }} c="dimmed" ta="center">
                Select the perfect plan for your needs
              </Text>
            </Stack>

            {/* MAIN FIX: Carousel Container with proper constraints */}
            <Box
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "1200px", // Constrained max width
                height: isMobile ? "650px" : "600px",
                margin: "0 auto 20px auto",
                overflow: "hidden", // Keep hidden here for carousel effect
              }}
            >
              {/* Cards Wrapper - This prevents horizontal scroll */}
              <Box
                style={{
                  position: "absolute",
                  width: "100vw", // Full viewport width
                  height: "100%",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Cards Container - Centered within wrapper */}
                <Box
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {plans.map((plan, index) => (
                    <motion.div
                      key={plan.id}
                      initial={false}
                      animate={getCardTransform(index)}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      style={{
                        position: "absolute",
                        width: isMobile ? "85%" : "300px", // Reduced width
                        height: isMobile ? "500px" : "480px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setActiveIndex(index);
                        setSelectedPlan(plan.id);
                      }}
                    >
                      <Card
                        withBorder
                        radius="lg"
                        p="xl"
                        h="100%"
                        style={{
                          background: plan.color,
                          border: `2px solid ${theme.colors.blue[7]}`,
                          transition: "all 0.3s ease",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {plan.popular && index === activeIndex && (
                          <Badge
                            color="yellow"
                            size="lg"
                            variant="filled"
                            style={{
                              position: "absolute",
                              top: -12,
                              left: "50%",
                              transform: "translateX(-50%)",
                              zIndex: 5,
                            }}
                          >
                            <Group gap={4}>
                              <IconStar size={14} />
                              RECOMMENDED
                            </Group>
                          </Badge>
                        )}

                        <Stack gap="md" style={{ flex: 1 }}>
                          {/* Plan Header */}
                          <Stack gap="xs">
                            <Group justify="space-between" align="flex-start">
                              <Title order={3} c="white">
                                {plan.name}
                              </Title>
                              <Badge
                                color={plan.badgeColor}
                                variant="filled"
                                size="lg"
                              >
                                {plan.badge}
                              </Badge>
                            </Group>

                            {plan.description && (
                              <Text size="sm" c="white" opacity={0.9}>
                                {plan.description}
                              </Text>
                            )}
                          </Stack>

                          {/* Price */}
                          <Box>
                            {getPlanPriceDisplay(plan)}
                            {plan.id !== "enterprise" && (
                              <Text size="sm" c="white" opacity={0.8} mt={4}>
                                Billed{" "}
                                {plan.id === "annual" ? "annually" : "monthly"}
                              </Text>
                            )}
                          </Box>

                          <Divider my="xs" color="rgba(255,255,255,0.3)" />

                          {/* Features */}
                          <Stack
                            gap="xs"
                            style={{ flex: 1, overflowY: "auto" }}
                          >
                            <Text fw={600} c="white" size="md">
                              Included Features:
                            </Text>
                            <Stack gap={6}>
                              {plan.features.slice(0, 8).map((feature, idx) => (
                                <Group key={idx} gap="xs" wrap="nowrap">
                                  <ThemeIcon
                                    color={feature.included ? "green" : "red"}
                                    size={20}
                                    radius="xl"
                                    variant={
                                      feature.included ? "filled" : "outline"
                                    }
                                  >
                                    <IconCheck size={12} />
                                  </ThemeIcon>
                                  <Text
                                    size="sm"
                                    c="white"
                                    opacity={feature.included ? 1 : 0.6}
                                    style={{ lineHeight: 1.3 }}
                                  >
                                    {feature.text}
                                  </Text>
                                </Group>
                              ))}
                            </Stack>
                          </Stack>

                          {/* Action Button */}
                          <Button
                            color={index === activeIndex ? "yellow" : "white"}
                            variant="filled"
                            size="lg"
                            radius="md"
                            fullWidth
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpgrade();
                            }}
                            disabled={
                              plan.id === "monthly" &&
                              user?.subscription === "monthly"
                            }
                            style={{
                              fontWeight: 700,
                              color:
                                index === activeIndex
                                  ? theme.colors.dark[9]
                                  : theme.colors.blue[7],
                              marginTop: "auto",
                            }}
                          >
                            {plan.id === "monthly" &&
                            user?.subscription === "monthly"
                              ? "Current Plan"
                              : plan.id === "enterprise"
                                ? "Contact Sales"
                                : "Select Plan"}
                          </Button>
                        </Stack>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Navigation Dots */}
            <Group
              justify="center"
              mt={isMobile ? "xl" : "lg"}
              style={{ position: "relative", zIndex: 40 }}
            >
              {plans.map((_, index) => (
                <ActionIcon
                  key={index}
                  variant="transparent"
                  onClick={() => handleDotClick(index)}
                  style={{ cursor: "pointer" }}
                  size="lg"
                >
                  {index === activeIndex ? (
                    <IconCircleFilled size={20} color={theme.colors.blue[6]} />
                  ) : (
                    <IconCircle size={20} color={theme.colors.gray[4]} />
                  )}
                </ActionIcon>
              ))}
            </Group>

            {/* Mobile Instructions */}
            {isMobile && (
              <Text size="sm" c="dimmed" ta="center" mt="md">
                Swipe left or right to view plans
              </Text>
            )}

            {/* Selected Plan Info */}
            <Box
              mt="xl"
              p="lg"
              style={{
                background: theme.colors.blue[0],
                borderRadius: theme.radius.lg,
                width: "100%",
                maxWidth: "600px",
              }}
            >
              <Group justify="center" gap="md">
                <IconCrown size={24} color={theme.colors.blue[6]} />
                <Text fw={600} size="lg">
                  Selected:{" "}
                  <Text span c="blue">
                    {plans.find((p) => p.id === selectedPlan)?.name} Plan
                  </Text>
                </Text>
              </Group>
            </Box>
          </Stack>
        </motion.div>
      </Container>
      <MainFooter />
    </Box>
  );
}
