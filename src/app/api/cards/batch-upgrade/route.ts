import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CARDS } from '@/data/cards';
import { Card, BatchUpgradeRequest, BatchUpgradeResponse } from '@/types/game';

interface GameData {
  cards: Card[];
  energy: number;
  maxEnergy: number;
  lastEnergyUpdate: number;
  energyRegenRate: number;
  unlockedLevels: number[];
}

interface RateLimitData {
  count: number;
  resetTime: number;
}


const gameData: GameData = {
  cards: [...INITIAL_CARDS],
  energy: 100,
  maxEnergy: 100,
  lastEnergyUpdate: Date.now(),
  energyRegenRate: 1,
  unlockedLevels: [1]
};


const rateLimits = new Map<string, RateLimitData>();


const PROGRESS_PER_CLICK = 2;
const ENERGY_PER_CLICK = 1;
const MAX_CLICKS_PER_REQUEST = 50;
const RATE_LIMIT_WINDOW = 60000; 
const MAX_REQUESTS_PER_WINDOW = 30; 

function updateEnergyRegeneration() {
  const now = Date.now();
  const timeDiff = (now - gameData.lastEnergyUpdate) / 1000;
  const energyToAdd = Math.floor(timeDiff * gameData.energyRegenRate);
  
  if (energyToAdd > 0 && gameData.energy < gameData.maxEnergy) {
    gameData.energy = Math.min(gameData.maxEnergy, gameData.energy + energyToAdd);
    gameData.lastEnergyUpdate = now;
  }
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const rateLimitData = rateLimits.get(clientId);
  
  if (!rateLimitData || now > rateLimitData.resetTime) {
    rateLimits.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (rateLimitData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  rateLimitData.count++;
  return true;
}

function getClientId(request: NextRequest): string {
 
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

export async function POST(request: NextRequest) {
  try {
  
    const clientId = getClientId(request);
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body: BatchUpgradeRequest = await request.json();
    
  
    if (!body.cardId || typeof body.cardId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid card ID' },
        { status: 400 }
      );
    }
    
    if (!body.clicks || typeof body.clicks !== 'number' || body.clicks <= 0 || body.clicks > MAX_CLICKS_PER_REQUEST) {
      return NextResponse.json(
        { error: `Invalid clicks amount. Must be between 1 and ${MAX_CLICKS_PER_REQUEST}` },
        { status: 400 }
      );
    }

    
    updateEnergyRegeneration();

    
    const cardIndex = gameData.cards.findIndex(c => c.id === body.cardId);
    if (cardIndex === -1) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    const card = gameData.cards[cardIndex];

    
    if (!card.unlocked) {
      return NextResponse.json(
        { error: 'Card is locked' },
        { status: 400 }
      );
    }

    if (card.progress >= card.maxProgress) {
      return NextResponse.json(
        { error: 'Card is already at maximum progress' },
        { status: 400 }
      );
    }

   
    const energyNeeded = body.clicks * ENERGY_PER_CLICK;
    
    if (gameData.energy < energyNeeded) {
      return NextResponse.json(
        { error: 'Insufficient energy', required: energyNeeded, available: gameData.energy },
        { status: 400 }
      );
    }

    const progressToAdd = body.clicks * PROGRESS_PER_CLICK;
    const newProgress = Math.min(card.maxProgress, card.progress + progressToAdd);
    const leveledUp = newProgress >= card.maxProgress && card.progress < card.maxProgress;
    
    gameData.energy -= energyNeeded;
    gameData.cards[cardIndex].progress = newProgress;
    
    let unlockedCards: string[] = [];
    let newLevel: number | undefined;

   
    if (leveledUp) {
      newLevel = card.level + 1;
      
  
      const cardsToUnlock = gameData.cards.filter(c => 
        c.requiredCardId === card.id && !c.unlocked
      );
      
      unlockedCards = cardsToUnlock.map(c => c.id);
      
     
      cardsToUnlock.forEach(c => {
        const unlockIndex = gameData.cards.findIndex(uc => uc.id === c.id);
        if (unlockIndex !== -1) {
          gameData.cards[unlockIndex].unlocked = true;
        }
      });
      
      
      const maxLevel = Math.max(...cardsToUnlock.map(c => c.level));
      if (maxLevel > 0 && !gameData.unlockedLevels.includes(maxLevel)) {
        gameData.unlockedLevels.push(maxLevel);
      }
    }

    const response: BatchUpgradeResponse = {
      success: true,
      cardId: body.cardId,
      newProgress,
      energyUsed: energyNeeded,
      remainingEnergy: gameData.energy,
      leveledUp,
      newLevel,
      unlockedCards: unlockedCards.length > 0 ? unlockedCards : undefined
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Batch upgrade error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    
    updateEnergyRegeneration();
    
    return NextResponse.json({
      cards: gameData.cards,
      energy: gameData.energy,
      maxEnergy: gameData.maxEnergy,
      energyRegenRate: gameData.energyRegenRate,
      unlockedLevels: gameData.unlockedLevels
    });
  } catch (error) {
    console.error('Game state error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
