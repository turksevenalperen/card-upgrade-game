import { NextRequest, NextResponse } from 'next/server';

interface EnergyState {
  energy: number;
  maxEnergy: number;
  lastUpdate: number;
  regenRate: number;
}

// In-memory storage for demo (in production, use a database)
const energyState: EnergyState = {
  energy: 100,
  maxEnergy: 100,
  lastUpdate: Date.now(),
  regenRate: 1 // per second
};

export async function GET() {
  try {
    // Calculate energy regeneration
    const now = Date.now();
    const timeDiff = (now - energyState.lastUpdate) / 1000;
    const energyToAdd = Math.floor(timeDiff * energyState.regenRate);
    
    if (energyToAdd > 0 && energyState.energy < energyState.maxEnergy) {
      energyState.energy = Math.min(energyState.maxEnergy, energyState.energy + energyToAdd);
      energyState.lastUpdate = now;
    }

    const timeToFull = energyState.energy < energyState.maxEnergy 
      ? Math.ceil((energyState.maxEnergy - energyState.energy) / energyState.regenRate)
      : 0;

    return NextResponse.json({
      energy: energyState.energy,
      maxEnergy: energyState.maxEnergy,
      regenRate: energyState.regenRate,
      timeToFull
    });
  } catch (error) {
    console.error('Energy API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();
    
    // Validate input
    if (typeof amount !== 'number' || amount <= 0 || amount > 100) {
      return NextResponse.json(
        { error: 'Invalid energy amount' },
        { status: 400 }
      );
    }

    // Check if enough energy
    if (energyState.energy < amount) {
      return NextResponse.json(
        { error: 'Insufficient energy' },
        { status: 400 }
      );
    }

    // Deduct energy
    energyState.energy = Math.max(0, energyState.energy - amount);
    energyState.lastUpdate = Date.now();

    return NextResponse.json({
      energy: energyState.energy,
      maxEnergy: energyState.maxEnergy,
      regenRate: energyState.regenRate
    });
  } catch (error) {
    console.error('Energy consumption error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
