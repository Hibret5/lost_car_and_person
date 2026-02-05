// This is our single source of truth for all alert data
export const alertsData = [
  {
    // === CARD DISPLAY DATA (for AlertPage) ===
    id: "5h7",
    code: "5h7",
    type: "car",
    brand: "Toyota Corolla",
    details: "Diesel equipped, Silver Metallic",
    location: "Mexico/AZ",
    time: "Last year",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500",
    
    // === DETAIL PAGE DATA (for AlertDetailPage) ===
    title: "Toyota Corolla - Diesel equipped",
    date: "10/11/2023",
    startTime: "8:11 pm",
    duration: "40.7h",
    lastSeen: "Medellin Area, Main Street near Central Park",
    description: "Vehicle detected by CCTV camera #CAM-4512 near central market",
    mapLocation: "Addis Ababa, Ethiopia",
    
    // Full description for popup detail
    fullDescription: `Gara, Toyota Corolla car vakugad vusur fiyatgaib vijerghasluq hr ru. Additional details about the vehicle condition, special features, and history. This is a longer description that will require vertical scrolling. More details about the vehicle's history, condition report, and special features.

The vehicle was last serviced at 50,000 miles with full maintenance records available. Includes premium audio system, leather seats, and advanced safety features. GPS tracking was installed but may not be active.

Vehicle identification number: JTDBU4EE7AJ123456
Engine serial number: 2AZ123456789
Transmission type: Automatic 6-speed
Fuel type: Diesel
Color: Silver Metallic
Year: 2018
Mileage: 65,432
Interior color: Black

Additional Notes:
The vehicle was last seen with minor damage to the rear bumper. The license plate frame is broken on the right side. There is a distinctive sticker on the rear windshield depicting a mountain landscape.

Recent Activity:
- Last serviced: 2023-08-15
- Insurance valid until: 2024-06-30
- Registration expires: 2024-12-31
- Reported stolen: 2023-10-15

The owner has provided additional information about custom modifications including aftermarket wheels and a custom exhaust system. The vehicle may be difficult to identify due to these modifications.`,
    
    // === DETECTION HISTORY TABLE DATA ===
    detectionHistory: [
      {
        id: "detect_5h7_1",
        name: "Alert 1",
        location: "Mexico",
        startDate: "10/11/2025",
        date: "10/11/2025",
        startTime: "8:11 pm",
        time: "8:11 pm",
        duration: "40.7h",
        lastSeen: "0:27h ago",
        status: "active",
        type: "CCTV",
        accuracy: "60%",
      },
      {
        id: "detect_5h7_2",
        name: "Alert 2",
        location: "22, gologal...",
        startDate: "10/11/2025",
        date: "10/11/2025",
        startTime: "6:12 pm",
        time: "6:12 pm",
        duration: "38.4h",
        lastSeen: "0:27h ago",
        status: "active",
        type: "CCTV",
        accuracy: "58.34%",
      },
      {
        id: "detect_5h7_3",
        name: "Alert 3",
        location: "22, axum h...",
        startDate: "11/11/2025",
        date: "11/11/2025",
        startTime: "5:31 am",
        time: "5:31 am",
        duration: "35.2h",
        lastSeen: "2:15h ago",
        status: "active",
        type: "CCTV",
        accuracy: "82.65%",
      },
      {
        id: "detect_5h7_4",
        name: "Alert 4",
        location: "megenagna ...",
        startDate: "11/11/2025",
        date: "11/11/2025",
        startTime: "11:20 pm",
        time: "11:20 pm",
        duration: "28.1h",
        lastSeen: "5:40h ago",
        status: "active",
        type: "CCTV",
        accuracy: "77.2%",
      },
      {
        id: "detect_5h7_5",
        name: "Alert 5",
        location: "urael, khalid ..",
        startDate: "12/11/2025",
        date: "12/11/2025",
        startTime: "00:30 am",
        time: "00:30 am",
        duration: "24.3h",
        lastSeen: "8:10h ago",
        status: "active",
        type: "Suggestion",
        accuracy: "--",
      },
      {
        id: "detect_5h7_6",
        name: "Alert 5",
        location: "urael, khalid ..",
        startDate: "12/11/2025",
        date: "12/11/2025",
        startTime: "00:30 am",
        time: "00:30 am",
        duration: "21.8h",
        lastSeen: "11:45h ago",
        status: "active",
        type: "Suggestion",
        accuracy: "--",
      },
      {
        id: "detect_5h7_7",
        name: "Alert 5",
        location: "urael, khalid ..",
        startDate: "12/11/2025",
        date: "12/11/2025",
        startTime: "00:30 am",
        time: "00:30 am",
        duration: "18.5h",
        lastSeen: "14:20h ago",
        status: "active",
        type: "Suggestion",
        accuracy: "--",
      },
      {
        id: "detect_5h7_8",
        name: "Alert 5",
        location: "urael, khalid ..",
        startDate: "12/11/2025",
        date: "12/11/2025",
        startTime: "00:30 am",
        time: "00:30 am",
        duration: "15.2h",
        lastSeen: "17:30h ago",
        status: "active",
        type: "Suggestion",
        accuracy: "--",
      },
      {
        id: "detect_5h7_9",
        name: "Alert 5",
        location: "urael, khalid ..",
        startDate: "12/11/2025",
        date: "12/11/2025",
        startTime: "00:30 am",
        time: "00:30 am",
        duration: "12.1h",
        lastSeen: "20:15h ago",
        status: "active",
        type: "Suggestion",
        accuracy: "--",
      },
      {
        id: "detect_5h7_10",
        name: "Alert 6",
        location: "Mexico City Center",
        startDate: "13/11/2025",
        date: "13/11/2025",
        startTime: "9:45 am",
        time: "9:45 am",
        duration: "10.5h",
        lastSeen: "1 day ago",
        status: "active",
        type: "CCTV",
        accuracy: "71.3%",
      },
      {
        id: "detect_5h7_11",
        name: "Alert 7",
        location: "Industrial Zone",
        startDate: "13/11/2025",
        date: "13/11/2025",
        startTime: "2:30 pm",
        time: "2:30 pm",
        duration: "8.2h",
        lastSeen: "1 day ago",
        status: "active",
        type: "CCTV",
        accuracy: "68.9%",
      },
      {
        id: "detect_5h7_12",
        name: "Alert 8",
        location: "Airport Area",
        startDate: "14/11/2025",
        date: "14/11/2025",
        startTime: "7:15 am",
        time: "7:15 am",
        duration: "6.7h",
        lastSeen: "2 days ago",
        status: "active",
        type: "CCTV",
        accuracy: "74.5%",
      },
    ],
    
    detailedInfo: [
      {
        position: "Reporting Officer",
        company: "Alwin Security",
        report: "Initial vehicle identification",
        contact: "alwin@example.com",
      },
      {
        position: "Case Manager",
        company: "Security Division",
        report: "Ongoing investigation",
        contact: "+55 (0)555 - 3456",
      },
      {
        position: "CCTV Analyst",
        company: "Surveillance Dept",
        report: "Footage analysis complete",
        contact: "analyst@example.com",
      },
      {
        position: "Field Agent",
        company: "Recovery Team",
        report: "Area search in progress",
        contact: "+55 (0)555 - 7890",
      },
    ],
    
    // Contact information
    contactInfo: {
      name: "Alwin Manager",
      email: "alwin@example.com",
      phone: "+55 (0)555 - 3456",
      website: "www.example.com",
      role: "Primary Contact",
      additional: "Available for contact Monday-Friday, 9AM-5PM. Please mention case number 5h7 when calling.",
    },
    
    // CCTV information
    cctvInfo: {
      cameraId: "CAM-4512",
      location: "Central Market, Addis Ababa",
      lastDetection: "2 hours ago",
      confidence: "92%",
      model: "Axis P3367-LVE",
      resolution: "4K Ultra HD",
      frameRate: "30 FPS",
      angle: "45-degree",
      coverage: "24/7 monitoring",
    },
    
    // Features list
    features: [
      "Diesel Engine",
      "Automatic Transmission",
      "Air Conditioning",
      "Power Windows",
      "Alloy Wheels",
      "Bluetooth Connectivity",
      "Leather Seats",
      "Sunroof",
      "Navigation System",
      "Backup Camera",
      "Heated Seats",
      "Premium Audio System",
      "Keyless Entry",
      "Push Button Start",
      "Lane Departure Warning",
      "Automatic Emergency Braking",
      "Adaptive Cruise Control",
      "Blind Spot Monitoring",
      "Rear Cross Traffic Alert",
      "Parking Sensors",
    ],
    
    // Additional technical info
    technicalSpecs: {
      vin: "JTDBU4EE7AJ123456",
      engineSize: "2.0L",
      fuelCapacity: "13.2 gallons",
      seatingCapacity: "5",
      weight: "2,900 lbs",
      transmission: "Automatic 6-speed",
      fuelType: "Diesel",
      color: "Silver Metallic",
      year: "2018",
      mileage: "65,432",
      make: "Toyota",
      model: "Corolla LE",
      drivetrain: "Front-Wheel Drive",
      horsepower: "139 hp",
      torque: "126 lb-ft",
    },
    
    // Additional evidence images
    additionalImages: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=500",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=500",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=500",
    ],
    
    // Search history
    searchHistory: {
      radius: "50 mile radius",
      duration: "Ongoing",
      team: "Local Police & Volunteer Group",
      lastSearch: "Today, 10:30 AM",
      nextSearch: "Tomorrow, 9:00 AM",
      members: "12 active searchers",
      areasCovered: "Downtown, Industrial Zone, Residential Areas",
    },
    
    // Statistics
    stats: {
      totalDetections: 12,
      activeDuration: "40.7h",
      cctvConfidence: "92%",
      lastSeenTime: "2 hours ago",
      detectionCount: "12 times",
      averageDetection: "Every 3.4 hours",
    },
    
    // Timeline
    timeline: [
      { date: "2023-10-15", event: "Reported stolen", time: "8:11 pm", icon: "alert" },
      { date: "2023-10-16", event: "First CCTV detection", time: "10:30 am", icon: "camera" },
      { date: "2023-10-18", event: "Last known location update", time: "3:45 pm", icon: "location" },
      { date: "2023-10-20", event: "Police investigation started", time: "9:00 am", icon: "police" },
      { date: "2023-10-22", event: "Multiple sightings reported", time: "2:30 pm", icon: "multiple" },
      { date: "2023-10-25", event: "Search radius expanded", time: "11:15 am", icon: "search" },
    ],
    
    reportDate: "2023-10-15",
    additionalInfo: {
      insuranceCompany: "StateFarm Insurance",
      policyNumber: "SF-789456123",
      vin: "JTDBU4EE7AJ123456",
      engineSize: "2.0L",
      fuelCapacity: "13.2 gallons",
      seatingCapacity: "5",
      weight: "2,900 lbs",
    },
  },
  
  {
    id: "8k3",
    code: "8k3",
    type: "car",
    brand: "Santa Cordilla",
    details: "PARC AR: 761, White Pearl",
    location: "California/LA",
    time: "2 months ago",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=500",
    
    title: "Santa Cordilla - PARC AR: 761",
    date: "10/10/2023",
    startTime: "6:30 pm",
    duration: "32.5h",
    lastSeen: "Downtown Area, Financial District",
    description: "Vehicle detected by multiple CCTV cameras in the area with high confidence",
    mapLocation: "Mexico City, Mexico",
    
    fullDescription: `Santa Cordilla with special features and custom modifications. This vehicle was last seen in the downtown area. Multiple CCTV cameras detected movement in the financial district. The vehicle appears to be in good condition with visible custom rims and tinted windows. License plate partially obscured but captured by traffic camera at intersection.`,
    
    detectionHistory: [
      {
        id: "detect_8k3_1",
        name: "Alert 1",
        location: "Los Angeles Downtown",
        date: "10/10/2025",
        startDate: "10/10/2025",
        startTime: "6:30 pm",
        time: "6:30 pm",
        duration: "32.5h",
        lastSeen: "1:15h ago",
        status: "active",
        type: "CCTV",
        accuracy: "65.5%",
      },
      {
        id: "detect_8k3_2",
        name: "Alert 2",
        location: "Hollywood Blvd",
        date: "10/10/2025",
        startDate: "10/10/2025",
        startTime: "8:45 pm",
        time: "8:45 pm",
        duration: "30.2h",
        lastSeen: "3:45h ago",
        status: "active",
        type: "CCTV",
        accuracy: "72.8%",
      },
      {
        id: "detect_8k3_3",
        name: "Alert 3",
        location: "Santa Monica",
        date: "11/10/2025",
        startDate: "11/10/2025",
        startTime: "10:15 am",
        time: "10:15 am",
        duration: "27.8h",
        lastSeen: "6:20h ago",
        status: "active",
        type: "CCTV",
        accuracy: "81.3%",
      },
      {
        id: "detect_8k3_4",
        name: "Alert 4",
        location: "Beverly Hills",
        date: "11/10/2025",
        startDate: "11/10/2025",
        startTime: "3:30 pm",
        time: "3:30 pm",
        duration: "25.1h",
        lastSeen: "8:10h ago",
        status: "active",
        type: "CCTV",
        accuracy: "79.6%",
      },
      {
        id: "detect_8k3_5",
        name: "Alert 5",
        location: "Venice Beach",
        date: "12/10/2025",
        startDate: "12/10/2025",
        startTime: "11:45 am",
        time: "11:45 am",
        duration: "22.7h",
        lastSeen: "10:45h ago",
        status: "active",
        type: "Suggestion",
        accuracy: "--",
      },
      {
        id: "detect_8k3_6",
        name: "Alert 6",
        location: "LAX Airport",
        date: "12/10/2025",
        startDate: "12/10/2025",
        startTime: "5:20 pm",
        time: "5:20 pm",
        duration: "20.3h",
        lastSeen: "12:30h ago",
        status: "active",
        type: "CCTV",
        accuracy: "85.2%",
      },
    ],
    
    detailedInfo: [
      {
        position: "Lead Investigator",
        company: "Santa Security Corp",
        report: "Initial Report and evidence collection",
        contact: "santa@example.com",
      },
      {
        position: "Traffic Analyst",
        company: "City CCTV Network",
        report: "License plate analysis",
        contact: "traffic@city.gov",
      },
      {
        position: "Field Coordinator",
        company: "Recovery Operations",
        report: "Team deployment status",
        contact: "+55 (0)555 - 1122",
      },
    ],
    
    contactInfo: {
      name: "Santa Manager",
      email: "santa@example.com",
      phone: "+55 (0)555 - 7890",
      role: "Reporting Officer",
      additional: "Contact available 24/7 for urgent updates",
    },
    
    cctvInfo: {
      cameraId: "CAM-7890",
      location: "Downtown Area, Financial District",
      lastDetection: "3 hours ago",
      confidence: "88%",
      model: "Hikvision DS-2CD2347G1-L",
      resolution: "8MP",
      frameRate: "25 FPS",
      angle: "Wide-angle 90-degree",
      coverage: "Major intersection monitoring",
    },
    
    features: [
      "Premium Package",
      "Leather Seats",
      "Navigation System",
      "Sunroof",
      "Backup Camera",
      "Blind Spot Detection",
      "Adaptive Headlights",
      "Parking Assist",
      "Premium Sound System",
      "Wireless Charging",
    ],
    
    technicalSpecs: {
      vin: "SCD78901234567890",
      engineSize: "2.5L",
      fuelCapacity: "14.5 gallons",
      seatingCapacity: "5",
      weight: "3,200 lbs",
      transmission: "Automatic CVT",
      fuelType: "Gasoline",
      color: "White Pearl",
      year: "2021",
      mileage: "32,150",
      make: "Santa",
      model: "Cordilla Elite",
      drivetrain: "All-Wheel Drive",
      horsepower: "203 hp",
      torque: "184 lb-ft",
    },
    
    additionalImages: [
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=500",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500",
    ],
    
    stats: {
      totalDetections: 6,
      activeDuration: "32.5h",
      cctvConfidence: "88%",
      lastSeenTime: "3 hours ago",
      detectionCount: "8 times",
      averageDetection: "Every 2.1 hours",
    },
    
    reportDate: "2023-11-20",
  },
  
  {
    id: "2j9",
    code: "2j9",
    type: "car",
    brand: "Toyota Corolla",
    details: "Blk., Pink A/C 615",
    location: "Mexico/AZ",
    time: "Last year",
    status: "resolved",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=500",
    
    title: "Toyota Corolla - Black, Pink A/C 615",
    date: "09/10/2023",
    startTime: "10:15 am",
    duration: "24.3h",
    lastSeen: "Airport Area, Parking Lot B",
    description: "Black Toyota Corolla with pink accents. Found and returned to owner.",
    mapLocation: "Mexico Airport Area",
    
    fullDescription: `Black Toyota Corolla with distinctive pink air conditioning vents. Vehicle was located in airport parking lot and has been successfully returned to the owner. Case resolved with cooperation from airport security and local authorities. Minor damage reported on front bumper.`,
    
    detectionHistory: [
      {
        id: "detect_2j9_1",
        name: "Alert 1",
        location: "Mexico Airport",
        date: "09/10/2025",
        startDate: "09/10/2025",
        startTime: "10:15 am",
        time: "10:15 am",
        duration: "24.3h",
        lastSeen: "Resolved",
        status: "resolved",
        type: "CCTV",
        accuracy: "95.2%",
      },
      {
        id: "detect_2j9_2",
        name: "Alert 2",
        location: "Airport Parking",
        date: "09/10/2025",
        startDate: "09/10/2025",
        startTime: "2:45 pm",
        time: "2:45 pm",
        duration: "21.8h",
        lastSeen: "Resolved",
        status: "resolved",
        type: "CCTV",
        accuracy: "91.7%",
      },
      {
        id: "detect_2j9_3",
        name: "Alert 3",
        location: "Terminal 2",
        date: "10/10/2025",
        startDate: "10/10/2025",
        startTime: "8:30 am",
        time: "8:30 am",
        duration: "18.5h",
        lastSeen: "Resolved",
        status: "resolved",
        type: "CCTV",
        accuracy: "88.3%",
      },
    ],
    
    contactInfo: {
      name: "Robert Smith",
      email: "robert@example.com",
      phone: "+1 (555) 456-7890",
      role: "Vehicle Owner",
      additional: "Vehicle recovered and returned",
    },
    
    cctvInfo: {
      cameraId: "CAM-1234",
      location: "Airport Parking, Level 3",
      lastDetection: "5 days ago",
      confidence: "95%",
      model: "Dahua IPC-HFW5842T-ASE",
      resolution: "8MP",
    },
    
    features: [
      "Custom Paint Job",
      "Sport Package",
      "Premium Sound System",
      "Custom Interior",
      "LED Lighting",
      "Aftermarket Rims",
    ],
    
    technicalSpecs: {
      vin: "JTDKN3DU8E1234567",
      engineSize: "1.8L",
      fuelCapacity: "13.2 gallons",
      seatingCapacity: "5",
      weight: "2,850 lbs",
      transmission: "Automatic CVT",
      fuelType: "Gasoline",
      color: "Black with Pink Accents",
      year: "2020",
      mileage: "45,210",
    },
    
    stats: {
      totalDetections: 3,
      activeDuration: "24.3h",
      cctvConfidence: "95%",
      lastSeenTime: "5 days ago",
      resolutionDate: "2023-09-12",
    },
    
    reportDate: "2023-09-10",
  },
  
  {
    id: "6n8",
    code: "6n8",
    type: "car",
    brand: "Ford Mustang",
    details: "Red, Black A/C 321, GT Premium",
    location: "Texas/Dallas",
    time: "1 week ago",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=500",
    
    title: "Ford Mustang - Red, Black A/C 321",
    date: "01/15/2024",
    startTime: "3:45 pm",
    duration: "18.5h",
    lastSeen: "Highway 75, Northbound Lane",
    description: "Red Ford Mustang with black stripes. High-performance vehicle detected speeding.",
    mapLocation: "Dallas, Texas",
    
    fullDescription: `Red Ford Mustang GT with black racing stripes. High-performance vehicle detected exceeding speed limits on Highway 75. Vehicle appears to have custom exhaust and performance modifications. Multiple traffic camera confirmations. Owner reported vehicle stolen from downtown parking garage.`,
    
    detectionHistory: [
      {
        id: "detect_6n8_1",
        name: "Alert 1",
        location: "Highway 75",
        date: "01/15/2025",
        startDate: "01/15/2025",
        startTime: "3:45 pm",
        time: "3:45 pm",
        duration: "18.5h",
        lastSeen: "1 hour ago",
        status: "active",
        type: "CCTV",
        accuracy: "78.9%",
      },
      {
        id: "detect_6n8_2",
        name: "Alert 2",
        location: "Downtown Dallas",
        date: "01/15/2025",
        startDate: "01/15/2025",
        startTime: "5:20 pm",
        time: "5:20 pm",
        duration: "16.8h",
        lastSeen: "2:15h ago",
        status: "active",
        type: "CCTV",
        accuracy: "82.4%",
      },
      {
        id: "detect_6n8_3",
        name: "Alert 3",
        location: "Industrial Area",
        date: "01/16/2025",
        startDate: "01/16/2025",
        startTime: "8:10 am",
        time: "8:10 am",
        duration: "14.3h",
        lastSeen: "4:30h ago",
        status: "active",
        type: "CCTV",
        accuracy: "75.6%",
      },
      {
        id: "detect_6n8_4",
        name: "Alert 4",
        location: "Shopping District",
        date: "01/16/2025",
        startDate: "01/16/2025",
        startTime: "11:45 am",
        time: "11:45 am",
        duration: "11.2h",
        lastSeen: "6:50h ago",
        status: "active",
        type: "Suggestion",
        accuracy: "--",
      },
      {
        id: "detect_6n8_5",
        name: "Alert 5",
        location: "Residential Area",
        date: "01/16/2025",
        startDate: "01/16/2025",
        startTime: "2:30 pm",
        time: "2:30 pm",
        duration: "8.7h",
        lastSeen: "9:15h ago",
        status: "active",
        type: "CCTV",
        accuracy: "69.8%",
      },
    ],
    
    detailedInfo: [
      {
        position: "Traffic Unit Lead",
        company: "Texas Highway Patrol",
        report: "Speed violation and pursuit initiated",
        contact: "thp@texas.gov",
      },
      {
        position: "Vehicle Recovery",
        company: "Auto Theft Division",
        report: "Stolen vehicle database match",
        contact: "+1 (555) 876-5432",
      },
    ],
    
    contactInfo: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 (555) 876-5432",
      role: "Performance Specialist",
      additional: "Vehicle insured with full coverage",
    },
    
    cctvInfo: {
      cameraId: "CAM-5678",
      location: "Highway 75 Traffic Camera",
      lastDetection: "1 hour ago",
      confidence: "85%",
      model: "TexasDOT-HWY-CAM-75",
      resolution: "1080p",
      speedCaptured: "92 mph in 65 mph zone",
    },
    
    features: [
      "V8 Engine 5.0L",
      "Manual 6-Speed Transmission",
      "Performance Package",
      "Track Mode",
      "MagnaRide Suspension",
      "Brembo Brakes",
      "Custom Exhaust",
      "Carbon Fiber Accents",
      "Recaro Seats",
      "Digital Dash",
    ],
    
    technicalSpecs: {
      vin: "1FA6P8CF2L5101234",
      engineSize: "5.0L V8",
      fuelCapacity: "16.0 gallons",
      seatingCapacity: "4",
      weight: "3,705 lbs",
      transmission: "Manual 6-speed",
      fuelType: "Premium Gasoline",
      color: "Race Red with Black Stripes",
      year: "2022",
      mileage: "12,450",
      horsepower: "450 hp",
      torque: "410 lb-ft",
      topSpeed: "155 mph (electronically limited)",
    },
    
    stats: {
      totalDetections: 5,
      activeDuration: "18.5h",
      cctvConfidence: "85%",
      lastSeenTime: "1 hour ago",
      detectionCount: "8 times",
      averageDetection: "Every 50 minutes",
    },
    
    reportDate: "2024-01-15",
  },
  
  {
    id: "9p2",
    code: "9p2",
    type: "car",
    brand: "BMW X5",
    details: "Black, Gray A/C 654, xDrive40i",
    location: "New York/NYC",
    time: "3 days ago",
    status: "resolved",
    imageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=500",
    
    title: "BMW X5 - Black, Gray A/C 654",
    date: "01/10/2024",
    startTime: "9:20 am",
    duration: "12.3h",
    lastSeen: "Financial District, Wall Street",
    description: "Black BMW X5 SUV with gray interior. Vehicle has been recovered from parking garage.",
    mapLocation: "New York City, USA",
    
    fullDescription: `Black BMW X5 xDrive40i with gray interior. Luxury SUV recovered from underground parking garage in Financial District. Vehicle was found undamaged with all personal belongings still inside. Owner immediately notified and vehicle returned. Security footage shows unauthorized individual parking the vehicle.`,
    
    detectionHistory: [
      {
        id: "detect_9p2_1",
        name: "Alert 1",
        location: "Wall Street",
        date: "01/10/2025",
        startDate: "01/10/2025",
        startTime: "9:20 am",
        time: "9:20 am",
        duration: "12.3h",
        lastSeen: "Resolved",
        status: "resolved",
        type: "CCTV",
        accuracy: "94.7%",
      },
      {
        id: "detect_9p2_2",
        name: "Alert 2",
        location: "Parking Garage B2",
        date: "01/10/2025",
        startDate: "01/10/2025",
        startTime: "11:45 am",
        time: "11:45 am",
        duration: "10.1h",
        lastSeen: "Resolved",
        status: "resolved",
        type: "CCTV",
        accuracy: "91.2%",
      },
      {
        id: "detect_9p2_3",
        name: "Alert 3",
        location: "Security Checkpoint",
        date: "01/10/2025",
        startDate: "01/10/2025",
        startTime: "2:30 pm",
        time: "2:30 pm",
        duration: "7.8h",
        lastSeen: "Resolved",
        status: "resolved",
        type: "CCTV",
        accuracy: "88.5%",
      },
    ],
    
    detailedInfo: [
      {
        position: "Security Director",
        company: "Financial District Security",
        report: "Garage security breach investigation",
        contact: "security@fidi.nyc",
      },
      {
        position: "Vehicle Recovery Agent",
        company: "NYPD Auto Crimes",
        report: "Recovery and evidence collection",
        contact: "nypd-auto@nyc.gov",
      },
    ],
    
    contactInfo: {
      name: "David Brown",
      email: "david@example.com",
      phone: "+1 (555) 345-6789",
      role: "Luxury Vehicle Owner",
      additional: "Vehicle recovered with no damage",
    },
    
    cctvInfo: {
      cameraId: "CAM-9012",
      location: "Wall Street Security Camera",
      lastDetection: "4 days ago",
      confidence: "96%",
      model: "NYC-SEC-CAM-9012",
      resolution: "4K with facial recognition",
    },
    
    features: [
      "xDrive All-Wheel Drive",
      "M Sport Package",
      "Heated & Ventilated Seats",
      "Panoramic Sunroof",
      "Driving Assistance Pro",
      "Parking Assistant Plus",
      "Harmon Kardon Sound",
      "Gesture Control",
      "Wireless Charging",
      "Heads-Up Display",
    ],
    
    technicalSpecs: {
      vin: "5UXCR6C05P9H12345",
      engineSize: "3.0L TwinPower Turbo",
      fuelCapacity: "18.2 gallons",
      seatingCapacity: "7",
      weight: "4,750 lbs",
      transmission: "8-speed Automatic",
      fuelType: "Gasoline",
      color: "Black Sapphire Metallic",
      year: "2023",
      mileage: "8,920",
      horsepower: "335 hp",
      torque: "331 lb-ft",
      towCapacity: "7,200 lbs",
    },
    
    stats: {
      totalDetections: 3,
      activeDuration: "12.3h",
      cctvConfidence: "96%",
      lastSeenTime: "4 days ago",
      resolutionDate: "2024-01-11",
      recoveryTime: "27 hours after report",
    },
    
    reportDate: "2024-01-10",
  },
  
  // Additional alerts for more variety
  {
    id: "4m5",
    code: "4m5",
    type: "bike",
    brand: "Harley Davidson",
    details: "Black, Custom Chrome",
    location: "Florida/Miami",
    time: "Yesterday",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=500",
    
    title: "Harley Davidson - Custom Chrome",
    date: "01/20/2024",
    startTime: "4:30 pm",
    duration: "8.2h",
    lastSeen: "Ocean Drive, South Beach",
    description: "Custom Harley Davidson motorcycle with extensive chrome modifications",
    mapLocation: "Miami Beach, Florida",
    
    detectionHistory: [
      {
        id: "detect_4m5_1",
        name: "Alert 1",
        location: "Ocean Drive",
        date: "01/20/2025",
        startDate: "01/20/2025",
        startTime: "4:30 pm",
        time: "4:30 pm",
        duration: "8.2h",
        lastSeen: "2 hours ago",
        status: "active",
        type: "CCTV",
        accuracy: "73.5%",
      },
      {
        id: "detect_4m5_2",
        name: "Alert 2",
        location: "Collins Ave",
        date: "01/20/2025",
        startDate: "01/20/2025",
        startTime: "6:15 pm",
        time: "6:15 pm",
        duration: "6.7h",
        lastSeen: "4 hours ago",
        status: "active",
        type: "CCTV",
        accuracy: "68.9%",
      },
      {
        id: "detect_4m5_3",
        name: "Alert 3",
        location: "Lincoln Rd",
        date: "01/20/2025",
        startDate: "01/20/2025",
        startTime: "8:45 pm",
        time: "8:45 pm",
        duration: "4.8h",
        lastSeen: "6 hours ago",
        status: "active",
        type: "Suggestion",
        accuracy: "--",
      },
      {
        id: "detect_4m5_4",
        name: "Alert 4",
        location: "Art Deco District",
        date: "01/20/2025",
        startDate: "01/20/2025",
        startTime: "10:20 pm",
        time: "10:20 pm",
        duration: "2.9h",
        lastSeen: "8 hours ago",
        status: "active",
        type: "CCTV",
        accuracy: "76.2%",
      },
    ],
    
    reportDate: "2024-01-20",
  },
  
  {
    id: "7t1",
    code: "7t1",
    type: "truck",
    brand: "Ford F-150",
    details: "White, Work Truck",
    location: "Colorado/Denver",
    time: "5 days ago",
    status: "active",
    imageUrl: "https://images.unsplash.com/photo-1563720223485-8d6d5c5bfc63?q=80&w=500",
    
    title: "Ford F-150 - Work Truck",
    date: "01/16/2024",
    startTime: "7:45 am",
    duration: "42.8h",
    lastSeen: "Construction Site, Downtown",
    description: "White Ford F-150 work truck with company logos",
    mapLocation: "Denver, Colorado",
    
    detectionHistory: [
      {
        id: "detect_7t1_1",
        name: "Alert 1",
        location: "Construction Zone A",
        date: "01/16/2025",
        startDate: "01/16/2025",
        startTime: "7:45 am",
        time: "7:45 am",
        duration: "42.8h",
        lastSeen: "4 hours ago",
        status: "active",
        type: "CCTV",
        accuracy: "81.5%",
      },
      {
        id: "detect_7t1_2",
        name: "Alert 2",
        location: "Material Yard",
        date: "01/16/2025",
        startDate: "01/16/2025",
        startTime: "10:30 am",
        time: "10:30 am",
        duration: "39.3h",
        lastSeen: "8 hours ago",
        status: "active",
        type: "CCTV",
        accuracy: "79.2%",
      },
      {
        id: "detect_7t1_3",
        name: "Alert 3",
        location: "Highway 70",
        date: "01/16/2025",
        startDate: "01/16/2025",
        startTime: "1:15 pm",
        time: "1:15 pm",
        duration: "35.8h",
        lastSeen: "12 hours ago",
        status: "active",
        type: "CCTV",
        accuracy: "84.7%",
      },
      {
        id: "detect_7t1_4",
        name: "Alert 4",
        location: "Residential Site",
        date: "01/16/2025",
        startDate: "01/16/2025",
        startTime: "4:45 pm",
        time: "4:45 pm",
        duration: "32.3h",
        lastSeen: "16 hours ago",
        status: "active",
        type: "Suggestion",
        accuracy: "--",
      },
    ],
    
    reportDate: "2024-01-16",
  },
  
  {
    id: "3r4",
    code: "3r4",
    type: "car",
    brand: "Tesla Model 3",
    details: "Blue, Electric",
    location: "California/SF",
    time: "2 weeks ago",
    status: "resolved",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=500",
    
    title: "Tesla Model 3 - Electric Blue",
    date: "01/05/2024",
    startTime: "11:20 am",
    duration: "6.5h",
    lastSeen: "Tech Campus Parking",
    description: "Blue Tesla Model 3 electric vehicle recovered quickly",
    mapLocation: "San Francisco, California",
    
    detectionHistory: [
      {
        id: "detect_3r4_1",
        name: "Alert 1",
        location: "Tech Campus",
        date: "01/05/2025",
        startDate: "01/05/2025",
        startTime: "11:20 am",
        time: "11:20 am",
        duration: "6.5h",
        lastSeen: "Resolved",
        status: "resolved",
        type: "CCTV",
        accuracy: "89.3%",
      },
      {
        id: "detect_3r4_2",
        name: "Alert 2",
        location: "Charging Station",
        date: "01/05/2025",
        startDate: "01/05/2025",
        startTime: "1:45 pm",
        time: "1:45 pm",
        duration: "4.9h",
        lastSeen: "Resolved",
        status: "resolved",
        type: "CCTV",
        accuracy: "92.1%",
      },
      {
        id: "detect_3r4_3",
        name: "Alert 3",
        location: "Security Gate",
        date: "01/05/2025",
        startDate: "01/05/2025",
        startTime: "3:30 pm",
        time: "3:30 pm",
        duration: "2.8h",
        lastSeen: "Resolved",
        status: "resolved",
        type: "CCTV",
        accuracy: "87.6%",
      },
    ],
    
    reportDate: "2024-01-05",
  },
];

