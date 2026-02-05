'use client';

import { useState, useEffect } from 'react';
import { 
  Container, Box, Title, Text, TextInput, Select, NumberInput, 
  Textarea, SimpleGrid, Paper, Button, Group, FileInput, Stack 
} from '@mantine/core';
import { IconUpload, IconMapPin, IconPlus, IconInfoCircle } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import MainFooter from '../../components/MainFooter';
import carData from '../data/carData'; // Import the car data

export default function UnifiedRegisterPage() {
  const [regType, setRegType] = useState('Person');
  
  // Vehicle selection states
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedSubmodel, setSelectedSubmodel] = useState(null);
  
  // Data for dropdowns
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [submodels, setSubmodels] = useState([]);

  // Color options
  const colorOptions = [
    'White', 'Black', 'Silver', 'Gray', 'Red', 'Blue', 'Green', 'Yellow', 
    'Orange', 'Brown', 'Gold', 'Beige', 'Maroon', 'Purple', 'Pink'
  ];

  // Region options (Ethiopian regions)
  const regionOptions = [
    'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
    'Gambela', 'Harari', 'Oromia', 'Sidama', 'Somali', 
    'Southern Nations, Nationalities, and Peoples', 'South West Ethiopia',
    'Tigray'
  ];

  // Initialize brands from carData
  useEffect(() => {
    const brandList = Object.keys(carData);
    setBrands(brandList);
  }, []);

  // Update models when brand changes
  useEffect(() => {
    if (selectedBrand && carData[selectedBrand]) {
      const modelList = Object.keys(carData[selectedBrand]);
      setModels(modelList);
      setSelectedModel(null); // Reset model when brand changes
      setSelectedSubmodel(null); // Reset submodel when brand changes
    } else {
      setModels([]);
      setSubmodels([]);
    }
  }, [selectedBrand]);

  // Update submodels when model changes
  useEffect(() => {
    if (selectedBrand && selectedModel && carData[selectedBrand]) {
      const brandData = carData[selectedBrand];
      if (brandData[selectedModel]) {
        const submodelList = brandData[selectedModel];
        setSubmodels(submodelList);
        setSelectedSubmodel(null); // Reset submodel when model changes
      }
    } else {
      setSubmodels([]);
    }
  }, [selectedBrand, selectedModel]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle form submission
    console.log({
      type: regType,
      vehicle: regType === 'Vehicle' ? {
        brand: selectedBrand,
        model: selectedModel,
        submodel: selectedSubmodel,
        color: e.target.color?.value || null,
        plateType: e.target.plateType?.value || null,
        region: e.target.region?.value || null,
        code: e.target.code?.value || null,
        plateNumber: e.target.plateNumber?.value || null
      } : null,
      // Add other form data here
    });
    alert('Form submitted!');
  };

  return (
    <Box bg="#f8f9fa" style={{ minHeight: '100vh' }}>
      {/* --- HEADER --- */}
      <Box bg="white" py="sm" style={{ borderBottom: '1px solid #E9ECEF' }}>
        <Container size="md">
          <Link href="/">
            <Image 
              src="/logo.jpg" 
              alt="Logo" 
              width={0} 
              height={40} 
              sizes="100vw" 
              style={{ width: 'auto', height: '40px', borderRadius: '4px' }} 
            />
          </Link>
        </Container>
      </Box>

      <Container size="md" py={40}>
        {/* --- BANNER AREA --- */}
        <Group align="center" gap="xl" mb={30} wrap="nowrap">
          {/* EBS Image - Increased to 160px */}
          <Box style={{ width: '160px', height: '160px', flexShrink: 0 }}>
            <Image 
              src="/ebs.jpg" 
              alt="EBS" 
              width={160} 
              height={160} 
              style={{ objectFit: 'contain' }} 
            />
          </Box>

          <Paper 
            shadow="xs" 
            radius="lg" 
            p={0} 
            style={{ 
              flex: 1, 
              overflow: 'hidden', 
              height: '140px',
              position: 'relative',
              background: '#2f80ed' 
            }}
          >
            <Image src="/lost.jpg" fill alt="Lost Banner" style={{ objectFit: 'cover' }} />
          </Paper>
        </Group>

        <Title ta="center" mb="xl">Register</Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="xl">
            <Select 
              label="Type" 
              placeholder="Select type" 
              data={['Person', 'Vehicle']} 
              value={regType} 
              onChange={(val) => setRegType(val || 'Person')}
              radius="md" 
              style={{ maxWidth: 200 }} 
            />

            {/* --- CONDITIONAL CONTENT --- */}
            {regType === 'Person' ? (
              <>
                <Paper withBorder p="xl" radius="lg">
                  <Title order={4} mb="lg">Personal Information</Title>
                  <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                    <TextInput name="firstName" label="First name" placeholder="First name" radius="md" required />
                    <TextInput name="middleName" label="Middle name" placeholder="Middle name" radius="md" />
                    <TextInput name="lastName" label="Last name" placeholder="Last name" radius="md" required />
                  </SimpleGrid>
                  <Select name="gender" label="Gender" data={['Male', 'Female', 'Other']} radius="md" mb="md" style={{ maxWidth: 200 }} required />
                  <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                    <NumberInput name="height" label="Height" placeholder="cm" radius="md" min={0} />
                    <NumberInput name="weight" label="Weight" placeholder="kg" radius="md" min={0} />
                    <NumberInput name="age" label="Age" placeholder="Age" radius="md" min={0} required />
                  </SimpleGrid>
                  <Textarea name="description" label="Additional description" placeholder="Add additional information about the person" minRows={3} radius="md" />
                </Paper>

                <Paper withBorder p="xl" radius="lg" ta="center">
                  <Title order={4} mb="lg" ta="left">Person image</Title>
                  <Box style={{ border: '2px dashed #ced4da', borderRadius: '12px', padding: '40px' }}>
                    <IconUpload size={40} color="#2f80ed" />
                    <Text size="sm" mt="sm">upload image for the Person</Text>
                  </Box>
                </Paper>
              </>
            ) : (
              <>
                <Paper withBorder p="xl" radius="lg">
                  <Title order={4} mb="lg">Car Information</Title>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                    <Select 
                      name="brand"
                      label="Brand" 
                      placeholder="Select brand" 
                      data={brands} 
                      value={selectedBrand}
                      onChange={setSelectedBrand}
                      radius="md"
                      searchable
                      clearable
                      required
                    />
                    <Select 
                      name="model"
                      label="Model" 
                      placeholder="Select model" 
                      data={models} 
                      value={selectedModel}
                      onChange={setSelectedModel}
                      radius="md"
                      disabled={!selectedBrand}
                      searchable
                      clearable
                      required
                    />
                    <Select 
                      name="submodel"
                      label="Sub Model" 
                      placeholder="Select sub model" 
                      data={submodels} 
                      value={selectedSubmodel}
                      onChange={setSelectedSubmodel}
                      radius="md"
                      disabled={!selectedModel}
                      searchable
                      clearable
                    />
                    <Select 
                      name="color"
                      label="Color" 
                      placeholder="Select color" 
                      data={colorOptions} 
                      radius="md"
                      searchable
                      required
                    />
                  </SimpleGrid>
                  <Textarea 
                    name="vehicleDescription"
                    label="Additional description" 
                    placeholder="Add additional information about the vehicle (damages, modifications, special features, etc.)" 
                    radius="md"
                    minRows={3}
                  />
                </Paper>

                <Paper withBorder p="xl" radius="lg">
                  <Title order={4} mb="lg">License Plate (Ethiopian Format)</Title>
                  <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                    <Select 
                      name="plateType"
                      label="Type" 
                      data={['National', 'Diplomatic', 'Government', 'Police', 'Military', 'Temporary']} 
                      radius="md"
                      placeholder="Select type"
                      required
                    />
                    <Select 
                      name="region"
                      label="Region" 
                      data={regionOptions} 
                      radius="md"
                      placeholder="Select region"
                      searchable
                      required
                    />
                    <Select 
                      name="code"
                      label="Code" 
                      data={Array.from({ length: 10 }, (_, i) => (i + 1).toString())} 
                      radius="md"
                      placeholder="Select code"
                      required
                    />
                  </SimpleGrid>
                  <TextInput 
                    name="plateNumber"
                    label="Plate Number" 
                    placeholder="Enter plate number (e.g., AA-12345)" 
                    radius="md" 
                    description="Format: RegionCode-Number (e.g., AA-12345 for Addis Ababa)"
                    required
                  />
                </Paper>

                {/* Car Image below License Plate */}
                <Paper withBorder p="xl" radius="lg" ta="center">
                  <Title order={4} mb="lg" ta="left">Car Images</Title>
                  <Text size="sm" c="dimmed" mb="lg">Upload clear images of the vehicle from multiple angles</Text>
                  <Box style={{ border: '2px dashed #ced4da', borderRadius: '12px', padding: '40px' }}>
                    <IconUpload size={40} color="#2f80ed" />
                    <Text size="sm" mt="sm">Drag and drop or click to upload car images</Text>
                    <Text size="xs" c="dimmed" mt="xs">Multiple images allowed (front, back, sides, interior)</Text>
                  </Box>
                </Paper>

                <Paper withBorder p="xl" radius="lg">
                  <Title order={4} mb="lg">Vehicle Verification</Title>
                  <Group align="flex-start">
                    <Box style={{ border: '2px dashed #ced4da', borderRadius: '12px', padding: '20px', flex: 1, textAlign: 'center' }}>
                      <IconUpload size={30} color="#2f80ed" />
                      <Text size="xs">Upload verification documents</Text>
                      <Text size="xs" c="dimmed">(Ownership documents, registration papers)</Text>
                    </Box>
                    <Paper withBorder p="sm" radius="md" bg="blue.0" style={{ flex: 1 }}>
                      <Group gap="xs" mb={5}><IconInfoCircle size={16} color="#2f80ed" /><Text fw={700} size="xs">Information</Text></Group>
                      <Text size="xs" c="dimmed">Must provide documentation proving ownership or authorization to report.</Text>
                      <Text size="xs" c="dimmed" mt={5}>Accepted: Title, Registration Certificate, Power of Attorney.</Text>
                    </Paper>
                  </Group>
                </Paper>
              </>
            )}

            {/* --- SHARED SECTIONS --- */}
            <Paper withBorder p="xl" radius="lg">
              <Title order={4} mb="lg">Last Known Information</Title>
              <TextInput 
                name="location"
                label="Location" 
                placeholder="Enter city or specific location" 
                leftSection={<IconMapPin size={16}/>} 
                radius="md" 
                mb="md" 
                required
              />
              <Box style={{ height: 200, background: '#e9ecef', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
                <Text c="dimmed">Map View Placeholder - Would show interactive map here</Text>
              </Box>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput name="lastSeenDate" label="Last seen date" placeholder="DD/MM/YYYY" radius="md" required />
                <TextInput name="lastSeenTime" label="Approximate time" placeholder="HH:MM AM/PM" radius="md" />
              </SimpleGrid>
            </Paper>

            <Paper withBorder p="xl" radius="lg">
              <Title order={4} mb="lg">Reporter Information</Title>
              <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                <TextInput name="reporterFirstName" label="First name" placeholder="First name" radius="md" required />
                <TextInput name="reporterMiddleName" label="Middle name" placeholder="Middle name" radius="md" />
                <TextInput name="reporterLastName" label="Last name" placeholder="Last name" radius="md" required />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput name="reporterPhone" label="Phone number" placeholder="+251 9XX XX XX XX" radius="md" required />
                <TextInput name="reporterEmail" label="E-mail" placeholder="example@gmail.com" type="email" radius="md" />
              </SimpleGrid>
              <Textarea 
                name="additionalContact"
                label="Additional Contact Information" 
                placeholder="Alternative phone numbers, social media handles, etc." 
                radius="md" 
                mt="md"
                minRows={2}
              />
            </Paper>

            <Button 
              type="submit"
              size="lg" 
              fullWidth 
              radius="xl" 
              color="blue" 
              mt="xl" 
              style={{ backgroundColor: '#0033cc' }}
            >
              Submit Report
            </Button>
            
            <Text size="sm" c="dimmed" ta="center">
              By submitting, you confirm that the information provided is accurate to the best of your knowledge.
            </Text>
          </Stack>
        </form>
      </Container>
      <MainFooter />
    </Box>
  );
}