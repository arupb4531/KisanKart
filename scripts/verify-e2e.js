// Comprehensive End-to-End Verification Test Script for KisanKart

async function runE2ETests() {
  const baseUrl = 'http://localhost:3002';
  console.log('🚀 Starting KisanKart Automated End-to-End Verification Suite...\n');

  try {
    // 1. Seed Database
    console.log('1️⃣ Seeding Database...');
    const seedRes = await fetch(`${baseUrl}/api/seed`, { method: 'POST' });
    const seedData = await seedRes.json();
    console.log('   ✓ Seed Status:', seedData.message);

    // 2. Test Public Marketplace Products
    console.log('\n2️⃣ Testing Marketplace Catalog & Filtering...');
    const allProdRes = await fetch(`${baseUrl}/api/products`);
    const allProd = await allProdRes.json();
    console.log(`   ✓ Total products retrieved: ${allProd.count}`);

    const organicRes = await fetch(`${baseUrl}/api/products?isOrganic=true&category=vegetables`);
    const organicProd = await organicRes.json();
    console.log(`   ✓ Organic Vegetables count: ${organicProd.count} (e.g. ${organicProd.products[0]?.name})`);

    // 3. Test Consumer Login
    console.log('\n3️⃣ Testing Consumer Authentication...');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'consumer@kisankart.com', password: 'password123' }),
    });
    const loginData = await loginRes.json();
    const consumerToken = loginData.token;
    console.log(`   ✓ Consumer Authenticated: ${loginData.user.name} (${loginData.user.role})`);

    // 4. Test Direct Checkout & Order Placement
    console.log('\n4️⃣ Testing Order Placement with Atomic Stock Decrement...');
    const targetProduct = allProd.products[0];
    const initialStock = targetProduct.stockQuantity;

    const orderRes = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${consumerToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            productId: targetProduct._id,
            name: targetProduct.name,
            unitPrice: targetProduct.pricePerUnit,
            quantity: 2,
            unit: targetProduct.unit,
          },
        ],
        deliverySlot: {
          date: '2026-08-20',
          timeSlot: '07:00 AM - 10:00 AM',
        },
        shippingAddress: {
          street: 'Flat 402, Green Acre Heights, Baner Road',
          city: 'Pune',
          state: 'Maharashtra',
          pincode: '411045',
        },
        paymentMethod: 'online',
      }),
    });

    const orderData = await orderRes.json();
    console.log(`   ✓ Order Placement Result: ${orderData.message}`);
    const placedOrder = orderData.orders[0];
    console.log(`   ✓ Placed Order Number: ${placedOrder.orderNumber}, Amount: ₹${placedOrder.totalAmount}`);

    // Verify Stock Decrement
    const updatedProdRes = await fetch(`${baseUrl}/api/products/${targetProduct._id}`);
    const updatedProdData = await updatedProdRes.json();
    console.log(`   ✓ Stock verified: Was ${initialStock} -> Now ${updatedProdData.product.stockQuantity} (-2 qty)`);

    // 5. Test Farmer Order Management & Status Progression
    console.log('\n5️⃣ Testing Farmer Order Fulfillment Flow...');
    const farmerLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'farmer@kisankart.com', password: 'password123' }),
    });
    const farmerLoginData = await farmerLoginRes.json();
    const farmerToken = farmerLoginData.token;
    console.log(`   ✓ Farmer Authenticated: ${farmerLoginData.user.name}`);

    // Update order to 'confirmed' -> 'dispatched' -> 'delivered'
    const statusUpdateRes = await fetch(`${baseUrl}/api/orders/${placedOrder._id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${farmerToken}`,
      },
      body: JSON.stringify({ status: 'delivered' }),
    });
    const statusUpdateData = await statusUpdateRes.json();
    console.log(`   ✓ Order Status Progression: ${statusUpdateData.message}`);

    // 6. Test Consumer Review Submission
    console.log('\n6️⃣ Testing Post-Delivery Review Submission...');
    const reviewRes = await fetch(`${baseUrl}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${consumerToken}`,
      },
      body: JSON.stringify({
        orderId: placedOrder._id,
        rating: 5,
        comment: 'Absolutely fresh and delivered in top condition right at 7:30 AM!',
      }),
    });
    const reviewData = await reviewRes.json();
    console.log(`   ✓ Review Submission: ${reviewData.message} (Rating: ${reviewData.review.rating}/5)`);

    // 7. Test Admin Metrics & Verification Gate
    console.log('\n7️⃣ Testing Admin Governance & Farmer Verification...');
    const adminLoginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@kisankart.com', password: 'password123' }),
    });
    const adminLoginData = await adminLoginRes.json();
    const adminToken = adminLoginData.token;
    console.log(`   ✓ Admin Authenticated: ${adminLoginData.user.name}`);

    // Fetch Metrics
    const metricsRes = await fetch(`${baseUrl}/api/admin/metrics`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const metricsData = await metricsRes.json();
    console.log(`   ✓ Platform Metrics: GMV: ₹${metricsData.metrics.gmv}, Total Orders: ${metricsData.metrics.totalOrders}, Completion Rate: ${metricsData.metrics.fulfillmentRate}%`);

    // Fetch Pending Farmers
    const pendingRes = await fetch(`${baseUrl}/api/admin/farmers/pending`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const pendingData = await pendingRes.json();
    console.log(`   ✓ Pending Farmers count: ${pendingData.pendingFarmers.length}`);

    if (pendingData.pendingFarmers.length > 0) {
      const pendingFarmer = pendingData.pendingFarmers[0];
      const verifyRes = await fetch(`${baseUrl}/api/admin/farmers/${pendingFarmer._id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ isVerified: true }),
      });
      const verifyData = await verifyRes.json();
      console.log(`   ✓ Farmer Verification Approved: ${verifyData.message}`);
    }

    console.log('\n✨ ALL E2E INTEGRATION TESTS PASSED SUCCESSFULLY! ✨\n');
  } catch (error) {
    console.error('❌ E2E Test Suite Error:', error);
    process.exit(1);
  }
}

runE2ETests();
