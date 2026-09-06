import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { runDatabaseSeed } from '@/lib/seedData';

export async function POST() {
  try {
    await connectToDatabase();
    const result = await runDatabaseSeed();
    return NextResponse.json({
      message: 'Database seeded successfully with sample farmers, verified produce, and demo orders.',
      result,
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const result = await runDatabaseSeed();
    return NextResponse.json({
      message: 'Database seeded successfully with sample farmers, verified produce, and demo orders.',
      result,
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: error?.message || 'Server error' }, { status: 500 });
  }
}
