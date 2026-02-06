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
  Divider,
  useMantineTheme,
  Alert,
  Select,
  TextInput,
  Checkbox,
  Loader,
  ActionIcon,
  Radio,
  RadioGroup,
  Grid,
  Badge,
  Modal,
  PinInput,
} from "@mantine/core";
import {
  IconShieldCheck,
  IconCalendar,
  IconArrowLeft,
  IconMapPin,
  IconBuildingBank,
  IconWallet,
  IconCreditCard,
  IconUser,
  IconCheck,
  IconSparkles,
  IconLock,
  IconAlertCircle,
  IconReceipt,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useMantineTheme();

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showValidation, setShowValidation] = useState(false); // NEW: Track if validation should show

  // Get plan from URL
  const planType = searchParams.get("type") || "annual";
  const [selectedPlan, setSelectedPlan] = useState(planType);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [billedTo, setBilledTo] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [paymentDate, setPaymentDate] = useState("14/11/2025 1:55 PM");
  const [location, setLocation] = useState("Ethiopia");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Credit card specific state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [cardholder, setCardholder] = useState("");

  // Wallet specific state
  const [walletId, setWalletId] = useState("");
  const [walletPin, setWalletPin] = useState("");

  // Banks list
  const banks = [
    "Commercial Bank of Ethiopia",
    "Dashen Bank",
    "Awash Bank",
    "Bank of Abyssinia",
    "NIB International Bank",
    "Hibret Bank",
    "Zemen Bank",
    "Wegagen Bank",
  ];

  // Plan data
  const plans = {
    monthly: {
      name: "Monthly",
      badge: "MONTHLY",
      price: "400",
      period: "month",
      total: "400",
      description: "400 birr / month",
      originalPrice: "400",
      borderColor: "#667eea",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      billing: "400.00",
    },
    annual: {
      name: "Annual",
      badge: "ANNUAL",
      price: "360",
      period: "month",
      total: "4,380",
      description: "$240 / month",
      savings: "Save 13%",
      originalPrice: "4,800",
      borderColor: "#f093fb",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      billing: "4380.00",
    },
  };

  const currentPlan = plans[selectedPlan];

  // Validation function
  const isFormValid = () => {
    // Check basic requirements
    if (!billedTo.trim()) return false;
    if (!acceptedTerms) return false;

    // Check payment method specific requirements
    switch (paymentMethod) {
      case "bank":
        return selectedBank.trim() !== "" && accountNumber.trim() !== "";
      case "creditCard":
        return (
          cardNumber.trim() !== "" &&
          cardExpiry.trim() !== "" &&
          cardCVC.trim() !== "" &&
          cardholder.trim() !== ""
        );
      case "wallet":
        return walletId.trim() !== "" && walletPin.trim() !== "";
      default:
        return false;
    }
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 300);
  }, []);

  const handleContinue = () => {
    if (!isFormValid()) {
      // Show validation errors when user tries to continue with incomplete form
      setShowValidation(true);
      return;
    }

    // Switch to confirmation view
    setShowConfirmation(true);
  };

  const handleConfirmPayment = () => {
    // Show PIN modal
    setShowPinModal(true);
  };

  const handlePinSubmit = async () => {
    if (pin.length !== 4) {
      alert("Please enter a 4-digit PIN");
      return;
    }

    setShowPinModal(false);
    setPaymentLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setPaymentLoading(false);
      setPin("");
      alert(`Payment successful! ${currentPlan.name} plan activated.`);
      router.push("/dashboard");
    }, 1500);
  };

  const handleEditForm = () => {
    // Go back to form view
    setShowConfirmation(false);
  };

  // Helper function to show error only when validation is triggered
  const showError = (fieldValue) => {
    return showValidation && !fieldValue.trim();
  };

  const renderLeftContent = () => {
    if (showConfirmation) {
      // CONFIRMATION VIEW (Left content changes to this)
      return (
        <Stack gap="lg">
          {/* Header */}
          <Box>
            <Group>
              <IconAlertCircle size={32} color={theme.colors.blue[6]} />
              <Title order={2} fw={900}>
                Dear, {billedTo || "User"}
              </Title>
            </Group>
            <Text c="dimmed" size="lg" mt={4}>
              Make sure you inserted the correct data
            </Text>
          </Box>

          <Divider />

          {/* Confirmation Details */}
          <Card withBorder p="lg" radius="lg" style={{ borderWidth: 2 }}>
            <Stack gap="md">
              <Text fw={700} size="xl" c="blue">
                Chosen Plan
              </Text>

              <Box>
                <Text size="sm" c="dimmed">
                  Plan Type
                </Text>
                <Group mt={4}>
                  <Badge color="blue" size="xl" radius="sm">
                    {currentPlan.name}
                  </Badge>
                </Group>
              </Box>

              {paymentMethod === "bank" && selectedBank && (
                <>
                  <Divider />

                  <Box>
                    <Text size="sm" c="dimmed">
                      Chosen Bank
                    </Text>
                    <Group mt={4} gap="xs">
                      <IconBuildingBank size={20} />
                      <Text fw={600} size="lg">
                        {selectedBank}
                      </Text>
                    </Group>
                  </Box>

                  <Box>
                    <Text size="sm" c="dimmed">
                      Account number
                    </Text>
                    <Text fw={600} size="lg" mt={4}>
                      {accountNumber
                        ? `${accountNumber.slice(0, 4)}xxxxxxxxxx`
                        : "Not provided"}
                    </Text>
                  </Box>
                </>
              )}

              {paymentMethod === "creditCard" && (
                <>
                  <Divider />

                  <Box>
                    <Text size="sm" c="dimmed">
                      Card Type
                    </Text>
                    <Group mt={4} gap="xs">
                      <IconCreditCard size={20} />
                      <Text fw={600} size="lg">
                        Credit Card
                      </Text>
                    </Group>
                  </Box>

                  <Box>
                    <Text size="sm" c="dimmed">
                      Card Number
                    </Text>
                    <Text fw={600} size="lg" mt={4}>
                      {cardNumber
                        ? `**** ${cardNumber.slice(-4)}`
                        : "Not provided"}
                    </Text>
                  </Box>
                </>
              )}

              {paymentMethod === "wallet" && (
                <>
                  <Divider />

                  <Box>
                    <Text size="sm" c="dimmed">
                      Wallet Type
                    </Text>
                    <Group mt={4} gap="xs">
                      <IconWallet size={20} />
                      <Text fw={600} size="lg">
                        Digital Wallet
                      </Text>
                    </Group>
                  </Box>

                  <Box>
                    <Text size="sm" c="dimmed">
                      Wallet ID
                    </Text>
                    <Text fw={600} size="lg" mt={4}>
                      {walletId
                        ? `${walletId.slice(0, 4)}...${walletId.slice(-4)}`
                        : "Not provided"}
                    </Text>
                  </Box>
                </>
              )}

              <Divider />

              <Box>
                <Text size="sm" c="dimmed">
                  Billing
                </Text>
                <Title order={1} fw={900} c="blue" mt={4}>
                  {currentPlan.billing} birr
                </Title>
              </Box>
            </Stack>
          </Card>

          {/* Action Buttons */}
          <Group grow mt="lg">
            <Button
              variant="outline"
              color="red"
              size="lg"
              radius="md"
              onClick={handleEditForm}
              leftSection={<IconArrowLeft size={20} />}
            >
              Cancel
            </Button>
            <Button
              color="blue"
              size="lg"
              radius="md"
              onClick={handleConfirmPayment}
              leftSection={<IconCheck size={20} />}
            >
              Continue
            </Button>
          </Group>

          {/* Security Note */}
          <Alert
            color="blue"
            variant="light"
            icon={<IconShieldCheck size={20} />}
          >
            <Text size="sm">
              Review your information carefully. Click Continue to proceed with
              payment.
            </Text>
          </Alert>
        </Stack>
      );
    }

    // ORIGINAL PAYMENT FORM VIEW
    return (
      <Stack gap="lg">
        {/* Header */}
        <Box>
          <Title order={2} fw={800} c="blue">
            Upgrade Your Plan
          </Title>
          <Text c="dimmed" size="md" mt={4}>
            Do more with unlimited blocks, files, automations & integrations.
          </Text>
        </Box>

        <Divider />

        {/* Billed To */}
        <Box>
          <Text fw={600} size="md" mb={4}>
            Billed To
          </Text>
          <TextInput
            placeholder="Your full name"
            value={billedTo}
            onChange={(e) => setBilledTo(e.target.value)}
            leftSection={<IconUser size={18} />}
            size="md"
            radius="md"
            error={showError(billedTo) && "Name is required"}
          />
        </Box>

        {/* Payment Method Selection */}
        <Box>
          <Text fw={600} size="md" mb={12}>
            Payment Method
          </Text>
          <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
            <Group gap="md" mb="md">
              <Card
                withBorder
                p="md"
                radius="md"
                style={{
                  cursor: "pointer",
                  borderColor:
                    paymentMethod === "bank" ? theme.colors.blue[6] : "#dee2e6",
                  backgroundColor:
                    paymentMethod === "bank" ? theme.colors.blue[0] : "white",
                  flex: 1,
                  transition: "all 0.2s",
                }}
                onClick={() => setPaymentMethod("bank")}
              >
                <Stack align="center" gap={8}>
                  <IconBuildingBank
                    size={28}
                    color={
                      paymentMethod === "bank" ? theme.colors.blue[6] : "gray"
                    }
                  />
                  <Text fw={500}>Bank</Text>
                </Stack>
              </Card>

              <Card
                withBorder
                p="md"
                radius="md"
                style={{
                  cursor: "pointer",
                  borderColor:
                    paymentMethod === "wallet"
                      ? theme.colors.green[6]
                      : "#dee2e6",
                  backgroundColor:
                    paymentMethod === "wallet"
                      ? theme.colors.green[0]
                      : "white",
                  flex: 1,
                  transition: "all 0.2s",
                }}
                onClick={() => setPaymentMethod("wallet")}
              >
                <Stack align="center" gap={8}>
                  <IconWallet
                    size={28}
                    color={
                      paymentMethod === "wallet"
                        ? theme.colors.green[6]
                        : "gray"
                    }
                  />
                  <Text fw={500}>Wallet</Text>
                </Stack>
              </Card>

              <Card
                withBorder
                p="md"
                radius="md"
                style={{
                  cursor: "pointer",
                  borderColor:
                    paymentMethod === "creditCard"
                      ? theme.colors.violet[6]
                      : "#dee2e6",
                  backgroundColor:
                    paymentMethod === "creditCard"
                      ? theme.colors.violet[0]
                      : "white",
                  flex: 1,
                  transition: "all 0.2s",
                }}
                onClick={() => setPaymentMethod("creditCard")}
              >
                <Stack align="center" gap={8}>
                  <IconCreditCard
                    size={28}
                    color={
                      paymentMethod === "creditCard"
                        ? theme.colors.violet[6]
                        : "gray"
                    }
                  />
                  <Text fw={500}>Card</Text>
                </Stack>
              </Card>
            </Group>
          </RadioGroup>
        </Box>

        {/* Dynamic Payment Form */}
        {renderPaymentForm()}

        {/* Payment Details */}
        <Card
          withBorder
          p="lg"
          radius="lg"
          style={{
            borderColor: theme.colors.gray[4],
            borderWidth: 1,
          }}
        >
          <Stack gap="md">
            <Text fw={600}>Payment Details</Text>
            <Grid>
              <Grid.Col span={6}>
                <Box>
                  <Text size="sm" c="dimmed">
                    Date & Time
                  </Text>
                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <Text fw={500}>{paymentDate}</Text>
                  </Group>
                </Box>
              </Grid.Col>
              <Grid.Col span={6}>
                <Box>
                  <Text size="sm" c="dimmed">
                    Location
                  </Text>
                  <Group gap="xs">
                    <IconMapPin size={16} />
                    <Text fw={500}>{location}</Text>
                  </Group>
                </Box>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Buttons */}
        <Group grow mt="lg">
          <Button
            variant="outline"
            color="gray"
            size="lg"
            radius="md"
            onClick={() => router.push("/subscribe")}
          >
            Cancel
          </Button>
          <Button
            color="blue"
            size="lg"
            radius="md"
            onClick={handleContinue}
            disabled={!isFormValid()}
            leftSection={<IconReceipt size={20} />}
          >
            Review & Continue
          </Button>
        </Group>

        {/* Terms */}
        <Alert
          color={showError(acceptedTerms.toString()) ? "red" : "gray"}
          variant="light"
          mt="md"
          p="md"
          radius="md"
        >
          <Checkbox
            label={
              <Text size="sm">
                By providing your payment information, you allow us to charge
                for future payments in accordance with our terms.
              </Text>
            }
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.currentTarget.checked)}
          />
        </Alert>

        {/* Validation Warning (only shows when user tries to continue with incomplete form) */}
        {showValidation && !isFormValid() && (
          <Alert
            color="yellow"
            variant="light"
            icon={<IconAlertCircle size={18} />}
          >
            <Text size="sm">
              Please fill in all required fields before continuing.
            </Text>
          </Alert>
        )}
      </Stack>
    );
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "creditCard":
        return (
          <Stack gap="md">
            <Card
              withBorder
              p="lg"
              radius="lg"
              style={{
                borderColor: theme.colors.violet[5],
                borderWidth: 1,
                backgroundColor: theme.colors.violet[0],
              }}
            >
              <Stack gap="md">
                <Text fw={600} mb={4}>
                  Card Details
                </Text>
                <TextInput
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  leftSection={<IconCreditCard size={18} />}
                  size="md"
                  error={showError(cardNumber) && "Card number is required"}
                />
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.currentTarget.value)}
                      size="md"
                      error={showError(cardExpiry) && "Expiry date is required"}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      placeholder="CVC"
                      value={cardCVC}
                      onChange={(e) => setCardCVC(e.currentTarget.value)}
                      size="md"
                      error={showError(cardCVC) && "CVC is required"}
                    />
                  </Grid.Col>
                </Grid>
                <TextInput
                  placeholder="Cardholder Name"
                  value={cardholder}
                  onChange={(e) => setCardholder(e.currentTarget.value)}
                  leftSection={<IconUser size={18} />}
                  size="md"
                  error={showError(cardholder) && "Cardholder name is required"}
                />
              </Stack>
            </Card>
          </Stack>
        );

      case "wallet":
        return (
          <Stack gap="md">
            <Card
              withBorder
              p="lg"
              radius="lg"
              style={{
                borderColor: theme.colors.green[5],
                borderWidth: 1,
                backgroundColor: theme.colors.green[0],
              }}
            >
              <Stack gap="md">
                <Text fw={600} mb={4}>
                  Wallet Details
                </Text>
                <TextInput
                  placeholder="Wallet ID or Phone Number"
                  value={walletId}
                  onChange={(e) => setWalletId(e.currentTarget.value)}
                  leftSection={<IconWallet size={18} />}
                  size="md"
                  error={showError(walletId) && "Wallet ID is required"}
                />
                <TextInput
                  placeholder="Wallet PIN"
                  type="password"
                  value={walletPin}
                  onChange={(e) => setWalletPin(e.currentTarget.value)}
                  leftSection={<IconLock size={18} />}
                  size="md"
                  error={showError(walletPin) && "Wallet PIN is required"}
                />
                <Alert color="yellow" variant="light" size="sm">
                  <Text size="xs">
                    Use your mobile wallet app to complete this payment
                  </Text>
                </Alert>
              </Stack>
            </Card>
          </Stack>
        );

      default: // bank
        return (
          <Stack gap="md">
            <Card
              withBorder
              p="lg"
              radius="lg"
              style={{
                borderColor: theme.colors.blue[5],
                borderWidth: 1,
                backgroundColor: theme.colors.blue[0],
              }}
            >
              <Stack gap="md">
                <Select
                  label="Select Bank"
                  placeholder="Choose your bank"
                  data={banks}
                  value={selectedBank}
                  onChange={setSelectedBank}
                  leftSection={<IconBuildingBank size={18} />}
                  size="md"
                  error={
                    showError(selectedBank) && "Bank selection is required"
                  }
                />
                <TextInput
                  label="Account Number"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.currentTarget.value)}
                  leftSection={<IconCreditCard size={18} />}
                  size="md"
                  error={
                    showError(accountNumber) && "Account number is required"
                  }
                />
              </Stack>
            </Card>
          </Stack>
        );
    }
  };

  const renderPinModal = () => (
    <Modal
      opened={showPinModal}
      onClose={() => {
        setShowPinModal(false);
        setPin("");
      }}
      size="sm"
      centered
      title={
        <Group>
          <IconLock size={24} />
          <Title order={3}>Enter PIN to Confirm</Title>
        </Group>
      }
      radius="lg"
    >
      <Stack gap="lg">
        <Text c="dimmed" ta="center">
          Enter your 4-digit PIN to confirm the payment
        </Text>

        <Group justify="center">
          <PinInput
            length={4}
            type="number"
            value={pin}
            onChange={setPin}
            size="lg"
            oneTimeCode
          />
        </Group>

        <Text size="sm" c="dimmed" ta="center">
          Amount:{" "}
          <Text span fw={700}>
            {currentPlan.billing} birr
          </Text>
        </Text>

        <Group grow>
          <Button
            variant="light"
            color="gray"
            onClick={() => {
              setShowPinModal(false);
              setPin("");
            }}
          >
            Cancel
          </Button>
          <Button
            color="green"
            onClick={handlePinSubmit}
            loading={paymentLoading}
            disabled={pin.length !== 4}
          >
            Confirm Payment
          </Button>
        </Group>

        <Alert color="red" variant="light" size="sm">
          <Text size="xs">
            This action cannot be undone. Your account will be charged
            immediately.
          </Text>
        </Alert>
      </Stack>
    </Modal>
  );

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
        <Loader />
      </Box>
    );
  }

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
            <Link href="/">
              <Image
                src="/logo.jpg"
                alt="Logo"
                width={120}
                height={40}
                style={{ height: "40px", borderRadius: "8px" }}
              />
            </Link>
          </Group>
        </Container>
      </Box>

      {/* Main Content */}
      <Container size="xl" py={40}>
        <Title
          order={1}
          fw={900}
          ta="center"
          mb="xl"
          gradient={{ from: "blue", to: "violet" }}
          variant="gradient"
        >
          {showConfirmation ? "Confirm Your Payment" : "Complete Your Payment"}
        </Title>

        <Grid gutter="xl">
          {/* LEFT: Dynamic Content */}
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <Card
              withBorder
              radius="lg"
              p="xl"
              style={{
                height: "100%",
                borderColor: showConfirmation
                  ? theme.colors.blue[4]
                  : theme.colors.blue[4],
                borderWidth: 1,
                boxShadow: showConfirmation
                  ? "0 4px 20px rgba(72, 187, 120, 0.15)"
                  : "0 4px 20px rgba(102, 126, 234, 0.15)",
              }}
            >
              {renderLeftContent()}
            </Card>
          </Grid.Col>

          {/* RIGHT: Plan Selection */}
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Card
              withBorder
              radius="lg"
              p="xl"
              style={{
                height: "100%",
                borderColor: theme.colors.violet[4],
                borderWidth: 1,
                boxShadow: "0 4px 20px rgba(157, 78, 221, 0.15)",
              }}
            >
              <Stack gap="xl">
                <Box>
                  <Group justify="center" mb="lg">
                    <IconSparkles size={32} color={theme.colors.violet[6]} />
                    <Title order={2} fw={800} ta="center" c="violet">
                      {showConfirmation ? "Selected Plan" : "Choose Your Plan"}
                    </Title>
                  </Group>

                  <Stack gap="md">
                    {Object.entries(plans).map(([key, plan]) => (
                      <Card
                        key={key}
                        withBorder
                        p="lg"
                        radius="lg"
                        style={{
                          cursor: showConfirmation ? "default" : "pointer",
                          borderColor:
                            selectedPlan === key ? plan.borderColor : "#dee2e6",
                          borderWidth: selectedPlan === key ? 2 : 1,
                          backgroundColor:
                            selectedPlan === key
                              ? `${plan.borderColor}15`
                              : "white",
                          transition: "all 0.3s ease",
                        }}
                        onClick={
                          showConfirmation
                            ? undefined
                            : () => setSelectedPlan(key)
                        }
                      >
                        <Stack gap={12}>
                          <Group justify="space-between" align="center">
                            <Badge
                              color={key === "annual" ? "pink" : "blue"}
                              variant="filled"
                              size="lg"
                              radius="sm"
                            >
                              {plan.badge}
                            </Badge>
                            {plan.savings && (
                              <Badge color="green" variant="filled" size="sm">
                                {plan.savings}
                              </Badge>
                            )}
                          </Group>

                          <Box>
                            <Text size="sm" c="dimmed">
                              Total Amount
                            </Text>
                            <Group align="flex-end" gap={4}>
                              <Title
                                order={1}
                                fw={900}
                                style={{
                                  color:
                                    selectedPlan === key
                                      ? plan.borderColor
                                      : theme.colors.blue[7],
                                }}
                              >
                                {plan.total}
                              </Title>
                              <Text size="lg" fw={600} c="dimmed">
                                birr
                              </Text>
                            </Group>
                          </Box>

                          <Group gap={4}>
                            <Text size="sm" c="dimmed">
                              {plan.description}
                            </Text>
                          </Group>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </Box>

                {/* Order Summary */}
                <Card
                  withBorder
                  p="lg"
                  radius="lg"
                  style={{
                    borderColor: theme.colors.green[4],
                    borderWidth: 1,
                    backgroundColor: theme.colors.green[0],
                  }}
                >
                  <Stack gap={12}>
                    <Text fw={700} size="lg" c="green">
                      Order Summary
                    </Text>

                    <Group justify="space-between">
                      <Text c="dimmed">Plan</Text>
                      <Text fw={600}>{currentPlan.name}</Text>
                    </Group>

                    <Group justify="space-between">
                      <Text c="dimmed">Billing</Text>
                      <Text fw={600}>
                        {selectedPlan === "annual" ? "Annual" : "Monthly"}
                      </Text>
                    </Group>

                    <Group justify="space-between">
                      <Text c="dimmed">Amount</Text>
                      <Text fw={600}>
                        {currentPlan.price} birr/{currentPlan.period}
                      </Text>
                    </Group>

                    <Divider />

                    <Group justify="space-between">
                      <Text fw={700} size="lg">
                        Total
                      </Text>
                      <Title order={2} fw={900} c="green">
                        {currentPlan.billing} birr
                      </Title>
                    </Group>
                  </Stack>
                </Card>

                {/* Security */}
                <Card
                  withBorder
                  p="lg"
                  radius="lg"
                  style={{
                    borderColor: theme.colors.blue[5],
                    borderWidth: 1,
                    backgroundColor: theme.colors.blue[0],
                  }}
                >
                  <Group gap="md">
                    <IconShieldCheck size={32} color={theme.colors.blue[7]} />
                    <Box>
                      <Text fw={700} size="md" c="blue">
                        Secure Payment
                      </Text>
                      <Text size="sm" c="dimmed">
                        Your payment is protected with bank-level security
                      </Text>
                    </Box>
                  </Group>
                </Card>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Container>

      {/* PIN Modal */}
      {renderPinModal()}
    </Box>
  );
}
