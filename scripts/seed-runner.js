// Simple standalone seed trigger calling the server API
async function main() {
  console.log('Triggering seed via Next.js endpoint...');
  try {
    const res = await fetch('http://localhost:3000/api/seed', { method: 'POST' }).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      console.log('Seed response:', data);
    } else {
      console.log('Please ensure the development server is running on port 3000.');
      console.log('You can also visit http://localhost:3000/api/seed to trigger full seeding.');
    }
  } catch (err) {
    console.error('Seed runner error:', err.message);
  }
}

main();
