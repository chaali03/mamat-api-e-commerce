const mongoose = require('mongoose');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

// Helper functions
const generateSKU = (category) => {
  const prefix = category.substring(0, 2).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${randomNum}`;
};

const generateProductId = (category) => {
  const prefixes = {
    Keyboard: 'KB',
    Mouse: 'MS',
    Headset: 'HS',
    Mousepad: 'MP',
    Switch: 'SW',
    Accessories: 'AC'
  };
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `${prefixes[category]}${randomNum}`;
};

const generateDimensions = () => {
  const x = Math.floor(100 + Math.random() * 400);
  const y = Math.floor(50 + Math.random() * 200);
  const z = Math.floor(10 + Math.random() * 50);
  return `${x}×${y}×${z}mm`;
};

const generateWeight = (min, max) => {
  const weight = Math.floor(min + Math.random() * (max - min));
  return `${weight}g`;
};

const generateRating = () => ({
  average: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
  count: Math.floor(10 + Math.random() * 500),
  distribution: {
    1: Math.floor(Math.random() * 20),
    2: Math.floor(Math.random() * 30),
    3: Math.floor(Math.random() * 50),
    4: Math.floor(Math.random() * 100),
    5: Math.floor(Math.random() * 300)
  }
});

const products = [];

// ==================== KEYBOARDS ====================

// Mechanical Keyboards
const mechanicalKeyboards = [
  {
    name: 'Aula F2088 Pro Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Aula',
    price: 899000,
    stock: 50,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/f2088-pro-1.jpg',
      'https://img.aula.com/f2088-pro-2.jpg',
      'https://img.aula.com/f2088-pro-3.jpg'
    ],
    description: 'Keyboard mechanical 65% dengan switch Aula Silver yang smooth dan responsif.',
    specs: {
      switchType: 'Mechanical',
      layout: '65%',
      connectivity: 'Bluetooth 5.0/Wired USB-C',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB',
      hotSwappable: true,
      compatibility: ['Windows', 'Mac', 'Android', 'iOS'],
      batteryLife: '200 hours',
      actuationForce: '45g',
      pollingRate: '1000Hz'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Ajazz AK992 Wireless Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Ajazz',
    price: 1299000,
    stock: 25,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/ak992-1.jpg',
      'https://img.ajazz.com/ak992-2.jpg'
    ],
    description: 'Keyboard gaming wireless premium dengan switch low-profile mechanical Ajazz Tactile.',
    specs: {
      switchType: 'Mechanical',
      layout: 'TKL',
      connectivity: 'Wireless/Bluetooth',
      keycaps: 'ABS Low-Profile',
      backlight: 'RGB',
      pollingRate: '1000Hz',
      compatibility: ['Windows', 'macOS'],
      actuationForce: '50g'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 10,
    warranty: '2 years'
  },
  {
    name: 'Monsgeek M1 Aluminum Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Monsgeek',
    price: 1899000,
    stock: 35,
    weight: generateWeight(1000, 1500),
    dimensions: generateDimensions(),
    images: [
      'https://img.monsgeek.com/m1-1.jpg',
      'https://img.monsgeek.com/m1-2.jpg'
    ],
    description: 'Keyboard mechanical premium 75% dengan case aluminum dan gasket mount design.',
    specs: {
      switchType: 'Mechanical',
      layout: '75%',
      connectivity: 'Bluetooth 5.1/Wired USB-C',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB',
      caseMaterial: 'Aluminum',
      gasketMount: true,
      hotSwappable: true,
      batteryLife: '300 hours',
      actuationForce: '45g',
      pollingRate: '1000Hz'
    },
    isFeatured: false,
    isNewRelease: true,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Rexus Daxa M84 Wireless Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Rexus',
    price: 799000,
    stock: 28,
    weight: generateWeight(600, 800),
    dimensions: generateDimensions(),
    images: [
      'https://img.rexus.com/daxa-m84-1.jpg',
      'https://img.rexus.com/daxa-m84-2.jpg'
    ],
    description: 'Keyboard mechanical wireless dengan 3 mode konektivitas dan switch hot-swappable.',
    specs: {
      switchType: 'Mechanical',
      layout: '75%',
      connectivity: 'Bluetooth 5.0/2.4GHz/Wired',
      keycaps: 'ABS Double-Shot',
      backlight: 'RGB',
      hotSwappable: true,
      compatibility: ['Windows', 'Mac', 'Android', 'iOS'],
      batteryLife: '150 hours',
      actuationForce: '45g'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 15,
    warranty: '1 year'
  },
  {
    name: 'Noir P60 Premium Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Noir',
    price: 1599000,
    stock: 15,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/p60-1.jpg',
      'https://img.noir.com/p60-2.jpg'
    ],
    description: 'Keyboard mechanical 60% premium dengan switch Noir MX Red dan keycaps PBT tahan lama.',
    specs: {
      switchType: 'Mechanical',
      layout: '60%',
      connectivity: 'Wired USB-C',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB',
      hotSwappable: false,
      compatibility: ['Windows', 'Mac'],
      actuationForce: '45g'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '2 years'
  }
];

// Membrane Keyboards
const membraneKeyboards = [
  {
    name: 'Digital Alliance M1 Wireless Membrane Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Digital Alliance',
    price: 499000,
    stock: 45,
    weight: generateWeight(400, 600),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/m1-1.jpg',
      'https://img.digitalalliance.com/m1-2.jpg'
    ],
    description: 'Keyboard membrane wireless yang ringkas dan nyaman dengan koneksi multi-device.',
    specs: {
      switchType: 'Membrane',
      layout: 'Compact',
      connectivity: 'Bluetooth',
      keycaps: 'ABS',
      batteryLife: '24 months',
      compatibility: ['Windows', 'Mac', 'Android', 'iOS'],
      multiDevice: '3 devices'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Armaggeddon AK5 Mecha-Membrane Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Armaggeddon',
    price: 899000,
    stock: 22,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      'https://img.armaggeddon.com/ak5-1.jpg',
      'https://img.armaggeddon.com/ak5-2.jpg'
    ],
    description: 'Keyboard hybrid mecha-membrane dengan sensasi klik tactile dan RGB yang hidup.',
    specs: {
      switchType: 'Mecha-Membrane',
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'ABS',
      backlight: 'RGB',
      wristRest: 'Magnetic leatherette',
      compatibility: ['Windows']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Fantech Maxfit81 Ergonomic Membrane Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Fantech',
    price: 1299000,
    stock: 18,
    weight: generateWeight(600, 800),
    dimensions: generateDimensions(),
    images: [
      'https://img.fantech.com/maxfit81-1.jpg',
      'https://img.fantech.com/maxfit81-2.jpg'
    ],
    description: 'Keyboard ergonomis dengan desain split untuk kenyamanan mengetik jangka panjang.',
    specs: {
      switchType: 'Membrane',
      layout: 'Ergonomic Split',
      connectivity: 'Wireless 2.4GHz',
      keycaps: 'ABS',
      batteryLife: '12 months',
      compatibility: ['Windows'],
      palmRest: 'Included'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 5,
    warranty: '1 year'
  },
  {
    name: 'Tecware Specter Pro Low-Profile Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Tecware',
    price: 799000,
    stock: 30,
    weight: generateWeight(500, 700),
    dimensions: generateDimensions(),
    images: [
      'https://img.tecware.com/specter-pro-1.jpg',
      'https://img.tecware.com/specter-pro-2.jpg'
    ],
    description: 'Keyboard membrane low-profile dengan desain minimalis dan multi-device connectivity.',
    specs: {
      switchType: 'Low-Profile Membrane',
      layout: '75%',
      connectivity: 'Bluetooth/Wired USB-C',
      keycaps: 'ABS',
      backlight: 'White',
      batteryLife: '100 hours',
      compatibility: ['Windows', 'Mac']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon K631 Gaming Membrane Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Redragon',
    price: 699000,
    stock: 25,
    weight: generateWeight(1000, 1200),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/k631-1.jpg',
      'https://img.redragon.com/k631-2.jpg'
    ],
    description: 'Keyboard gaming membrane dengan switch ultra-senyap dan RGB yang dinamis.',
    specs: {
      switchType: 'Whisper Quiet Membrane',
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'ABS',
      backlight: 'RGB',
      waterResistance: 'IP32',
      compatibility: ['Windows', 'macOS']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 10,
    warranty: '1 year'
  }
];

// Optical Keyboards
const opticalKeyboards = [
  {
    name: 'Ajazz AK820 Optical Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Ajazz',
    price: 2499000,
    stock: 10,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/ak820-1.jpg',
      'https://img.ajazz.com/ak820-2.jpg'
    ],
    description: 'Keyboard gaming optical dengan teknologi analog input dan actuation point yang bisa disesuaikan.',
    specs: {
      switchType: 'Optical',
      layout: '60%',
      connectivity: 'Wired USB-C',
      keycaps: 'PBT Double-Shot',
      actuationRange: '0.1-4.0mm adjustable',
      pollingRate: '1000Hz',
      compatibility: ['Windows'],
      analogInput: true,
      actuationForce: '45g'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '2 years'
  },
  {
    name: 'Aula F2100 Optical Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Aula',
    price: 1999000,
    stock: 8,
    weight: generateWeight(1200, 1500),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/f2100-1.jpg',
      'https://img.aula.com/f2100-2.jpg'
    ],
    description: 'Keyboard gaming optical dengan switch Gen-2 dan teknologi analog input untuk kontrol presisi.',
    specs: {
      switchType: 'Optical',
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'Doubleshot PBT',
      actuationPoint: 'Adjustable 1.5-3.6mm',
      pollingRate: '8000Hz',
      wristRest: 'Magnetic leatherette',
      compatibility: ['Windows'],
      actuationForce: '45g'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 15,
    warranty: '2 years'
  },
  {
    name: 'Rexus Legionare X10 Optical Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Rexus',
    price: 1299000,
    stock: 15,
    weight: generateWeight(1000, 1200),
    dimensions: generateDimensions(),
    images: [
      'https://img.rexus.com/legionare-x10-1.jpg',
      'https://img.rexus.com/legionare-x10-2.jpg'
    ],
    description: 'Keyboard gaming optical dengan switch ultra-cepat dan desain tahan lama untuk esports.',
    specs: {
      switchType: 'Optical',
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'ABS',
      actuationSpeed: '0.2ms',
      antiGhosting: 'Full N-Key Rollover',
      wristRest: 'Detachable',
      compatibility: ['Windows'],
      actuationForce: '45g'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon K685 Wireless Optical Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Redragon',
    price: 899000,
    stock: 20,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/k685-1.jpg',
      'https://img.redragon.com/k685-2.jpg'
    ],
    description: 'Keyboard gaming optical wireless dengan switch linear cepat dan RGB yang mencolok.',
    specs: {
      switchType: 'Optical',
      layout: 'TKL',
      connectivity: 'Wireless 2.4GHz/Wired USB',
      keycaps: 'ABS',
      batteryLife: '30 hours',
      pollingRate: '1000Hz',
      backlight: 'RGB',
      compatibility: ['Windows'],
      actuationForce: '45g'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Monsgeek M3 Ultra-Thin Optical Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Monsgeek',
    price: 3499000,
    stock: 12,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      'https://img.monsgeek.com/m3-1.jpg',
      'https://img.monsgeek.com/m3-2.jpg'
    ],
    description: 'Keyboard optical ultra-tipis dengan switch OPX yang super cepat dan desain premium.',
    specs: {
      switchType: 'Optical',
      layout: 'Full-size Ultra-Thin',
      connectivity: 'Bluetooth/Wired USB-C',
      keycaps: 'PBT Double-Shot',
      batteryLife: '50 hours',
      pollingRate: '4000Hz',
      backlight: 'RGB per-key',
      compatibility: ['Windows', 'macOS'],
      actuationForce: '45g'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '2 years'
  }
];

// Magnetic Keyboards
const magneticKeyboards = [
  {
    name: 'Noir P75 Magnetic Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'Noir',
    price: 2799000,
    stock: 14,
    weight: generateWeight(1000, 1500),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/p75-1.jpg',
      'https://img.noir.com/p75-2.jpg'
    ],
    description: 'Keyboard gaming dengan switch magnetic OmniPoint yang bisa disesuaikan actuation point-nya.',
    specs: {
      switchType: 'Magnetic',
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'PBT Double-Shot',
      actuationRange: '0.4-3.6mm adjustable',
      pollingRate: '1000Hz',
      OLEDDisplay: 'Smart',
      compatibility: ['Windows', 'macOS'],
      actuationForce: '45g'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 10,
    warranty: '2 years'
  },
  {
    name: 'Ajazz AK900 Magnetic Analog Keyboard',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'Ajazz',
    price: 2299000,
    stock: 18,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/ak900-1.jpg',
      'https://img.ajazz.com/ak900-2.jpg'
    ],
    description: 'Keyboard analog dengan switch magnetic yang memungkinkan kontrol input seperti controller.',
    specs: {
      switchType: 'Magnetic',
      layout: 'TKL',
      connectivity: 'Wired USB-C',
      keycaps: 'PBT Double-Shot',
      actuationRange: '0.1-4.0mm adjustable',
      analogInput: true,
      pollingRate: '1000Hz',
      compatibility: ['Windows'],
      actuationForce: '45g'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '2 years'
  },
  {
    name: 'Monsgeek M5 Hall Effect Keyboard',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'Monsgeek',
    price: 1899000,
    stock: 22,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      'https://img.monsgeek.com/m5-1.jpg',
      'https://img.monsgeek.com/m5-2.jpg'
    ],
    description: 'Keyboard gaming dengan switch Hall Effect yang presisi dan bisa disesuaikan.',
    specs: {
      switchType: 'Magnetic',
      layout: '75%',
      connectivity: 'Wired USB-C',
      keycaps: 'PBT Double-Shot',
      actuationRange: '0.5-3.5mm adjustable',
      pollingRate: '8000Hz',
      hotSwappable: true,
      compatibility: ['Windows', 'macOS'],
      actuationForce: '45g'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Aula F3000 Magnetic Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'Aula',
    price: 1599000,
    stock: 16,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/f3000-1.jpg',
      'https://img.aula.com/f3000-2.jpg'
    ],
    description: 'Keyboard gaming dengan switch magnetic G-Square yang cepat dan bisa dikustomisasi.',
    specs: {
      switchType: 'Magnetic',
      layout: '75%',
      connectivity: 'Wired USB-C',
      keycaps: 'PBT Double-Shot',
      actuationRange: '0.3-3.8mm adjustable',
      pollingRate: '1000Hz',
      backlight: 'RGB',
      compatibility: ['Windows'],
      actuationForce: '45g'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir P60X Magnetic Keyboard',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'Noir',
    price: 2199000,
    stock: 12,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/p60x-1.jpg',
      'https://img.noir.com/p60x-2.jpg'
    ],
    description: 'Keyboard 60% premium dengan switch magnetic tactile yang bisa disesuaikan.',
    specs: {
      switchType: 'Magnetic',
      layout: '60%',
      connectivity: 'Wired USB-C',
      keycaps: 'PBT Double-Shot',
      actuationRange: '0.5-3.5mm adjustable',
      pollingRate: '8000Hz',
      hotSwappable: true,
      compatibility: ['Windows', 'macOS'],
      actuationForce: '45g'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 5,
    warranty: '2 years'
  }
];

// ==================== MICE ====================

// Gaming Mice
const gamingMice = [
  {
    name: 'Rexus Legionare X5 Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Rexus',
    price: 799000,
    stock: 30,
    weight: generateWeight(50, 70),
    dimensions: generateDimensions(),
    images: [
      'https://img.rexus.com/legionare-x5-1.jpg',
      'https://img.rexus.com/legionare-x5-2.jpg'
    ],
    description: 'Mouse gaming wireless ultralight dengan sensor 30K DPI.',
    specs: {
      sensorType: 'Optical',
      dpi: '30000DPI',
      connectivity: 'Wireless 2.4GHz',
      switches: 'Omron 20M',
      batteryLife: '80 hours',
      pollingRate: '1000Hz',
      buttons: 6
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance G10 Esports Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Digital Alliance',
    price: 999000,
    stock: 25,
    weight: generateWeight(60, 70),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/g10-1.jpg',
      'https://img.digitalalliance.com/g10-2.jpg'
    ],
    description: 'Mouse esports profesional dengan berat ultra-ringan 63g.',
    specs: {
      sensorType: 'Optical',
      dpi: '25600DPI',
      connectivity: 'Wireless 2.4GHz',
      switches: 'Omron 20M',
      batteryLife: '70 hours',
      pollingRate: '1000Hz',
      buttons: 6
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 10,
    warranty: '2 years'
  },
  {
    name: 'Armaggeddon Predator X7 Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Armaggeddon',
    price: 699000,
    stock: 18,
    weight: generateWeight(60, 70),
    dimensions: generateDimensions(),
    images: [
      'https://img.armaggeddon.com/predator-x7-1.jpg',
      'https://img.armaggeddon.com/predator-x7-2.jpg'
    ],
    description: 'Mouse gaming wireless dengan desain honeycomb dan 9 programmable buttons.',
    specs: {
      sensorType: 'Optical',
      dpi: '18000DPI',
      connectivity: 'Wireless 2.4GHz',
      switches: 'Omron 10M',
      batteryLife: '180 hours',
      pollingRate: '1000Hz',
      buttons: 9
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Fantech XD5 Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Fantech',
    price: 899000,
    stock: 22,
    weight: generateWeight(60, 80),
    dimensions: generateDimensions(),
    images: [
      'https://img.fantech.com/xd5-1.jpg',
      'https://img.fantech.com/xd5-2.jpg'
    ],
    description: 'Mouse gaming wireless dengan shell honeycomb dan RGB lighting.',
    specs: {
      sensorType: 'Optical',
      dpi: '19000DPI',
      connectivity: 'Wireless 2.4GHz',
      switches: 'Huano Blue Shell',
      batteryLife: '71 hours',
      pollingRate: '1000Hz',
      buttons: 6
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon M913 Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Redragon',
    price: 1299000,
    stock: 15,
    weight: generateWeight(60, 70),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/m913-1.jpg',
      'https://img.redragon.com/m913-2.jpg'
    ],
    description: 'Mouse gaming ergonomis dengan sensor top-tier dan desain ringan.',
    specs: {
      sensorType: 'Optical',
      dpi: '30000DPI',
      connectivity: 'Wireless 2.4GHz',
      switches: 'Omron 20M',
      batteryLife: '90 hours',
      pollingRate: '4000Hz',
      buttons: 8
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '2 years'
  }
];

// Office Mice
const officeMice = [
  {
    name: 'Tecware EXO Wireless Office Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Tecware',
    price: 499000,
    stock: 35,
    weight: generateWeight(130, 150),
    dimensions: generateDimensions(),
    images: [
      'https://img.tecware.com/exo-1.jpg',
      'https://img.tecware.com/exo-2.jpg'
    ],
    description: 'Mouse premium untuk produktivitas dengan scroll ultra-presisi.',
    specs: {
      sensorType: 'Optical',
      dpi: '4000DPI',
      connectivity: 'Bluetooth/2.4GHz',
      batteryLife: '70 days',
      scroll: 'Precision',
      compatibility: ['Windows', 'macOS'],
      buttons: 5
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Aula F300 Bluetooth Office Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Aula',
    price: 399000,
    stock: 28,
    weight: generateWeight(130, 140),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/f300-1.jpg',
      'https://img.aula.com/f300-2.jpg'
    ],
    description: 'Mouse ergonomis dengan desain premium dan tracking presisi.',
    specs: {
      sensorType: 'Optical',
      dpi: '3200DPI',
      connectivity: 'Bluetooth',
      batteryLife: '3 months',
      buttons: 3,
      compatibility: ['Windows', 'macOS']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Ajazz AJ199 Productivity Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Ajazz',
    price: 599000,
    stock: 20,
    weight: generateWeight(100, 110),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/aj199-1.jpg',
      'https://img.ajazz.com/aj199-2.jpg'
    ],
    description: 'Mouse produktivitas dengan performa gaming-grade dan desain ergonomis.',
    specs: {
      sensorType: 'Optical',
      dpi: '16000DPI',
      connectivity: 'Bluetooth/2.4GHz',
      batteryLife: '400 hours',
      switches: 'Mechanical',
      compatibility: ['Multi-device'],
      buttons: 6
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance M200 Multi-Device Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Digital Alliance',
    price: 299000,
    stock: 40,
    weight: generateWeight(130, 140),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/m200-1.jpg',
      'https://img.digitalalliance.com/m200-2.jpg'
    ],
    description: 'Mouse multi-device dengan scroll hyper-fast dan ergonomi nyaman.',
    specs: {
      sensorType: 'Optical',
      dpi: '1000DPI',
      connectivity: 'Bluetooth/2.4GHz',
      batteryLife: '24 months',
      buttons: 8,
      compatibility: ['Multi-device']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir N100 Premium Office Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Noir',
    price: 499000,
    stock: 25,
    weight: generateWeight(90, 110),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/n100-1.jpg',
      'https://img.noir.com/n100-2.jpg'
    ],
    description: 'Mouse premium dengan multi-touch surface dan desain minimalis.',
    specs: {
      sensorType: 'Laser',
      dpi: '1300DPI',
      connectivity: 'Bluetooth',
      batteryLife: '1 month',
      charging: 'USB-C',
      compatibility: ['Windows', 'macOS'],
      buttons: 3
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  }
];

// Wireless Mice
const wirelessMice = [
  {
    name: 'Rexus Legionare X3 Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Wireless',
    brand: 'Rexus',
    price: 499000,
    stock: 38,
    weight: generateWeight(90, 110),
    dimensions: generateDimensions(),
    images: [
      'https://img.rexus.com/legionare-x3-1.jpg',
      'https://img.rexus.com/legionare-x3-2.jpg'
    ],
    description: 'Mouse gaming wireless dengan performa tinggi dan harga terjangkau.',
    specs: {
      sensorType: 'Optical',
      dpi: '12000DPI',
      connectivity: 'Wireless 2.4GHz',
      batteryLife: '250 hours',
      pollingRate: '1000Hz',
      buttons: 6
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Armaggeddon X9 Dual Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Wireless',
    brand: 'Armaggeddon',
    price: 599000,
    stock: 22,
    weight: generateWeight(80, 90),
    dimensions: generateDimensions(),
    images: [
      'https://img.armaggeddon.com/x9-1.jpg',
      'https://img.armaggeddon.com/x9-2.jpg'
    ],
    description: 'Mouse wireless dengan dual connectivity dan desain ergonomis.',
    specs: {
      sensorType: 'Optical',
      dpi: '16000DPI',
      connectivity: 'Bluetooth/2.4GHz',
      batteryLife: '450 hours',
      buttons: 6,
      compatibility: ['Multi-device']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Fantech XD3 Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Wireless',
    brand: 'Fantech',
    price: 699000,
    stock: 30,
    weight: generateWeight(100, 110),
    dimensions: generateDimensions(),
    images: [
      'https://img.fantech.com/xd3-1.jpg',
      'https://img.fantech.com/xd3-2.jpg'
    ],
    description: 'Mouse wireless dengan dual mode konektivitas dan RGB lighting.',
    specs: {
      sensorType: 'Optical',
      dpi: '18000DPI',
      connectivity: 'Bluetooth/2.4GHz',
      batteryLife: '400 hours',
      buttons: 6,
      compatibility: ['Multi-device']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon M908 Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Wireless',
    brand: 'Redragon',
    price: 799000,
    stock: 25,
    weight: generateWeight(90, 110),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/m908-1.jpg',
      'https://img.redragon.com/m908-2.jpg'
    ],
    description: 'Mouse gaming wireless dengan desain compact dan RGB lighting.',
    specs: {
      sensorType: 'Optical',
      dpi: '10000DPI',
      connectivity: 'Bluetooth/2.4GHz',
      batteryLife: '60 hours',
      buttons: 6,
      compatibility: ['Multi-device']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance G5 Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Wireless',
    brand: 'Digital Alliance',
    price: 899000,
    stock: 18,
    weight: generateWeight(70, 90),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/g5-1.jpg',
      'https://img.digitalalliance.com/g5-2.jpg'
    ],
    description: 'Mouse wireless ultralight dengan fitur hot-swappable switches.',
    specs: {
      sensorType: 'Optical',
      dpi: '16000DPI',
      connectivity: 'Bluetooth/2.4GHz',
      batteryLife: '78 hours',
      buttons: 6,
      hotSwap: 'Switch sockets'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '1 year'
  }
];

// Ergonomic Mice
const ergonomicMice = [
  {
    name: 'Tecware ERGO Vertical Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Tecware',
    price: 799000,
    stock: 20,
    weight: generateWeight(130, 140),
    dimensions: generateDimensions(),
    images: [
      'https://img.tecware.com/ergo-1.jpg',
      'https://img.tecware.com/ergo-2.jpg'
    ],
    description: 'Mouse vertikal ergonomis untuk mengurangi ketegangan pergelangan tangan.',
    specs: {
      sensorType: 'Optical',
      dpi: '4000DPI',
      connectivity: 'Bluetooth/2.4GHz',
      batteryLife: '4 months',
      angle: '57° vertical',
      compatibility: ['Windows', 'macOS'],
      buttons: 5
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Aula F500 Ergonomic Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Aula',
    price: 599000,
    stock: 25,
    weight: generateWeight(100, 120),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/f500-1.jpg',
      'https://img.aula.com/f500-2.jpg'
    ],
    description: 'Mouse ergonomis dengan desain unik untuk kenyamanan jangka panjang.',
    specs: {
      sensorType: 'Optical',
      dpi: '1000DPI',
      connectivity: 'Wireless 2.4GHz',
      batteryLife: '12 months',
      design: 'Thumb scoop',
      compatibility: ['Windows'],
      buttons: 6
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir N200 Vertical Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Noir',
    price: 999000,
    stock: 15,
    weight: generateWeight(140, 150),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/n200-1.jpg',
      'https://img.noir.com/n200-2.jpg'
    ],
    description: 'Mouse vertikal premium dengan desain ergonomis profesional.',
    specs: {
      sensorType: 'Laser',
      dpi: '1600DPI',
      connectivity: 'Wireless 2.4GHz',
      batteryLife: '6 months',
      angle: 'Vertical',
      compatibility: ['Windows', 'macOS'],
      buttons: 7
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon M618 Vertical Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Redragon',
    price: 499000,
    stock: 30,
    weight: generateWeight(110, 130),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/m618-1.jpg',
      'https://img.redragon.com/m618-2.jpg'
    ],
    description: 'Mouse vertikal ekonomis dengan desain ergonomis dasar.',
    specs: {
      sensorType: 'Optical',
      dpi: '1600DPI',
      connectivity: 'Wired USB',
      design: 'Vertical',
      buttons: 6,
      compatibility: ['Windows', 'macOS']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Ajazz AJ300 Ergonomic Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Ajazz',
    price: 699000,
    stock: 22,
    weight: generateWeight(120, 140),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/aj300-1.jpg',
      'https://img.ajazz.com/aj300-2.jpg'
    ],
    description: 'Mouse ergonomis vertikal dengan penyangga pergelangan tangan terintegrasi.',
    specs: {
      sensorType: 'Optical',
      dpi: '5000DPI',
      connectivity: 'Wireless 2.4GHz',
      batteryLife: '30 days',
      design: 'Vertical with wrist rest',
      compatibility: ['Windows', 'macOS'],
      buttons: 5
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  }
];

// ==================== MOUSEPADS ====================

// Hard Mousepads
const hardMousepads = [
  {
    name: 'Rexus Legionare H1 Hard Mousepad',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Rexus',
    price: 299000,
    stock: 25,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      'https://img.rexus.com/legionare-h1-1.jpg',
      'https://img.rexus.com/legionare-h1-2.jpg'
    ],
    description: 'Mousepad hard surface dengan tracking konsisten untuk gaming.',
    specs: {
      size: '320x270x3mm',
      material: 'Hard polymer',
      base: 'Rubber anti-slip',
      thickness: '3mm',
      surface: 'Smooth',
      compatibility: 'All mouse sensors'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  },
  {
    name: 'Digital Alliance DA-H1 Glass Mousepad',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Digital Alliance',
    price: 499000,
    stock: 15,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-h1-1.jpg',
      'https://img.digitalalliance.com/da-h1-2.jpg'
    ],
    description: 'Mousepad hard premium dengan surface seperti kaca untuk glide ultra-cepat.',
    specs: {
      size: '355x255x2mm',
      material: 'Glass-infused',
      base: 'Silicone',
      thickness: '2mm',
      surface: 'Ultra-smooth',
      compatibility: 'High-DPI sensors'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Armaggeddon H2 Hard Gaming Mousepad',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Armaggeddon',
    price: 399000,
    stock: 20,
    weight: generateWeight(300, 350),
    dimensions: generateDimensions(),
    images: [
      'https://img.armaggeddon.com/h2-1.jpg',
      'https://img.armaggeddon.com/h2-2.jpg'
    ],
    description: 'Mousepad hard dengan surface rendah gesekan untuk kontrol presisi.',
    specs: {
      size: '340x280x3mm',
      material: 'Hard plastic',
      base: 'Rubber',
      thickness: '3mm',
      surface: 'Low-friction',
      compatibility: 'Gaming mice'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  },
  {
    name: 'Fantech MP-H1 Hard Mousepad',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Fantech',
    price: 449000,
    stock: 18,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      'https://img.fantech.com/mp-h1-1.jpg',
      'https://img.fantech.com/mp-h1-2.jpg'
    ],
    description: 'Mousepad hard gaming dengan surface tekstur untuk kontrol optimal.',
    specs: {
      size: '360x300x3mm',
      material: 'Hard composite',
      base: 'Rubber',
      thickness: '3mm',
      surface: 'Textured',
      compatibility: 'High-performance sensors'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon P008 Hard Mousepad',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Redragon',
    price: 349000,
    stock: 22,
    weight: generateWeight(300, 350),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/p008-1.jpg',
      'https://img.redragon.com/p008-2.jpg'
    ],
    description: 'Mousepad hard dengan surface cepat dan tahan lama untuk gaming.',
    specs: {
      size: '350x300x3mm',
      material: 'Hard polymer',
      base: 'Rubber',
      thickness: '3mm',
      surface: 'Speed-optimized',
      compatibility: 'All gaming mice'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  }
];

// Soft Mousepads
const softMousepads = [
  {
    name: 'Aula F100 Cloth Mousepad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'Aula',
    price: 199000,
    stock: 40,
    weight: generateWeight(200, 300),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/f100-1.jpg',
      'https://img.aula.com/f100-2.jpg'
    ],
    description: 'Mousepad cloth klasik dengan performa konsisten untuk semua kebutuhan.',
    specs: {
      size: '320x270x2mm',
      material: 'Cloth',
      base: 'Rubber',
      thickness: '2mm',
      surface: 'Smooth',
      compatibility: 'All mice'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  },
  {
    name: 'Ajazz AJ-M1 Textured Mousepad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'Ajazz',
    price: 299000,
    stock: 35,
    weight: generateWeight(250, 300),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/aj-m1-1.jpg',
      'https://img.ajazz.com/aj-m1-2.jpg'
    ],
    description: 'Mousepad cloth dengan surface mikro-tekstur untuk kontrol optimal.',
    specs: {
      size: '355x255x3mm',
      material: 'High-density cloth',
      base: 'Rubber',
      thickness: '3mm',
      surface: 'Micro-textured',
      compatibility: 'Gaming sensors'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir N-M1 Professional Mousepad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'Noir',
    price: 399000,
    stock: 28,
    weight: generateWeight(280, 320),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/n-m1-1.jpg',
      'https://img.noir.com/n-m1-2.jpg'
    ],
    description: 'Mousepad cloth profesional yang dikembangkan bersama esports athletes.',
    specs: {
      size: '340x280x3mm',
      material: 'Cloth',
      base: 'Rubber',
      thickness: '3mm',
      surface: 'Optimized for gaming',
      compatibility: 'High-DPI sensors'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance DA-S1 Premium Mousepad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'Digital Alliance',
    price: 349000,
    stock: 25,
    weight: generateWeight(300, 350),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-s1-1.jpg',
      'https://img.digitalalliance.com/da-s1-2.jpg'
    ],
    description: 'Mousepad cloth premium dengan ketebalan ekstra untuk kenyamanan.',
    specs: {
      size: '360x300x4mm',
      material: 'Premium cloth',
      base: 'Anti-slip rubber',
      thickness: '4mm',
      surface: 'Dense weave',
      compatibility: 'All gaming mice'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Rexus Legionare S1 Speed Mousepad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'Rexus',
    price: 299000,
    stock: 30,
    weight: generateWeight(250, 300),
    dimensions: generateDimensions(),
    images: [
      'https://img.rexus.com/legionare-s1-1.jpg',
      'https://img.rexus.com/legionare-s1-2.jpg'
    ],
    description: 'Mousepad cloth dengan surface cepat untuk glide optimal.',
    specs: {
      size: '350x300x4mm',
      material: 'Cloth',
      base: 'Rubber',
      thickness: '4mm',
      surface: 'Speed-optimized',
      compatibility: 'All sensors'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  }
];

// RGB Mousepads
const rgbMousepads = [
  {
    name: 'Redragon P018-RGB Gaming Mousepad',
    category: 'Mousepad',
    subCategory: 'RGB',
    brand: 'Redragon',
    price: 799000,
    stock: 18,
    weight: generateWeight(450, 550),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/p018-rgb-1.jpg',
      'https://img.redragon.com/p018-rgb-2.jpg'
    ],
    description: 'Mousepad gaming dengan RGB yang bisa disinkronisasi.',
    specs: {
      size: '355x255x3mm',
      material: 'Micro-textured cloth',
      base: 'Rubber',
      thickness: '3mm',
      lighting: 'RGB',
      compatibility: 'All systems',
      connectivity: 'USB'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Armaggeddon RGB-X1 Dual-Surface Mousepad',
    category: 'Mousepad',
    subCategory: 'RGB',
    brand: 'Armaggeddon',
    price: 899000,
    stock: 15,
    weight: generateWeight(500, 600),
    dimensions: generateDimensions(),
    images: [
      'https://img.armaggeddon.com/rgb-x1-1.jpg',
      'https://img.armaggeddon.com/rgb-x1-2.jpg'
    ],
    description: 'Mousepad RGB premium dengan dual-surface dan kontrol pencahayaan canggih.',
    specs: {
      size: '320x270x4mm',
      material: 'Dual-surface cloth',
      base: 'Rubber',
      thickness: '4mm',
      lighting: 'RGB',
      compatibility: 'All systems',
      connectivity: 'USB'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Fantech MP-RGB1 Programmable Mousepad',
    category: 'Mousepad',
    subCategory: 'RGB',
    brand: 'Fantech',
    price: 699000,
    stock: 12,
    weight: generateWeight(500, 550),
    dimensions: generateDimensions(),
    images: [
      'https://img.fantech.com/mp-rgb1-1.jpg',
      'https://img.fantech.com/mp-rgb1-2.jpg'
    ],
    description: 'Mousepad RGB dengan kontrol pencahayaan penuh via software.',
    specs: {
      size: '360x300x3mm',
      material: 'Micro-textured cloth',
      base: 'Anti-slip rubber',
      thickness: '3mm',
      lighting: 'RGB',
      compatibility: 'All systems',
      connectivity: 'USB passthrough'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance DA-RGB Dynamic Mousepad',
    category: 'Mousepad',
    subCategory: 'RGB',
    brand: 'Digital Alliance',
    price: 599000,
    stock: 20,
    weight: generateWeight(450, 500),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-rgb-1.jpg',
      'https://img.digitalalliance.com/da-rgb-2.jpg'
    ],
    description: 'Mousepad RGB dengan efek pencahayaan dinamis dan surface optimal.',
    specs: {
      size: '350x300x4mm',
      material: 'Textured cloth',
      base: 'Rubber',
      thickness: '4mm',
      lighting: 'RGB dynamic',
      compatibility: 'All systems',
      connectivity: 'USB'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Aula F200-RGB Hybrid Mousepad',
    category: 'Mousepad',
    subCategory: 'RGB',
    brand: 'Aula',
    price: 799000,
    stock: 16,
    weight: generateWeight(500, 550),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/f200-rgb-1.jpg',
      'https://img.aula.com/f200-rgb-2.jpg'
    ],
    description: 'Mousepad RGB tahan air dengan surface hybrid untuk glide cepat.',
    specs: {
      size: '370x320x3mm',
      material: 'Hybrid water-resistant',
      base: 'Rubber',
      thickness: '3mm',
      lighting: 'RGB',
      compatibility: 'All systems',
      connectivity: 'USB'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '1 year'
  }
];

// Extended Mousepads
const extendedMousepads = [
  {
    name: 'Redragon P028-XXL Extended Mousepad',
    category: 'Mousepad',
    subCategory: 'Extended',
    brand: 'Redragon',
    price: 499000,
    stock: 25,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/p028-xxl-1.jpg',
      'https://img.redragon.com/p028-xxl-2.jpg'
    ],
    description: 'Mousepad extended besar dengan permukaan cloth yang optimal untuk tracking.',
    specs: {
      size: '900x400x6mm',
      material: 'High-quality cloth',
      base: 'Rubber anti-slip',
      thickness: '6mm',
      stitchedEdges: true,
      compatibility: 'Full desk coverage'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Armaggeddon XXL-X1 Extended Mousepad',
    category: 'Mousepad',
    subCategory: 'Extended',
    brand: 'Armaggeddon',
    price: 599000,
    stock: 18,
    weight: generateWeight(700, 800),
    dimensions: generateDimensions(),
    images: [
      'https://img.armaggeddon.com/xxl-x1-1.jpg',
      'https://img.armaggeddon.com/xxl-x1-2.jpg'
    ],
    description: 'Mousepad extended dengan surface mikro-tekstur untuk kontrol optimal.',
    specs: {
      size: '920x400x3mm',
      material: 'High-density cloth',
      base: 'Rubber',
      thickness: '3mm',
      stitchedEdges: true,
      compatibility: 'Full desk setup'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance DA-XXL Pro Mousepad',
    category: 'Mousepad',
    subCategory: 'Extended',
    brand: 'Digital Alliance',
    price: 699000,
    stock: 15,
    weight: generateWeight(700, 800),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-xxl-1.jpg',
      'https://img.digitalalliance.com/da-xxl-2.jpg'
    ],
    description: 'Mousepad extended profesional yang dikembangkan bersama esports athletes.',
    specs: {
      size: '900x400x3mm',
      material: 'Cloth',
      base: 'Rubber',
      thickness: '3mm',
      stitchedEdges: true,
      compatibility: 'Professional gaming'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Fantech MP-XXL1 Premium Mousepad',
    category: 'Mousepad',
    subCategory: 'Extended',
    brand: 'Fantech',
    price: 799000,
    stock: 12,
    weight: generateWeight(800, 850),
    dimensions: generateDimensions(),
    images: [
      'https://img.fantech.com/mp-xxl1-1.jpg',
      'https://img.fantech.com/mp-xxl1-2.jpg'
    ],
    description: 'Mousepad extended premium dengan ketahanan tinggi dan permukaan optimal.',
    specs: {
      size: '930x400x3mm',
      material: 'Premium cloth',
      base: 'Anti-slip rubber',
      thickness: '3mm',
      stitchedEdges: true,
      compatibility: 'Full desktop setup'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Aula F300-XXL Large Mousepad',
    category: 'Mousepad',
    subCategory: 'Extended',
    brand: 'Aula',
    price: 649000,
    stock: 20,
    weight: generateWeight(700, 800),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/f300-xxl-1.jpg',
      'https://img.aula.com/f300-xxl-2.jpg'
    ],
    description: 'Mousepad extended besar dengan surface cepat dan tahan lama.',
    specs: {
      size: '900x420x4mm',
      material: 'Dense-weave cloth',
      base: 'Rubber',
      thickness: '4mm',
      stitchedEdges: true,
      compatibility: 'Keyboard+mouse space'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '1 year'
  }
];

// ==================== HEADSETS ====================

// Gaming Headsets
const gamingHeadsets = [
  {
    name: 'Rexus Legionare HX1 Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Rexus',
    price: 899000,
    stock: 40,
    weight: generateWeight(300, 350),
    dimensions: generateDimensions(),
    images: [
      'https://img.rexus.com/legionare-hx1-1.jpg',
      'https://img.rexus.com/legionare-hx1-2.jpg'
    ],
    description: 'Headset gaming dengan driver 53mm yang powerful untuk audio immersive.',
    specs: {
      driverSize: '53mm',
      frequencyResponse: '10Hz-30kHz',
      impedance: '60Ω',
      microphone: 'Detachable noise-cancelling',
      connectivity: '3.5mm/USB',
      cableLength: '1m + 2m extension',
      earCushions: 'Memory foam'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance DA-H1 Flagship Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Digital Alliance',
    price: 1499000,
    stock: 15,
    weight: generateWeight(320, 350),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-h1-1.jpg',
      'https://img.digitalalliance.com/da-h1-2.jpg'
    ],
    description: 'Headset gaming flagship dengan ANC dan audio high-fidelity.',
    specs: {
      driverSize: '40mm',
      frequencyResponse: '10Hz-22kHz',
      impedance: '32Ω',
      microphone: 'Retractable AI noise-cancelling',
      connectivity: 'Wireless/3.5mm',
      batteryLife: '22 hours',
      features: 'Active Noise Cancellation'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '2 years'
  },
  {
    name: 'Armaggeddon XH1 Esports Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Armaggeddon',
    price: 1299000,
    stock: 22,
    weight: generateWeight(300, 350),
    dimensions: generateDimensions(),
    images: [
      'https://img.armaggeddon.com/xh1-1.jpg',
      'https://img.armaggeddon.com/xh1-2.jpg'
    ],
    description: 'Headset gaming esports dengan microphone broadcast-grade dan audio presisi.',
    specs: {
      driverSize: '50mm',
      frequencyResponse: '12Hz-28kHz',
      impedance: '32Ω',
      microphone: 'HyperClear Supercardioid',
      connectivity: 'Wireless 2.4GHz',
      batteryLife: '24 hours',
      features: 'Virtual 7.1 Surround'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Fantech HG11 Pro Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Fantech',
    price: 999000,
    stock: 18,
    weight: generateWeight(340, 360),
    dimensions: generateDimensions(),
    images: [
      'https://img.fantech.com/hg11-1.jpg',
      'https://img.fantech.com/hg11-2.jpg'
    ],
    description: 'Headset gaming profesional dengan teknologi Blue VO!CE untuk komunikasi jernih.',
    specs: {
      driverSize: '50mm',
      frequencyResponse: '20Hz-20kHz',
      impedance: '32Ω',
      microphone: 'Detachable',
      connectivity: 'Wireless 2.4GHz',
      batteryLife: '20 hours',
      features: 'Virtual 7.1 Surround'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon H510 Dual-Mode Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Redragon',
    price: 1299000,
    stock: 15,
    weight: generateWeight(300, 320),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/h510-1.jpg',
      'https://img.redragon.com/h510-2.jpg'
    ],
    description: 'Headset gaming dual-mode dengan audio Hi-Res dan desain ergonomis.',
    specs: {
      driverSize: '50mm',
      frequencyResponse: '20Hz-40kHz',
      impedance: '32Ω',
      microphone: 'AI noise-cancelling',
      connectivity: 'Wireless 2.4GHz/Bluetooth',
      batteryLife: '25 hours',
      features: 'Hi-Res Audio certified'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '2 years'
  }
];

// Music Headsets
const musicHeadsets = [
  {
    name: 'Noir NH1 Premium Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Noir',
    price: 2499000,
    stock: 25,
    weight: generateWeight(240, 260),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/nh1-1.jpg',
      'https://img.noir.com/nh1-2.jpg'
    ],
    description: 'Headset premium dengan noise cancellation terbaik dan audio high-resolution.',
    specs: {
      driverSize: '40mm',
      frequencyResponse: '4Hz-40kHz',
      impedance: '48Ω',
      microphone: 'Built-in beamforming',
      connectivity: 'Bluetooth 5.2',
      batteryLife: '30 hours',
      features: 'Industry-leading ANC'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '2 years'
  },
  {
    name: 'Ajazz AH1 Comfort Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Ajazz',
    price: 1999000,
    stock: 30,
    weight: generateWeight(230, 250),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/ah1-1.jpg',
      'https://img.ajazz.com/ah1-2.jpg'
    ],
    description: 'Headset dengan kenyamanan legendaris dan noise cancellation kelas atas.',
    specs: {
      driverSize: '40mm',
      frequencyResponse: '20Hz-20kHz',
      impedance: '32Ω',
      microphone: 'Built-in array',
      connectivity: 'Bluetooth 5.1',
      batteryLife: '24 hours',
      features: 'Triport acoustic architecture'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Aula FH1 Audiophile Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Aula',
    price: 1799000,
    stock: 20,
    weight: generateWeight(280, 300),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/fh1-1.jpg',
      'https://img.aula.com/fh1-2.jpg'
    ],
    description: 'Headset audiophile dengan desain premium dan sound signature ala Sennheiser.',
    specs: {
      driverSize: '42mm',
      frequencyResponse: '6Hz-22kHz',
      impedance: '28Ω',
      microphone: '3-mic array',
      connectivity: 'Bluetooth 5.2',
      batteryLife: '60 hours',
      features: 'Adaptive ANC'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Tecware TH1 Studio Monitor Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Tecware',
    price: 1499000,
    stock: 25,
    weight: generateWeight(300, 320),
    dimensions: generateDimensions(),
    images: [
      'https://img.tecware.com/th1-1.jpg',
      'https://img.tecware.com/th1-2.jpg'
    ],
    description: 'Headset monitor profesional dengan akurasi audio yang luar biasa.',
    specs: {
      driverSize: '45mm',
      frequencyResponse: '15Hz-28kHz',
      impedance: '38Ω',
      microphone: 'Built-in',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '50 hours',
      features: 'Studio-grade sound'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance DA-H2 Studio Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Digital Alliance',
    price: 2199000,
    stock: 18,
    weight: generateWeight(340, 360),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-h2-1.jpg',
      'https://img.digitalalliance.com/da-h2-2.jpg'
    ],
    description: 'Headphone studio profesional dengan detail audio yang sangat akurat.',
    specs: {
      driverSize: '45mm',
      frequencyResponse: '5Hz-40kHz',
      impedance: '48Ω',
      microphone: 'None',
      connectivity: 'Wired 3.5mm',
      features: 'Tesla drivers, closed-back'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '2 years'
  }
];

// Wireless Headsets
const wirelessHeadsets = [
  {
    name: 'Armaggeddon WH1 Wireless Headset',
    category: 'Headset',
    subCategory: 'Wireless',
    brand: 'Armaggeddon',
    price: 1299000,
    stock: 22,
    weight: generateWeight(280, 300),
    dimensions: generateDimensions(),
    images: [
      'https://img.armaggeddon.com/wh1-1.jpg',
      'https://img.armaggeddon.com/wh1-2.jpg'
    ],
    description: 'Headset wireless dengan ANC adaptif dan ketahanan terhadap cuaca.',
    specs: {
      driverSize: '40mm',
      frequencyResponse: '10Hz-20kHz',
      impedance: '32Ω',
      microphone: '8-mic array',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '36 hours',
      features: 'SmartSound technology'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir NH2 Wireless Headphones',
    category: 'Headset',
    subCategory: 'Wireless',
    brand: 'Noir',
    price: 2999000,
    stock: 15,
    weight: generateWeight(370, 400),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/nh2-1.jpg',
      'https://img.noir.com/nh2-2.jpg'
    ],
    description: 'Headset premium dengan ANC dan audio berkualitas tinggi.',
    specs: {
      driverSize: '40mm',
      frequencyResponse: '20Hz-20kHz',
      impedance: 'N/A',
      microphone: 'Beamforming array',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '20 hours',
      features: 'Spatial Audio'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '2 years'
  },
  {
    name: 'Ajazz AJ-WH1 Wireless Headset',
    category: 'Headset',
    subCategory: 'Wireless',
    brand: 'Ajazz',
    price: 899000,
    stock: 35,
    weight: generateWeight(250, 280),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/aj-wh1-1.jpg',
      'https://img.ajazz.com/aj-wh1-2.jpg'
    ],
    description: 'Headset wireless dengan ANC hybrid dan harga terjangkau.',
    specs: {
      driverSize: '40mm',
      frequencyResponse: '16Hz-40kHz',
      impedance: '16Ω',
      microphone: 'Built-in',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '40 hours',
      features: 'Hybrid ANC'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon H520 Premium Wireless Headset',
    category: 'Headset',
    subCategory: 'Wireless',
    brand: 'Redragon',
    price: 1499000,
    stock: 18,
    weight: generateWeight(300, 320),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/h520-1.jpg',
      'https://img.redragon.com/h520-2.jpg'
    ],
    description: 'Headset wireless premium dengan desain mewah dan sound signature ala B&W.',
    specs: {
      driverSize: '43.6mm',
      frequencyResponse: '10Hz-30kHz',
      impedance: '32Ω',
      microphone: '6-mic array',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '30 hours',
      features: 'Adaptive ANC'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Fantech HG21 Compact Wireless Headset',
    category: 'Headset',
    subCategory: 'Wireless',
    brand: 'Fantech',
    price: 1299000,
    stock: 28,
    weight: generateWeight(220, 250),
    dimensions: generateDimensions(),
    images: [
      'https://img.fantech.com/hg21-1.jpg',
      'https://img.fantech.com/hg21-2.jpg'
    ],
    description: 'Headset wireless dengan kualitas audio dan ANC yang solid.',
    specs: {
      driverSize: '32mm',
      frequencyResponse: '18Hz-22kHz',
      impedance: '28Ω',
      microphone: 'Built-in',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '30 hours',
      features: 'Active Noise Cancellation'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  }
];

// Noise-Cancelling Headsets
const noiseCancellingHeadsets = [
  {
    name: 'Digital Alliance DA-NC1 ANC Headset',
    category: 'Headset',
    subCategory: 'Noise-Cancelling',
    brand: 'Digital Alliance',
    price: 1999000,
    stock: 20,
    weight: generateWeight(240, 260),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-nc1-1.jpg',
      'https://img.digitalalliance.com/da-nc1-2.jpg'
    ],
    description: 'Headset dengan teknologi noise cancellation mutakhir dan desain modern.',
    specs: {
      driverSize: '40mm',
      frequencyResponse: '20Hz-20kHz',
      impedance: '32Ω',
      microphone: '8-mic array',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '20 hours',
      features: '11 levels of ANC'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Aula ANC1 Lightweight Headphones',
    category: 'Headset',
    subCategory: 'Noise-Cancelling',
    brand: 'Aula',
    price: 1499000,
    stock: 30,
    weight: generateWeight(180, 200),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/anc1-1.jpg',
      'https://img.aula.com/anc1-2.jpg'
    ],
    description: 'Headset noise-cancelling ringan dengan baterai tahan lama.',
    specs: {
      driverSize: '30mm',
      frequencyResponse: '7Hz-20kHz',
      impedance: '32Ω',
      microphone: 'Built-in',
      connectivity: 'Bluetooth 5.2',
      batteryLife: '35 hours',
      features: 'DSEE upscaling'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Tecware NC1 Adaptive ANC Headset',
    category: 'Headset',
    subCategory: 'Noise-Cancelling',
    brand: 'Tecware',
    price: 1799000,
    stock: 22,
    weight: generateWeight(250, 280),
    dimensions: generateDimensions(),
    images: [
      'https://img.tecware.com/nc1-1.jpg',
      'https://img.tecware.com/nc1-2.jpg'
    ],
    description: 'Headset premium dengan ANC adaptif dan sound signature yang powerful.',
    specs: {
      driverSize: '40mm',
      frequencyResponse: '10Hz-40kHz',
      impedance: '32Ω',
      microphone: '4-mic array',
      connectivity: 'Bluetooth 5.2',
      batteryLife: '30 hours',
      features: 'Smart Ambient'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir NC1 Audiophile Headphones',
    category: 'Headset',
    subCategory: 'Noise-Cancelling',
    brand: 'Noir',
    price: 2499000,
    stock: 15,
    weight: generateWeight(320, 350),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/nc1-1.jpg',
      'https://img.noir.com/nc1-2.jpg'
    ],
    description: 'Headset audiophile dengan noise cancellation dan kualitas audio studio.',
    specs: {
      driverSize: '50mm',
      frequencyResponse: '20Hz-22kHz',
      impedance: '32Ω',
      microphone: 'Built-in',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '20 hours',
      features: 'Mode Environment'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '2 years'
  },
  {
    name: 'Ajazz ANC1 Wireless Headset',
    category: 'Headset',
    subCategory: 'Noise-Cancelling',
    brand: 'Ajazz',
    price: 1999000,
    stock: 25,
    weight: generateWeight(250, 270),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/anc1-1.jpg',
      'https://img.ajazz.com/anc1-2.jpg'
    ],
    description: 'Headset terbaru dengan ANC dan konektivitas yang mulus.',
    specs: {
      driverSize: '40mm',
      frequencyResponse: '20Hz-20kHz',
      impedance: 'N/A',
      microphone: '6-mic array',
      connectivity: 'Bluetooth 5.3',
      batteryLife: '40 hours',
      features: 'Advanced ANC'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  }
];

// ==================== SWITCHES ====================

// Linear Switches
const linearSwitches = [
  {
    name: 'Aula Silver Linear Switch',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Aula',
    price: 20000,
    stock: 1200,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/silver-1.jpg',
      'https://img.aula.com/silver-2.jpg'
    ],
    description: 'Switch mechanical linear dengan actuation force 45g yang ringan dan smooth.',
    specs: {
      type: 'Linear',
      actuationForce: '45g',
      travelDistance: '3.8mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      spring: 'Gold-plated'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Ajazz Red Linear Switch',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Ajazz',
    price: 18000,
    stock: 1500,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/red-1.jpg',
      'https://img.ajazz.com/red-2.jpg'
    ],
    description: 'Switch linear populer dengan gaya tekan yang halus dan konsisten.',
    specs: {
      type: 'Linear',
      actuationForce: '50g',
      travelDistance: '4.0mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      spring: 'Standard'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir Black Linear Switch',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Noir',
    price: 25000,
    stock: 800,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/black-1.jpg',
      'https://img.noir.com/black-2.jpg'
    ],
    description: 'Switch linear premium dengan gaya tekan yang sangat smooth dan stabil.',
    specs: {
      type: 'Linear',
      actuationForce: '60g',
      travelDistance: '3.8mm',
      lifespan: '70 million clicks',
      pinType: '5-pin',
      housingMaterial: 'PC',
      stemMaterial: 'POM',
      spring: 'Double-stage'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon Red Linear Switch',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Redragon',
    price: 15000,
    stock: 1000,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/red-1.jpg',
      'https://img.redragon.com/red-2.jpg'
    ],
    description: 'Switch linear dengan desain box yang tahan debu dan kelembaban.',
    specs: {
      type: 'Linear',
      actuationForce: '45g',
      travelDistance: '3.6mm',
      lifespan: '80 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      feature: 'Dust-proof box design'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance DA-Red Linear Switch',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Digital Alliance',
    price: 20000,
    stock: 1200,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-red-1.jpg',
      'https://img.digitalalliance.com/da-red-2.jpg'
    ],
    description: 'Switch linear klasik yang banyak digunakan di keyboard gaming.',
    specs: {
      type: 'Linear',
      actuationForce: '45g',
      travelDistance: '4.0mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      spring: 'Standard'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  }
];

// Tactile Switches
const tactileSwitches = [
  {
    name: 'Aula Brown Tactile Switch',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Aula',
    price: 20000,
    stock: 1100,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/brown-1.jpg',
      'https://img.aula.com/brown-2.jpg'
    ],
    description: 'Switch tactile dengan bump yang jelas di awal tekan.',
    specs: {
      type: 'Tactile',
      actuationForce: '55g',
      travelDistance: '3.8mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      tactileBump: 'Early'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Ajazz Brown Tactile Switch',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Ajazz',
    price: 18000,
    stock: 1400,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/brown-1.jpg',
      'https://img.ajazz.com/brown-2.jpg'
    ],
    description: 'Switch tactile dengan bump yang ringan, cocok untuk pemula.',
    specs: {
      type: 'Tactile',
      actuationForce: '55g',
      travelDistance: '4.0mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      tactileBump: 'Subtle'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir T1 Tactile Switch',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Noir',
    price: 25000,
    stock: 750,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/t1-1.jpg',
      'https://img.noir.com/t1-2.jpg'
    ],
    description: 'Switch tactile dengan bump yang kuat dan gaya tekan yang halus.',
    specs: {
      type: 'Tactile',
      actuationForce: '67g',
      travelDistance: '3.8mm',
      lifespan: '70 million clicks',
      pinType: '5-pin',
      housingMaterial: 'PC',
      stemMaterial: 'POM',
      tactileBump: 'Pronounced'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon Brown Tactile Switch',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Redragon',
    price: 15000,
    stock: 900,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/brown-1.jpg',
      'https://img.redragon.com/brown-2.jpg'
    ],
    description: 'Switch tactile dengan desain box yang tahan debu dan kelembaban.',
    specs: {
      type: 'Tactile',
      actuationForce: '50g',
      travelDistance: '3.6mm',
      lifespan: '80 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      feature: 'Dust-proof box design'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance DA-Brown Tactile Switch',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Digital Alliance',
    price: 20000,
    stock: 1100,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-brown-1.jpg',
      'https://img.digitalalliance.com/da-brown-2.jpg'
    ],
    description: 'Switch tactile klasik dengan bump yang ringan namun terasa.',
    specs: {
      type: 'Tactile',
      actuationForce: '55g',
      travelDistance: '4.0mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      tactileBump: 'Subtle'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  }
];

// Clicky Switches
const clickySwitches = [
  {
    name: 'Aula Blue Clicky Switch',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Aula',
    price: 20000,
    stock: 950,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/blue-1.jpg',
      'https://img.aula.com/blue-2.jpg'
    ],
    description: 'Switch clicky dengan suara yang jernih dan tactile bump yang jelas.',
    specs: {
      type: 'Clicky',
      actuationForce: '50g',
      travelDistance: '3.8mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      clickType: 'Sharp click'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Ajazz Blue Clicky Switch',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Ajazz',
    price: 18000,
    stock: 1300,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/blue-1.jpg',
      'https://img.ajazz.com/blue-2.jpg'
    ],
    description: 'Switch clicky dengan suara yang keras dan tactile feedback yang kuat.',
    specs: {
      type: 'Clicky',
      actuationForce: '60g',
      travelDistance: '4.0mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      clickType: 'Loud click'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon Blue Clicky Switch',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Redragon',
    price: 15000,
    stock: 800,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/blue-1.jpg',
      'https://img.redragon.com/blue-2.jpg'
    ],
    description: 'Switch clicky dengan suara yang khas dan desain box yang tahan debu.',
    specs: {
      type: 'Clicky',
      actuationForce: '50g',
      travelDistance: '3.6mm',
      lifespan: '80 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      clickType: 'Crisp click'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance DA-Blue Clicky Switch',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Digital Alliance',
    price: 12000,
    stock: 1100,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-blue-1.jpg',
      'https://img.digitalalliance.com/da-blue-2.jpg'
    ],
    description: 'Switch clicky ekonomis dengan suara yang keras dan feedback yang jelas.',
    specs: {
      type: 'Clicky',
      actuationForce: '62g',
      travelDistance: '4.0mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      clickType: 'Loud click'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir Blue Classic Clicky Switch',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Noir',
    price: 20000,
    stock: 1000,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/blue-1.jpg',
      'https://img.noir.com/blue-2.jpg'
    ],
    description: 'Switch clicky klasik dengan suara yang ikonik dan tactile feedback.',
    specs: {
      type: 'Clicky',
      actuationForce: '60g',
      travelDistance: '4.0mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      clickType: 'Classic click'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  }
];

// Silent Switches
const silentSwitches = [
  {
    name: 'Aula Silent Red Linear Switch',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Aula',
    price: 22000,
    stock: 900,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.aula.com/silent-red-1.jpg',
      'https://img.aula.com/silent-red-2.jpg'
    ],
    description: 'Switch linear silent dengan gaya tekan yang halus dan suara minimal.',
    specs: {
      type: 'Silent',
      actuationForce: '45g',
      travelDistance: '3.5mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      noiseLevel: 'Reduced by 30%'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Ajazz Silent Pink Linear Switch',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Ajazz',
    price: 25000,
    stock: 850,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/silent-pink-1.jpg',
      'https://img.ajazz.com/silent-pink-2.jpg'
    ],
    description: 'Switch linear silent premium dengan teknologi peredam suara.',
    specs: {
      type: 'Silent',
      actuationForce: '45g',
      travelDistance: '3.7mm',
      lifespan: '50 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      noiseLevel: 'Reduced by 30%'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Noir Silent Black Ultra-Light Switch',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Noir',
    price: 28000,
    stock: 700,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/silent-black-1.jpg',
      'https://img.noir.com/silent-black-2.jpg'
    ],
    description: 'Switch linear ultra-ringan dengan desain box silent yang inovatif.',
    specs: {
      type: 'Silent',
      actuationForce: '35g',
      travelDistance: '3.6mm',
      lifespan: '80 million clicks',
      pinType: '3-pin',
      housingMaterial: 'Nylon',
      stemMaterial: 'POM',
      feature: 'Silent box design'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Redragon Silent Brown Tactile Switch',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Redragon',
    price: 35000,
    stock: 500,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.redragon.com/silent-brown-1.jpg',
      'https://img.redragon.com/silent-brown-2.jpg'
    ],
    description: 'Switch tactile silent premium dengan kualitas konstruksi tinggi.',
    specs: {
      type: 'Silent',
      actuationForce: '62g',
      travelDistance: '3.7mm',
      lifespan: '70 million clicks',
      pinType: '5-pin',
      housingMaterial: 'PC',
      stemMaterial: 'POM',
      noiseLevel: 'Reduced by 40%'
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '1 year'
  },
  {
    name: 'Digital Alliance DA-Silent Linear Switch',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Digital Alliance',
    price: 30000,
    stock: 600,
    weight: generateWeight(4, 6),
    dimensions: generateDimensions(),
    images: [
      'https://img.digitalalliance.com/da-silent-1.jpg',
      'https://img.digitalalliance.com/da-silent-2.jpg'
    ],
    description: 'Switch linear silent dengan gaya tekan yang sangat halus dan stabil.',
    specs: {
      type: 'Silent',
      actuationForce: '62g',
      travelDistance: '3.8mm',
      lifespan: '70 million clicks',
      pinType: '5-pin',
      housingMaterial: 'PC',
      stemMaterial: 'POM',
      noiseLevel: 'Reduced by 35%'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '1 year'
  }
];

// ==================== ACCESSORIES ====================

// Cables
const cables = [
  {
    name: 'Noir Custom Coiled Cable',
    category: 'Accessories',
    subCategory: 'Cable',
    brand: 'Noir',
    price: 299000,
    stock: 50,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/cable-1.jpg',
      'https://img.noir.com/cable-2.jpg'
    ],
    description: 'Kabel custom coiled premium dengan berbagai pilihan warna dan connector.',
    specs: {
      type: 'Cable',
      material: 'Braided nylon',
      length: '150cm',
      connector: 'USB-C to USB-A',
      compatibility: 'Most mechanical keyboards',
      colorOptions: ['Black', 'White', 'Red', 'Blue']
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  },
  {
    name: 'Ajazz Aviator Cable',
    category: 'Accessories',
    subCategory: 'Cable',
    brand: 'Ajazz',
    price: 249000,
    stock: 40,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/cable-1.jpg',
      'https://img.ajazz.com/cable-2.jpg'
    ],
    description: 'Kabel mechanical keyboard dengan connector aviator yang stylish.',
    specs: {
      type: 'Cable',
      material: 'Braided paracord',
      length: '180cm',
      connector: 'USB-C to USB-A with aviator',
      compatibility: 'Most mechanical keyboards',
      colorOptions: ['Black', 'White']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  }
];

// Keycaps
const keycaps = [
  {
    name: 'Noir PBT Double-Shot Keycaps',
    category: 'Accessories',
    subCategory: 'Keycap',
    brand: 'Noir',
    price: 499000,
    stock: 30,
    weight: generateWeight(200, 300),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/keycap-1.jpg',
      'https://img.noir.com/keycap-2.jpg'
    ],
    description: 'Set keycaps PBT double-shot dengan kualitas tinggi dan berbagai pilihan warna.',
    specs: {
      type: 'Keycap',
      material: 'PBT',
      profile: 'Cherry',
      compatibility: 'MX-style switches',
      keyCount: '144 keys',
      colorOptions: ['Black', 'White', 'Gray']
    },
    isFeatured: true,
    isNewRelease: true,
    discount: 0,
    warranty: '6 months'
  },
  {
    name: 'Ajazz ABS Dye-Sub Keycaps',
    category: 'Accessories',
    subCategory: 'Keycap',
    brand: 'Ajazz',
    price: 399000,
    stock: 35,
    weight: generateWeight(150, 250),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/keycap-1.jpg',
      'https://img.ajazz.com/keycap-2.jpg'
    ],
    description: 'Set keycaps ABS dengan dye-sublimation printing untuk ketahanan tinggi.',
    specs: {
      type: 'Keycap',
      material: 'ABS',
      profile: 'OEM',
      compatibility: 'MX-style switches',
      keyCount: '108 keys',
      colorOptions: ['Black', 'White']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  }
];

// Lubes
const lubes = [
  {
    name: 'Noir Switch Lube Kit',
    category: 'Accessories',
    subCategory: 'Lube',
    brand: 'Noir',
    price: 199000,
    stock: 60,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/lube-1.jpg',
      'https://img.noir.com/lube-2.jpg'
    ],
    description: 'Kit lengkap untuk melumasi switch mechanical keyboard, termasuk brush dan aplikator.',
    specs: {
      type: 'Lube',
      material: 'Krytox 205g0',
      quantity: '5ml',
      compatibility: 'All mechanical switches',
      includedTools: ['Brush', 'Applicator']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  },
  {
    name: 'Ajazz Tribosys 3203 Lube',
    category: 'Accessories',
    subCategory: 'Lube',
    brand: 'Ajazz',
    price: 179000,
    stock: 45,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/lube-1.jpg',
      'https://img.ajazz.com/lube-2.jpg'
    ],
    description: 'Lube premium untuk switch mechanical dengan formula khusus untuk tactile feel.',
    specs: {
      type: 'Lube',
      material: 'Tribosys 3203',
      quantity: '3ml',
      compatibility: 'All mechanical switches',
      includedTools: ['Brush']
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  }
];

// Stabilizers
const stabilizers = [
  {
    name: 'Noir Plate-Mount Stabilizers',
    category: 'Accessories',
    subCategory: 'Stabilizer',
    brand: 'Noir',
    price: 149000,
    stock: 40,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/stab-1.jpg',
      'https://img.noir.com/stab-2.jpg'
    ],
    description: 'Stabilizer plate-mount premium untuk keyboard mechanical, sudah dilumasi.',
    specs: {
      type: 'Stabilizer',
      mountType: 'Plate-mount',
      compatibility: 'Most mechanical keyboards',
      preLubed: true,
      color: 'Black'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  },
  {
    name: 'Ajazz Screw-In Stabilizers',
    category: 'Accessories',
    subCategory: 'Stabilizer',
    brand: 'Ajazz',
    price: 199000,
    stock: 30,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/stab-1.jpg',
      'https://img.ajazz.com/stab-2.jpg'
    ],
    description: 'Stabilizer screw-in dengan konstruksi solid untuk mengurangi rattle.',
    specs: {
      type: 'Stabilizer',
      mountType: 'Screw-in',
      compatibility: 'Most mechanical keyboards',
      preLubed: false,
      color: 'Black'
    },
    isFeatured: false,
    isNewRelease: true,
    discount: 0,
    warranty: '6 months'
  }
];

// Toolkits
const toolkits = [
  {
    name: 'Noir Keyboard Maintenance Kit',
    category: 'Accessories',
    subCategory: 'Toolkit',
    brand: 'Noir',
    price: 299000,
    stock: 25,
    weight: generateWeight(200, 300),
    dimensions: generateDimensions(),
    images: [
      'https://img.noir.com/toolkit-1.jpg',
      'https://img.noir.com/toolkit-2.jpg'
    ],
    description: 'Kit lengkap untuk perawatan dan modifikasi keyboard mechanical.',
    specs: {
      type: 'Toolkit',
      includedTools: [
        'Switch puller',
        'Keycap puller',
        'Stabilizer tool',
        'Brush set',
        'Tweezer'
      ],
      compatibility: 'Most mechanical keyboards'
    },
    isFeatured: true,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  },
  {
    name: 'Ajazz Basic Keyboard Toolset',
    category: 'Accessories',
    subCategory: 'Toolkit',
    brand: 'Ajazz',
    price: 199000,
    stock: 35,
    weight: generateWeight(150, 250),
    dimensions: generateDimensions(),
    images: [
      'https://img.ajazz.com/toolkit-1.jpg',
      'https://img.ajazz.com/toolkit-2.jpg'
    ],
    description: 'Set alat dasar untuk perawatan keyboard mechanical sehari-hari.',
    specs: {
      type: 'Toolkit',
      includedTools: [
        'Switch puller',
        'Keycap puller',
        'Brush'
      ],
      compatibility: 'Most mechanical keyboards'
    },
    isFeatured: false,
    isNewRelease: false,
    discount: 0,
    warranty: '6 months'
  }
];

// ==================== COMBINE ALL PRODUCTS ====================

const allProducts = [
  ...mechanicalKeyboards,
  ...membraneKeyboards,
  ...opticalKeyboards,
  ...magneticKeyboards,
  ...gamingMice,
  ...officeMice,
  ...wirelessMice,
  ...ergonomicMice,
  ...hardMousepads,
  ...softMousepads,
  ...rgbMousepads,
  ...extendedMousepads,
  ...gamingHeadsets,
  ...musicHeadsets,
  ...wirelessHeadsets,
  ...noiseCancellingHeadsets,
  ...linearSwitches,
  ...tactileSwitches,
  ...clickySwitches,
  ...silentSwitches,
  ...cables,
  ...keycaps,
  ...lubes,
  ...stabilizers,
  ...toolkits
];

// Process all products to add required fields
allProducts.forEach(product => {
  product.productId = generateProductId(product.category);
  product.slug = slugify(product.name, { lower: true, strict: true });
  product.sku = generateSKU(product.category);
  product.thumbnail = product.images[0];
  product.rating = generateRating();
  product.shortDescription = product.description.substring(0, 150);
  product.metaTitle = product.name;
  product.metaDescription = product.description.substring(0, 160);
  product.tags = [
    product.brand.toLowerCase(),
    product.category.toLowerCase(),
    product.subCategory.toLowerCase(),
    ...product.name.toLowerCase().split(' ')
  ].filter(tag => tag.length > 2);
  
  // Add variants for some products
  if (Math.random() > 0.7) {
    product.variants = [
      {
        color: 'Black',
        image: product.images[0],
        stock: Math.floor(product.stock * 0.6)
      },
      {
        color: 'White',
        image: product.images[1] || product.images[0],
        stock: Math.floor(product.stock * 0.4)
      }
    ];
  }

  // Add cost (70-80% of price)
  product.cost = Math.round(product.price * (0.7 + Math.random() * 0.1));
});

module.exports = allProducts;