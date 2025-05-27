const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

// Helper functions for product data
function generateWeight(min, max) {
  return Math.floor(min + Math.random() * (max - min)) + 'g';
}

function generateDimensions() {
  const width = Math.floor(100 + Math.random() * 300);
  const height = Math.floor(100 + Math.random() * 300);
  const depth = Math.floor(10 + Math.random() * 50);
  return `${width}mm x ${height}mm x ${depth}mm`;
}

function slugifyText(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Fix image path by removing special characters and replacing spaces with hyphens
function fixImagePath(path) {
  if (!path) return path;
  
  // Extract directory and filename
  const lastSlashIndex = path.lastIndexOf('/');
  const directory = path.substring(0, lastSlashIndex + 1);
  const filename = path.substring(lastSlashIndex + 1);
  
  // Remove special characters and replace spaces with hyphens
  const cleanFilename = filename
    .replace(/[:']/g, '') // Remove colons and quotes
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/mian\.png/g, 'main.png'); // Fix typo mian.png to main.png
  
  return directory + cleanFilename;
}

function generateProductId(category) {
  return `PROD-${category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateSKU(category) {
  return `SKU-${category.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateRating() {
  return {
    average: (4 + Math.random()).toFixed(1),
    count: Math.floor(Math.random() * 150) + 10
  };
}

// Define ALLOWED_CATEGORIES for filtering products
const ALLOWED_CATEGORIES = ['Keyboard', 'Mouse', 'Headset', 'Mousepad', 'Switch', 'Accessories'];
const ALLOWED_BRANDS = [
  'Ajazz', 'Aula', 'Rexus', 'Noir', 'Armaggeddon', 'Fantech', 'Digital Alliance',
  'Razer', 'Logitech', 'SteelSeries', 'HyperX', 'Corsair', 'Keychron', 'Royal Kludge',
  'Ducky', 'Varmilo', 'Leopold', 'Glorious', 'Wooting', 'Akko', 'Gateron', 'Kailh',
  'JWK', 'Durock', 'Everglide', 'Outemu', 'Tecware', 'Redragon', 'Bloody', 'Monsgeek',
  'Cherry'
];

// Process all products to add required fields
function enhanceProductData(products) {
  return products.map(product => {
    // Add slug if not present
    if (!product.slug) {
      product.slug = slugifyText(product.name);
    }
    
    // Add product ID and SKU if not present
    if (!product.productId) {
      if (ALLOWED_CATEGORIES.includes(product.category)) {
        product.productId = generateProductId(product.category);
        product.sku = generateSKU(product.category);
      } else {
        product.productId = `PROD-${Math.floor(1000 + Math.random() * 9000)}`;
        product.sku = `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
      }
    }
    
    // Add thumbnail if not present
    if (!product.thumbnail) {
      product.thumbnail = product.images[0];
    }
    
    // Add enhanced rating if not present
    if (!product.rating || typeof product.rating !== 'object') {
      const baseRating = product.rating || generateRating();
      const reviewCount = Math.floor(Math.random() * 50) + 5;
      
      product.rating = {
        average: typeof baseRating === 'number' ? baseRating : parseFloat(baseRating),
        count: reviewCount
      };
    }
    
    // Fix mainImage path
    if (product.mainImage) {
      product.mainImage = fixImagePath(product.mainImage);
    }
    
    // Fix images array
    if (product.images && Array.isArray(product.images)) {
      product.images = product.images.map(img => fixImagePath(img));
    }
    
    // Fix images in variants
    if (product.variants && Array.isArray(product.variants)) {
      product.variants = product.variants.map(variant => {
        if (variant.image) {
          variant.image = fixImagePath(variant.image);
        }
        return variant;
      });
    }
    
    return product;
  });
}

// Definisi semua variabel produk (pindahkan semua definisi produk dari products.js ke sini)

// Definisikan variabel produk di sini, bukan mengimpornya dari app.js
// Inisialisasi variabel produk
let mechanicalKeyboards = [
  // Akko Products
  {
    name: 'Akko 3068B Plus Wireless Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Akko',
    price: 1099000,
    stock: 45,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/Akko 3068B Plus 1.png',
      '/images/products/mechanicalKeyboards/Akko 3068B Plus 2.png',
      '/images/products/mechanicalKeyboards/Akko 3068B Plus 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/Akko 3068B Plus Black:main.png',
    description: '65% mechanical keyboard with Akko CS Jelly Pink/Blue/White switches. Features triple-mode connectivity, RGB lighting, and hot-swappable PCB.',
    specs: {
      switchType: 'Akko CS Jelly Pink/Blue/White',
      layout: '65%',
      connectivity: 'Bluetooth 5.0/2.4GHz/Wired USB-C',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB',
      hotSwappable: true,
      compatibility: ['Windows', 'Mac', 'Android', 'iOS'],
      batteryLife: '200 hours',
      actuationForce: '45g',
      pollingRate: '1000Hz'
    },
    variants: [
      {
        name: 'Akko 3068B Plus Black',
        color: 'Black',
        image: '/images/products/mechanicalKeyboards/Akko 3068B Plus Black.png',
        price: 1099000
      },
      {
        name: 'Akko 3068B Plus White',
        color: 'White',
        image: '/images/products/mechanicalKeyboards/Akko 3068B Plus white.png',
        price: 1099000
      },
      {
        name: 'Akko 3068B Plus Pink',
        color: 'Pink',
        image: '/images/products/mechanicalKeyboards/Akko 3068B Plus pink.png',
        price: 1149000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '1 year',
    rating: {
      average: 4.7,
      count: 128
    },
    reviews: 128
  },
  {
    name: 'Akko MOD 007S V2 Barebones Kit',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Akko',
    price: 2499000,
    stock: 20,
    weight: generateWeight(1500, 2000),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/Akko MOD 007S V2 Barebones Kit 1.png',
      '/images/products/mechanicalKeyboards/Akko MOD 007S V2 Barebones Kit 2.png',
      '/images/products/mechanicalKeyboards/Akko MOD 007S V2 Barebones Kit 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/Akko MOD 007S V2 Barebones Kit:main.png',
    description: 'Premium 75% keyboard kit with aluminum case, gasket mount, and hot-swappable PCB. Features sound-dampening foam and aluminum/PC plate options.',
    specs: {
      layout: '75%',
      connectivity: 'Wired USB-C',
      caseMaterial: 'Aluminium CNC',
      mountingStyle: 'Gasket Mount',
      hotSwappable: true,
      pcbType: 'QMK/VIA Compatible',
      plateOptions: ['Aluminium', 'PC'],
      foamOptions: ['Poron Foam', 'PE Foam'],
      weight: '2kg'
    },
    variants: [
      {
        name: 'Akko MOD 007S V2 Grey',
        color: 'Grey',
        image: '/images/products/mechanicalKeyboards/Akko MOD 007S V2 Barebones Kit gray.png',
        price: 2499000
      },
      {
        name: 'Akko MOD 007S V2 White',
        color: 'White',
        image: '/images/products/mechanicalKeyboards/Akko MOD 007S V2 Barebones Kit white.png',
        price: 2499000
      },
      {
        name: 'Akko MOD 007S V2 Purple',
        color: 'Purple',
        image: '/images/products/mechanicalKeyboards/Akko MOD 007S V2 Barebones Kit purple.png',
        price: 2599000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 year',
    rating: {
      average: 4.9,
      count: 56
    },
    reviews: 56
  },
  
  // Aula Products
  {
    name: 'Aula F87 Pro Mechanical Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Aula',
    price: 899000,
    stock: 35,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/Aula F87 Pro Mechanical Gaming Keyboard 1.png',
      '/images/products/mechanicalKeyboards/Aula F87 Pro Mechanical Gaming Keyboard 2.png',
      '/images/products/mechanicalKeyboards/Aula F87 Pro Mechanical Gaming Keyboard 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/Aula F87 Pro Mechanical Gaming Keyboard:main.png',
    description: 'TKL gaming keyboard with Aula Mechanical Switches and RGB lighting. Features hot-swappable switches and N-key rollover for competitive gaming.',
    specs: {
      switchType: 'Aula Red/Blue/Brown',
      layout: 'TKL',
      connectivity: 'Wired USB-C',
      keycaps: 'ABS Double-Shot',
      backlight: 'RGB',
      hotSwappable: true,
      nKeyRollover: true,
      pollingRate: '1000Hz'
    },
    variants: [
      {
        name: 'Aula F87 Pro Smoke Blue',
        color: 'Smoke Blue',
        switchType: 'Red',
        image: '/images/products/mechanicalKeyboards/Aula F87 Pro Mechanical Gaming Keyboard blue smoke.png',
        price: 899000
      },
      {
        name: 'Aula F87 Pro White Green',
        color: 'White Green',
        switchType: 'Blue',
        image: '/images/products/mechanicalKeyboards/Aula F87 Pro Mechanical Gaming Keyboad white green.png',
        price: 899000
      },
      {
        name: 'Aula F87 Pro Black Grey (side-printed)',
        color: 'Black Grey',
        switchType: 'Brown',
        image: '/images/products/mechanicalKeyboards/Aula F87 Pro Mechanical Gaming Keyboard black grey (side-printed).png',
        price: 929000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 15,
    warranty: '1 year',
    rating: {
      average: 4.5,
      count: 87
    },
    reviews: 87
  },
  
  // Ajazz Products
  {
    name: 'Ajazz AK816 Pro Wireless Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Ajazz',
    price: 799000,
    stock: 40,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/Ajazz AK816 Pro Wireless Mechanical Keyboard 1.png',
      '/images/products/mechanicalKeyboards/Ajazz AK816 Pro Wireless Mechanical Keyboard 2.png',
      '/images/products/mechanicalKeyboards/Ajazz AK816 Pro Wireless Mechanical Keyboard 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/Ajazz AK816 Pro Wireless Mechanical Keyboard:main.png',
    description: '75% mechanical keyboard with wireless connectivity and RGB lighting. Equipped with durable and responsive Ajazz switches.',
    specs: {
      switchType: 'Compatible with 3 and 5 PIN',
      layout: '75%',
      connectivity: 'Bluetooth 5.0/2.4GHz/Wired',
      keycaps: 'ABS Double-Shot',
      backlight: 'RGB',
      batteryLife: '180 hours',
      compatibility: ['Windows', 'Mac', 'Android']
    },
    variants: [
      {
        name: 'Ajazz AK816 Pro Black',
        color: 'Black',
        image: '/images/products/mechanicalKeyboards/Ajazz AK816 Pro Wireless Mechanical Keyboard black.png',
        price: 799000
      },
      {
        name: 'Ajazz AK816 Pro White',
        color: 'White',
        image: '/images/products/mechanicalKeyboards/Ajazz AK816 Pro Wireless Mechanical Keyboard white.png',
        price: 799000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '1 year',
    rating: {
      average: 4.4,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'Ajazz K870T Bluetooth Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Ajazz',
    price: 699000,
    stock: 30,
    weight: generateWeight(600, 800),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/\'Ajazz K870T Bluetooth Mechanical Keyboard 1.png',
      '/images/products/mechanicalKeyboards/\'Ajazz K870T Bluetooth Mechanical Keyboard 2.png',
      '/images/products/mechanicalKeyboards/\'Ajazz K870T Bluetooth Mechanical Keyboard 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/\'Ajazz K870T Bluetooth Mechanical Keyboard:main.png',
    description: 'TKL mechanical keyboard with Bluetooth and wired connectivity. Equipped with Ajazz switches and customizable RGB backlight.',
    specs: {
      switchType: 'Ajazz Blue/Brown/Red',
      layout: 'TKL',
      connectivity: 'Bluetooth 5.0/Wired',
      keycaps: 'ABS Double-Shot',
      backlight: 'RGB',
      batteryLife: '200 hours',
      compatibility: ['Windows', 'Mac', 'Android', 'iOS']
    },
    variants: [
      {
        name: 'Ajazz K870T Black (Blue Switch)',
        color: 'Black',
        switchType: 'Blue',
        image: '/images/products/mechanicalKeyboards/\'Ajazz K870T Bluetooth Mechanical Keyboard black (black switch).png',
        price: 699000
      },
      {
        name: 'Ajazz K870T White (Brown Switch)',
        color: 'White',
        switchType: 'Brown',
        image: '/images/products/mechanicalKeyboards/\'Ajazz K870T Bluetooth Mechanical white (brown switch).png',
        price: 699000
      },
      {
        name: 'Ajazz K870T Black (Red Switch)',
        color: 'Black',
        switchType: 'Red',
        image: '/images/products/mechanicalKeyboards/\'Ajazz K870T Bluetooth Mechanical Keyboard black (red switch).png',
        price: 699000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 15,
    warranty: '1 year',
    rating: {
      average: 4.3,
      count: 72
    },
    reviews: 72
  },
  
  // Keychron Products
  {
    name: 'Keychron K8 Pro Wireless Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Keychron',
    price: 1299000,
    stock: 25,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/Keychron K8 Pro Wireless Mechanical Keyboard 1.png',
      '/images/products/mechanicalKeyboards/Keychron K8 Pro Wireless Mechanical Keyboard 2.png',
      '/images/products/mechanicalKeyboards/Keychron K8 Pro Wireless Mechanical Keyboard 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/Keychron K8 Pro Wireless Mechanical Keyboard:main.png',
    description: 'TKL hot-swappable mechanical keyboard with QMK/VIA support. Features Bluetooth 5.1 and wired connectivity, RGB backlight, and Gateron G Pro switches.',
    specs: {
      switchType: 'Gateron G Pro Red/Brown/Yellow',
      layout: 'TKL',
      connectivity: 'Bluetooth 5.1/Wired USB-C',
      keycaps: 'PBT Double-Shot OSA Profile',
      backlight: 'RGB',
      hotSwappable: true,
      compatibility: ['Windows', 'Mac', 'Linux'],
      batteryLife: '240 hours',
      programmable: 'QMK/VIA',
      nKeyRollover: true
    },
    variants: [
      {
        name: 'Keychron K8 Pro Black (Red Switch)',
        color: 'Black',
        switchType: 'Red',
        image: '/images/products/mechanicalKeyboards/Keychron K8 Pro Wireless Mechanical Keyboard black (red switch.png',
        price: 1299000
      },
      {
        name: 'Keychron K8 Pro White (Brown Switch)',
        color: 'White',
        switchType: 'Brown',
        image: '/images/products/mechanicalKeyboards/Keychron K8 Pro Wireless Mechanical Keyboard white (brown switch).png',
        price: 1299000
      },
      {
        name: 'Keychron K8 Pro Black (Yellow Switch)',
        color: 'Black',
        switchType: 'Yellow',
        image: '/images/products/mechanicalKeyboards/Keychron K8 Pro Wireless Mechanical Keyboard (yellow switch).png',
        price: 1329000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 5,
    warranty: '1 year',
    rating: {
      average: 4.8,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Keychron Q1 QMK Custom Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Keychron',
    price: 2199000,
    stock: 15,
    weight: generateWeight(1500, 1800),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/Keychron Q1 QMK Custom Mechanical Keyboard 1.png',
      '/images/products/mechanicalKeyboards/Keychron Q1 QMK Custom Mechanical Keyboard 2.png',
      '/images/products/mechanicalKeyboards/Keychron Q1 QMK Custom Mechanical Keyboard 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/Keychron Q1 QMK Custom Mechanical Keyboard:main.png',
    description: 'Premium 75% gasket-mounted mechanical keyboard with full QMK/VIA programmability. Features CNC aluminum case, hot-swappable PCB, and screw-in stabilizers.',
    specs: {
      switchType: 'Gateron G Pro Red/Blue/Brown',
      layout: '75%',
      connectivity: 'Wired USB-C',
      keycaps: 'PBT Double-Shot',
      caseMaterial: 'CNC Aluminum',
      mountingStyle: 'Gasket Mount',
      hotSwappable: true,
      programmable: 'QMK/VIA',
      plateOptions: 'Steel/PC/FR4',
      weight: '1.6kg'
    },
    variants: [
      {
        name: 'Keychron Q1 Black',
        color: 'Black',
        image: '/images/products/mechanicalKeyboards/Keychron Q1 QMK Custom Mechanical Keyboard black.png',
        price: 2199000
      },
      {
        name: 'Keychron Q1 Navy Blue',
        color: 'Navy Blue',
        image: '/images/products/mechanicalKeyboards/Keychron Q1 QMK Custom Mechanical Keyboard navy blue.png',
        price: 2199000
      },
      {
        name: 'Keychron Q1 Silver Grey',
        color: 'Silver Grey',
        image: '/images/products/mechanicalKeyboards/Keychron Q1 QMK Custom Mechanical Keyboard silver grey.png',
        price: 2199000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 year',
    rating: {
      average: 4.9,
      count: 48
    },
    reviews: 48
  },
  
  // Logitech Products
  {
    name: 'Logitech G Pro X Mechanical Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Logitech',
    price: 1899000,
    stock: 30,
    weight: generateWeight(900, 1100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/Logitech G Pro X Mechanical Gaming Keyboard 1.png',
      '/images/products/mechanicalKeyboards/Logitech G Pro X Mechanical Gaming Keyboard 2.png',
      '/images/products/mechanicalKeyboards/Logitech G Pro X Mechanical Gaming Keyboard 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/Logitech G Pro X Mechanical Gaming Keyboard:main.png',
    description: 'Tournament-grade tenkeyless mechanical gaming keyboard with swappable GX switches. Features RGB lighting, detachable cable, and compact design for professional esports players.',
    specs: {
      switchType: 'GX Blue Clicky/Brown Tactile/Red Linear',
      layout: 'TKL',
      connectivity: 'Wired USB-C (Detachable)',
      keycaps: 'ABS Double-Shot',
      backlight: 'RGB LIGHTSYNC',
      programmable: 'Logitech G HUB',
      pollingRate: '1000Hz',
      nKeyRollover: true,
      dimensions: '361.5 x 153 x 34 mm',
      weight: '980g'
    },
    variants: [
      {
        name: 'Logitech G Pro X (GX Blue Clicky)',
        color: 'Black',
        switchType: 'GX Blue Clicky',
        image: '/images/products/mechanicalKeyboards/Logitech G Pro X Mechanical Gaming Keyboard (GX Blue Clicky).png',
        price: 1899000
      },
      {
        name: 'Logitech G Pro X (GX Brown Tactile)',
        color: 'Black',
        switchType: 'GX Brown Tactile',
        image: '/images/products/mechanicalKeyboards/Logitech G Pro X Mechanical Gaming Keyboard (GX Brown Tactile).png',
        price: 1899000
      },
      {
        name: 'Logitech G Pro X (GX Red Linear)',
        color: 'Black',
        switchType: 'GX Red Linear',
        image: '/images/products/mechanicalKeyboards/Logitech G Pro X Mechanical Gaming Keyboard (GX Red Linear).png',
        price: 1899000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 years',
    rating: {
      average: 4.7,
      count: 120
    },
    reviews: 120
  },
  
  // Monsgeek Products
  {
    name: 'Monsgeek M1W Wireless Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Monsgeek',
    price: 1499000,
    stock: 20,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/Monsgeek M1W Wireless Mechanical Keyboard 1.png',
      '/images/products/mechanicalKeyboards/Monsgeek M1W Wireless Mechanical Keyboard 2.png',
      '/images/products/mechanicalKeyboards/Monsgeek M1W Wireless Mechanical Keyboard 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/Monsgeek M1W Wireless Mechanical Keyboard:main.png',
    description: '75% wireless mechanical keyboard with gasket mount design. Features hot-swappable PCB, QMK/VIA support, and triple-mode connectivity.',
    specs: {
      switchType: 'Gateron G Pro/TTC',
      layout: '75%',
      connectivity: 'Bluetooth 5.0/2.4GHz/Wired USB-C',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB',
      hotSwappable: true,
      programmable: 'QMK/VIA',
      mountingStyle: 'Gasket Mount',
      batteryLife: '200 hours',
      compatibility: ['Windows', 'Mac', 'Linux']
    },
    variants: [
      {
        name: 'Monsgeek M1W Black SP',
        color: 'Black',
        switchType: 'SP Switch',
        image: '/images/products/mechanicalKeyboards/Monsgeek M1W Wireless Mechanical Keyboard black SP.png',
        price: 1499000
      },
      {
        name: 'Monsgeek M1W Silver TP',
        color: 'Silver',
        switchType: 'TP Switch',
        image: '/images/products/mechanicalKeyboards/Monsgeek M1W Wireless Mechanical Keyboard silver TP.png',
        price: 1499000
      },
      {
        name: 'Monsgeek M1W White TP',
        color: 'White',
        switchType: 'TP Switch',
        image: '/images/products/mechanicalKeyboards/Monsgeek M1W Wireless Mechanical Keyboard white TP.png',
        price: 1499000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 5,
    warranty: '1 year',
    rating: {
      average: 4.6,
      count: 42
    },
    reviews: 42
  },
  
  // Royal Kludge Products
  {
    name: 'Royal Kludge RK84 Pro Wireless Mechanical Keyboard',
    category: 'Keyboard',
    subCategory: 'Mechanical',
    brand: 'Royal Kludge',
    price: 999000,
    stock: 35,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      '/images/products/mechanicalKeyboards/Royal Kludge RK84 Pro Wireless Mechanical Keyboard 1.png',
      '/images/products/mechanicalKeyboards/Royal Kludge RK84 Pro Wireless Mechanical Keyboard 2.png',
      '/images/products/mechanicalKeyboards/Royal Kludge RK84 Pro Wireless Mechanical Keyboard 3.png'
    ],
    mainImage: '/images/products/mechanicalKeyboards/Royal Kludge RK84 Pro Wireless Mechanical Keyboard:main.png',
    description: '75% wireless mechanical keyboard with hot-swappable switches. Features triple-mode connectivity, RGB lighting, and compact layout with arrow keys and function row.',
    specs: {
      switchType: 'RK Brown/Red/Blue',
      layout: '75%',
      connectivity: 'Bluetooth 5.0/2.4GHz/Wired USB-C',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB',
      hotSwappable: true,
      batteryLife: '240 hours',
      compatibility: ['Windows', 'Mac', 'Android'],
      nKeyRollover: true
    },
    variants: [
      {
        name: 'Royal Kludge RK84 Pro Black (RK Brown)',
        color: 'Black',
        switchType: 'RK Brown',
        image: '/images/products/mechanicalKeyboards/Royal Kludge RK84 Pro Wireless Mechanical Keyboard Black (RK Brown).png',
        price: 999000
      },
      {
        name: 'Royal Kludge RK84 Pro White (RK Brown)',
        color: 'White',
        switchType: 'RK Brown',
        image: '/images/products/mechanicalKeyboards/Royal Kludge RK84 Pro Wireless Mechanical Keyboard white (RK Brown).png',
        price: 999000
      },
      {
        name: 'Royal Kludge RK84 Pro White (RK Red)',
        color: 'White',
        switchType: 'RK Red',
        image: '/images/products/mechanicalKeyboards/Royal Kludge RK84 Pro Wireless Mechanical Keyboard white (RK Red).png',
        price: 999000
      }
    ],
    isFeatured: false,
    isNewRelease: true,
    isBestSeller: true,
    discount: 15,
    warranty: '1 year',
    rating: {
      average: 4.5,
      count: 78
    },
    reviews: 78
  }
];

// Membrane Keyboards
let membraneKeyboards = [
  {
    name: 'Corsair K55 RGB Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Corsair',
    price: 599000,
    stock: 50,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MembraneKeyboards/Corsair K55 RGB Gaming Keyboard 1.png',
      '/images/products/MembraneKeyboards/Corsair K55 RGB Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/MembraneKeyboards/Corsair K55 RGB Gaming Keyboard:main.png',
    description: 'Keyboard gaming membrane dengan 6 tombol makro yang dapat diprogram dan pencahayaan RGB dinamis. Dilengkapi dengan kontrol multimedia khusus dan sandaran tangan yang dapat dilepas.',
    specs: {
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'ABS',
      backlight: 'RGB 3-zone',
      macroKeys: 6,
      multimediaKeys: true,
      compatibility: ['Windows'],
      pollingRate: '1000Hz',
      keyLifespan: '20 juta ketukan',
      software: 'Corsair iCUE'
    },
    variants: [
      {
        name: 'Corsair K55 RGB Black',
        color: 'Black',
        image: '/images/products/MembraneKeyboards/Corsair K55 RGB Gaming Keyboard black.png',
        price: 599000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.5,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Razer Cynosa Lite Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Razer',
    price: 499000,
    stock: 45,
    weight: generateWeight(600, 800),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MembraneKeyboards/Razer Cynosa Lite Gaming Keyboard 1.png',
      '/images/products/MembraneKeyboards/Razer Cynosa Lite Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/MembraneKeyboards/Razer Cynosa Lite Gaming Keyboard:main.png',
    description: 'Keyboard gaming membrane entry-level dengan pencahayaan RGB tunggal. Desain tahan cipratan dan tombol yang responsif untuk pengalaman gaming yang menyenangkan.',
    specs: {
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'ABS',
      backlight: 'Single-zone RGB',
      spillResistant: true,
      compatibility: ['Windows'],
      pollingRate: '1000Hz',
      keyLifespan: '10 juta ketukan',
      software: 'Razer Synapse 3'
    },
    variants: [
      {
        name: 'Razer Cynosa Lite Black',
        color: 'Black',
        image: '/images/products/MembraneKeyboards/Razer Cynosa Lite Gaming Keyboard black.png',
        price: 499000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: false,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.2,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Razer Ornata V2 Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Razer',
    price: 1299000,
    stock: 30,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MembraneKeyboards/Razer Ornata V2 Gaming Keyboard 1.png',
      '/images/products/MembraneKeyboards/Razer Ornata V2 Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/MembraneKeyboards/Razer Ornata V2 Gaming Keyboard:main.png',
    description: 'Keyboard hybrid mecha-membrane premium dengan teknologi Razer Hybrid Switches. Dilengkapi dengan roda digital multi-fungsi, tombol media khusus, dan sandaran tangan ergonomis magnetik.',
    specs: {
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'ABS Double-Shot',
      backlight: 'Razer Chroma RGB (per-key)',
      switchType: 'Razer Mecha-Membrane',
      multimediaControls: true,
      digitalScrollWheel: true,
      compatibility: ['Windows'],
      pollingRate: '1000Hz',
      keyLifespan: '80 juta ketukan',
      software: 'Razer Synapse 3'
    },
    variants: [
      {
        name: 'Razer Ornata V2 Black',
        color: 'Black',
        image: '/images/products/MembraneKeyboards/Razer Ornata V2 Gaming Keyboard black.png',
        price: 1299000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 110
    },
    reviews: 110
  },
  {
    name: 'Redragon K502 Karura Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Redragon',
    price: 299000,
    stock: 60,
    weight: generateWeight(500, 700),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MembraneKeyboards/Redragon K502 Karura Gaming Keyboard 1.png',
      '/images/products/MembraneKeyboards/Redragon K502 Karura Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/MembraneKeyboards/Redragon K502 Karura Gaming Keyboard:main.png',
    description: 'Keyboard gaming membrane ekonomis dengan pencahayaan LED 7 warna. Desain tahan air dan tombol anti-ghosting untuk pengalaman gaming yang lancar.',
    specs: {
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'ABS',
      backlight: '7-color LED',
      antiGhosting: '25-key rollover',
      waterResistant: true,
      compatibility: ['Windows', 'Mac', 'Linux'],
      keyLifespan: '10 juta ketukan'
    },
    variants: [
      {
        name: 'Redragon K502 Karura Black',
        color: 'Black',
        image: '/images/products/MembraneKeyboards/Redragon K502 Karura Gaming Keyboard black.png',
        price: 299000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.3,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'Redragon K512 Shiva RGB Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'Redragon',
    price: 399000,
    stock: 40,
    weight: generateWeight(600, 800),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MembraneKeyboards/Redragon K512 Shiva RGB Gaming Keyboard 1.png',
      '/images/products/MembraneKeyboards/Redragon K512 Shiva RGB Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/MembraneKeyboards/Redragon K512 Shiva RGB Gaming Keyboard:main.png',
    description: 'Keyboard gaming membrane dengan pencahayaan RGB yang dapat disesuaikan dan tombol multimedia khusus. Dilengkapi dengan sandaran tangan ergonomis dan tombol anti-ghosting.',
    specs: {
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'ABS Double Injection',
      backlight: 'RGB (8 modes)',
      antiGhosting: '26-key rollover',
      multimediaKeys: true,
      compatibility: ['Windows', 'Mac', 'Linux'],
      keyLifespan: '10 juta ketukan'
    },
    variants: [
      {
        name: 'Redragon K512 Shiva Black',
        color: 'Black',
        image: '/images/products/MembraneKeyboards/Redragon K512 Shiva RGB Gaming Keyboard black.png',
        price: 399000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: false,
    discount: 5,
    warranty: '1 tahun',
    rating: {
      average: 4.4,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'SteelSeries Apex 3 Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Membrane',
    brand: 'SteelSeries',
    price: 899000,
    stock: 35,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MembraneKeyboards/SteelSeries Apex 3 Gaming Keyboard 1.png',
      '/images/products/MembraneKeyboards/SteelSeries Apex 3 Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/MembraneKeyboards/SteelSeries Apex 3 Gaming Keyboard:main.png',
    description: 'Keyboard gaming membrane premium dengan teknologi Whisper Quiet untuk pengoperasian yang tenang. Dilengkapi dengan pencahayaan RGB 10-zone, tahan air, dan sandaran tangan magnetik.',
    specs: {
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'ABS Premium',
      backlight: 'RGB 10-zone',
      waterResistant: true,
      compatibility: ['Windows', 'Mac'],
      pollingRate: '1000Hz',
      keyLifespan: '20 juta ketukan',
      software: 'SteelSeries Engine'
    },
    variants: [
      {
        name: 'SteelSeries Apex 3 Black',
        color: 'Black',
        image: '/images/products/MembraneKeyboards/SteelSeries Apex 3 Gaming Keyboard black.png',
        price: 899000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.6,
      count: 95
    },
    reviews: 95
  }
];

// Optical Keyboards
let opticalKeyboards = [
  {
    name: 'Razer Huntsman Elite Optical Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Razer',
    price: 2499000,
    stock: 25,
    weight: generateWeight(1000, 1200),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OpticalKeyboards/Razer Huntsman Elite Optical Gaming Keyboard 1.png',
      '/images/products/OpticalKeyboards/Razer Huntsman Elite Optical Gaming Keyboard 2.png',
      '/images/products/OpticalKeyboards/Razer Huntsman Elite Optical Gaming Keyboard 3.png'
    ],
    mainImage: '/images/products/OpticalKeyboards/Razer Huntsman Elite Optical Gaming Keyboard:main.png',
    description: 'Keyboard gaming premium dengan teknologi Razer Optical Switch untuk kecepatan aktuasi yang tak tertandingi. Dilengkapi dengan sandaran tangan ergonomis, dial multi-fungsi, dan pencahayaan Chroma RGB yang dapat disesuaikan.',
    specs: {
      switchType: 'Razer Optical Switch (Clicky/Linear)',
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'Doubleshot ABS',
      backlight: 'Razer Chroma RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: '1.5mm',
      actuationForce: '45g',
      mediaControls: true,
      passthrough: 'USB 2.0',
      onboardMemory: '5 profiles',
      software: 'Razer Synapse 3'
    },
    variants: [
      {
        name: 'Razer Huntsman Elite (Clicky Optical)',
        color: 'Black',
        switchType: 'Clicky Optical',
        image: '/images/products/OpticalKeyboards/Razer Huntsman Elite Optical Gaming Keyboard (Clicky Optical).png',
        price: 2499000
      },
      {
        name: 'Razer Huntsman Elite (Linear Optical)',
        color: 'Black',
        switchType: 'Linear Optical',
        image: '/images/products/OpticalKeyboards/Salinan Razer Huntsman Elite Optical Gaming Keyboard (Linear Optical).png',
        price: 2599000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Razer Huntsman Mini Optical Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Razer',
    price: 1699000,
    stock: 35,
    weight: generateWeight(600, 800),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OpticalKeyboards/Razer Huntsman Mini Optical Gaming Keyboard 1.png',
      '/images/products/OpticalKeyboards/Razer Huntsman Mini Optical Gaming Keyboard 2.png',
      '/images/products/OpticalKeyboards/Razer Huntsman Mini Optical Gaming Keyboard 3.png'
    ],
    mainImage: '/images/products/OpticalKeyboards/Razer Huntsman Mini Optical Gaming Keyboard:main.png',
    description: 'Keyboard gaming 60% dengan teknologi Razer Optical Switch untuk kecepatan aktuasi yang luar biasa. Desain kompak yang ideal untuk setup gaming minimalis atau untuk dibawa bepergian.',
    specs: {
      switchType: 'Razer Optical Switch (Clicky/Linear)',
      layout: '60%',
      connectivity: 'Wired USB-C (Detachable)',
      keycaps: 'PBT Doubleshot',
      backlight: 'Razer Chroma RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: '1.5mm',
      actuationForce: '45g',
      onboardMemory: 'Hybrid',
      software: 'Razer Synapse 3'
    },
    variants: [
      {
        name: 'Razer Huntsman Mini (Clicky Optical)',
        color: 'Black',
        switchType: 'Clicky Optical',
        image: '/images/products/OpticalKeyboards/Salinan Razer Huntsman Mini Optical Gaming Keyboard (Clicky Optical).png',
        price: 1699000
      },
      {
        name: 'Razer Huntsman Mini (Linear Optical)',
        color: 'White',
        switchType: 'Linear Optical',
        image: '/images/products/OpticalKeyboards/Salinan Razer Huntsman Mini Optical Gaming Keyboard (Linear Optical)png.png',
        price: 1799000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'SteelSeries Apex Pro Optical Magnetic Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'SteelSeries',
    price: 2899000,
    stock: 20,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OpticalKeyboards/SteelSeries Apex Pro Optical Magnetic Keyboard 1.png',
      '/images/products/OpticalKeyboards/SteelSeries Apex Pro Optical Magnetic Keyboard 2.png'
    ],
    mainImage: '/images/products/OpticalKeyboards/SteelSeries Apex Pro Optical Magnetic Keyboard:main.png',
    description: 'Keyboard gaming premium dengan teknologi OmniPoint Adjustable Switch yang memungkinkan pengguna menyesuaikan titik aktuasi setiap tombol. Dilengkapi dengan display OLED yang dapat disesuaikan dan sandaran tangan magnetik premium.',
    specs: {
      switchType: 'OmniPoint Adjustable Optical Magnetic',
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: 'Adjustable (0.4mm - 3.6mm)',
      actuationForce: '45g',
      mediaControls: true,
      oledDisplay: true,
      passthrough: 'USB 2.0',
      software: 'SteelSeries Engine'
    },
    variants: [
      {
        name: 'SteelSeries Apex Pro',
        color: 'Black',
        image: '/images/products/OpticalKeyboards/SteelSeries Apex Pro Optical Magnetic Keyboard.png',
        price: 2899000
      },
      {
        name: 'SteelSeries Apex Pro TKL',
        color: 'Black',
        layout: 'TKL',
        image: '/images/products/OpticalKeyboards/SteelSeries Apex Pro Optical Magnetic Keyboard TKL.png',
        price: 2699000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 75
    },
    reviews: 75
  },
  {
    name: 'Bloody B975 Light Strike Optical Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Bloody',
    price: 1499000,
    stock: 30,
    weight: generateWeight(900, 1100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OpticalKeyboards/Bloody B975 Light Strike Optical Gaming Keyboard 1.png',
      '/images/products/OpticalKeyboards/Bloody B975 Light Strike Optical Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/OpticalKeyboards/Bloody B975 Light Strike Optical Gaming Keyboard:mian.png',
    description: 'Keyboard gaming full-size dengan teknologi Light Strike Optical Switch untuk respons yang cepat dan tahan lama. Dilengkapi dengan pencahayaan RGB yang dapat disesuaikan dan kerangka aluminium premium.',
    specs: {
      switchType: 'Light Strike Optical Switch (Orange/Brown)',
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'Double-Shot ABS',
      backlight: 'RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: '0.2mm',
      actuationForce: '40g',
      keyLifespan: '100 juta ketukan',
      nKeyRollover: true,
      software: 'Bloody Key Dominator'
    },
    variants: [
      {
        name: 'Bloody B975 (Orange Switch)',
        color: 'Black',
        switchType: 'Orange (Linear)',
        image: '/images/products/OpticalKeyboards/Bloody B975 Light Strike Optical Gaming Keyboard (Orange Switch).png',
        price: 1499000
      },
      {
        name: 'Bloody B975 (Brown Switch)',
        color: 'Black',
        switchType: 'Brown (Tactile)',
        image: '/images/products/OpticalKeyboards/Bloody B975 Light Strike Optical Gaming Keyboard (Brown Switch).png',
        price: 1499000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 15,
    warranty: '1 tahun',
    rating: {
      average: 4.5,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Bloody B930 Light Strike Optical TKL Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Bloody',
    price: 1299000,
    stock: 35,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OpticalKeyboards/Bloody B930 Light Strike Optical TKL Gaming Keyboard 1.png',
      '/images/products/OpticalKeyboards/Bloody B930 Light Strike Optical TKL Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/OpticalKeyboards/Bloody B930 Light Strike Optical TKL Gaming Keyboard:main.png',
    description: 'Keyboard gaming TKL dengan teknologi Light Strike Optical Switch untuk respons yang cepat dan tahan lama. Desain kompak dengan pencahayaan RGB yang dapat disesuaikan.',
    specs: {
      switchType: 'Light Strike Optical Switch (Orange/Brown)',
      layout: 'TKL',
      connectivity: 'Wired USB',
      keycaps: 'Double-Shot ABS',
      backlight: 'RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: '0.2mm',
      actuationForce: '40g',
      keyLifespan: '100 juta ketukan',
      nKeyRollover: true,
      software: 'Bloody Key Dominator'
    },
    variants: [
      {
        name: 'Bloody B930 (Orange Switch)',
        color: 'Black',
        switchType: 'Orange (Linear)',
        image: '/images/products/OpticalKeyboards/Bloody B930 Light Strike Optical TKL Gaming Keyboard (Orange Switch).png',
        price: 1299000
      },
      {
        name: 'Bloody B930 (Brown Switch)',
        color: 'Black',
        switchType: 'Brown (Tactile)',
        image: '/images/products/OpticalKeyboards/Bloody B930 Light Strike Optical TKL Gaming Keyboard (Brown Switch).png',
        price: 1299000
      }
    ],
    isFeatured: false,
    isNewRelease: true,
    isBestSeller: false,
    discount: 10,
    warranty: '1 tahun',
    rating: {
      average: 4.4,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Corsair K100 RGB Optical-Mechanical Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Corsair',
    price: 2999000,
    stock: 15,
    weight: generateWeight(1200, 1400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OpticalKeyboards/Corsair K100 RGB Optical-Mechanical Gaming Keyboard 1.png',
      '/images/products/OpticalKeyboards/Corsair K100 RGB Optical-Mechanical Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/OpticalKeyboards/Corsair K100 RGB Optical-Mechanical Gaming Keyboard:main.png',
    description: 'Keyboard gaming flagship dari Corsair dengan teknologi Optical-Mechanical Switch untuk performa maksimal. Dilengkapi dengan iCUE Control Wheel, tombol makro khusus, dan pencahayaan RGB 44-zone.',
    specs: {
      switchType: 'OPX Optical-Mechanical/Cherry MX Speed',
      layout: 'Full-size',
      connectivity: 'Wired USB',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB (per-key + 44-zone LightEdge)',
      pollingRate: '4000Hz (Hyper-Polling)',
      actuationPoint: '1.0mm (OPX) / 1.2mm (Cherry MX Speed)',
      actuationForce: '45g',
      mediaControls: true,
      macroKeys: 6,
      passthrough: 'USB 2.0',
      onboardMemory: '8MB',
      software: 'Corsair iCUE'
    },
    variants: [
      {
        name: 'Corsair K100 RGB (OPX Optical)',
        color: 'Black',
        switchType: 'OPX Optical-Mechanical',
        image: '/images/products/OpticalKeyboards/Corsair K100 RGB Optical-Mechanical Gaming Keyboard (OPX Optical).png',
        price: 2999000
      },
      {
        name: 'Corsair K100 RGB (Cherry MX Speed)',
        color: 'Black',
        switchType: 'Cherry MX Speed',
        image: '/images/products/OpticalKeyboards/Corsair K100 RGB Optical-Mechanical Gaming Keyboard (Cherry MX Speed).png',
        price: 3099000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 90
    },
    reviews: 90
  },
  {
    name: 'Wooting 60HE Analog Optical Gaming Keyboard',
    category: 'Keyboard',
    subCategory: 'Optical',
    brand: 'Wooting',
    price: 2599000,
    stock: 10,
    weight: generateWeight(600, 800),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OpticalKeyboards/Wooting 60HE Analog Optical Gaming Keyboard 1.png',
      '/images/products/OpticalKeyboards/Wooting 60HE Analog Optical Gaming Keyboard 2.png'
    ],
    mainImage: '/images/products/OpticalKeyboards/Wooting 60HE Analog Optical Gaming Keyboard:main.png',
    description: 'Keyboard gaming 60% dengan teknologi Hall Effect Analog Optical yang menawarkan input analog presisi tinggi. Fitur Rapid Trigger untuk respons yang lebih cepat dan akurasi yang lebih baik dalam game kompetitif.',
    specs: {
      switchType: 'Lekker Hall Effect Analog Optical',
      layout: '60%',
      connectivity: 'Wired USB-C (Detachable)',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: 'Adjustable (0.1mm - 4.0mm)',
      actuationForce: '40g',
      analogInput: true,
      rapidTrigger: true,
      software: 'Wooting Wootility'
    },
    variants: [
      {
        name: 'Wooting 60HE Black',
        color: 'Black',
        image: '/images/products/OpticalKeyboards/Wooting 60HE Analog Optical Gaming Keyboard black.png',
        price: 2599000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 45
    },
    reviews: 45
  }
];

// Magnetic Keyboards
let magneticKeyboards = [
  {
    name: 'SteelSeries Apex Pro 2 OmniPoint Magnetic Keyboard TKL',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'SteelSeries',
    price: 2799000,
    stock: 25,
    weight: generateWeight(800, 1000),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MagneticKeyboards/SteelSeries Apex Pro 2 OmniPoint Magnetic Keyboard TKL 1.png',
      '/images/products/MagneticKeyboards/SteelSeries Apex Pro 2 OmniPoint Magnetic Keyboard TKL 2.png'
    ],
    mainImage: '/images/products/MagneticKeyboards/SteelSeries Apex Pro 2 OmniPoint Magnetic Keyboard TKL:main.png',
    description: 'Keyboard gaming TKL premium dengan teknologi OmniPoint 2.0 Adjustable Magnetic Switch. Memungkinkan pengguna menyesuaikan titik aktuasi setiap tombol untuk pengalaman gaming yang lebih responsif.',
    specs: {
      switchType: 'OmniPoint 2.0 Adjustable Magnetic',
      layout: 'TKL',
      connectivity: 'Wired USB-C',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: 'Adjustable (0.2mm - 3.8mm)',
      actuationForce: '45g',
      dualActuation: true,
      rapidTrigger: true,
      software: 'SteelSeries GG'
    },
    variants: [
      {
        name: 'SteelSeries Apex Pro 2 TKL Black',
        color: 'Black',
        image: '/images/products/MagneticKeyboards/SteelSeries Apex Pro 2 OmniPoint Magnetic Keyboard TKL.png',
        price: 2799000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: true,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Razer Huntsman V2 Analog Magnetic Keyboard',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'Razer',
    price: 3499000,
    stock: 20,
    weight: generateWeight(1100, 1300),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MagneticKeyboards/Razer Huntsman V2 Analog Magnetic Keyboard 1.png',
      '/images/products/MagneticKeyboards/Razer Huntsman V2 Analog Magnetic Keyboard 2.png'
    ],
    mainImage: '/images/products/MagneticKeyboards/Razer Huntsman V2 Analog Magnetic Keyboard:main.png',
    description: 'Keyboard gaming premium dengan teknologi Razer Analog Optical Switch yang menggunakan sensor magnetik untuk input analog presisi tinggi. Dilengkapi dengan sandaran tangan ergonomis dan pencahayaan Chroma RGB.',
    specs: {
      switchType: 'Razer Analog Optical Magnetic',
      layout: 'Full-size',
      connectivity: 'Wired USB-C',
      keycaps: 'Doubleshot PBT',
      backlight: 'Razer Chroma RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: 'Adjustable (1.5mm - 3.6mm)',
      actuationForce: '45g',
      analogInput: true,
      dualActuation: true,
      mediaControls: true,
      passthrough: 'USB 3.0',
      software: 'Razer Synapse 3'
    },
    variants: [
      {
        name: 'Razer Huntsman V2 Analog',
        color: 'Black',
        image: '/images/products/MagneticKeyboards/Razer Huntsman V2 Analog Magnetic Keyboard.png',
        price: 3499000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Keychron Q1 Pro Hall Effect Magnetic Keyboard',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'Keychron',
    price: 2599000,
    stock: 15,
    weight: generateWeight(1000, 1200),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MagneticKeyboards/Keychron Q1 Pro Hall Effect Magnetic Keyboard 1.png',
      '/images/products/MagneticKeyboards/Keychron Q1 Pro Hall Effect Magnetic Keyboard 2.png'
    ],
    mainImage: '/images/products/MagneticKeyboards/Keychron Q1 Pro Hall Effect Magnetic Keyboard:main.png',
    description: 'Keyboard 75% premium dengan teknologi Hall Effect Magnetic Switch. Fitur gasket mount, case aluminium CNC, dan konektivitas nirkabel untuk pengalaman mengetik yang superior.',
    specs: {
      switchType: 'Hall Effect Magnetic',
      layout: '75%',
      connectivity: 'Bluetooth 5.1/2.4GHz/Wired USB-C',
      keycaps: 'PBT Double-Shot OSA Profile',
      backlight: 'RGB (south-facing)',
      caseMaterial: 'Aluminium CNC',
      mountingStyle: 'Gasket Mount',
      hotSwappable: true,
      batteryLife: '300 hours',
      software: 'VIA/QMK Compatible'
    },
    variants: [
      {
        name: 'Keychron Q1 Pro Carbon Black',
        color: 'Carbon Black',
        image: '/images/products/MagneticKeyboards/Keychron Q1 Pro Hall Effect Magnetic Keyboard carbon black.png',
        price: 2599000
      },
      {
        name: 'Keychron Q1 Pro Shell White',
        color: 'Shell White',
        image: '/images/products/MagneticKeyboards/Keychron Q1 Pro Hall Effect Magnetic Keyboard shell white.png',
        price: 2599000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 55
    },
    reviews: 55
  },
  {
    name: 'Aula Hero 68 HE Magnetic Keyboard',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'Aula',
    price: 1899000,
    stock: 30,
    weight: generateWeight(700, 900),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MagneticKeyboards/Aula Hero 68 HE Magnetic Keyboard 1.png',
      '/images/products/MagneticKeyboards/Aula Hero 68 HE Magnetic Keyboard 2.png',
      '/images/products/MagneticKeyboards/Aula Hero 68 HE Magnetic Keyboard 3.png'
    ],
    mainImage: '/images/products/MagneticKeyboards/Aula Hero 68 HE Magnetic Keyboard:main.png',
    description: 'Keyboard gaming 65% dengan teknologi Hall Effect Magnetic Switch. Menawarkan respons cepat dan umur pakai yang lebih lama dibandingkan switch mekanik konvensional.',
    specs: {
      switchType: 'Hall Effect Magnetic',
      layout: '65%',
      connectivity: 'Wired USB-C (Detachable)',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: '2.0mm',
      actuationForce: '40g',
      hotSwappable: true,
      software: 'Aula Engine'
    },
    variants: [
      {
        name: 'Aula Hero 68 HE Black',
        color: 'Black',
        image: '/images/products/MagneticKeyboards/Aula Hero 68 HE Magnetic Keyboard black.png',
        price: 1899000
      },
      {
        name: 'Aula Hero 68 HE White',
        color: 'White',
        image: '/images/products/MagneticKeyboards/Aula Hero 68 HE Magnetic Keyboard white.png',
        price: 1899000
      }
    ],
    isFeatured: false,
    isNewRelease: true,
    isBestSeller: false,
    discount: 5,
    warranty: '1 tahun',
    rating: {
      average: 4.6,
      count: 40
    },
    reviews: 40
  },
  {
    name: 'Monsgeek Fun 60 Series Magnetic Keyboard',
    category: 'Keyboard',
    subCategory: 'Magnetic',
    brand: 'Monsgeek',
    price: 1999000,
    stock: 25,
    weight: generateWeight(600, 800),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MagneticKeyboards/Monsgeek Fun 60 Series Magnetic Keyboard 1.png',
      '/images/products/MagneticKeyboards/Monsgeek Fun 60 Series Magnetic Keyboard 2.png',
      '/images/products/MagneticKeyboards/Monsgeek Fun 60 Series Magnetic Keyboard 3.png'
    ],
    mainImage: '/images/products/MagneticKeyboards/Monsgeek Fun 60 Series Magnetic Keyboard:main.png',
    description: 'Keyboard 60% kompak dengan teknologi Hall Effect Magnetic Switch. Tersedia dalam beberapa varian dengan fitur yang berbeda untuk memenuhi kebutuhan pengguna.',
    specs: {
      switchType: 'Hall Effect Magnetic',
      layout: '60%',
      connectivity: 'Wired USB-C (Detachable)',
      keycaps: 'PBT Double-Shot',
      backlight: 'RGB (per-key)',
      pollingRate: '1000Hz',
      actuationPoint: 'Adjustable (0.1mm - 4.0mm)',
      actuationForce: '35g',
      hotSwappable: true,
      software: 'Monsgeek Software'
    },
    variants: [
      {
        name: 'Monsgeek Fun 60 Ultra Black',
        color: 'Black',
        image: '/images/products/MagneticKeyboards/Monsgeek Fun 60 Series Magnetic Keyboard black ultra.png',
        price: 1999000
      },
      {
        name: 'Monsgeek Fun 60 Pro Black',
        color: 'Black',
        image: '/images/products/MagneticKeyboards/Monsgeek Fun 60 Series Magnetic Keyboard black pro.png',
        price: 2199000
      },
      {
        name: 'Monsgeek Fun 60 Max Black',
        color: 'Black',
        image: '/images/products/MagneticKeyboards/Monsgeek Fun 60 Series Magnetic Keyboard max black.png',
        price: 2399000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 35
    },
    reviews: 35
  }
];


// ==================== MICE ====================

// ... existing code ...

// Gaming Mice
let gamingMice = [
  {
    name: 'Logitech G Pro X Superlight Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Logitech',
    price: 1899000,
    stock: 30,
    weight: generateWeight(60, 70),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/Logitech G Pro X Superlight Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/Logitech G Pro X Superlight Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/Logitech G Pro X Superlight Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel ultra-ringan dengan sensor HERO 25K untuk performa gaming profesional. Bobot kurang dari 63 gram dan baterai tahan hingga 70 jam.',
    specs: {
      sensor: 'HERO 25K',
      dpi: '25.600',
      pollingRate: '1000Hz',
      buttons: 5,
      weight: '63g',
      connectivity: 'Lightspeed Wireless',
      batteryLife: '70 jam',
      rgb: false,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'Logitech G Pro X Superlight Black',
        color: 'Black',
        image: '/images/products/GamingMice/Logitech G Pro X Superlight Wireless Gaming Mouse black.png',
        price: 1899000
      },
      {
        name: 'Logitech G Pro X Superlight White',
        color: 'White',
        image: '/images/products/GamingMice/Logitech G Pro X Superlight Wireless Gaming Mouse white.png',
        price: 1899000
      },
      {
        name: 'Logitech G Pro X Superlight Pink',
        color: 'Pink',
        image: '/images/products/GamingMice/Logitech G Pro X Superlight Wireless Gaming Mouse pink.png',
        price: 1999000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'Logitech G502 X PLUS Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Logitech',
    price: 2199000,
    stock: 25,
    weight: generateWeight(100, 120),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/Logitech G502 X PLUS Wireless Gaming Mouse\' 1.png',
      '/images/products/GamingMice/Logitech G502 X PLUS Wireless Gaming Mouse\' 2.png'
    ],
    mainImage: '/images/products/GamingMice/Logitech G502 X PLUS Wireless Gaming Mouse\':main.png',
    description: 'Mouse gaming nirkabel dengan teknologi LIGHTFORCE hybrid optical-mechanical switch dan pencahayaan LIGHTSYNC RGB. Dilengkapi dengan 13 tombol yang dapat diprogram dan roda scroll dual-mode.',
    specs: {
      sensor: 'HERO 25K',
      dpi: '25.600',
      pollingRate: '1000Hz',
      buttons: 13,
      weight: '106g',
      connectivity: 'Lightspeed Wireless/Bluetooth',
      batteryLife: '120 jam (tanpa RGB), 37 jam (dengan RGB)',
      rgb: true,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'Logitech G502 X PLUS Black',
        color: 'Black',
        image: '/images/products/GamingMice/Salinan Logitech G502 X PLUS Wireless Gaming Mouse\' black.png',
        price: 2199000
      },
      {
        name: 'Logitech G502 X PLUS White',
        color: 'White',
        image: '/images/products/GamingMice/Logitech G502 X PLUS Wireless Gaming Mouse\' white.png',
        price: 2199000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: true,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Razer Viper V2 Pro Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Razer',
    price: 1999000,
    stock: 20,
    weight: generateWeight(55, 65),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/Razer Viper V2 Pro Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/Razer Viper V2 Pro Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/Razer Viper V2 Pro Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel ultra-ringan dengan sensor Focus Pro 30K untuk performa esports profesional. Bobot hanya 58 gram dan switch optik generasi ke-3 dengan durabilitas hingga 90 juta klik.',
    specs: {
      sensor: 'Focus Pro 30K Optical',
      dpi: '30.000',
      pollingRate: '1000Hz',
      buttons: 5,
      weight: '58g',
      connectivity: 'Razer HyperSpeed Wireless/USB-C',
      batteryLife: '80 jam',
      rgb: false,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'Razer Viper V2 Pro Black',
        color: 'Black',
        image: '/images/products/GamingMice/Salinan Razer Viper V2 Pro Wireless Gaming Mouse black.png',
        price: 1999000
      },
      {
        name: 'Razer Viper V2 Pro White',
        color: 'White',
        image: '/images/products/GamingMice/Razer Viper V2 Pro Wireless Gaming Mouse white.png',
        price: 1999000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 110
    },
    reviews: 110
  },
  {
    name: 'Razer DeathAdder V3 Pro Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Razer',
    price: 2099000,
    stock: 15,
    weight: generateWeight(60, 70),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/Razer DeathAdder V3 Pro Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/Razer DeathAdder V3 Pro Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/Razer DeathAdder V3 Pro Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel ergonomis dengan sensor Focus Pro 30K dan teknologi HyperSpeed Wireless. Bobot hanya 63 gram dan switch optik generasi ke-3 dengan durabilitas hingga 90 juta klik.',
    specs: {
      sensor: 'Focus Pro 30K Optical',
      dpi: '30.000',
      pollingRate: '1000Hz (4000Hz dengan dongle HyperPolling)',
      buttons: 5,
      weight: '63g',
      connectivity: 'Razer HyperSpeed Wireless/USB-C',
      batteryLife: '90 jam',
      rgb: false,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'Razer DeathAdder V3 Pro Black',
        color: 'Black',
        image: '/images/products/GamingMice/Salinan Razer DeathAdder V3 Pro Wireless Gaming Mouse black.png',
        price: 2099000
      },
      {
        name: 'Razer DeathAdder V3 Pro White',
        color: 'White',
        image: '/images/products/GamingMice/Razer DeathAdder V3 Pro Wireless Gaming Mouse white.png',
        price: 2099000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'Glorious Model O Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Glorious',
    price: 1499000,
    stock: 30,
    weight: generateWeight(65, 75),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/Glorious Model O Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/Glorious Model O Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/Glorious Model O Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel ultra-ringan dengan desain honeycomb dan sensor BAMF. Bobot hanya 69 gram dan dilengkapi dengan kabel pengisi daya Ascended dan kaki mouse G-Skates premium.',
    specs: {
      sensor: 'BAMF Optical',
      dpi: '19.000',
      pollingRate: '1000Hz',
      buttons: 6,
      weight: '69g',
      connectivity: 'Wireless/Wired USB-C',
      batteryLife: '71 jam',
      rgb: true,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'Glorious Model O Wireless Black',
        color: 'Black',
        image: '/images/products/GamingMice/Glorious Model O Wireless Gaming Mouse black.png',
        price: 1499000
      },
      {
        name: 'Glorious Model O Wireless White',
        color: 'White',
        image: '/images/products/GamingMice/Glorious Model O Wireless Gaming Mouse white.png',
        price: 1499000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Glorious Model D Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Glorious',
    price: 1499000,
    stock: 25,
    weight: generateWeight(65, 75),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/Glorious Model D Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/Glorious Model D Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/Glorious Model D Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel ergonomis dengan desain honeycomb dan sensor BAMF. Bobot hanya 69 gram dan dilengkapi dengan kabel pengisi daya Ascended dan kaki mouse G-Skates premium.',
    specs: {
      sensor: 'BAMF Optical',
      dpi: '19.000',
      pollingRate: '1000Hz',
      buttons: 6,
      weight: '69g',
      connectivity: 'Wireless/Wired USB-C',
      batteryLife: '71 jam',
      rgb: true,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'Glorious Model D Wireless Black',
        color: 'Black',
        image: '/images/products/GamingMice/Glorious Model D Wireless Gaming Mouse black.png',
        price: 1499000
      },
      {
        name: 'Glorious Model D Wireless White',
        color: 'White',
        image: '/images/products/GamingMice/Glorious Model D Wireless Gaming Mouse white.png',
        price: 1499000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: false,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 75
    },
    reviews: 75
  },
  {
    name: 'Pulsar Xlite V2 Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Pulsar',
    price: 1399000,
    stock: 20,
    weight: generateWeight(55, 65),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/Pulsar Xlite V2 Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/Pulsar Xlite V2 Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/Pulsar Xlite V2 Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel ultra-ringan dengan desain ergonomis. Bobot hanya 59 gram dan dilengkapi dengan sensor PAW3370 dan switch Kailh 8.0 yang tahan lama.',
    specs: {
      sensor: 'PAW3370 Optical',
      dpi: '20.000',
      pollingRate: '1000Hz',
      buttons: 5,
      weight: '59g',
      connectivity: 'Wireless/Wired USB-C',
      batteryLife: '70 jam',
      rgb: false,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'Pulsar Xlite V2 Black',
        color: 'Black',
        image: '/images/products/GamingMice/Pulsar Xlite V2 Wireless Gaming Mouse:main black.png',
        price: 1399000
      },
      {
        name: 'Pulsar Xlite V2 White',
        color: 'White',
        image: '/images/products/GamingMice/Pulsar Xlite V2 Wireless Gaming Mouse white.png',
        price: 1399000
      },
      {
        name: 'Pulsar Xlite V2 Red',
        color: 'Red',
        image: '/images/products/GamingMice/Pulsar Xlite V2 Wireless Gaming Mouse red.png',
        price: 1449000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'SteelSeries Aerox 3 Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'SteelSeries',
    price: 1599000,
    stock: 25,
    weight: generateWeight(65, 75),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/SteelSeries Aerox 3 Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/SteelSeries Aerox 3 Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/SteelSeries Aerox 3 Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel ultra-ringan dengan desain honeycomb dan sertifikasi tahan air IP54. Bobot hanya 68 gram dan dilengkapi dengan teknologi Quantum 2.0 Wireless dan TrueMove Air Optical Sensor.',
    specs: {
      sensor: 'TrueMove Air Optical',
      dpi: '18.000',
      pollingRate: '1000Hz',
      buttons: 6,
      weight: '68g',
      connectivity: 'Quantum 2.0 Wireless/Bluetooth/Wired USB-C',
      batteryLife: '200 jam',
      rgb: true,
      waterResistant: 'IP54',
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'SteelSeries Aerox 3 Wireless Black',
        color: 'Black',
        image: '/images/products/GamingMice/SteelSeries Aerox 3 Wireless Gaming Mouse black.png',
        price: 1599000
      },
      {
        name: 'SteelSeries Aerox 3 Wireless White',
        color: 'White',
        image: '/images/products/GamingMice/SteelSeries Aerox 3 Wireless Gaming Mouse white.png',
        price: 1599000
      }
    ],
    isFeatured: false,
    isNewRelease: true,
    isBestSeller: false,
    discount: 5,
    warranty: '1 tahun',
    rating: {
      average: 4.6,
      count: 70
    },
    reviews: 70
  },
  {
    name: 'SteelSeries Prime Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'SteelSeries',
    price: 1799000,
    stock: 15,
    weight: generateWeight(75, 85),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/SteelSeries Prime Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/SteelSeries Prime Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/SteelSeries Prime Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel premium dengan Prestige OM (Optical Magnetic) Switch yang dikembangkan bersama atlet esports profesional. Bobot hanya 80 gram dan dilengkapi dengan sensor TrueMove Pro.',
    specs: {
      sensor: 'TrueMove Pro Optical',
      dpi: '18.000',
      pollingRate: '1000Hz',
      buttons: 6,
      weight: '80g',
      connectivity: 'Quantum 2.0 Wireless/Wired USB-C',
      batteryLife: '100 jam',
      rgb: false,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'SteelSeries Prime Wireless Black',
        color: 'Black',
        image: '/images/products/GamingMice/SteelSeries Prime Wireless Gaming Mouse black.png',
        price: 1799000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 55
    },
    reviews: 55
  },
  {
    name: 'Fantech Aria XD7 Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Fantech',
    price: 899000,
    stock: 40,
    weight: generateWeight(55, 65),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/Fantech Aria XD7 Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/Fantech Aria XD7 Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/Fantech Aria XD7 Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel ultra-ringan dengan desain simetris. Bobot hanya 59 gram dan dilengkapi dengan sensor PixArt 3395 dan switch Huano Blue Pink yang tahan lama.',
    specs: {
      sensor: 'PixArt 3395 Optical',
      dpi: '26.000',
      pollingRate: '1000Hz',
      buttons: 6,
      weight: '59g',
      connectivity: 'Wireless 2.4GHz/Wired USB-C',
      batteryLife: '70 jam',
      rgb: true,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'Fantech Aria XD7 Black',
        color: 'Black',
        image: '/images/products/GamingMice/Fantech Aria XD7 Wireless Gaming Mouse:main black.png',
        price: 899000
      },
      {
        name: 'Fantech Aria XD7 White',
        color: 'White',
        image: '/images/products/GamingMice/Fantech Aria XD7 Wireless Gaming Mouse white.png',
        price: 899000
      }
    ],
    isFeatured: false,
    isNewRelease: true,
    isBestSeller: true,
    discount: 10,
    warranty: '1 tahun',
    rating: {
      average: 4.5,
      count: 90
    },
    reviews: 90
  },
  {
    name: 'Fantech Helios XD3 Wireless Gaming Mouse',
    category: 'Mouse',
    subCategory: 'Gaming',
    brand: 'Fantech',
    price: 699000,
    stock: 50,
    weight: generateWeight(65, 75),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingMice/Fantech Helios XD3 Wireless Gaming Mouse 1.png',
      '/images/products/GamingMice/Fantech Helios XD3 Wireless Gaming Mouse 2.png'
    ],
    mainImage: '/images/products/GamingMice/Fantech Helios XD3 Wireless Gaming Mouse:main.png',
    description: 'Mouse gaming nirkabel dengan desain ergonomis. Bobot hanya 74 gram dan dilengkapi dengan sensor PixArt 3370 dan switch Huano yang tahan lama.',
    specs: {
      sensor: 'PixArt 3370 Optical',
      dpi: '16.000',
      pollingRate: '1000Hz',
      buttons: 6,
      weight: '74g',
      connectivity: 'Wireless 2.4GHz/Wired USB-C',
      batteryLife: '80 jam',
      rgb: true,
      compatibility: ['Windows', 'macOS']
    },
    variants: [
      {
        name: 'Fantech Helios XD3 Black',
        color: 'Black',
        image: '/images/products/GamingMice/Fantech Helios XD3 Wireless Gaming Mouse:main black.png',
        price: 699000
      },
      {
        name: 'Fantech Helios XD3 White',
        color: 'White',
        image: '/images/products/GamingMice/Fantech Helios XD3 Wireless Gaming Mouse white.png',
        price: 699000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 15,
    warranty: '1 tahun',
    rating: {
      average: 4.4,
      count: 110
    },
    reviews: 110
  }
];


// ... existing code ...

// Office Mice
let officeMice = [
  {
    name: 'Logitech MX Master 3S Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Logitech',
    price: 1499000,
    stock: 35,
    weight: generateWeight(140, 150),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OfficeMice/Logitech MX Master 3S Wireless Mouse 1.png',
      '/images/products/OfficeMice/Logitech MX Master 3S Wireless Mouse 2.png'
    ],
    mainImage: '/images/products/OfficeMice/Logitech MX Master 3S Wireless Mouse:main.png',
    description: 'Mouse nirkabel premium dengan sensor 8K DPI dan teknologi Quiet Click. Dilengkapi dengan roda scroll MagSpeed elektromagnetik dan dapat digunakan di berbagai permukaan termasuk kaca.',
    specs: {
      sensor: 'Darkfield High Precision',
      dpi: '8.000',
      pollingRate: '125Hz',
      buttons: 7,
      weight: '141g',
      connectivity: 'Bluetooth/Logi Bolt USB Receiver',
      batteryLife: '70 hari',
      rgb: false,
      compatibility: ['Windows', 'macOS', 'Linux', 'iPadOS'],
      scrollTechnology: 'MagSpeed Electromagnetic',
      programmableButtons: true,
      software: 'Logitech Options+'
    },
    variants: [
      {
        name: 'Logitech MX Master 3S Black',
        color: 'Black',
        image: '/images/products/OfficeMice/Logitech MX Master 3S Wireless Mouse black.png',
        price: 1499000
      },
      {
        name: 'Logitech MX Master 3S White',
        color: 'White',
        image: '/images/products/OfficeMice/Logitech MX Master 3S Wireless Mouse white.png',
        price: 1499000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'Dell Premier Rechargeable Mouse - MS700',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Dell',
    price: 899000,
    stock: 40,
    weight: generateWeight(100, 120),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OfficeMice/Dell Premier Rechargeable Mouse - MS700 1.png',
      '/images/products/OfficeMice/Dell Premier Rechargeable Mouse - MS700 2.png'
    ],
    mainImage: '/images/products/OfficeMice/Dell Premier Rechargeable Mouse - MS700:main.png',
    description: 'Mouse nirkabel premium dengan desain ergonomis dan baterai yang dapat diisi ulang. Dilengkapi dengan sensor presisi tinggi dan dapat terhubung hingga 3 perangkat secara bersamaan.',
    specs: {
      sensor: 'Optical',
      dpi: '4.000',
      pollingRate: '125Hz',
      buttons: 7,
      weight: '110g',
      connectivity: 'Bluetooth 5.0/2.4GHz Wireless',
      batteryLife: '6 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS', 'Chrome OS'],
      programmableButtons: true,
      multiDeviceConnection: 3,
      software: 'Dell Peripheral Manager'
    },
    variants: [
      {
        name: 'Dell Premier MS700 Titan Grey',
        color: 'Titan Grey',
        image: '/images/products/OfficeMice/Dell Premier Rechargeable Mouse - MS700 titan grey.png',
        price: 899000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'HP 930 Creator Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'HP',
    price: 799000,
    stock: 30,
    weight: generateWeight(100, 120),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OfficeMice/HP 930 Creator Wireless Mouse 1.png',
      '/images/products/OfficeMice/HP 930 Creator Wireless Mouse 2.png'
    ],
    mainImage: '/images/products/OfficeMice/HP 930 Creator Wireless Mouse:main.png',
    description: 'Mouse nirkabel yang dirancang khusus untuk kreator konten dengan 7 tombol yang dapat diprogram. Dilengkapi dengan roda scroll horizontal dan dapat terhubung hingga 3 perangkat.',
    specs: {
      sensor: 'Optical',
      dpi: '3.000',
      pollingRate: '125Hz',
      buttons: 7,
      weight: '115g',
      connectivity: 'Bluetooth 5.0/2.4GHz Wireless',
      batteryLife: '3 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS'],
      programmableButtons: true,
      multiDeviceConnection: 3,
      horizontalScroll: true,
      software: 'HP Accessory Center'
    },
    variants: [
      {
        name: 'HP 930 Creator Black',
        color: 'Black',
        image: '/images/products/OfficeMice/HP 930 Creator Wireless Mouse black.png',
        price: 799000
      }
    ],
    isFeatured: false,
    isNewRelease: true,
    isBestSeller: false,
    discount: 10,
    warranty: '1 tahun',
    rating: {
      average: 4.5,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Lenovo ThinkPad Professional Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Lenovo',
    price: 599000,
    stock: 45,
    weight: generateWeight(90, 110),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OfficeMice/Lenovo ThinkPad Professional Wireless Mouse 1.png',
      '/images/products/OfficeMice/Lenovo ThinkPad Professional Wireless Mouse 2.png'
    ],
    mainImage: '/images/products/OfficeMice/Lenovo ThinkPad Professional Wireless Mouse:main.png',
    description: 'Mouse nirkabel profesional dengan desain ergonomis dan sensor presisi tinggi. Dilengkapi dengan teknologi hemat energi dan dapat digunakan hingga 12 bulan dengan satu set baterai.',
    specs: {
      sensor: 'Optical',
      dpi: '2.400',
      pollingRate: '125Hz',
      buttons: 4,
      weight: '100g',
      connectivity: '2.4GHz Wireless',
      batteryLife: '12 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS', 'Linux'],
      programmableButtons: false,
      powerSaving: true
    },
    variants: [
      {
        name: 'Lenovo ThinkPad Professional Black',
        color: 'Black',
        image: '/images/products/OfficeMice/Lenovo ThinkPad Professional Wireless Mouse black.png',
        price: 599000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 15,
    warranty: '1 tahun',
    rating: {
      average: 4.6,
      count: 110
    },
    reviews: 110
  },
  {
    name: 'Kensington Pro Fit Ergo Vertical Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Kensington',
    price: 699000,
    stock: 25,
    weight: generateWeight(110, 130),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OfficeMice/Kensington Pro Fit Ergo Vertical Wireless Mouse 1.png',
      '/images/products/OfficeMice/Kensington Pro Fit Ergo Vertical Wireless Mouse 2.png'
    ],
    mainImage: '/images/products/OfficeMice/Kensington Pro Fit Ergo Vertical Wireless Mouse:main.png',
    description: 'Mouse nirkabel ergonomis dengan desain vertikal 60° untuk mengurangi ketegangan pada pergelangan tangan. Dilengkapi dengan sensor presisi tinggi dan tombol DPI yang dapat disesuaikan.',
    specs: {
      sensor: 'Optical',
      dpi: '800/1200/1600/2400',
      pollingRate: '125Hz',
      buttons: 6,
      weight: '120g',
      connectivity: '2.4GHz Wireless',
      batteryLife: '12 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS'],
      programmableButtons: false,
      ergonomicDesign: '60° vertical orientation',
      adjustableDPI: true
    },
    variants: [
      {
        name: 'Kensington Pro Fit Ergo Vertical Black',
        color: 'Black',
        image: '/images/products/OfficeMice/Kensington Pro Fit Ergo Vertical Wireless Mouse black.png',
        price: 699000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 55
    },
    reviews: 55
  },
  {
    name: 'Verbatim Silent Wireless Blue LED Mouse',
    category: 'Mouse',
    subCategory: 'Office',
    brand: 'Verbatim',
    price: 299000,
    stock: 50,
    weight: generateWeight(70, 90),
    dimensions: generateDimensions(),
    images: [
      '/images/products/OfficeMice/erbatim Silent Wireless Blue LED Mouse 1.png',
      '/images/products/OfficeMice/erbatim Silent Wireless Blue LED Mouse 2.png'
    ],
    mainImage: '/images/products/OfficeMice/erbatim Silent Wireless Blue LED Mouse:main.png',
    description: 'Mouse nirkabel dengan teknologi Silent Click untuk penggunaan yang tenang. Dilengkapi dengan sensor Blue LED yang dapat digunakan di berbagai permukaan dan fitur hemat energi.',
    specs: {
      sensor: 'Blue LED',
      dpi: '1600',
      pollingRate: '125Hz',
      buttons: 3,
      weight: '80g',
      connectivity: '2.4GHz Wireless',
      batteryLife: '12 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS'],
      programmableButtons: false,
      silentClick: true,
      powerSaving: true
    },
    variants: [
      {
        name: 'Verbatim Silent Wireless Black',
        color: 'Black',
        image: '/images/products/OfficeMice/erbatim Silent Wireless Blue LED Mouse black .png',
        price: 299000
      },
      {
        name: 'Verbatim Silent Wireless White',
        color: 'White',
        image: '/images/products/OfficeMice/erbatim Silent Wireless Blue LED Mouse:main white.png',
        price: 299000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 20,
    warranty: '1 tahun',
    rating: {
      average: 4.3,
      count: 95
    },
    reviews: 95
  }
];

// ... existing code ...

// Ergonomic Mice
let ergonomicMice = [
  {
    name: 'Logitech MX Vertical Ergonomic Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Logitech',
    price: 1599000,
    stock: 30,
    weight: generateWeight(130, 150),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ErgonomicMice/Logitech MX Vertical Ergonomic Mouse 1.png',
      '/images/products/ErgonomicMice/Logitech MX Vertical Ergonomic Mouse 2.png'
    ],
    mainImage: '/images/products/ErgonomicMice/Logitech MX Vertical Ergonomic Mouse:main.png',
    description: 'Mouse ergonomis dengan desain vertikal 57° yang mengurangi ketegangan otot hingga 10%. Dilengkapi dengan sensor presisi 4000 DPI dan dapat terhubung hingga 3 perangkat secara bersamaan.',
    specs: {
      sensor: 'Darkfield High Precision',
      dpi: '4.000',
      pollingRate: '125Hz',
      buttons: 6,
      weight: '135g',
      connectivity: 'Bluetooth/Logi Bolt USB Receiver/USB-C',
      batteryLife: '4 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS', 'Linux', 'iPadOS'],
      programmableButtons: true,
      software: 'Logitech Options+',
      ergonomicDesign: '57° vertical orientation'
    },
    variants: [
      {
        name: 'Logitech MX Vertical Black',
        color: 'Black',
        image: '/images/products/ErgonomicMice/Logitech MX Vertical Ergonomic Mouse black.png',
        price: 1599000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Logitech Lift Vertical Ergonomic Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Logitech',
    price: 1299000,
    stock: 40,
    weight: generateWeight(120, 140),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ErgonomicMice/Logitech Lift Vertical Ergonomic Mouse 1.png',
      '/images/products/ErgonomicMice/Logitech Lift Vertical Ergonomic Mouse 2.png'
    ],
    mainImage: '/images/products/ErgonomicMice/Logitech Lift Vertical Ergonomic Mouse:main.png',
    description: 'Mouse ergonomis vertikal yang dirancang untuk pengguna dengan tangan berukuran kecil hingga sedang. Desain vertikal 57° mengurangi tekanan pada pergelangan tangan dan dilengkapi dengan SmartWheel untuk scrolling yang presisi.',
    specs: {
      sensor: 'Optical',
      dpi: '4.000',
      pollingRate: '125Hz',
      buttons: 6,
      weight: '125g',
      connectivity: 'Bluetooth/Logi Bolt USB Receiver',
      batteryLife: '24 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS', 'Linux', 'iPadOS', 'Chrome OS'],
      programmableButtons: true,
      software: 'Logitech Options+',
      ergonomicDesign: '57° vertical orientation',
      smartWheel: true
    },
    variants: [
      {
        name: 'Logitech Lift Vertical Black',
        color: 'Black',
        image: '/images/products/ErgonomicMice/Logitech Lift Vertical Ergonomic Mouse black.png',
        price: 1299000
      },
      {
        name: 'Logitech Lift Vertical White',
        color: 'White',
        image: '/images/products/ErgonomicMice/Logitech Lift Vertical Ergonomic Mouse white.png',
        price: 1299000
      },
      {
        name: 'Logitech Lift Vertical Rose',
        color: 'Rose',
        image: '/images/products/ErgonomicMice/Logitech Lift Vertical Ergonomic Mouse rose.png',
        price: 1349000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'Microsoft Sculpt Ergonomic Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Microsoft',
    price: 899000,
    stock: 35,
    weight: generateWeight(100, 120),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ErgonomicMice/Microsoft Sculpt Ergonomic Mouse 1.png',
      '/images/products/ErgonomicMice/Microsoft Sculpt Ergonomic Mouse 2.png'
    ],
    mainImage: '/images/products/ErgonomicMice/Microsoft Sculpt Ergonomic Mouse:main.png',
    description: 'Mouse ergonomis dengan desain menyerupai bukit yang mendukung posisi pergelangan tangan alami. Dilengkapi dengan tombol Windows dan roda scroll yang responsif.',
    specs: {
      sensor: 'BlueTrack Technology',
      dpi: '1.000',
      pollingRate: '125Hz',
      buttons: 4,
      weight: '105g',
      connectivity: '2.4GHz Wireless',
      batteryLife: '12 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS'],
      programmableButtons: false,
      windowsButton: true,
      ergonomicDesign: 'Thumb scoop design'
    },
    variants: [
      {
        name: 'Microsoft Sculpt Ergonomic Black',
        color: 'Black',
        image: '/images/products/ErgonomicMice/Microsoft Sculpt Ergonomic Mouse black.png',
        price: 899000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 15,
    warranty: '1 tahun',
    rating: {
      average: 4.5,
      count: 110
    },
    reviews: 110
  },
  {
    name: 'Anker Wireless Vertical Ergonomic Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Anker',
    price: 599000,
    stock: 50,
    weight: generateWeight(90, 110),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ErgonomicMice/Anker Wireless Vertical Ergonomic Mouse 1.png',
      '/images/products/ErgonomicMice/Anker Wireless Vertical Ergonomic Mouse 2.png'
    ],
    mainImage: '/images/products/ErgonomicMice/Anker Wireless Vertical Ergonomic Mouse:main.png',
    description: 'Mouse ergonomis vertikal dengan desain handshake alami yang mengurangi ketegangan pada pergelangan tangan. Dilengkapi dengan 5 tombol yang dapat diprogram dan pengaturan DPI yang dapat disesuaikan.',
    specs: {
      sensor: 'Optical',
      dpi: '800/1200/1600/2400',
      pollingRate: '125Hz',
      buttons: 5,
      weight: '95g',
      connectivity: '2.4GHz Wireless',
      batteryLife: '18 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS', 'Linux'],
      programmableButtons: true,
      adjustableDPI: true,
      ergonomicDesign: 'Vertical handshake position'
    },
    variants: [
      {
        name: 'Anker Wireless Vertical Ergonomic Black',
        color: 'Black',
        image: '/images/products/ErgonomicMice/Anker Wireless Vertical Ergonomic Mouse black.png',
        price: 599000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 20,
    warranty: '1 tahun',
    rating: {
      average: 4.4,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'Evoluent VerticalMouse 4 Right Wireless',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Evoluent',
    price: 1799000,
    stock: 20,
    weight: generateWeight(120, 140),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ErgonomicMice/Evoluent VerticalMouse 4 Right Wireless 1.png',
      '/images/products/ErgonomicMice/Evoluent VerticalMouse 4 Right Wireless 2.png'
    ],
    mainImage: '/images/products/ErgonomicMice/Evoluent VerticalMouse 4 Right Wireless:main.png',
    description: 'Mouse ergonomis vertikal premium dengan desain paten yang mendukung posisi tangan alami. Dilengkapi dengan 6 tombol yang dapat diprogram dan indikator kecepatan pointer.',
    specs: {
      sensor: 'Optical',
      dpi: 'Adjustable (up to 2600)',
      pollingRate: '125Hz',
      buttons: 6,
      weight: '130g',
      connectivity: '2.4GHz Wireless',
      batteryLife: '3 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS'],
      programmableButtons: true,
      adjustableDPI: true,
      ergonomicDesign: 'Patented shape supports hand in upright neutral posture',
      pointerSpeedIndicator: true
    },
    variants: [
      {
        name: 'Evoluent VerticalMouse 4 Right Wireless Black',
        color: 'Black',
        image: '/images/products/ErgonomicMice/Evoluent VerticalMouse 4 Right Wireless black.png',
        price: 1799000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Evoluent VerticalMouse C Series Wireless',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Evoluent',
    price: 1899000,
    stock: 15,
    weight: generateWeight(110, 130),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ErgonomicMice/Evoluent VerticalMouse C Series Wireless 1.png',
      '/images/products/ErgonomicMice/Evoluent VerticalMouse C Series Wireless 2.png'
    ],
    mainImage: '/images/products/ErgonomicMice/Evoluent VerticalMouse C Series Wireless:main.png',
    description: 'Mouse ergonomis vertikal premium dengan desain yang lebih ramping dan kontur yang lebih halus. Dilengkapi dengan 6 tombol yang dapat diprogram dan sensor presisi tinggi.',
    specs: {
      sensor: 'Optical',
      dpi: 'Adjustable (up to 2600)',
      pollingRate: '125Hz',
      buttons: 6,
      weight: '120g',
      connectivity: '2.4GHz Wireless/Bluetooth',
      batteryLife: '4 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS'],
      programmableButtons: true,
      adjustableDPI: true,
      ergonomicDesign: 'Slimmer profile with smoother contours',
      thumbRest: true
    },
    variants: [
      {
        name: 'Evoluent VerticalMouse C Series Wireless Black',
        color: 'Black',
        image: '/images/products/ErgonomicMice/Evoluent VerticalMouse C Series Wireless black.png',
        price: 1899000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 45
    },
    reviews: 45
  },
  {
    name: 'J-Tech Digital Scroll Endurance Wireless Mouse',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'J-Tech Digital',
    price: 699000,
    stock: 40,
    weight: generateWeight(100, 120),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ErgonomicMice/J-Tech Digital Scroll Endurance Wireless Mouse 1.png',
      '/images/products/ErgonomicMice/J-Tech Digital Scroll Endurance Wireless Mouse 2.png'
    ],
    mainImage: '/images/products/ErgonomicMice/J-Tech Digital Scroll Endurance Wireless Mouse:main.png',
    description: 'Mouse ergonomis vertikal dengan desain yang mengurangi tekanan pada pergelangan tangan. Dilengkapi dengan tombol DPI yang dapat disesuaikan dan sandaran jempol yang nyaman.',
    specs: {
      sensor: 'Optical',
      dpi: '800/1200/1600/2400/3200',
      pollingRate: '125Hz',
      buttons: 5,
      weight: '110g',
      connectivity: '2.4GHz Wireless',
      batteryLife: '12 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS', 'Linux'],
      programmableButtons: false,
      adjustableDPI: true,
      ergonomicDesign: 'Vertical design with thumb rest',
      removablePalmRest: true
    },
    variants: [
      {
        name: 'J-Tech Digital Scroll Endurance Wireless Black',
        color: 'Black',
        image: '/images/products/ErgonomicMice/J-Tech Digital Scroll Endurance Wireless Mouse black.png',
        price: 699000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 15,
    warranty: '1 tahun',
    rating: {
      average: 4.3,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Kensington Pro Fit Ergo Vertical Wireless Trackball',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Kensington',
    price: 1299000,
    stock: 25,
    weight: generateWeight(130, 150),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ErgonomicMice/Kensington Pro Fit Ergo Vertical Wireless Trackball 1.png',
      '/images/products/ErgonomicMice/Kensington Pro Fit Ergo Vertical Wireless Trackball 2.png'
    ],
    mainImage: '/images/products/ErgonomicMice/Kensington Pro Fit Ergo Vertical Wireless Trackball:main.png',
    description: 'Mouse ergonomis vertikal dengan trackball terintegrasi yang menggabungkan kenyamanan desain vertikal dengan presisi trackball. Dilengkapi dengan 9 tombol yang dapat diprogram.',
    specs: {
      sensor: 'Optical Trackball',
      dpi: 'Adjustable (400/800/1200/1600)',
      pollingRate: '125Hz',
      buttons: 9,
      weight: '140g',
      connectivity: '2.4GHz Wireless/Bluetooth 4.0',
      batteryLife: '18 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS'],
      programmableButtons: true,
      adjustableDPI: true,
      ergonomicDesign: 'Vertical design with integrated trackball',
      software: 'KensingtonWorks'
    },
    variants: [
      {
        name: 'Kensington Pro Fit Ergo Vertical Wireless Trackball Black',
        color: 'Black',
        image: '/images/products/ErgonomicMice/Kensington Pro Fit Ergo Vertical Wireless Trackball black.png',
        price: 1299000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.6,
      count: 55
    },
    reviews: 55
  },
  {
    name: 'Kensington Orbit Fusion Wireless Trackball',
    category: 'Mouse',
    subCategory: 'Ergonomic',
    brand: 'Kensington',
    price: 1199000,
    stock: 20,
    weight: generateWeight(140, 160),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ErgonomicMice/Kensington Orbit Fusion Wireless Trackball 1.png',
      '/images/products/ErgonomicMice/Kensington Orbit Fusion Wireless Trackball 2.png'
    ],
    mainImage: '/images/products/ErgonomicMice/Kensington Orbit Fusion Wireless Trackball:main.png',
    description: 'Trackball ergonomis dengan desain ambidextrous yang dapat digunakan dengan tangan kanan atau kiri. Dilengkapi dengan cincin scroll dan 5 tombol yang dapat diprogram.',
    specs: {
      sensor: 'Optical Trackball',
      dpi: 'Adjustable (400/800/1500)',
      pollingRate: '125Hz',
      buttons: 5,
      weight: '150g',
      connectivity: '2.4GHz Wireless/Bluetooth 4.2',
      batteryLife: '24 bulan',
      rgb: false,
      compatibility: ['Windows', 'macOS', 'Chrome OS'],
      programmableButtons: true,
      adjustableDPI: true,
      ergonomicDesign: 'Ambidextrous design with scroll ring',
      software: 'KensingtonWorks'
    },
    variants: [
      {
        name: 'Kensington Orbit Fusion Wireless Trackball Black',
        color: 'Black',
        image: '/images/products/ErgonomicMice/Kensington Orbit Fusion Wireless Trackball black.png',
        price: 1199000
      }
    ],
    isFeatured: false,
    isNewRelease: true,
    isBestSeller: false,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.5,
      count: 40
    },
    reviews: 40
  }
];


// ==================== MOUSEPADS ====================

// ... existing code ...

// Hard Mousepads
let hardMousepads = [
  {
    name: 'Logitech G440 Hard Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Logitech',
    price: 399000,
    stock: 40,
    weight: generateWeight(200, 300),
    dimensions: generateDimensions(),
    images: [
      '/images/products/HardMousepads/Logitech G440 Hard Gaming Mouse Pad 1.png',
      '/images/products/HardMousepads/Logitech G440 Hard Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/HardMousepads/Logitech G440 Hard Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming dengan permukaan keras yang dirancang untuk performa sensor optimal dan kontrol yang presisi. Permukaan polimer bergesekan rendah memberikan kecepatan dan akurasi tinggi.',
    specs: {
      material: 'Polimer Keras',
      surface: 'Bergesekan Rendah',
      base: 'Karet Anti-Slip',
      thickness: '3mm',
      size: '340 x 280 mm',
      edgeType: 'Tepi Halus',
      washable: false,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'Logitech G440 Hard Gaming Mouse Pad',
        color: 'Black',
        image: '/images/products/HardMousepads/Logitech G440 Hard Gaming Mouse Pad black.png',
        price: 399000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.6,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Razer Acari Ultra-Low Friction Hard Mouse Mat',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Razer',
    price: 699000,
    stock: 25,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/HardMousepads/Razer Acari Ultra-Low Friction Hard Mouse Mat 1.png',
      '/images/products/HardMousepads/Razer Acari Ultra-Low Friction Hard Mouse Mat 2.png'
    ],
    mainImage: '/images/products/HardMousepads/Razer Acari Ultra-Low Friction Hard Mouse Mat:main.png',
    description: 'Mousepad gaming premium dengan permukaan ultra-low friction untuk gerakan mouse yang sangat cepat dan halus. Didesain untuk gaming kompetitif dengan teknologi Razer Ultraviolet Nanobead yang mengurangi gesekan.',
    specs: {
      material: 'Ultraviolet Nanobead Surface',
      surface: 'Ultra-Low Friction',
      base: 'Karet Anti-Slip',
      thickness: '2.5mm',
      size: '420 x 320 mm',
      edgeType: 'Tepi Halus',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'Razer Acari Ultra-Low Friction Hard Mouse Mat',
        color: 'Black',
        image: '/images/products/HardMousepads/Razer Acari Ultra-Low Friction Hard Mouse Mat black.png',
        price: 699000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Razer Sphex V3 Ultra-Thin Gaming Mouse Mat',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Razer',
    price: 299000,
    stock: 50,
    weight: generateWeight(100, 150),
    dimensions: generateDimensions(),
    images: [
      '/images/products/HardMousepads/Razer Sphex V3 Ultra-Thin Gaming Mouse Mat 1.png',
      '/images/products/HardMousepads/Razer Sphex V3 Ultra-Thin Gaming Mouse Mat 2.png'
    ],
    mainImage: '/images/products/HardMousepads/Razer Sphex V3 Ultra-Thin Gaming Mouse Mat:main.png',
    description: 'Mousepad gaming ultra-tipis dengan permukaan keras yang dapat ditempel pada meja. Dengan ketebalan hanya 0.4mm, memberikan pengalaman seperti bermain langsung di permukaan meja dengan perekat yang dapat digunakan kembali.',
    specs: {
      material: 'Polycarbonate',
      surface: 'Tekstur Mikro',
      base: 'Perekat Dapat Digunakan Kembali',
      thickness: '0.4mm',
      edgeType: 'Tepi Halus',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'Razer Sphex V3 Small',
        size: 'Small (270 x 215 mm)',
        image: '/images/products/HardMousepads/Razer Sphex V3 Ultra-Thin Gaming Mouse Mat small.png',
        price: 299000
      },
      {
        name: 'Razer Sphex V3 Large',
        size: 'Large (450 x 400 mm)',
        image: '/images/products/HardMousepads/Razer Sphex V3 Ultra-Thin Gaming Mouse Mat large.png',
        price: 399000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.5,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'Corsair MM800 RGB POLARIS Hard Surface Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Corsair',
    price: 799000,
    stock: 20,
    weight: generateWeight(350, 450),
    dimensions: generateDimensions(),
    images: [
      '/images/products/HardMousepads/Corsair MM800 RGB POLARIS Hard Surface Gaming Mouse Pad 1.png',
      '/images/products/HardMousepads/Corsair MM800 RGB POLARIS Hard Surface Gaming Mouse Pad. 2.png'
    ],
    mainImage: '/images/products/HardMousepads/Corsair MM800 RGB POLARIS Hard Surface Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming dengan permukaan keras dan 15 zona RGB yang dapat diprogram. Dilengkapi dengan USB pass-through port dan dapat disinkronkan dengan perangkat Corsair lainnya melalui software iCUE.',
    specs: {
      material: 'Micro-Texture Surface',
      surface: 'Low-Friction',
      base: 'Karet Anti-Slip',
      thickness: '5mm',
      size: '350 x 260 mm',
      edgeType: 'Tepi Halus',
      lighting: '15 Zona RGB',
      usbPassthrough: true,
      software: 'Corsair iCUE',
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'Corsair MM800 RGB POLARIS Hard Surface',
        color: 'Black',
        image: '/images/products/HardMousepads/Corsair MM800 RGB POLARIS Hard Surface Gaming Mouse Pad black.png',
        price: 799000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: false,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 75
    },
    reviews: 75
  },
  {
    name: 'Cooler Master MP860 Dual-Sided RGB Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Hard/Soft',
    brand: 'Cooler Master',
    price: 699000,
    stock: 30,
    weight: generateWeight(400, 500),
    dimensions: generateDimensions(),
    images: [
      '/images/products/HardMousepads/Cooler Master MP860 Dual-Sided RGB Gaming Mouse Pad 1.png',
      '/images/products/HardMousepads/Cooler Master MP860 Dual-Sided RGB Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/HardMousepads/Cooler Master MP860 Dual-Sided RGB Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming inovatif dengan dua sisi yang dapat dibalik - satu sisi permukaan keras untuk kecepatan dan sisi lainnya permukaan kain untuk kontrol. Dilengkapi dengan pencahayaan RGB yang dapat disesuaikan.',
    specs: {
      material: 'Aluminium (Sisi Keras) / Kain (Sisi Lembut)',
      surface: 'Dual-Sided',
      base: 'Karet Anti-Slip',
      thickness: '8mm',
      size: '360 x 260 mm',
      edgeType: 'Tepi Halus',
      lighting: 'RGB 19 Efek',
      software: 'Cooler Master Software Portal',
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'Cooler Master MP860 Dual-Sided RGB',
        color: 'Black',
        image: '/images/products/HardMousepads/Cooler Master MP860 Dual-Sided RGB Gaming Mouse Pad black.png',
        price: 699000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.6,
      count: 60
    },
    reviews: 60
  },
  {
    name: 'ASUS ROG Strix Edge Hard Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'ASUS',
    price: 499000,
    stock: 35,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/HardMousepads/ASUS ROG Strix Edge Hard Gaming Mouse Pad 1.png',
      '/images/products/HardMousepads/ASUS ROG Strix Edge Hard Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/HardMousepads/ASUS ROG Strix Edge Hard Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming dengan permukaan keras yang dioptimalkan untuk gaming kompetitif. Desain ROG yang ikonik dengan tepi jahitan anti-fray dan base anti-slip untuk stabilitas maksimal.',
    specs: {
      material: 'Permukaan Keras Bergesekan Rendah',
      surface: 'Tekstur Mikro',
      base: 'Karet Anti-Slip',
      thickness: '3mm',
      size: '450 x 400 mm',
      edgeType: 'Tepi Jahitan Anti-Fray',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'ASUS ROG Strix Edge Hard Gaming',
        color: 'Black/Red',
        image: '/images/products/HardMousepads/ASUS ROG Strix Edge Hard Gaming Mouse Pad black:red.png',
        price: 499000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '1 tahun',
    rating: {
      average: 4.5,
      count: 80
    },
    reviews: 80
  },
  {
    name: 'Glorious Helios XL Ultra Thin Polycarbonate Hard Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Hard',
    brand: 'Glorious',
    price: 449000,
    stock: 25,
    weight: generateWeight(150, 200),
    dimensions: generateDimensions(),
    images: [
      '/images/products/HardMousepads/Glorious Helios XL Ultra Thin Polycarbonate Hard Mouse Pad 1.png',
      '/images/products/HardMousepads/Glorious Helios XL Ultra Thin Polycarbonate Hard Mouse Pad 2.png'
    ],
    mainImage: '/images/products/HardMousepads/Glorious Helios XL Ultra Thin Polycarbonate Hard Mouse Pad:main.png',
    description: 'Mousepad gaming ultra-tipis dengan permukaan polycarbonate yang sangat halus. Dengan ketebalan hanya 0.5mm, memberikan pengalaman gliding yang sangat cepat dan presisi tinggi.',
    specs: {
      material: 'Polycarbonate',
      surface: 'Ultra-Smooth',
      base: 'Perekat Premium',
      thickness: '0.5mm',
      edgeType: 'Tepi Halus',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse',
      durability: 'Tahan Gores'
    },
    variants: [
      {
        name: 'Glorious Helios L',
        size: 'L (280 x 330 mm)',
        image: '/images/products/HardMousepads/Glorious Helios XL Ultra Thin Polycarbonate Hard Mouse Pad L.png',
        price: 449000
      },
      {
        name: 'Glorious Helios XL',
        size: 'XL (400 x 450 mm)',
        image: '/images/products/HardMousepads/Glorious Helios XL Ultra Thin Polycarbonate Hard Mouse Pad xl.png',
        price: 549000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 70
    },
    reviews: 70
  }
];


// ... existing code ...

// Soft Mousepads
let softMousepads = [
  {
    name: 'Corsair MM300 Extended Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'Corsair',
    price: 349000,
    stock: 45,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SoftMousepads/Corsair MM300 Extended Gaming Mouse Pad 1.png',
      '/images/products/SoftMousepads/Corsair MM300 Extended Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/SoftMousepads/Corsair MM300 Extended Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming dengan permukaan kain tekstur premium yang dioptimalkan untuk sensor gaming. Desain anti-fray dengan tepi jahitan untuk daya tahan yang lebih lama.',
    specs: {
      material: 'Kain Tekstur Premium',
      surface: 'Tekstur Halus',
      base: 'Karet Anti-Slip',
      thickness: '3mm',
      edgeType: 'Tepi Jahitan Anti-Fray',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'Corsair MM300 Medium',
        size: 'Medium (360 x 300 mm)',
        image: '/images/products/SoftMousepads/Corsair MM300 Extended Gaming Mouse Pad Medium.png',
        price: 349000
      },
      {
        name: 'Corsair MM300 Extended',
        size: 'Extended (930 x 300 mm)',
        image: '/images/products/SoftMousepads/Corsair MM300 Extended Gaming Mouse Pad Extanded.png',
        price: 499000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Corsair MM350 Champion Series Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'Corsair',
    price: 399000,
    stock: 35,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SoftMousepads/Corsair MM350 Champion Series Gaming Mouse Pad 1.png',
      '/images/products/SoftMousepads/Corsair MM350 Champion Series Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/SoftMousepads/Corsair MM350 Champion Series Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming premium dengan permukaan kain mikro-anyaman yang dioptimalkan untuk gaming kompetitif. Ketebalan 5mm memberikan kenyamanan ekstra dan tepi jahitan anti-fray untuk daya tahan maksimal.',
    specs: {
      material: 'Kain Mikro-Anyaman',
      surface: 'Tekstur Halus',
      base: 'Karet Anti-Slip',
      thickness: '5mm',
      edgeType: 'Tepi Jahitan Anti-Fray',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse',
      series: 'Champion Series'
    },
    variants: [
      {
        name: 'Corsair MM350 XL',
        size: 'XL (450 x 400 mm)',
        image: '/images/products/SoftMousepads/Corsair MM350 Champion Series Gaming Mouse Pad XL .png',
        price: 399000
      },
      {
        name: 'Corsair MM350 Extended XL',
        size: 'Extended XL (930 x 400 mm)',
        image: '/images/products/SoftMousepads/Corsair MM350 Champion Series Gaming Mouse Pad Extanded XL.png',
        price: 599000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'HyperX Fury S Pro Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'HyperX',
    price: 249000,
    stock: 50,
    weight: generateWeight(200, 300),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SoftMousepads/HyperX Fury S Pro Gaming Mouse Pad 1.png',
      '/images/products/SoftMousepads/HyperX Fury S Pro Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/SoftMousepads/HyperX Fury S Pro Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming dengan permukaan kain yang halus dan konsisten untuk kontrol presisi. Tepi jahitan anti-fray dan base anti-slip memberikan stabilitas selama gameplay intensif.',
    specs: {
      material: 'Kain Densitas Tinggi',
      surface: 'Tekstur Halus',
      base: 'Karet Anti-Slip',
      thickness: '4mm',
      edgeType: 'Tepi Jahitan Anti-Fray',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'HyperX Fury S Pro Small',
        size: 'Small (290 x 240 mm)',
        image: '/images/products/SoftMousepads/HyperX Fury S Pro Gaming Mouse Pad small.png',
        price: 249000
      },
      {
        name: 'HyperX Fury S Pro Medium',
        size: 'Medium (360 x 300 mm)',
        image: '/images/products/SoftMousepads/HyperX Fury S Pro Gaming Mouse Pad medium.png',
        price: 299000
      },
      {
        name: 'HyperX Fury S Pro Large',
        size: 'Large (450 x 400 mm)',
        image: '/images/products/SoftMousepads/HyperX Fury S Pro Gaming Mouse Pad large.png',
        price: 399000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 15,
    warranty: '2 tahun',
    rating: {
      average: 4.6,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'Logitech G640 Large Cloth Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'Logitech',
    price: 449000,
    stock: 40,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SoftMousepads/Logitech G640 Large Cloth Gaming Mouse Pad 1.png',
      '/images/products/SoftMousepads/Logitech G640 Large Cloth Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/SoftMousepads/Logitech G640 Large Cloth Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming dengan permukaan kain tekstur sedang yang konsisten untuk kontrol dan kecepatan yang seimbang. Digunakan oleh banyak pemain esports profesional.',
    specs: {
      material: 'Kain Tekstur Sedang',
      surface: 'Tekstur Sedang',
      base: 'Karet Anti-Slip',
      thickness: '3mm',
      size: '460 x 400 mm',
      edgeType: 'Tepi Halus',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'Logitech G640 Large Black',
        color: 'Black',
        image: '/images/products/SoftMousepads/Logitech G640 Large Cloth Gaming Mouse Pad black.png',
        price: 449000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 110
    },
    reviews: 110
  },
  {
    name: 'Razer Gigantus V2 Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'Razer',
    price: 299000,
    stock: 45,
    weight: generateWeight(200, 300),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SoftMousepads/Razer Gigantus V2 Gaming Mouse Pad 1.png',
      '/images/products/SoftMousepads/Razer Gigantus V2 Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/SoftMousepads/Razer Gigantus V2 Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming dengan permukaan kain mikro-anyaman yang dioptimalkan untuk performa gaming. Permukaan tekstur halus memberikan keseimbangan antara kecepatan dan kontrol.',
    specs: {
      material: 'Kain Mikro-Anyaman',
      surface: 'Tekstur Halus',
      base: 'Karet Anti-Slip',
      thickness: '3mm',
      edgeType: 'Tepi Halus',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'Razer Gigantus V2 Medium',
        size: 'Medium (360 x 275 mm)',
        image: '/images/products/SoftMousepads/Razer Gigantus V2 Gaming Mouse Pad medium.png',
        price: 299000
      },
      {
        name: 'Razer Gigantus V2 Large',
        size: 'Large (450 x 400 mm)',
        image: '/images/products/SoftMousepads/Razer Gigantus V2 Gaming Mouse Pad large.png',
        price: 399000
      },
      {
        name: 'Razer Gigantus V2 XXL',
        size: 'XXL (940 x 410 mm)',
        image: '/images/products/SoftMousepads/Razer Gigantus V2 Gaming Mouse Pad XXL.png',
        price: 599000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 130
    },
    reviews: 130
  },
  {
    name: 'Razer Strider Hybrid Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Hybrid',
    brand: 'Razer',
    price: 499000,
    stock: 30,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SoftMousepads/Razer Strider Hybrid Gaming Mouse Pad 1.png',
      '/images/products/SoftMousepads/Razer Strider Hybrid Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/SoftMousepads/Razer Strider Hybrid Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming hybrid inovatif yang menggabungkan kecepatan permukaan keras dengan kenyamanan permukaan kain. Tahan air dan tahan kusut untuk daya tahan maksimal.',
    specs: {
      material: 'Hybrid (Kain + Polyester Coating)',
      surface: 'Tekstur Sedang',
      base: 'Karet Anti-Slip',
      thickness: '3mm',
      edgeType: 'Tepi Jahitan Anti-Fray',
      washable: true,
      waterproof: true,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'Razer Strider Medium',
        size: 'Medium (360 x 275 mm)',
        image: '/images/products/SoftMousepads/Razer Strider Hybrid Gaming Mouse Pad medium.png',
        price: 499000
      },
      {
        name: 'Razer Strider Large',
        size: 'Large (450 x 400 mm)',
        image: '/images/products/SoftMousepads/Razer Strider Hybrid Gaming Mouse Pad large.png',
        price: 599000
      },
      {
        name: 'Razer Strider XXL',
        size: 'XXL (940 x 410 mm)',
        image: '/images/products/SoftMousepads/Razer Strider Hybrid Gaming Mouse Pad XXL.png',
        price: 799000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 75
    },
    reviews: 75
  },
  {
    name: 'SteelSeries QcK Heavy Gaming Mouse Pad',
    category: 'Mousepad',
    subCategory: 'Soft',
    brand: 'SteelSeries',
    price: 399000,
    stock: 40,
    weight: generateWeight(350, 450),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SoftMousepads/SteelSeries QcK Heavy Gaming Mouse Pad:1.png',
      '/images/products/SoftMousepads/SteelSeries QcK Heavy Gaming Mouse Pad 2.png'
    ],
    mainImage: '/images/products/SoftMousepads/SteelSeries QcK Heavy Gaming Mouse Pad:main.png',
    description: 'Mousepad gaming dengan ketebalan ekstra 6mm untuk kenyamanan maksimal. Permukaan mikro-anyaman memberikan kontrol presisi dan konsistensi untuk semua tipe sensor mouse.',
    specs: {
      material: 'Kain Mikro-Anyaman',
      surface: 'Tekstur Halus',
      base: 'Karet Anti-Slip',
      thickness: '6mm',
      size: '450 x 400 mm',
      edgeType: 'Tepi Halus',
      washable: true,
      compatibility: 'Semua Tipe Sensor Mouse'
    },
    variants: [
      {
        name: 'SteelSeries QcK Heavy Black',
        color: 'Black',
        image: '/images/products/SoftMousepads/SteelSeries QcK Heavy Gaming Mouse Pad black.png',
        price: 399000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 100
    },
    reviews: 100
  }
];


// ==================== HEADSETS ====================

// ... existing code ...

// Gaming Headsets
let gamingHeadsets = [
  {
    name: 'Logitech G Pro X Wireless Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Logitech',
    price: 2499000,
    stock: 30,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingHeadsets/Logitech G Pro X Wireless Gaming Headset 1.png',
      '/images/products/GamingHeadsets/Logitech G Pro X Wireless Gaming Headset 2.png'
    ],
    mainImage: '/images/products/GamingHeadsets/Logitech G Pro X Wireless Gaming Headset:main.png',
    description: 'Headset gaming profesional dengan teknologi LIGHTSPEED wireless dan mikrofon Blue VO!CE. Dirancang bersama dengan para profesional esports untuk performa audio tingkat tinggi.',
    specs: {
      type: 'Over-ear',
      driver: '50mm PRO-G',
      frequency: '20Hz-20kHz',
      impedance: '32 Ohm',
      sensitivity: '91.7 dB SPL @ 1 mW & 1 cm',
      connectivity: 'LIGHTSPEED Wireless (2.4GHz)',
      batteryLife: '20 jam',
      microphone: 'Detachable Pro-grade',
      noiseIsolation: true,
      surround: 'DTS Headphone:X 2.0',
      weight: '370g',
      compatibility: ['PC', 'PlayStation', 'Nintendo Switch']
    },
    variants: [
      {
        name: 'Logitech G Pro X Wireless Black',
        color: 'Black',
        image: '/images/products/GamingHeadsets/Logitech G Pro X Wireless Gaming Headset black.png',
        price: 2499000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Logitech G435 LIGHTSPEED Wireless Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Logitech',
    price: 1299000,
    stock: 45,
    weight: generateWeight(200, 300),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingHeadsets/Logitech G435 LIGHTSPEED Wireless Gaming Headset 1.png',
      '/images/products/GamingHeadsets/Logitech G435 LIGHTSPEED Wireless Gaming Headset 2.png'
    ],
    mainImage: '/images/products/GamingHeadsets/Logitech G435 LIGHTSPEED Wireless Gaming Headset:main.png',
    description: 'Headset gaming ringan dan ramah lingkungan dengan konektivitas LIGHTSPEED wireless dan Bluetooth. Dilengkapi dengan dual microphone beamforming untuk komunikasi yang jelas.',
    specs: {
      type: 'Over-ear',
      driver: '40mm',
      frequency: '20Hz-20kHz',
      impedance: '45 Ohm',
      connectivity: 'LIGHTSPEED Wireless (2.4GHz)/Bluetooth',
      batteryLife: '18 jam',
      microphone: 'Dual Beamforming',
      noiseIsolation: false,
      surround: 'Dolby Atmos Compatible',
      weight: '165g',
      compatibility: ['PC', 'PlayStation', 'Nintendo Switch', 'Mobile']
    },
    variants: [
      {
        name: 'Logitech G435 Black',
        color: 'Black',
        image: '/images/products/GamingHeadsets/Logitech G435 LIGHTSPEED Wireless Gaming Headset black.png',
        price: 1299000
      },
      {
        name: 'Logitech G435 White',
        color: 'White',
        image: '/images/products/GamingHeadsets/Logitech G435 LIGHTSPEED Wireless Gaming Headset white.png',
        price: 1299000
      },
      {
        name: 'Logitech G435 Blue',
        color: 'Blue',
        image: '/images/products/GamingHeadsets/Logitech G435 LIGHTSPEED Wireless Gaming Headset blue.png',
        price: 1349000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.6,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'Razer BlackShark V2 Pro Wireless Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Razer',
    price: 2199000,
    stock: 25,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingHeadsets/Razer BlackShark V2 Pro Wireless Gaming Headset 1.png',
      '/images/products/GamingHeadsets/Razer BlackShark V2 Pro Wireless Gaming Headset 2.png'
    ],
    mainImage: '/images/products/GamingHeadsets/Razer BlackShark V2 Pro Wireless Gaming Headset:main.png',
    description: 'Headset gaming esports premium dengan driver TriForce Titanium 50mm dan mikrofon HyperClear Supercardioid. Dilengkapi dengan teknologi THX Spatial Audio untuk pengalaman suara 3D yang imersif.',
    specs: {
      type: 'Over-ear',
      driver: 'TriForce Titanium 50mm',
      frequency: '12Hz-28kHz',
      impedance: '32 Ohm',
      sensitivity: '100 dB SPL',
      connectivity: 'Razer HyperSpeed Wireless (2.4GHz)',
      batteryLife: '24 jam',
      microphone: 'HyperClear Supercardioid',
      noiseIsolation: true,
      surround: 'THX Spatial Audio',
      weight: '320g',
      compatibility: ['PC', 'PlayStation', 'Nintendo Switch', 'Mobile']
    },
    variants: [
      {
        name: 'Razer BlackShark V2 Pro Black',
        color: 'Black',
        image: '/images/products/GamingHeadsets/Razer BlackShark V2 Pro Wireless Gaming Headset black.png',
        price: 2199000
      },
      {
        name: 'Razer BlackShark V2 Pro White',
        color: 'White',
        image: '/images/products/GamingHeadsets/Razer BlackShark V2 Pro Wireless Gaming Headset white.png',
        price: 2199000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 110
    },
    reviews: 110
  },
  {
    name: 'Razer Kraken V3 X Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Razer',
    price: 899000,
    stock: 40,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingHeadsets/Razer Kraken V3 X Gaming Headset 1.png',
      '/images/products/GamingHeadsets/Razer Kraken V3 X Gaming Headset 2.png'
    ],
    mainImage: '/images/products/GamingHeadsets/Razer Kraken V3 X Gaming Headset:main.png',
    description: 'Headset gaming ringan dengan driver Razer TriForce 40mm dan mikrofon HyperClear Cardioid. Dilengkapi dengan Razer Chroma RGB untuk personalisasi pencahayaan.',
    specs: {
      type: 'Over-ear',
      driver: 'TriForce 40mm',
      frequency: '12Hz-28kHz',
      impedance: '32 Ohm',
      sensitivity: '103 dB SPL',
      connectivity: 'Wired (USB)',
      microphone: 'HyperClear Cardioid',
      noiseIsolation: true,
      surround: '7.1 Surround Sound',
      weight: '285g',
      compatibility: ['PC', 'PlayStation', 'Nintendo Switch', 'Xbox']
    },
    variants: [
      {
        name: 'Razer Kraken V3 X Black',
        color: 'Black',
        image: '/images/products/GamingHeadsets/Razer Kraken V3 X Gaming Headset black.png',
        price: 899000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 15,
    warranty: '2 tahun',
    rating: {
      average: 4.5,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'HyperX Cloud Alpha Wireless Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'HyperX',
    price: 1999000,
    stock: 30,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingHeadsets/HyperX Cloud Alpha Wireless Gaming Headset 1.png',
      '/images/products/GamingHeadsets/HyperX Cloud Alpha Wireless Gaming Headset 2.png'
    ],
    mainImage: '/images/products/GamingHeadsets/HyperX Cloud Alpha Wireless Gaming Headset:main.png',
    description: 'Headset gaming wireless dengan baterai tahan hingga 300 jam dan driver dual chamber 50mm. Dilengkapi dengan mikrofon yang dapat dilepas dan bahan memory foam untuk kenyamanan maksimal.',
    specs: {
      type: 'Over-ear',
      driver: 'Dual Chamber 50mm',
      frequency: '15Hz-21kHz',
      impedance: '65 Ohm',
      sensitivity: '98 dB SPL',
      connectivity: 'Wireless (2.4GHz)',
      batteryLife: '300 jam',
      microphone: 'Detachable Noise-Cancelling',
      noiseIsolation: true,
      surround: 'DTS Headphone:X',
      weight: '335g',
      compatibility: ['PC', 'PlayStation']
    },
    variants: [
      {
        name: 'HyperX Cloud Alpha Wireless Black/Red',
        color: 'Black/Red',
        image: '/images/products/GamingHeadsets/HyperX Cloud Alpha Wireless Gaming Headset black:red.png',
        price: 1999000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Corsair HS80 RGB Wireless Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Corsair',
    price: 1899000,
    stock: 35,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingHeadsets/Corsair HS80 RGB Wireless Gaming Headset 1.png',
      '/images/products/GamingHeadsets/Corsair HS80 RGB Wireless Gaming Headset 2.png'
    ],
    mainImage: '/images/products/GamingHeadsets/Corsair HS80 RGB Wireless Gaming Headset:main.png',
    description: 'Headset gaming premium dengan konektivitas SLIPSTREAM WIRELESS dan audio Dolby Atmos. Dilengkapi dengan mikrofon omnidirectional broadcast-grade dan headband floating untuk kenyamanan maksimal.',
    specs: {
      type: 'Over-ear',
      driver: '50mm Neodymium',
      frequency: '20Hz-40kHz',
      impedance: '32 Ohm',
      sensitivity: '116 dB SPL',
      connectivity: 'SLIPSTREAM WIRELESS (2.4GHz)/USB',
      batteryLife: '20 jam',
      microphone: 'Omnidirectional Broadcast-Grade',
      noiseIsolation: true,
      surround: 'Dolby Atmos',
      weight: '367g',
      compatibility: ['PC', 'PlayStation']
    },
    variants: [
      {
        name: 'Corsair HS80 RGB Black',
        color: 'Black',
        image: '/images/products/GamingHeadsets/Corsair HS80 RGB Wireless Gaming Headset black.png',
        price: 1899000
      },
      {
        name: 'Corsair HS80 RGB White',
        color: 'White',
        image: '/images/products/GamingHeadsets/Corsair HS80 RGB Wireless Gaming Headset white.png',
        price: 1899000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: false,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 90
    },
    reviews: 90
  },
  {
    name: 'Corsair VOID RGB Elite Wireless Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'Corsair',
    price: 1599000,
    stock: 30,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingHeadsets/Corsair VOID RGB Elite Wireless Gaming Headset 1.png',
      '/images/products/GamingHeadsets/Corsair VOID RGB Elite Wireless Gaming Headset 2.png'
    ],
    mainImage: '/images/products/GamingHeadsets/Corsair VOID RGB Elite Wireless Gaming Headset:main.png',
    description: 'Headset gaming wireless dengan driver 50mm dan mikrofon omnidirectional. Dilengkapi dengan RGB lighting dan ear cup berbahan memory foam untuk kenyamanan selama sesi gaming panjang.',
    specs: {
      type: 'Over-ear',
      driver: '50mm Neodymium',
      frequency: '20Hz-30kHz',
      impedance: '32 Ohm',
      sensitivity: '109 dB SPL',
      connectivity: 'SLIPSTREAM WIRELESS (2.4GHz)',
      batteryLife: '16 jam',
      microphone: 'Omnidirectional',
      noiseIsolation: true,
      surround: '7.1 Surround Sound',
      weight: '390g',
      compatibility: ['PC', 'PlayStation']
    },
    variants: [
      {
        name: 'Corsair VOID RGB Elite Carbon',
        color: 'Carbon',
        image: '/images/products/GamingHeadsets/Corsair VOID RGB Elite Wireless Gaming Headset carbonpng.png',
        price: 1599000
      },
      {
        name: 'Corsair VOID RGB Elite White',
        color: 'White',
        image: '/images/products/GamingHeadsets/Corsair VOID RGB Elite Wireless Gaming Headset white.png',
        price: 1599000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.6,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'SteelSeries Arctis Nova Pro Wireless Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'SteelSeries',
    price: 4999000,
    stock: 15,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingHeadsets/SteelSeries Arctis Nova Pro Wireless Gaming Headset 1.png',
      '/images/products/GamingHeadsets/SteelSeries Arctis Nova Pro Wireless Gaming Headset 2.png'
    ],
    mainImage: '/images/products/GamingHeadsets/SteelSeries Arctis Nova Pro Wireless Gaming Headset:main.png',
    description: 'Headset gaming premium dengan sistem baterai hot-swap dan GameDAC Gen 2. Dilengkapi dengan Active Noise Cancellation, Bluetooth multi-device, dan driver Neodymium High Fidelity.',
    specs: {
      type: 'Over-ear',
      driver: 'High Fidelity 40mm',
      frequency: '10Hz-40kHz',
      impedance: '38 Ohm',
      sensitivity: '93 dB SPL',
      connectivity: '2.4GHz Wireless/Bluetooth 5.0',
      batteryLife: '22 jam (per baterai)',
      microphone: 'ClearCast Gen 2',
      noiseIsolation: true,
      anc: true,
      surround: 'Sonar 360° Spatial Audio',
      weight: '338g',
      compatibility: ['PC', 'PlayStation', 'Nintendo Switch', 'Mobile']
    },
    variants: [
      {
        name: 'SteelSeries Arctis Nova Pro Wireless Black',
        color: 'Black',
        image: '/images/products/GamingHeadsets/SteelSeries Arctis Nova Pro Wireless Gaming Headset black.png',
        price: 4999000
      },
      {
        name: 'SteelSeries Arctis Nova Pro Wireless White',
        color: 'White',
        image: '/images/products/GamingHeadsets/SteelSeries Arctis Nova Pro Wireless Gaming Headset white.png',
        price: 4999000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 60
    },
    reviews: 60
  },
  {
    name: 'SteelSeries Arctis 5 Gaming Headset',
    category: 'Headset',
    subCategory: 'Gaming',
    brand: 'SteelSeries',
    price: 1499000,
    stock: 35,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/GamingHeadsets/SteelSeries Arctis 5 Gaming Headset 2.png'
    ],
    mainImage: '/images/products/GamingHeadsets/SteelSeries Arctis 5 Gaming Headset 2.png',
    description: 'Headset gaming dengan mikrofon ClearCast dan pencahayaan RGB Prism. Dilengkapi dengan ChatMix Dial untuk menyesuaikan keseimbangan audio game dan chat dengan mudah.',
    specs: {
      type: 'Over-ear',
      driver: 'S1 40mm',
      frequency: '20Hz-22kHz',
      impedance: '32 Ohm',
      sensitivity: '98 dB SPL',
      connectivity: 'Wired (USB/3.5mm)',
      microphone: 'ClearCast Bidirectional',
      noiseIsolation: true,
      surround: 'DTS Headphone:X v2.0',
      weight: '280g',
      compatibility: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile']
    },
    variants: [
      {
        name: 'SteelSeries Arctis 5 Black',
        color: 'Black',
        image: '/images/products/GamingHeadsets/SteelSeries Arctis 5 Gaming Headset black.png',
        price: 1499000
      },
      {
        name: 'SteelSeries Arctis 5 White',
        color: 'White',
        image: '/images/products/GamingHeadsets/SteelSeries Arctis 5 Gaming Headset white.png',
        price: 1499000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.6,
      count: 130
    },
    reviews: 130
  }
];

// ... existing code ...

// Music Headsets
let musicHeadsets = [
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Sony',
    price: 4999000,
    stock: 35,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MusicHeadsets/Sony WH-1000XM5 Wireless Headphones 1.png',
      '/images/products/MusicHeadsets/Sony WH-1000XM5 Wireless Headphones 2.png'
    ],
    mainImage: '/images/products/MusicHeadsets/Sony WH-1000XM5 Wireless Headphones:main.png',
    description: 'Headphone premium dengan noise cancelling terbaik di kelasnya. Dilengkapi dengan driver 30mm, teknologi DSEE Extreme untuk peningkatan kualitas audio, dan mikrofon dengan teknologi beamforming untuk kualitas panggilan yang jernih.',
    specs: {
      type: 'Over-ear',
      driver: '30mm',
      frequency: '4Hz-40kHz',
      impedance: '48 Ohm',
      sensitivity: '102 dB SPL',
      connectivity: 'Bluetooth 5.2/Wired 3.5mm',
      batteryLife: '30 jam (dengan ANC)',
      microphone: 'Beamforming dengan AI Noise Reduction',
      noiseIsolation: true,
      anc: true,
      multipoint: true,
      weight: '250g',
      compatibility: ['Android', 'iOS', 'Windows', 'Mac']
    },
    variants: [
      {
        name: 'Sony WH-1000XM5 Black',
        color: 'Black',
        image: '/images/products/MusicHeadsets/Sony WH-1000XM5 Wireless Headphones black.png',
        price: 4999000
      },
      {
        name: 'Sony WH-1000XM5 Silver',
        color: 'Silver',
        image: '/images/products/MusicHeadsets/Sony WH-1000XM5 Wireless Headphones silver.png',
        price: 4999000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'Sony WF-1000XM5 Wireless Earbuds',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Sony',
    price: 3499000,
    stock: 40,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MusicHeadsets/ony WF-1000XM5 Wireless Earbuds 1.png',
      '/images/products/MusicHeadsets/ony WF-1000XM5 Wireless Earbuds 2.png'
    ],
    mainImage: '/images/products/MusicHeadsets/ony WF-1000XM5 Wireless Earbuds:main.png',
    description: 'Earbuds premium dengan noise cancelling terbaik di kelasnya. Dilengkapi dengan driver Dynamic Driver X, teknologi DSEE Extreme, dan mikrofon dengan teknologi AI untuk kualitas panggilan yang jernih bahkan di lingkungan bising.',
    specs: {
      type: 'In-ear',
      driver: 'Dynamic Driver X',
      frequency: '20Hz-40kHz',
      connectivity: 'Bluetooth 5.3',
      batteryLife: '8 jam (dengan ANC), 24 jam (dengan case)',
      microphone: 'AI Noise Reduction Technology',
      noiseIsolation: true,
      anc: true,
      multipoint: true,
      waterResistant: 'IPX4',
      weight: '5.9g per earbud, 39g case',
      compatibility: ['Android', 'iOS', 'Windows', 'Mac']
    },
    variants: [
      {
        name: 'Sony WF-1000XM5 Black',
        color: 'Black',
        image: '/images/products/MusicHeadsets/ony WF-1000XM5 Wireless Earbuds black.png',
        price: 3499000
      },
      {
        name: 'Sony WF-1000XM5 White',
        color: 'White',
        image: '/images/products/MusicHeadsets/ony WF-1000XM5 Wireless Earbuds white.png',
        price: 3499000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: true,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Bose QuietComfort Ultra Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Bose',
    price: 4799000,
    stock: 30,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MusicHeadsets/Bose QuietComfort Ultra Headphones 1.png',
      '/images/products/MusicHeadsets/Bose QuietComfort Ultra Headphones 2.png'
    ],
    mainImage: '/images/products/MusicHeadsets/Bose QuietComfort Ultra Headphones:main.png',
    description: 'Headphone premium dengan teknologi Immersive Audio dan noise cancelling terbaik dari Bose. Dilengkapi dengan CustomTune yang menyesuaikan audio dengan bentuk telinga pengguna untuk pengalaman mendengarkan yang personal.',
    specs: {
      type: 'Over-ear',
      frequency: '10Hz-20kHz',
      connectivity: 'Bluetooth 5.3/Wired 3.5mm',
      batteryLife: '24 jam (dengan ANC)',
      microphone: 'Quad-microphone Array',
      noiseIsolation: true,
      anc: true,
      multipoint: true,
      immersiveAudio: true,
      weight: '280g',
      compatibility: ['Android', 'iOS', 'Windows', 'Mac']
    },
    variants: [
      {
        name: 'Bose QuietComfort Ultra Black',
        color: 'Black',
        image: '/images/products/MusicHeadsets/Bose QuietComfort Ultra Headphones black.png',
        price: 4799000
      },
      {
        name: 'Bose QuietComfort Ultra White',
        color: 'White',
        image: '/images/products/MusicHeadsets/Bose QuietComfort Ultra Headphones white.png',
        price: 4799000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 90
    },
    reviews: 90
  },
  {
    name: 'Bose QuietComfort Ultra Earbuds',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Bose',
    price: 3299000,
    stock: 35,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MusicHeadsets/Bose QuietComfort Ultra Earbuds 1.png',
      '/images/products/MusicHeadsets/Bose QuietComfort Ultra Earbuds 2.png'
    ],
    mainImage: '/images/products/MusicHeadsets/Bose QuietComfort Ultra Earbuds:main.png',
    description: 'Earbuds premium dengan teknologi Immersive Audio dan noise cancelling terbaik dari Bose. Dilengkapi dengan CustomTune yang menyesuaikan audio dengan bentuk telinga pengguna untuk pengalaman mendengarkan yang personal.',
    specs: {
      type: 'In-ear',
      frequency: '20Hz-20kHz',
      connectivity: 'Bluetooth 5.3',
      batteryLife: '6 jam (dengan ANC), 24 jam (dengan case)',
      microphone: 'Quad-microphone Array',
      noiseIsolation: true,
      anc: true,
      immersiveAudio: true,
      waterResistant: 'IPX4',
      weight: '6.2g per earbud, 59.8g case',
      compatibility: ['Android', 'iOS', 'Windows', 'Mac']
    },
    variants: [
      {
        name: 'Bose QuietComfort Ultra Earbuds Black',
        color: 'Black',
        image: '/images/products/MusicHeadsets/Bose QuietComfort Ultra Earbuds black.png',
        price: 3299000
      },
      {
        name: 'Bose QuietComfort Ultra Earbuds White',
        color: 'White',
        image: '/images/products/MusicHeadsets/Bose QuietComfort Ultra Earbuds white.png',
        price: 3299000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Sennheiser MOMENTUM 4 Wireless Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Sennheiser',
    price: 4499000,
    stock: 25,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MusicHeadsets/Sennheiser MOMENTUM 4 Wireless Headphones 1.png',
      '/images/products/MusicHeadsets/Sennheiser MOMENTUM 4 Wireless Headphones 2.png'
    ],
    mainImage: '/images/products/MusicHeadsets/Sennheiser MOMENTUM 4 Wireless Headphones:main.png',
    description: 'Headphone premium dengan baterai tahan hingga 60 jam dan kualitas suara Sennheiser yang legendaris. Dilengkapi dengan teknologi Adaptive Noise Cancellation dan kontrol sentuh yang intuitif.',
    specs: {
      type: 'Over-ear',
      driver: '42mm',
      frequency: '6Hz-22kHz',
      impedance: '100 Ohm',
      sensitivity: '106 dB SPL',
      connectivity: 'Bluetooth 5.2/Wired 3.5mm',
      batteryLife: '60 jam (dengan ANC)',
      microphone: 'Beamforming dengan Wind Noise Reduction',
      noiseIsolation: true,
      anc: true,
      multipoint: true,
      weight: '293g',
      compatibility: ['Android', 'iOS', 'Windows', 'Mac']
    },
    variants: [
      {
        name: 'Sennheiser MOMENTUM 4 Black',
        color: 'Black',
        image: '/images/products/MusicHeadsets/Sennheiser MOMENTUM 4 Wireless Headphones black.png',
        price: 4499000
      },
      {
        name: 'Sennheiser MOMENTUM 4 White',
        color: 'White',
        image: '/images/products/MusicHeadsets/Sennheiser MOMENTUM 4 Wireless Headphones white.png',
        price: 4499000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'Sennheiser HD 660S2 Audiophile Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Sennheiser',
    price: 5999000,
    stock: 15,
    weight: generateWeight(300, 400),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MusicHeadsets/Sennheiser HD 660S2 Audiophile Headphones 1.png',
      '/images/products/MusicHeadsets/Sennheiser HD 660S2 Audiophile Headphones 2.png'
    ],
    mainImage: '/images/products/MusicHeadsets/Sennheiser HD 660S2 Audiophile Headphones:main.png',
    description: 'Headphone audiophile open-back dengan kualitas suara referensi. Dilengkapi dengan driver yang dioptimalkan untuk bass yang lebih dalam dan impedansi yang lebih rendah untuk kompatibilitas yang lebih baik dengan berbagai perangkat.',
    specs: {
      type: 'Over-ear Open-back',
      driver: '38mm',
      frequency: '8Hz-41.5kHz',
      impedance: '300 Ohm',
      sensitivity: '104 dB SPL',
      connectivity: 'Wired (6.3mm/4.4mm Pentaconn)',
      microphone: 'Tidak ada',
      noiseIsolation: false,
      anc: false,
      weight: '260g',
      compatibility: ['Amplifier', 'DAC', 'Audio Interface']
    },
    variants: [
      {
        name: 'Sennheiser HD 660S2 Black',
        color: 'Black',
        image: '/images/products/MusicHeadsets/Sennheiser HD 660S2 Audiophile Headphones black.png',
        price: 5999000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 45
    },
    reviews: 45
  },
  {
    name: 'Beyerdynamic DT 1990 Pro Open-Back Studio Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Beyerdynamic',
    price: 7999000,
    stock: 10,
    weight: generateWeight(350, 450),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MusicHeadsets/Beyerdynamic DT 1990 Pro Open-Back Studio Headphones 1.png',
      '/images/products/MusicHeadsets/Beyerdynamic DT 1990 Pro Open-Back Studio Headphones 2.png'
    ],
    mainImage: '/images/products/MusicHeadsets/Beyerdynamic DT 1990 Pro Open-Back Studio Headphones:main.png',
    description: 'Headphone studio profesional open-back dengan driver Tesla 45mm. Dilengkapi dengan dua set ear pad yang berbeda untuk karakteristik suara yang dapat disesuaikan dan konstruksi kokoh buatan Jerman.',
    specs: {
      type: 'Over-ear Open-back',
      driver: 'Tesla 45mm',
      frequency: '5Hz-40kHz',
      impedance: '250 Ohm',
      sensitivity: '102 dB SPL',
      connectivity: 'Wired (3.5mm/6.3mm)',
      microphone: 'Tidak ada',
      noiseIsolation: false,
      anc: false,
      weight: '370g',
      compatibility: ['Amplifier', 'DAC', 'Audio Interface'],
      accessories: ['Carrying Case', 'Two Pairs of Ear Pads', 'Two Detachable Cables']
    },
    variants: [
      {
        name: 'Beyerdynamic DT 1990 Pro Black',
        color: 'Black',
        image: '/images/products/MusicHeadsets/Beyerdynamic DT 1990 Pro Open-Back Studio Headphones black.png',
        price: 7999000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.9,
      count: 35
    },
    reviews: 35
  },
  {
    name: 'Audio-Technica ATH-M50x Professional Monitor Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Audio-Technica',
    price: 2499000,
    stock: 40,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MusicHeadsets/Audio-Technica ATH-M50x Professional Monitor Headphones 1.png',
      '/images/products/MusicHeadsets/Audio-Technica ATH-M50x Professional Monitor Headphones 2.png'
    ],
    mainImage: '/images/products/MusicHeadsets/Audio-Technica ATH-M50x Professional Monitor Headphones 1.png',
    description: 'Headphone monitor profesional dengan driver 45mm dan desain closed-back. Menjadi standar industri untuk mixing, tracking, dan DJ-ing dengan suara yang akurat dan detail.',
    specs: {
      type: 'Over-ear Closed-back',
      driver: '45mm',
      frequency: '15Hz-28kHz',
      impedance: '38 Ohm',
      sensitivity: '99 dB SPL',
      connectivity: 'Wired (Detachable 3.5mm/6.3mm)',
      microphone: 'Tidak ada',
      noiseIsolation: true,
      anc: false,
      foldable: true,
      weight: '285g',
      compatibility: ['Studio Equipment', 'Mobile Devices', 'DJ Equipment'],
      accessories: ['Carrying Pouch', 'Three Detachable Cables']
    },
    variants: [
      {
        name: 'Audio-Technica ATH-M50x Black',
        color: 'Black',
        image: '/images/products/MusicHeadsets/Audio-Technica ATH-M50x Professional Monitor Headphones black.png',
        price: 2499000
      },
      {
        name: 'Audio-Technica ATH-M50x White',
        color: 'White',
        image: '/images/products/MusicHeadsets/Audio-Technica ATH-M50x Professional Monitor Headphones white.png',
        price: 2599000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 180
    },
    reviews: 180
  },
  {
    name: 'Audio-Technica ATH-WP900 Portable Wooden Headphones',
    category: 'Headset',
    subCategory: 'Music',
    brand: 'Audio-Technica',
    price: 5499000,
    stock: 15,
    weight: generateWeight(250, 350),
    dimensions: generateDimensions(),
    images: [
      '/images/products/MusicHeadsets/Audio-Technica ATH-WP900 Portable Wooden Headphones 1.png',
      '/images/products/MusicHeadsets/Audio-Technica ATH-WP900 Portable Wooden Headphones 2.png'
    ],
    mainImage: '/images/products/MusicHeadsets/Audio-Technica ATH-WP900 Portable Wooden Headphones:main.png',
    description: 'Headphone premium dengan housing kayu maple yang memberikan resonansi alami dan suara yang hangat. Dilengkapi dengan driver 53mm dan desain portabel yang elegan.',
    specs: {
      type: 'Over-ear Closed-back',
      driver: '53mm',
      frequency: '5Hz-50kHz',
      impedance: '38 Ohm',
      sensitivity: '100 dB SPL',
      connectivity: 'Wired (Detachable 3.5mm/4.4mm Pentaconn)',
      microphone: 'Tidak ada',
      noiseIsolation: true,
      anc: false,
      foldable: true,
      housing: 'Maple Wood',
      weight: '243g',
      compatibility: ['Portable Audio Players', 'Mobile Devices', 'Home Audio'],
      accessories: ['Carrying Case', 'Two Detachable Cables']
    },
    variants: [
      {
        name: 'Audio-Technica ATH-WP900 Maple Wood',
        color: 'Maple Wood',
        image: '/images/products/MusicHeadsets/Audio-Technica ATH-WP900 Portable Wooden Headphones maple wood.png',
        price: 5499000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 30
    },
    reviews: 30
  }
];


// ... existing code ...

// Noise Cancelling Headsets
let noiseCancellingHeadsets = [
  {
    name: 'Apple AirPods Max',
    category: 'Headset',
    subCategory: 'Noise Cancelling',
    brand: 'Apple',
    price: 8999000,
    stock: 25,
    weight: generateWeight(350, 450),
    dimensions: generateDimensions(),
    images: [
      '/images/products/CancellingHeadsets/Apple AirPods Max 1.png',
      '/images/products/CancellingHeadsets/Apple AirPods Max 2.png'
    ],
    mainImage: '/images/products/CancellingHeadsets/Apple AirPods Max:main.png',
    description: 'Headphone premium dengan teknologi Active Noise Cancellation dan Transparency Mode. Dilengkapi dengan driver dinamis yang dirancang khusus oleh Apple dan chip H1 untuk pengalaman audio komputasional yang luar biasa.',
    specs: {
      type: 'Over-ear',
      driver: 'Apple-designed Dynamic Driver',
      frequency: '20Hz-20kHz',
      connectivity: 'Bluetooth 5.0',
      batteryLife: '20 jam (dengan ANC)',
      microphone: 'Beamforming dengan Voice Isolation',
      noiseIsolation: true,
      anc: true,
      spatialAudio: true,
      weight: '384.8g',
      compatibility: ['iPhone', 'iPad', 'Mac', 'Apple TV', 'Apple Watch']
    },
    variants: [
      {
        name: 'Apple AirPods Max Space Gray',
        color: 'Space Gray',
        image: '/images/products/CancellingHeadsets/Apple AirPods Max space gray.png',
        price: 8999000
      },
      {
        name: 'Apple AirPods Max Silver',
        color: 'Silver',
        image: '/images/products/CancellingHeadsets/Apple AirPods Max silver.png',
        price: 8999000
      },
      {
        name: 'Apple AirPods Max Blue',
        color: 'Blue',
        image: '/images/products/CancellingHeadsets/Apple AirPods Max blue.png',
        price: 8999000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 95
    },
    reviews: 95,
    features: [
      'Active Noise Cancellation',
      'Transparency Mode',
      'Spatial Audio dengan Dynamic Head Tracking',
      'Adaptive EQ',
      'Digital Crown untuk kontrol volume dan playback',
      'Sensor optik dan posisi',
      'Case Smart yang menghemat baterai',
      'Seamless switching antar perangkat Apple'
    ]
  }
];


// ==================== SWITCH ====================

// Linear Switches
let linearSwitches = [
  {
    name: 'Akko CS Jelly Black Linear Switches',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Akko',
    price: 299000,
    stock: 100,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/LinearSwitches/Akko CS Jelly Black Linear Switches 1.png',
      '/images/products/LinearSwitches/Akko CS Jelly Black Linear Switches 2.png',
      '/images/products/LinearSwitches/Akko CS Jelly Black Linear Switches 45.png',
      '/images/products/LinearSwitches/Akko CS Jelly Black Linear Switches 90.png'
    ],
    mainImage: '/images/products/LinearSwitches/Akko CS Jelly Black Linear Switches:main.png',
    description: 'Switch linear premium dengan desain stem yang unik dan performa yang halus. Akko CS Jelly Black menawarkan pengalaman mengetik yang mulus dengan suara yang lembut.',
    specs: {
      type: 'Linear',
      actuationForce: '45g',
      bottomOutForce: '60g',
      preTravel: '1.9mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Nylon (Top) / Polycarbonate (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 45/90 switches'
    },
    variants: [
      {
        name: 'Akko CS Jelly Black 45 pcs',
        quantity: '45 pcs',
        image: '/images/products/LinearSwitches/Akko CS Jelly Black Linear Switches 45.png',
        price: 299000
      },
      {
        name: 'Akko CS Jelly Black 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/LinearSwitches/Akko CS Jelly Black Linear Switches 90.png',
        price: 549000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '1 bulan',
    rating: {
      average: 4.7,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Akko CS Silver Linear Switches',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Akko',
    price: 299000,
    stock: 100,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/LinearSwitches/Akko CS Silver Linear Switches 1.png',
      '/images/products/LinearSwitches/Akko CS Silver Linear Switches 2.png',
      '/images/products/LinearSwitches/Akko CS Silver Linear Switches 45.png',
      '/images/products/LinearSwitches/Akko CS Silver Linear Switches 90.png'
    ],
    mainImage: '/images/products/LinearSwitches/Akko CS Silver Linear Switches:main.png',
    description: 'Switch linear dengan jarak pre-travel yang pendek, ideal untuk gaming. Akko CS Silver menawarkan respons yang cepat dengan suara yang halus dan minim gesekan.',
    specs: {
      type: 'Linear',
      actuationForce: '43g',
      bottomOutForce: '55g',
      preTravel: '1.0mm',
      totalTravel: '3.5mm',
      stem: 'POM',
      housing: 'Nylon (Top) / Polycarbonate (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 45/90 switches'
    },
    variants: [
      {
        name: 'Akko CS Silver 45 pcs',
        quantity: '45 pcs',
        image: '/images/products/LinearSwitches/Akko CS Silver Linear Switches 45.png',
        price: 299000
      },
      {
        name: 'Akko CS Silver 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/LinearSwitches/Akko CS Silver Linear Switches 90.png',
        price: 549000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 bulan',
    rating: {
      average: 4.6,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Cherry MX Red RGB Linear Switches',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Cherry',
    price: 399000,
    stock: 80,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/LinearSwitches/Cherry MX Red RGB Linear Switches 1.png',
      '/images/products/LinearSwitches/Cherry MX Red RGB Linear Switches 2.png',
      '/images/products/LinearSwitches/Cherry MX Red RGB Linear Switches 70.png',
      '/images/products/LinearSwitches/Cherry MX Red RGB Linear Switches 90.png'
    ],
    mainImage: '/images/products/LinearSwitches/Cherry MX Red RGB Linear Switches:main.png',
    description: 'Switch linear klasik dengan housing transparan untuk RGB. Cherry MX Red adalah standar industri untuk switch gaming dengan performa yang konsisten dan tahan lama.',
    specs: {
      type: 'Linear',
      actuationForce: '45g',
      bottomOutForce: '60g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Polycarbonate (Transparent)',
      spring: 'Stainless Steel',
      pins: '3-pin (PCB-mount)',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches',
      lifespan: '100 million keystrokes'
    },
    variants: [
      {
        name: 'Cherry MX Red RGB 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/LinearSwitches/Cherry MX Red RGB Linear Switches 70.png',
        price: 399000
      },
      {
        name: 'Cherry MX Red RGB 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/LinearSwitches/Cherry MX Red RGB Linear Switches 90.png',
        price: 499000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Cherry MX Black RGB Linear Switches',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Cherry',
    price: 399000,
    stock: 70,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/LinearSwitches/Cherry MX Black RGB Linear Switches 1.png',
      '/images/products/LinearSwitches/Cherry MX Black RGB Linear Switches 2.png',
      '/images/products/LinearSwitches/Salinan Cherry MX Black RGB Linear Switches 70.png',
      '/images/products/LinearSwitches/Cherry MX Black RGB Linear Switches 90.png'
    ],
    mainImage: '/images/products/LinearSwitches/Cherry MX Black RGB Linear Switches:main.png',
    description: 'Switch linear dengan gaya tekan yang lebih berat dan housing transparan untuk RGB. Cherry MX Black menawarkan pengalaman mengetik yang lebih tegas dengan performa yang konsisten.',
    specs: {
      type: 'Linear',
      actuationForce: '60g',
      bottomOutForce: '80g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Polycarbonate (Transparent)',
      spring: 'Stainless Steel',
      pins: '3-pin (PCB-mount)',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches',
      lifespan: '100 million keystrokes'
    },
    variants: [
      {
        name: 'Cherry MX Black RGB 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/LinearSwitches/Salinan Cherry MX Black RGB Linear Switches 70.png',
        price: 399000
      },
      {
        name: 'Cherry MX Black RGB 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/LinearSwitches/Cherry MX Black RGB Linear Switches 90.png',
        price: 499000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'Gateron CJ Linear Switches',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Gateron',
    price: 349000,
    stock: 90,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/LinearSwitches/Gateron CJ Linear Switches 1.png',
      '/images/products/LinearSwitches/Gateron CJ Linear Switches 2.png',
      '/images/products/LinearSwitches/Gateron CJ Linear Switches 70.png',
      '/images/products/LinearSwitches/Gateron CJ Linear Switches 90.png'
    ],
    mainImage: '/images/products/LinearSwitches/Gateron CJ Linear Switches:main.png',
    description: 'Switch linear premium dengan suara yang halus dan performa yang mulus. Gateron CJ menawarkan pengalaman mengetik yang premium dengan minimal wobble dan suara yang lembut.',
    specs: {
      type: 'Linear',
      actuationForce: '45g',
      bottomOutForce: '63g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Nylon (Top) / Nylon (Bottom)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Gateron CJ 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/LinearSwitches/Gateron CJ Linear Switches 70.png',
        price: 349000
      },
      {
        name: 'Gateron CJ 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/LinearSwitches/Gateron CJ Linear Switches 90.png',
        price: 449000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 75
    },
    reviews: 75
  },
  {
    name: 'Gateron Milky Yellow Pro Linear Switches',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'Gateron',
    price: 249000,
    stock: 120,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/LinearSwitches/Gateron Milky Yellow Pro Linear Switches 2.png',
      '/images/products/LinearSwitches/Gateron Milky Yellow Pro Linear Switches 70.png',
      '/images/products/LinearSwitches/Gateron Milky Yellow Pro Linear Switches 90.png',
      '/images/products/LinearSwitches/Gateron Milky Yellow Pro Linear Switches 110.png'
    ],
    mainImage: '/images/products/LinearSwitches/Gateron Milky Yellow Pro Linear Switches 2.png',
    description: 'Switch linear ekonomis dengan performa yang luar biasa. Gateron Milky Yellow Pro menawarkan pengalaman mengetik yang halus dengan harga yang terjangkau.',
    specs: {
      type: 'Linear',
      actuationForce: '50g',
      bottomOutForce: '63.5g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Milky Nylon (Top) / Milky Nylon (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 70/90/110 switches'
    },
    variants: [
      {
        name: 'Gateron Milky Yellow Pro 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/LinearSwitches/Gateron Milky Yellow Pro Linear Switches 70.png',
        price: 249000
      },
      {
        name: 'Gateron Milky Yellow Pro 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/LinearSwitches/Gateron Milky Yellow Pro Linear Switches 90.png',
        price: 319000
      },
      {
        name: 'Gateron Milky Yellow Pro 110 pcs',
        quantity: '110 pcs',
        image: '/images/products/LinearSwitches/Gateron Milky Yellow Pro Linear Switches 110.png',
        price: 379000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '1 tahun',
    rating: {
      average: 4.6,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'JWK/Durock Linear Switches',
    category: 'Switch',
    subCategory: 'Linear',
    brand: 'JWK/Durock',
    price: 379000,
    stock: 80,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/LinearSwitches/JWK:Durock Linear Switches 1.png',
      '/images/products/LinearSwitches/JWK:Durock Linear Switches 2.png',
      '/images/products/LinearSwitches/JWK:Durock Linear Switches 70.png',
      '/images/products/LinearSwitches/JWK:Durock Linear Switches 90.png'
    ],
    mainImage: '/images/products/LinearSwitches/JWK:Durock Linear Switches:main.png',
    description: 'Switch linear premium dengan toleransi yang ketat dan performa yang halus. JWK/Durock Linear menawarkan pengalaman mengetik yang premium dengan minimal wobble dan suara yang lembut.',
    specs: {
      type: 'Linear',
      actuationForce: '67g',
      bottomOutForce: '78g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Polycarbonate (Top) / Nylon (Bottom)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'JWK/Durock Linear 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/LinearSwitches/JWK:Durock Linear Switches 70.png',
        price: 379000
      },
      {
        name: 'JWK/Durock Linear 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/LinearSwitches/JWK:Durock Linear Switches 90.png',
        price: 479000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.9,
      count: 60
    },
    reviews: 60
  }
];


// ... existing code ...

// Tactile Switches
let tactileSwitches = [
  {
    name: 'Akko CS Lavender Purple Tactile Switches',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Akko',
    price: 299000,
    stock: 100,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/TactileSwitches/Akko CS Lavender Purple Tactile Switches 1.png',
      '/images/products/TactileSwitches/Akko CS Lavender Purple Tactile Switches 2.png',
      '/images/products/TactileSwitches/Akko CS Lavender Purple Tactile Switches 45.png',
      '/images/products/TactileSwitches/Akko CS Lavender Purple Tactile Switches 90.png'
    ],
    mainImage: '/images/products/TactileSwitches/Akko CS Lavender Purple Tactile Switches:main.png',
    description: 'Switch tactile premium dengan titik taktil yang jelas dan suara yang lembut. Akko CS Lavender Purple menawarkan pengalaman mengetik yang nyaman dengan feedback taktil yang memuaskan.',
    specs: {
      type: 'Tactile',
      actuationForce: '50g',
      bottomOutForce: '65g',
      preTravel: '1.9mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Nylon (Top) / Polycarbonate (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 45/90 switches'
    },
    variants: [
      {
        name: 'Akko CS Lavender Purple 45 pcs',
        quantity: '45 pcs',
        image: '/images/products/TactileSwitches/Akko CS Lavender Purple Tactile Switches 45.png',
        price: 299000
      },
      {
        name: 'Akko CS Lavender Purple 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/TactileSwitches/Akko CS Lavender Purple Tactile Switches 90.png',
        price: 549000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '1 bulan',
    rating: {
      average: 4.7,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Akko CS Ocean Blue Tactile Switches',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Akko',
    price: 299000,
    stock: 100,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/TactileSwitches/Akko CS Ocean Blue Tactile Switches 1.png',
      '/images/products/TactileSwitches/Akko CS Ocean Blue Tactile Switches 2.png',
      '/images/products/TactileSwitches/Akko CS Ocean Blue Tactile Switches 45.png',
      '/images/products/TactileSwitches/Akko CS Ocean Blue Tactile Switches 90.png'
    ],
    mainImage: '/images/products/TactileSwitches/Akko CS Ocean Blue Tactile Switches:main.png',
    description: 'Switch tactile dengan titik taktil yang lebih kuat dan suara yang lebih jelas. Akko CS Ocean Blue menawarkan pengalaman mengetik yang responsif dengan feedback taktil yang tegas.',
    specs: {
      type: 'Tactile',
      actuationForce: '55g',
      bottomOutForce: '68g',
      preTravel: '1.9mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Nylon (Top) / Polycarbonate (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 45/90 switches'
    },
    variants: [
      {
        name: 'Akko CS Ocean Blue 45 pcs',
        quantity: '45 pcs',
        image: '/images/products/TactileSwitches/Akko CS Ocean Blue Tactile Switches 45.png',
        price: 299000
      },
      {
        name: 'Akko CS Ocean Blue 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/TactileSwitches/Akko CS Ocean Blue Tactile Switches 90.png',
        price: 549000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 bulan',
    rating: {
      average: 4.6,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Cherry MX Brown RGB Tactile Switches',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Cherry',
    price: 399000,
    stock: 80,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/TactileSwitches/Cherry MX Brown RGB Tactile Switches 1.png',
      '/images/products/TactileSwitches/Cherry MX Brown RGB Tactile Switches 2.png',
      '/images/products/TactileSwitches/Cherry MX Brown RGB Tactile Switches 70.png',
      '/images/products/TactileSwitches/Cherry MX Brown RGB Tactile Switches 90.png'
    ],
    mainImage: '/images/products/TactileSwitches/Cherry MX Brown RGB Tactile Switches:main.png',
    description: 'Switch tactile klasik dengan housing transparan untuk RGB. Cherry MX Brown adalah standar industri untuk switch tactile dengan performa yang konsisten dan tahan lama.',
    specs: {
      type: 'Tactile',
      actuationForce: '45g',
      bottomOutForce: '60g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Polycarbonate (Transparent)',
      spring: 'Stainless Steel',
      pins: '3-pin (PCB-mount)',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches',
      lifespan: '100 million keystrokes'
    },
    variants: [
      {
        name: 'Cherry MX Brown RGB 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/TactileSwitches/Cherry MX Brown RGB Tactile Switches 70.png',
        price: 399000
      },
      {
        name: 'Cherry MX Brown RGB 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/TactileSwitches/Cherry MX Brown RGB Tactile Switches 90.png',
        price: 499000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Durock Koala Tactile Switches',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Durock',
    price: 379000,
    stock: 70,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/TactileSwitches/Durock Koala Tactile Switches 1.png',
      '/images/products/TactileSwitches/Durock Koala Tactile Switches 2.png',
      '/images/products/TactileSwitches/Durock Koala Tactile Switches 70.png',
      '/images/products/TactileSwitches/Durock Koala Tactile Switches 90.png.png'
    ],
    mainImage: '/images/products/TactileSwitches/Durock Koala Tactile Switches:main.png',
    description: 'Switch tactile premium dengan titik taktil yang kuat dan suara yang unik. Durock Koala menawarkan pengalaman mengetik yang premium dengan minimal wobble dan feedback taktil yang memuaskan.',
    specs: {
      type: 'Tactile',
      actuationForce: '62g',
      bottomOutForce: '67g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Nylon (Top) / Nylon (Bottom)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Durock Koala 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/TactileSwitches/Durock Koala Tactile Switches 70.png',
        price: 379000
      },
      {
        name: 'Durock Koala 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/TactileSwitches/Durock Koala Tactile Switches 90.png.png',
        price: 479000
      }
    ],
    isFeatured: false,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 55
    },
    reviews: 55
  },
  {
    name: 'Durock T1 Tactile Switches',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Durock',
    price: 399000,
    stock: 60,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/TactileSwitches/Durock T1 Tactile Switches 1.png',
      '/images/products/TactileSwitches/Durock T1 Tactile Switches 2.png',
      '/images/products/TactileSwitches/Durock T1 Tactile Switches 70.png',
      '/images/products/TactileSwitches/Durock T1 Tactile Switches 90.png .png'
    ],
    mainImage: '/images/products/TactileSwitches/Durock T1 Tactile Switches:main.png',
    description: 'Switch tactile premium dengan titik taktil yang sangat kuat dan suara yang tegas. Durock T1 menawarkan pengalaman mengetik yang premium dengan feedback taktil yang jelas dan tegas.',
    specs: {
      type: 'Tactile',
      actuationForce: '67g',
      bottomOutForce: '72g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Polycarbonate (Top) / Nylon (Bottom)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Durock T1 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/TactileSwitches/Durock T1 Tactile Switches 70.png',
        price: 399000
      },
      {
        name: 'Durock T1 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/TactileSwitches/Durock T1 Tactile Switches 90.png .png',
        price: 499000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.9,
      count: 45
    },
    reviews: 45
  },
  {
    name: 'Gateron Brown Pro Tactile Switches',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Gateron',
    price: 249000,
    stock: 120,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/TactileSwitches/Gateron Brown Pro Tactile Switches 1.png',
      '/images/products/TactileSwitches/Gateron Brown Pro Tactile Switches 2.png',
      '/images/products/TactileSwitches/Gateron Brown Pro Tactile Switches 70.png',
      '/images/products/TactileSwitches/Gateron Brown Pro Tactile Switches 90.png',
      '/images/products/TactileSwitches/Gateron Brown Pro Tactile Switches 110.png'
    ],
    mainImage: '/images/products/TactileSwitches/Gateron Brown Pro Tactile Switches 1.png',
    description: 'Switch tactile ekonomis dengan performa yang luar biasa. Gateron Brown Pro menawarkan pengalaman mengetik yang nyaman dengan titik taktil yang halus dan harga yang terjangkau.',
    specs: {
      type: 'Tactile',
      actuationForce: '55g',
      bottomOutForce: '60g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Nylon (Top) / Nylon (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 70/90/110 switches'
    },
    variants: [
      {
        name: 'Gateron Brown Pro 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/TactileSwitches/Gateron Brown Pro Tactile Switches 70.png',
        price: 249000
      },
      {
        name: 'Gateron Brown Pro 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/TactileSwitches/Gateron Brown Pro Tactile Switches 90.png',
        price: 319000
      },
      {
        name: 'Gateron Brown Pro 110 pcs',
        quantity: '110 pcs',
        image: '/images/products/TactileSwitches/Gateron Brown Pro Tactile Switches 110.png',
        price: 379000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '1 tahun',
    rating: {
      average: 4.6,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'Gateron Kangaroo Ink Tactile Switches',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Gateron',
    price: 449000,
    stock: 50,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/TactileSwitches/Gateron Kangaroo Ink Tactile Switches 1.png',
      '/images/products/TactileSwitches/Gateron Kangaroo Ink Tactile Switches 2.png',
      '/images/products/TactileSwitches/Gateron Kangaroo Ink Tactile Switches:main 70.png',
      '/images/products/TactileSwitches/Gateron Kangaroo Ink Tactile Switches:main 90.png'
    ],
    mainImage: '/images/products/TactileSwitches/Gateron Kangaroo Ink Tactile Switches:main.png',
    description: 'Switch tactile premium dari seri Ink dengan titik taktil yang halus dan suara yang lembut. Gateron Kangaroo Ink menawarkan pengalaman mengetik yang premium dengan housing Ink yang khas.',
    specs: {
      type: 'Tactile',
      actuationForce: '58g',
      bottomOutForce: '67g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Ink Housing (Top & Bottom)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Gateron Kangaroo Ink 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/TactileSwitches/Gateron Kangaroo Ink Tactile Switches:main 70.png',
        price: 449000
      },
      {
        name: 'Gateron Kangaroo Ink 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/TactileSwitches/Gateron Kangaroo Ink Tactile Switches:main 90.png',
        price: 579000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.9,
      count: 40
    },
    reviews: 40
  },
  {
    name: 'Glorious Panda Tactile Switches',
    category: 'Switch',
    subCategory: 'Tactile',
    brand: 'Glorious',
    price: 399000,
    stock: 60,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/TactileSwitches/Glorious Panda Tactile Switches 1.png',
      '/images/products/TactileSwitches/Glorious Panda Tactile Switches 2.png',
      '/images/products/TactileSwitches/Glorious Panda Tactile Switches 36.png',
      '/images/products/TactileSwitches/Glorious Panda Tactile Switches 70.png',
      '/images/products/TactileSwitches/Glorious Panda Tactile Switches 110.png'
    ],
    mainImage: '/images/products/TactileSwitches/Glorious Panda Tactile Switches:main.png',
    description: 'Switch tactile premium dengan titik taktil yang kuat dan suara yang unik. Glorious Panda menawarkan pengalaman mengetik yang premium dengan feedback taktil yang tegas dan suara yang khas.',
    specs: {
      type: 'Tactile',
      actuationForce: '67g',
      bottomOutForce: '78g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Polycarbonate (Top) / Nylon (Bottom)',
      spring: 'Gold-plated',
      pins: '3-pin',
      factory: 'Lightly lubed',
      quantity: 'Pack of 36/70/110 switches'
    },
    variants: [
      {
        name: 'Glorious Panda 36 pcs',
        quantity: '36 pcs',
        image: '/images/products/TactileSwitches/Glorious Panda Tactile Switches 36.png',
        price: 399000
      },
      {
        name: 'Glorious Panda 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/TactileSwitches/Glorious Panda Tactile Switches 70.png',
        price: 599000
      },
      {
        name: 'Glorious Panda 110 pcs',
        quantity: '110 pcs',
        image: '/images/products/TactileSwitches/Glorious Panda Tactile Switches 110.png',
        price: 899000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 75
    },
    reviews: 75
  }
];


// ... existing code ...

// Clicky Switches
let clickySwitches = [
  {
    name: 'Akko CS Crystal Clicky Switches',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Akko',
    price: 299000,
    stock: 100,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ClickySwitches/Akko CS Crystal Clicky Switches 1.png',
      '/images/products/ClickySwitches/Akko CS Crystal Clicky Switches 2.png',
      '/images/products/ClickySwitches/Akko CS Crystal Clicky Switches 45.png',
      '/images/products/ClickySwitches/Akko CS Crystal Clicky Switches 90.png'
    ],
    mainImage: '/images/products/ClickySwitches/Akko CS Crystal Clicky Switches:main.png',
    description: 'Switch clicky premium dengan suara yang jelas dan performa yang responsif. Akko CS Crystal menawarkan pengalaman mengetik yang memuaskan dengan feedback taktil dan suara klik yang khas.',
    specs: {
      type: 'Clicky',
      actuationForce: '45g',
      bottomOutForce: '60g',
      preTravel: '1.9mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Polycarbonate (Transparent)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 45/90 switches'
    },
    variants: [
      {
        name: 'Akko CS Crystal 45 pcs',
        quantity: '45 pcs',
        image: '/images/products/ClickySwitches/Akko CS Crystal Clicky Switches 45.png',
        price: 299000
      },
      {
        name: 'Akko CS Crystal 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/ClickySwitches/Akko CS Crystal Clicky Switches 90.png',
        price: 549000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 bulan',
    rating: {
      average: 4.6,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Cherry MX Blue RGB Clicky Switches',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Cherry',
    price: 399000,
    stock: 80,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ClickySwitches/Cherry MX Blue RGB Clicky Switches 1.png',
      '/images/products/ClickySwitches/Cherry MX Blue RGB Clicky Switches 2.png',
      '/images/products/ClickySwitches/Cherry MX Blue RGB Clicky Switches 70.png',
      '/images/products/ClickySwitches/Cherry MX Blue RGB Clicky Switches 90.png'
    ],
    mainImage: '/images/products/ClickySwitches/Cherry MX Blue RGB Clicky Switches:main.png',
    description: 'Switch clicky klasik dengan housing transparan untuk RGB. Cherry MX Blue adalah standar industri untuk switch clicky dengan performa yang konsisten dan tahan lama.',
    specs: {
      type: 'Clicky',
      actuationForce: '50g',
      bottomOutForce: '60g',
      preTravel: '2.2mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Polycarbonate (Transparent)',
      spring: 'Stainless Steel',
      pins: '3-pin (PCB-mount)',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches',
      lifespan: '100 million keystrokes'
    },
    variants: [
      {
        name: 'Cherry MX Blue RGB 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/ClickySwitches/Cherry MX Blue RGB Clicky Switches 70.png',
        price: 399000
      },
      {
        name: 'Cherry MX Blue RGB 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/ClickySwitches/Cherry MX Blue RGB Clicky Switches 90.png',
        price: 499000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.7,
      count: 120
    },
    reviews: 120
  },
  {
    name: 'Cherry MX Green RGB Clicky Switches',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Cherry',
    price: 429000,
    stock: 60,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ClickySwitches/Cherry MX Green RGB Clicky Switches 1.png',
      '/images/products/ClickySwitches/Cherry MX Green RGB Clicky Switches 2.png',
      '/images/products/ClickySwitches/Cherry MX Green RGB Clicky Switches 70.png',
      '/images/products/ClickySwitches/Cherry MX Green RGB Clicky Switches 90.png'
    ],
    mainImage: '/images/products/ClickySwitches/Cherry MX Green RGB Clicky Switches:main.png',
    description: 'Switch clicky dengan gaya tekan yang lebih berat dan housing transparan untuk RGB. Cherry MX Green menawarkan pengalaman mengetik yang lebih tegas dengan suara klik yang jelas.',
    specs: {
      type: 'Clicky',
      actuationForce: '70g',
      bottomOutForce: '80g',
      preTravel: '2.2mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Polycarbonate (Transparent)',
      spring: 'Stainless Steel',
      pins: '3-pin (PCB-mount)',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches',
      lifespan: '100 million keystrokes'
    },
    variants: [
      {
        name: 'Cherry MX Green RGB 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/ClickySwitches/Cherry MX Green RGB Clicky Switches 70.png',
        price: 429000
      },
      {
        name: 'Cherry MX Green RGB 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/ClickySwitches/Cherry MX Green RGB Clicky Switches 90.png',
        price: 529000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: false,
    discount: 0,
    warranty: '2 tahun',
    rating: {
      average: 4.6,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Gateron Blue Clicky Switches',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Gateron',
    price: 249000,
    stock: 120,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ClickySwitches/Gateron Blue Clicky Switches 1.png',
      '/images/products/ClickySwitches/Gateron Blue Clicky Switches 2.png',
      '/images/products/ClickySwitches/Gateron Blue Clicky Switches 70.png',
      '/images/products/ClickySwitches/Gateron Blue Clicky Switches 90.png',
      '/images/products/ClickySwitches/Gateron Blue Clicky Switches 110.png'
    ],
    mainImage: '/images/products/ClickySwitches/Gateron Blue Clicky Switches 1.png',
    description: 'Switch clicky ekonomis dengan performa yang luar biasa. Gateron Blue menawarkan pengalaman mengetik yang responsif dengan suara klik yang jelas dan harga yang terjangkau.',
    specs: {
      type: 'Clicky',
      actuationForce: '55g',
      bottomOutForce: '60g',
      preTravel: '2.3mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Nylon (Top) / Nylon (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 70/90/110 switches'
    },
    variants: [
      {
        name: 'Gateron Blue 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/ClickySwitches/Gateron Blue Clicky Switches 70.png',
        price: 249000
      },
      {
        name: 'Gateron Blue 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/ClickySwitches/Gateron Blue Clicky Switches 90.png',
        price: 319000
      },
      {
        name: 'Gateron Blue 110 pcs',
        quantity: '110 pcs',
        image: '/images/products/ClickySwitches/Gateron Blue Clicky Switches 110.png',
        price: 379000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '1 tahun',
    rating: {
      average: 4.5,
      count: 150
    },
    reviews: 150
  },
  {
    name: 'Gateron Green Clicky Switches',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Gateron',
    price: 269000,
    stock: 90,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ClickySwitches/Gateron Green Clicky Switches 1.png',
      '/images/products/ClickySwitches/Gateron Green Clicky Switches 2.png',
      '/images/products/ClickySwitches/Gateron Green Clicky Switches 70.png',
      '/images/products/ClickySwitches/Gateron Green Clicky Switches 90.png'
    ],
    mainImage: '/images/products/ClickySwitches/Gateron Green Clicky Switches:main.png',
    description: 'Switch clicky dengan gaya tekan yang lebih berat. Gateron Green menawarkan pengalaman mengetik yang lebih tegas dengan suara klik yang jelas dan feedback taktil yang kuat.',
    specs: {
      type: 'Clicky',
      actuationForce: '65g',
      bottomOutForce: '80g',
      preTravel: '2.3mm',
      totalTravel: '4.0mm',
      stem: 'POM',
      housing: 'Nylon (Top) / Nylon (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Gateron Green 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/ClickySwitches/Gateron Green Clicky Switches 70.png',
        price: 269000
      },
      {
        name: 'Gateron Green 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/ClickySwitches/Gateron Green Clicky Switches 90.png',
        price: 339000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: false,
    discount: 5,
    warranty: '1 tahun',
    rating: {
      average: 4.4,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'Kailh Box Jade Clicky Switches',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Kailh',
    price: 349000,
    stock: 70,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ClickySwitches/Kailh Box Jade Clicky Switches 1.png',
      '/images/products/ClickySwitches/Kailh Box Jade Clicky Switches 2.png',
      '/images/products/ClickySwitches/Kailh Box Jade Clicky Switches 70.png',
      '/images/products/ClickySwitches/Kailh Box Jade Clicky Switches 90.png'
    ],
    mainImage: '/images/products/ClickySwitches/Kailh Box Jade Clicky Switches:main.png',
    description: 'Switch clicky premium dengan teknologi Box dan suara klik yang sangat jelas. Kailh Box Jade menawarkan pengalaman mengetik yang unik dengan feedback taktil yang kuat dan suara klik yang tajam.',
    specs: {
      type: 'Clicky',
      actuationForce: '50g',
      bottomOutForce: '60g',
      preTravel: '1.8mm',
      totalTravel: '3.6mm',
      stem: 'POM',
      housing: 'Box Design (Dust & Water Resistant)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Factory lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Kailh Box Jade 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/ClickySwitches/Kailh Box Jade Clicky Switches 70.png',
        price: 349000
      },
      {
        name: 'Kailh Box Jade 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/ClickySwitches/Kailh Box Jade Clicky Switches 90.png',
        price: 449000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Kailh Box Navy Clicky Switches',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Kailh',
    price: 369000,
    stock: 60,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ClickySwitches/Kailh Box Navy Clicky Switches 1.png',
      '/images/products/ClickySwitches/Kailh Box Navy Clicky Switches 2.png',
      '/images/products/ClickySwitches/Kailh Box Navy Clicky Switches 70.png',
      '/images/products/ClickySwitches/Kailh Box Navy Clicky Switches 90.png'
    ],
    mainImage: '/images/products/ClickySwitches/Kailh Box Navy Clicky Switches:main.png',
    description: 'Switch clicky premium dengan teknologi Box dan gaya tekan yang lebih berat. Kailh Box Navy menawarkan pengalaman mengetik yang unik dengan feedback taktil yang sangat kuat dan suara klik yang tajam.',
    specs: {
      type: 'Clicky',
      actuationForce: '60g',
      bottomOutForce: '90g',
      preTravel: '1.8mm',
      totalTravel: '3.6mm',
      stem: 'POM',
      housing: 'Box Design (Dust & Water Resistant)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Factory lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Kailh Box Navy 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/ClickySwitches/Kailh Box Navy Clicky Switches 70.png',
        price: 369000
      },
      {
        name: 'Kailh Box Navy 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/ClickySwitches/Kailh Box Navy Clicky Switches 90.png',
        price: 469000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.9,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Kailh Box White Clicky Switches',
    category: 'Switch',
    subCategory: 'Clicky',
    brand: 'Kailh',
    price: 329000,
    stock: 80,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/ClickySwitches/Kailh Box White Clicky Switches 1.png',
      '/images/products/ClickySwitches/Kailh Box White Clicky Switches 2.png',
      '/images/products/ClickySwitches/Kailh Box White Clicky Switches 70.png',
      '/images/products/ClickySwitches/Kailh Box White Clicky Switches 90.png'
    ],
    mainImage: '/images/products/ClickySwitches/Kailh Box White Clicky Switches:main.png',
    description: 'Switch clicky premium dengan teknologi Box dan gaya tekan yang ringan. Kailh Box White menawarkan pengalaman mengetik yang responsif dengan feedback taktil yang jelas dan suara klik yang tajam.',
    specs: {
      type: 'Clicky',
      actuationForce: '45g',
      bottomOutForce: '55g',
      preTravel: '1.8mm',
      totalTravel: '3.6mm',
      stem: 'POM',
      housing: 'Box Design (Dust & Water Resistant)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Factory lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Kailh Box White 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/ClickySwitches/Kailh Box White Clicky Switches 70.png',
        price: 329000
      },
      {
        name: 'Kailh Box White 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/ClickySwitches/Kailh Box White Clicky Switches 90.png',
        price: 429000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 95
    },
    reviews: 95
  }
];


// Silent Switches
let silentSwitches = [
  {
    name: 'Cherry MX Silent Red RGB Linear Switches',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Cherry',
    price: 429000,
    stock: 80,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SilentSwitches/Cherry MX Silent Red RGB Linear Switches 1.png',
      '/images/products/SilentSwitches/Cherry MX Silent Red RGB Linear Switches 2.png',
      '/images/products/SilentSwitches/Cherry MX Silent Red RGB Linear Switches 70.png',
      '/images/products/SilentSwitches/Cherry MX Silent Red RGB Linear Switches 90.png'
    ],
    mainImage: '/images/products/SilentSwitches/Cherry MX Silent Red RGB Linear Switches:main.png',
    description: 'Switch linear silent premium dengan housing transparan untuk RGB. Cherry MX Silent Red menawarkan pengalaman mengetik yang halus dan sangat tenang dengan teknologi peredam suara khusus.',
    specs: {
      type: 'Linear Silent',
      actuationForce: '45g',
      bottomOutForce: '60g',
      preTravel: '1.9mm',
      totalTravel: '3.7mm',
      stem: 'POM dengan teknologi peredam',
      housing: 'Polycarbonate (Transparent)',
      spring: 'Stainless Steel',
      pins: '3-pin (PCB-mount)',
      factory: 'Lightly lubed',
      quantity: 'Pack of 70/90 switches',
      lifespan: '100 million keystrokes'
    },
    variants: [
      {
        name: 'Cherry MX Silent Red RGB 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/SilentSwitches/Cherry MX Silent Red RGB Linear Switches 70.png',
        price: 429000
      },
      {
        name: 'Cherry MX Silent Red RGB 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/SilentSwitches/Cherry MX Silent Red RGB Linear Switches 90.png',
        price: 529000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '2 tahun',
    rating: {
      average: 4.8,
      count: 95
    },
    reviews: 95
  },
  {
    name: 'Durock Dolphin Silent Linear Switches',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Durock',
    price: 399000,
    stock: 70,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SilentSwitches/Durock Dolphin Silent Linear Switches 1.png',
      '/images/products/SilentSwitches/Durock Dolphin Silent Linear Switches 2.png',
      '/images/products/SilentSwitches/Durock Dolphin Silent Linear Switches 70.png',
      '/images/products/SilentSwitches/Durock Dolphin Silent Linear Switches 90.png'
    ],
    mainImage: '/images/products/SilentSwitches/Durock Dolphin Silent Linear Switches:main.png',
    description: 'Switch linear silent premium dengan performa yang halus dan suara yang sangat minim. Durock Dolphin menawarkan pengalaman mengetik yang premium dengan minimal wobble dan suara yang sangat tenang.',
    specs: {
      type: 'Linear Silent',
      actuationForce: '62g',
      bottomOutForce: '67g',
      preTravel: '2.0mm',
      totalTravel: '3.8mm',
      stem: 'POM dengan teknologi peredam',
      housing: 'Polycarbonate (Top) / Nylon (Bottom)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Factory lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Durock Dolphin 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/SilentSwitches/Durock Dolphin Silent Linear Switches 70.png',
        price: 399000
      },
      {
        name: 'Durock Dolphin 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/SilentSwitches/Durock Dolphin Silent Linear Switches 90.png',
        price: 499000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.9,
      count: 65
    },
    reviews: 65
  },
  {
    name: 'Durock Shrimp Silent Tactile Switches',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Durock',
    price: 419000,
    stock: 60,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SilentSwitches/Durock Shrimp Silent Tactile Switches 1.png',
      '/images/products/SilentSwitches/Durock Shrimp Silent Tactile Switches 2.png',
      '/images/products/SilentSwitches/Durock Shrimp Silent Tactile Switches 70.png',
      '/images/products/SilentSwitches/Durock Shrimp Silent Tactile Switches 90.png'
    ],
    mainImage: '/images/products/SilentSwitches/Durock Shrimp Silent Tactile Switches:main.png',
    description: 'Switch tactile silent premium dengan titik taktil yang jelas namun suara yang sangat minim. Durock Shrimp menawarkan pengalaman mengetik yang premium dengan feedback taktil yang memuaskan namun tetap tenang.',
    specs: {
      type: 'Tactile Silent',
      actuationForce: '67g',
      bottomOutForce: '72g',
      preTravel: '2.0mm',
      totalTravel: '3.8mm',
      stem: 'POM dengan teknologi peredam',
      housing: 'Polycarbonate (Top) / Nylon (Bottom)',
      spring: 'Gold-plated',
      pins: '5-pin',
      factory: 'Factory lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Durock Shrimp 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/SilentSwitches/Durock Shrimp Silent Tactile Switches 70.png',
        price: 419000
      },
      {
        name: 'Durock Shrimp 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/SilentSwitches/Durock Shrimp Silent Tactile Switches 90.png',
        price: 519000
      }
    ],
    isFeatured: true,
    isNewRelease: true,
    isBestSeller: false,
    discount: 0,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 55
    },
    reviews: 55
  },
  {
    name: 'Gateron Silent Black Linear Switches',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Gateron',
    price: 349000,
    stock: 80,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SilentSwitches/Gateron Silent Black Linear Switches 1.png',
      '/images/products/SilentSwitches/Gateron Silent Black Linear Switches 2.png',
      '/images/products/SilentSwitches/Salinan Gateron Silent Black Linear Switches 70.png',
      '/images/products/SilentSwitches/Salinan Gateron Silent Black Linear Switches 90.png'
    ],
    mainImage: '/images/products/SilentSwitches/Gateron Silent Black Linear Switches:main.png',
    description: 'Switch linear silent dengan gaya tekan yang lebih berat. Gateron Silent Black menawarkan pengalaman mengetik yang halus dan tenang dengan gaya tekan yang lebih tegas.',
    specs: {
      type: 'Linear Silent',
      actuationForce: '60g',
      bottomOutForce: '80g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM dengan teknologi peredam',
      housing: 'Nylon (Top) / Nylon (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 70/90 switches'
    },
    variants: [
      {
        name: 'Gateron Silent Black 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/SilentSwitches/Salinan Gateron Silent Black Linear Switches 70.png',
        price: 349000
      },
      {
        name: 'Gateron Silent Black 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/SilentSwitches/Salinan Gateron Silent Black Linear Switches 90.png',
        price: 449000
      }
    ],
    isFeatured: false,
    isNewRelease: false,
    isBestSeller: true,
    discount: 5,
    warranty: '1 tahun',
    rating: {
      average: 4.7,
      count: 85
    },
    reviews: 85
  },
  {
    name: 'Gateron Silent Red Linear Switches',
    category: 'Switch',
    subCategory: 'Silent',
    brand: 'Gateron',
    price: 329000,
    stock: 100,
    weight: generateWeight(50, 100),
    dimensions: generateDimensions(),
    images: [
      '/images/products/SilentSwitches/Gateron Silent Red Linear Switches 1.png',
      '/images/products/SilentSwitches/Gateron Silent Red Linear Switches 2.png',
      '/images/products/SilentSwitches/Gateron Silent Red Linear Switches 70.png',
      '/images/products/SilentSwitches/Gateron Silent Red Linear Switches 90.png',
      '/images/products/SilentSwitches/Gateron Silent Red Linear Switches 110.png'
    ],
    mainImage: '/images/products/SilentSwitches/Gateron Silent Red Linear Switches:main.png',
    description: 'Switch linear silent dengan gaya tekan yang ringan. Gateron Silent Red menawarkan pengalaman mengetik yang halus dan tenang dengan gaya tekan yang ringan, ideal untuk penggunaan jangka panjang.',
    specs: {
      type: 'Linear Silent',
      actuationForce: '45g',
      bottomOutForce: '60g',
      preTravel: '2.0mm',
      totalTravel: '4.0mm',
      stem: 'POM dengan teknologi peredam',
      housing: 'Nylon (Top) / Nylon (Bottom)',
      spring: 'Stainless Steel',
      pins: '5-pin',
      factory: 'Pre-lubed',
      quantity: 'Pack of 70/90/110 switches'
    },
    variants: [
      {
        name: 'Gateron Silent Red 70 pcs',
        quantity: '70 pcs',
        image: '/images/products/SilentSwitches/Gateron Silent Red Linear Switches 70.png',
        price: 329000
      },
      {
        name: 'Gateron Silent Red 90 pcs',
        quantity: '90 pcs',
        image: '/images/products/SilentSwitches/Gateron Silent Red Linear Switches 90.png',
        price: 429000
      },
      {
        name: 'Gateron Silent Red 110 pcs',
        quantity: '110 pcs',
        image: '/images/products/SilentSwitches/Gateron Silent Red Linear Switches 110.png',
        price: 519000
      }
    ],
    isFeatured: true,
    isNewRelease: false,
    isBestSeller: true,
    discount: 10,
    warranty: '1 tahun',
    rating: {
      average: 4.8,
      count: 120
    },
    reviews: 120
  }
];

// Combine all products into one array
const allProducts = enhanceProductData([
  ...mechanicalKeyboards,
  ...membraneKeyboards,
  ...opticalKeyboards,
  ...magneticKeyboards,
  ...gamingMice,
  ...officeMice,
  ...ergonomicMice,
  ...hardMousepads,
  ...softMousepads,
  ...gamingHeadsets,
  ...musicHeadsets,
  ...noiseCancellingHeadsets,
  ...linearSwitches,
  ...tactileSwitches,
  ...clickySwitches,
  ...silentSwitches
]);

module.exports = {
  generateWeight,
  generateDimensions,
  slugify: slugifyText,
  generateProductId,
  generateSKU,
  generateRating,
  ALLOWED_CATEGORIES,
  ALLOWED_BRANDS,
  enhanceProductData,
  mechanicalKeyboards,
  membraneKeyboards,
  opticalKeyboards,
  magneticKeyboards,
  gamingMice,
  officeMice,
  ergonomicMice,
  hardMousepads,
  softMousepads,
  gamingHeadsets,
  musicHeadsets,
  noiseCancellingHeadsets,
  linearSwitches,
  tactileSwitches,
  clickySwitches,
  silentSwitches,
  allProducts
};