import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CARDS } from '@/data/cards';
import { Card, ProgressRequest, ProgressResponse } from '@/types/game';

interface GameData {
  cards: Card[];
  energy: number;
  maxEnergy: number;
  lastEnergyUpdate: number;
  energyRegenRate: number;
  unlockedLevels: number[];
}

// In-memory storage for demo (in production, use a database)
// In-memory storage for demo (in production, use a database)
const gameData: GameData = {
  cards: [...INITIAL_CARDS],
  energy: 100,
  maxEnergy: 100,
  lastEnergyUpdate: Date.now(),
  energyRegenRate: 1,
  unlockedLevels: [1, 2, 3]
};

// Configuration
const PROGRESS_PER_CLICK = 2;
const ENERGY_PER_CLICK = 1;

function updateEnergyRegeneration() {
  const now = Date.now();
  const timeDiff = (now - gameData.lastEnergyUpdate) / 1000;
  const energyToAdd = Math.floor(timeDiff * gameData.energyRegenRate);
  
  if (energyToAdd > 0 && gameData.energy < gameData.maxEnergy) {
    gameData.energy = Math.min(gameData.maxEnergy, gameData.energy + energyToAdd);
    gameData.lastEnergyUpdate = now;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProgressRequest = await request.json();
    
    // Input validation
    if (!body.cardId || typeof body.cardId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid card ID' },
        { status: 400 }
      );
    }

    // Update energy regeneration
    updateEnergyRegeneration();

    // Check energy
    if (gameData.energy < ENERGY_PER_CLICK) {
      return NextResponse.json(
        { error: 'Insufficient energy' },
        { status: 400 }
      );
    }

    // Find the card
    const cardIndex = gameData.cards.findIndex(c => c.id === body.cardId);
    if (cardIndex === -1) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    const card = gameData.cards[cardIndex];

    // Validate card state
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

    // Apply progress
    const newProgress = Math.min(card.maxProgress, card.progress + PROGRESS_PER_CLICK);
    const leveledUp = newProgress >= card.maxProgress && card.progress < card.maxProgress;
    
    // Update game state
    gameData.energy -= ENERGY_PER_CLICK;
    gameData.cards[cardIndex].progress = newProgress;
    
    let unlockedCards: string[] = [];
    let newLevel: number | undefined;

    // Handle level up
    if (leveledUp) {
      newLevel = card.level + 1;
      
      // Find cards that should be unlocked
      const cardsToUnlock = gameData.cards.filter(c => 
        c.requiredCardId === card.id && !c.unlocked
      );
      
      unlockedCards = cardsToUnlock.map(c => c.id);
      
      // Unlock cards
      cardsToUnlock.forEach(c => {
        const unlockIndex = gameData.cards.findIndex(uc => uc.id === c.id);
        if (unlockIndex !== -1) {
          gameData.cards[unlockIndex].unlocked = true;
        }
      });
      
      // Check if new level should be unlocked
      const maxLevel = Math.max(...cardsToUnlock.map(c => c.level));
      if (maxLevel > 0 && !gameData.unlockedLevels.includes(maxLevel)) {
        gameData.unlockedLevels.push(maxLevel);
      }
    }

    const response: ProgressResponse = {
      success: true,
      cardId: body.cardId,
      newProgress,
      maxProgress: card.maxProgress,
      energyUsed: ENERGY_PER_CLICK,
      remainingEnergy: gameData.energy,
      leveledUp,
      newLevel,
      unlockedCards: unlockedCards.length > 0 ? unlockedCards : undefined
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
