import { User } from '@/models/User';
import { FarmerProfile } from '@/models/FarmerProfile';
import { Product } from '@/models/Product';
import { Order } from '@/models/Order';
import { Review } from '@/models/Review';
import { hashPassword } from '@/lib/auth';
import initialProductsData from '@/data/products.json';

export async function runDatabaseSeed() {
  console.log('🌱 Seeding KisanKart database from src/data/products.json...');

  // Clean existing collections
  await Promise.all([
    User.deleteMany({}),
    FarmerProfile.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
  ]);

  const defaultPasswordHash = await hashPassword('password123');

  // 1. Create Admin
  const adminUser = await User.create({
    name: 'Rajesh Sharma (Admin)',
    email: 'admin@kisankart.com',
    passwordHash: defaultPasswordHash,
    phone: '+91 98230 11223',
    role: 'admin',
    isVerified: true,
    address: {
      street: 'Agri Directorate Towers',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411005',
    },
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop',
  });

  // 2. Create Farmers
  const farmer1User = await User.create({
    name: 'Ramesh Patil',
    email: 'farmer@kisankart.com',
    passwordHash: defaultPasswordHash,
    phone: '+91 94220 54321',
    role: 'farmer',
    isVerified: true,
    address: {
      street: 'Gat No. 42, Saswad Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '412301',
    },
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop',
  });

  const farmer1Profile = await FarmerProfile.create({
    userId: farmer1User._id,
    farmName: 'Patil Organic Bio Farms',
    farmLocation: {
      address: 'Gat No. 42, Purandar Tehsil',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '412301',
      coordinates: [73.9822, 18.3444],
    },
    farmingMethod: 'organic',
    bio: '3rd generation organic certified farmer dedicated to zero chemical residues. We use Jeevamrutha bio-fertilizers and solar-powered drip irrigation.',
    primaryCrops: ['Organic Tomatoes', 'Alphonso Mangoes', 'Spinach', 'Cold-pressed Oils'],
    experienceYears: 14,
    verificationDocs: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop',
    ],
    certificates: ['NPOP Certified Organic', 'Jaivik Bharat Mark #88421'],
    averageRating: 4.9,
    totalRatings: 18,
  });

  const farmer2User = await User.create({
    name: 'Sunita Devi',
    email: 'sunita@kisankart.com',
    passwordHash: defaultPasswordHash,
    phone: '+91 98112 33445',
    role: 'farmer',
    isVerified: true,
    address: {
      street: 'Trimbak Valley Farms',
      city: 'Nashik',
      state: 'Maharashtra',
      pincode: '422212',
    },
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop',
  });

  const farmer2Profile = await FarmerProfile.create({
    userId: farmer2User._id,
    farmName: 'Sahyadri Natural Dairy & Orchards',
    farmLocation: {
      address: 'Trimbak Road, Post Dindori',
      city: 'Nashik',
      state: 'Maharashtra',
      pincode: '422212',
      coordinates: [73.7898, 19.9975],
    },
    farmingMethod: 'natural',
    bio: 'Ethical dairy and fruit sanctuary with 40+ free-grazing indigenous Gir cows. We provide pristine A2 raw milk, Vedic bilona ghee, and vine-ripened orchard fruits.',
    primaryCrops: ['A2 Gir Cow Milk', 'Vedic Bilona Ghee', 'Nashik Table Grapes', 'Pomegranates'],
    experienceYears: 9,
    verificationDocs: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop',
    ],
    certificates: ['FSSAI Dairy License', 'Gir Gau Seva Certified'],
    averageRating: 4.8,
    totalRatings: 14,
  });

  // Pending farmer awaiting admin verification
  const farmer3User = await User.create({
    name: 'Vikram Singh',
    email: 'vikram@kisankart.com',
    passwordHash: defaultPasswordHash,
    phone: '+91 97554 99887',
    role: 'farmer',
    isVerified: false,
    address: {
      street: 'Sanwer Tehsil, Grain Corridor',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '453551',
    },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
  });

  await FarmerProfile.create({
    userId: farmer3User._id,
    farmName: 'Malwa Heritage Grain Fields',
    farmLocation: {
      address: 'Village Kshipra, Sanwer',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '453551',
      coordinates: [75.8577, 22.7196],
    },
    farmingMethod: 'conventional',
    bio: 'Specialist in single-origin high protein Sharbati wheat, MP Durum semolina, and naturally sun-dried whole pulses.',
    primaryCrops: ['Sharbati Wheat', 'Desi Chana Dal', 'Soybean'],
    experienceYears: 18,
    verificationDocs: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop',
    ],
    certificates: ['APMC Trader Pass #331'],
    averageRating: 4.5,
    totalRatings: 0,
  });

  // 3. Create Consumers
  const consumer1 = await User.create({
    name: 'Ananya Sharma',
    email: 'consumer@kisankart.com',
    passwordHash: defaultPasswordHash,
    phone: '+91 98200 45678',
    role: 'consumer',
    isVerified: true,
    address: {
      street: 'Flat 402, Green Acre Heights, Baner Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411045',
      coordinates: { lat: 18.559, lng: 73.778 },
    },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
  });

  const consumer2 = await User.create({
    name: 'Priya Nair',
    email: 'priya@kisankart.com',
    passwordHash: defaultPasswordHash,
    phone: '+91 98331 67890',
    role: 'consumer',
    isVerified: true,
    address: {
      street: 'B-12, Palm Meadows, Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      coordinates: { lat: 18.5074, lng: 73.8077 },
    },
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop',
  });

  // 4. Create Produce Catalog directly from src/data/products.json
  const farmerEmailMap = new Map();
  farmerEmailMap.set('farmer@kisankart.com', farmer1User._id);
  farmerEmailMap.set('sunita@kisankart.com', farmer2User._id);
  farmerEmailMap.set('vikram@kisankart.com', farmer3User._id);

  const createdProducts = [];
  const now = new Date();

  for (const item of initialProductsData) {
    const farmerId = farmerEmailMap.get(item.farmerEmail) || farmer1User._id;
    const harvestDate = new Date(now.getTime() - (item.harvestHoursAgo || 8) * 60 * 60 * 1000);

    const productDoc = await Product.create({
      farmerId,
      name: item.name,
      category: item.category as any,
      description: item.description,
      pricePerUnit: item.pricePerUnit,
      unit: item.unit as any,
      stockQuantity: item.stockQuantity,
      harvestDate,
      isOrganic: Boolean(item.isOrganic),
      images: item.images && item.images.length > 0 ? item.images : ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'],
      isAvailable: Number(item.stockQuantity) > 0,
    });

    createdProducts.push(productDoc);
  }

  // 5. Create Sample Orders from created products
  const pTomatoes = createdProducts[0];
  const pSpinach = createdProducts[2] || createdProducts[0];
  const pMilk = createdProducts[5] || createdProducts[0];
  const pGrapes = createdProducts[7] || createdProducts[0];
  const pMangoes = createdProducts[1] || createdProducts[0];

  const order1 = await Order.create({
    orderNumber: 'KM-88401-1',
    consumerId: consumer1._id,
    farmerId: pTomatoes.farmerId,
    items: [
      {
        productId: pTomatoes._id,
        name: pTomatoes.name,
        unitPrice: pTomatoes.pricePerUnit,
        quantity: 2,
        unit: pTomatoes.unit,
        subtotal: pTomatoes.pricePerUnit * 2,
        image: pTomatoes.images[0],
      },
      {
        productId: pSpinach._id,
        name: pSpinach.name,
        unitPrice: pSpinach.pricePerUnit,
        quantity: 3,
        unit: pSpinach.unit,
        subtotal: pSpinach.pricePerUnit * 3,
        image: pSpinach.images[0],
      },
    ],
    totalAmount: pTomatoes.pricePerUnit * 2 + pSpinach.pricePerUnit * 3,
    deliverySlot: {
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      timeSlot: '07:00 AM - 10:00 AM',
    },
    shippingAddress: consumer1.address,
    status: 'delivered',
    paymentMethod: 'online',
    paymentStatus: 'paid',
  });

  // Add review for order1
  await Review.create({
    orderId: order1._id,
    consumerId: consumer1._id,
    farmerId: pTomatoes.farmerId,
    productId: pTomatoes._id,
    rating: 5,
    comment: 'Exceptional freshness! The produce tasted just like the ones from my grandmother’s village farm. Delivery was right on time at 7:30 AM.',
  });

  const order2 = await Order.create({
    orderNumber: 'KM-88402-2',
    consumerId: consumer1._id,
    farmerId: pMilk.farmerId,
    items: [
      {
        productId: pMilk._id,
        name: pMilk.name,
        unitPrice: pMilk.pricePerUnit,
        quantity: 2,
        unit: pMilk.unit,
        subtotal: pMilk.pricePerUnit * 2,
        image: pMilk.images[0],
      },
      {
        productId: pGrapes._id,
        name: pGrapes.name,
        unitPrice: pGrapes.pricePerUnit,
        quantity: 1,
        unit: pGrapes.unit,
        subtotal: pGrapes.pricePerUnit * 1,
        image: pGrapes.images[0],
      },
    ],
    totalAmount: pMilk.pricePerUnit * 2 + pGrapes.pricePerUnit * 1,
    deliverySlot: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      timeSlot: '07:00 AM - 10:00 AM',
    },
    shippingAddress: consumer1.address,
    status: 'confirmed',
    paymentMethod: 'cod',
    paymentStatus: 'pending',
  });

  const order3 = await Order.create({
    orderNumber: 'KM-88403-3',
    consumerId: consumer2._id,
    farmerId: pMangoes.farmerId,
    items: [
      {
        productId: pMangoes._id,
        name: pMangoes.name,
        unitPrice: pMangoes.pricePerUnit,
        quantity: 1,
        unit: pMangoes.unit,
        subtotal: pMangoes.pricePerUnit * 1,
        image: pMangoes.images[0],
      },
    ],
    totalAmount: pMangoes.pricePerUnit * 1,
    deliverySlot: {
      date: new Date(),
      timeSlot: '05:00 PM - 08:00 PM',
    },
    shippingAddress: consumer2.address,
    status: 'dispatched',
    paymentMethod: 'online',
    paymentStatus: 'paid',
  });

  console.log(`✅ KisanKart database seeded successfully with ${createdProducts.length} produce items from src/data/products.json!`);
  return {
    success: true,
    farmersCount: 3,
    consumersCount: 2,
    productsCount: createdProducts.length,
    ordersCount: 3,
  };
}
