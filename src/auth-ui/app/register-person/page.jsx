'use client';

import { useState } from 'react';
import { 
  Container, Box, Title, Text, TextInput, Select, NumberInput, 
  Textarea, SimpleGrid, Paper, Button, Group, FileInput, Stack 
} from '@mantine/core';
import { IconUpload, IconMapPin, IconPlus, IconInfoCircle } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import MainFooter from '../../components/MainFooter';

export default function UnifiedRegisterPage() {
  const [regType, setRegType] = useState('Person');

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
              height: '140px', // Increased height slightly to match larger EBS logo
              position: 'relative',
              background: '#2f80ed' 
            }}
          >
            <Image src="/lost.jpg" fill alt="Lost Banner" style={{ objectFit: 'cover' }} />
          </Paper>
        </Group>

        <Title ta="center" mb="xl">Register</Title>

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
                  <TextInput label="First name" placeholder="First name" radius="md" />
                  <TextInput label="Middle name" placeholder="Middle name" radius="md" />
                  <TextInput label="Last name" placeholder="Last name" radius="md" />
                </SimpleGrid>
                <Select label="Gender" data={['Male', 'Female']} radius="md" mb="md" style={{ maxWidth: 200 }} />
                <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                  <NumberInput label="Height" placeholder="cm" radius="md" />
                  <NumberInput label="Weight" placeholder="kg" radius="md" />
                  <NumberInput label="Age" placeholder="Age" radius="md" />
                </SimpleGrid>
                <Textarea label="Additional description" placeholder="Add additional information about the person" minRows={3} radius="md" />
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
                <Title order={4} mb="lg">Car Brand</Title>
                <SimpleGrid cols={{ base: 1, sm: 2 }} mb="md">
                  <Select label="Brand" placeholder="Toyota" data={['Toyota', 'Hyundai']} radius="md" />
                  <Select label="Model" placeholder="Vitz" data={['Vitz', 'Corolla']} radius="md" />
                  <Select label="sub model" placeholder="2004" data={['2004', '2010']} radius="md" />
                  <Select label="Color" placeholder="Silver" data={['Silver', 'Black']} radius="md" />
                </SimpleGrid>
                <Textarea label="Additional description" placeholder="add additional info" radius="md" />
              </Paper>

              <Paper withBorder p="xl" radius="lg">
                <Title order={4} mb="lg">License Plate</Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
                  <Select label="Type" data={['National', 'Private']} radius="md" />
                  <Select label="Region" data={['Oromia', 'Addis Ababa']} radius="md" />
                  <Select label="Code" data={['2', '3']} radius="md" />
                </SimpleGrid>
                <TextInput label="Plate Number" placeholder="XXXXX" radius="md" />
              </Paper>

              {/* Car Image below License Plate */}
              <Paper withBorder p="xl" radius="lg" ta="center">
                <Title order={4} mb="lg" ta="left">Car image</Title>
                <Box style={{ border: '2px dashed #ced4da', borderRadius: '12px', padding: '40px' }}>
                  <IconUpload size={40} color="#2f80ed" />
                  <Text size="sm" mt="sm">upload image for the car</Text>
                </Box>
              </Paper>

              <Paper withBorder p="xl" radius="lg">
                <Title order={4} mb="lg">Verification</Title>
                <Group align="flex-start">
                  <Box style={{ border: '2px dashed #ced4da', borderRadius: '12px', padding: '20px', flex: 1, textAlign: 'center' }}>
                    <IconUpload size={30} color="#2f80ed" />
                    <Text size="xs">upload verification image</Text>
                  </Box>
                  <Paper withBorder p="sm" radius="md" bg="blue.0" style={{ flex: 1 }}>
                    <Group gap="xs" mb={5}><IconInfoCircle size={16} color="#2f80ed" /><Text fw={700} size="xs">Information</Text></Group>
                    <Text size="xs" c="dimmed">Must provide documentation proving ownership.</Text>
                  </Paper>
                </Group>
              </Paper>
            </>
          )}

          {/* --- SHARED SECTIONS --- */}
          <Paper withBorder p="xl" radius="lg">
            <Title order={4} mb="lg">Last information</Title>
            <TextInput label="Location" placeholder="Adama" leftSection={<IconMapPin size={16}/>} radius="md" mb="md" />
            <Box style={{ height: 200, background: '#e9ecef', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
               <Text c="dimmed">Map View Placeholder</Text>
            </Box>
            <TextInput label="Last seen date" placeholder="DD/MM/YY" radius="md" />
          </Paper>

          <Paper withBorder p="xl" radius="lg">
            <Title order={4} mb="lg">Reporter information</Title>
            <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
              <TextInput label="First name" radius="md" />
              <TextInput label="Middle name" radius="md" />
              <TextInput label="Last name" radius="md" />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Phone number" placeholder="+251 9..." radius="md" />
              <TextInput label="E-mail" placeholder="example@gmail.com" radius="md" />
            </SimpleGrid>
          </Paper>

          <Button size="lg" fullWidth radius="xl" color="blue" mt="xl" style={{ backgroundColor: '#0033cc' }}>
            Submit
          </Button>
        </Stack>
      </Container>
      <MainFooter />
    </Box>
  );
}