// Helper functions
export const getAlertById = (id) => {
  return alertsData.find(alert => alert.id === id || alert.code === id) || alertsData[0];
};

export const getAllAlerts = () => {
  return alertsData;
};

export const getActiveAlerts = () => {
  return alertsData.filter(alert => alert.status === "active");
};

export const getResolvedAlerts = () => {
  return alertsData.filter(alert => alert.status === "resolved");
};

export const getStats = () => {
  const allAlerts = alertsData;
  return {
    total: allAlerts.length,
    active: allAlerts.filter(a => a.status === "active").length,
    resolved: allAlerts.filter(a => a.status === "resolved").length,
  };
};

export const getAlertByCode = (code) => {
  return alertsData.find(alert => alert.code === code);
};

export const getAlertsByType = (type) => {
  return alertsData.filter(alert => alert.type === type);
};

export const getAlertsByLocation = (location) => {
  return alertsData.filter(alert => alert.location.includes(location));
};

export const getAlertsByStatus = (status) => {
  return alertsData.filter(alert => alert.status === status);
};

export const searchAlerts = (query) => {
  const lowerQuery = query.toLowerCase();
  return alertsData.filter(alert => 
    alert.brand.toLowerCase().includes(lowerQuery) ||
    alert.code.toLowerCase().includes(lowerQuery) ||
    alert.location.toLowerCase().includes(lowerQuery) ||
    alert.details.toLowerCase().includes(lowerQuery)
  );
};