const mongoose = require('mongoose');

// Simple standalone seed trigger calling the server API or running mongoose directly
async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/krishi_market';
  console.log('Connecting to MongoDB at:', uri);
  try {
    await mongoose.connect(uri);
    console.log('Connected. Running seed via Next.js endpoint or data models...');
    // We can fetch the endpoint if dev server is running
    const res = await fetch('http://localhost:3000/api/seed', { method: 'POST' }).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      console.log('Seed response:', data);
    } else {
      console.log('You can also visit http://localhost:3000/api/seed to trigger full seeding.');
    }
  } catch (err) {
    console.error('Seed runner error:', err.message);
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

main();
