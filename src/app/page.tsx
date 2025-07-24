"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { List } from "lucide-react"
import type { Card } from "@/types/game" // Assuming this path is correct
import { CardItem } from "../components/CardItem"
import { EnergyBar } from "@/components/EnergyBar"
import { CategoryFilter } from "../components/CategoryFilter"
import { LevelFilter } from "../components/LevelFilter"
import { gameStorage } from "@/utils/localStorage" // Assuming this path is correct
import { INITIAL_CARDS } from "@/data/cards" // Assuming this path is correct
import { cn } from "@/lib/utils"

// Assuming GameState type is defined elsewhere, e.g., in '@/types/game'
interface GameState {
  cards: Card[]
  energy: number
  maxEnergy: number
  lastEnergyUpdate: number
  energyRegenRate: number
  unlockedLevels: number[]
}

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all")
  const [notification, setNotification] = useState<string>("")

  // Initialize game state from localStorage or default
  useEffect(() => {
    const initializeGameState = () => {
      try {
        let loadedState = gameStorage.loadGameState()

        if (!loadedState) {
          // Create default game state
          loadedState = {
            cards: [...INITIAL_CARDS],
            energy: 100,
            maxEnergy: 100,
            lastEnergyUpdate: Date.now(),
            energyRegenRate: 1,
            unlockedLevels: [1],
          }
          gameStorage.saveGameState(loadedState)
        } else {
          // Update energy regeneration for loaded state
          loadedState = gameStorage.updateEnergyRegeneration(loadedState)
          gameStorage.saveGameState(loadedState)
        }

        setGameState(loadedState)
      } catch (error) {
        console.error("Failed to initialize game state:", error)
      } finally {
        setLoading(false)
      }
    }
    initializeGameState()
  }, [])

  // Energy regeneration with localStorage sync and background sync
  useEffect(() => {
    if (!gameState) return

    const updateEnergy = () => {
      setGameState((prev) => {
        if (!prev || prev.energy >= prev.maxEnergy) return prev

        // Calculate energy based on time elapsed since last update
        const now = Date.now()
        const timeDiff = (now - prev.lastEnergyUpdate) / 1000
        const energyToAdd = Math.floor(timeDiff * prev.energyRegenRate)

        if (energyToAdd > 0) {
          const updated = {
            ...prev,
            energy: Math.min(prev.maxEnergy, prev.energy + energyToAdd),
            lastEnergyUpdate: now,
          }

          // Save to localStorage
          gameStorage.saveGameState(updated)
          return updated
        }

        return prev
      })
    }

    // Handle page visibility change (when tab becomes active again)
    const handleVisibilityChange = () => {
      if (!document.hidden && gameState) {
        // Recalculate energy when tab becomes active
        const loadedState = gameStorage.loadGameState()
        if (loadedState) {
          const updatedState = gameStorage.updateEnergyRegeneration(loadedState)
          if (updatedState.energy !== loadedState.energy) {
            gameStorage.saveGameState(updatedState)
            setGameState(updatedState)
          }
        }
      }
    }

    // Regular interval for active tab
    const interval = setInterval(updateEnergy, 1000)

    // Listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Also update when window gains focus
    window.addEventListener("focus", handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleVisibilityChange)
    }
  }, [gameState])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const handleCardClick = async (cardId: string) => {
    if (!gameState) return
    const card = gameState.cards.find((c) => c.id === cardId)
    if (!card || !card.unlocked || card.progress >= card.maxProgress) return

    if (gameState.energy < 1) {
      showNotification("Insufficient energy!")
      return
    }

    // Update locally
    const newProgress = Math.min(card.maxProgress, card.progress + 2)
    const leveledUp = newProgress >= card.maxProgress && card.progress < card.maxProgress

    const baseUpdatedState = {
      ...gameState,
      energy: gameState.energy - 1,
      cards: gameState.cards.map((c) => (c.id === cardId ? { ...c, progress: newProgress } : c)),
    }

    // Handle level up - unlock next level cards
    const updatedState = leveledUp
      ? (() => {
          const cardsToUnlock = gameState.cards.filter((c) => c.requiredCardId === cardId && !c.unlocked)

          if (cardsToUnlock.length > 0) {
            const unlockedState = {
              ...baseUpdatedState,
              cards: baseUpdatedState.cards.map((c) =>
                cardsToUnlock.some((unlock) => unlock.id === c.id) ? { ...c, unlocked: true } : c,
              ),
            }

            const maxLevel = Math.max(...cardsToUnlock.map((c) => c.level))
            if (maxLevel > 0 && !unlockedState.unlockedLevels.includes(maxLevel)) {
              showNotification(`🔓 Level ${maxLevel} unlocked!`)
              return {
                ...unlockedState,
                unlockedLevels: [...unlockedState.unlockedLevels, maxLevel],
              }
            }

            showNotification(`🔓 New cards unlocked!`)
            return unlockedState
          }

          return baseUpdatedState
        })()
      : baseUpdatedState

    if (leveledUp) {
      showNotification(`🎉 ${card.name} completed!`)
    }

    // Save to localStorage and update state
    gameStorage.saveGameState(updatedState)
    setGameState(updatedState)
  }

  const handleBatchUpgrade = async (cardId: string, clicks: number) => {
    if (!gameState) return
    const card = gameState.cards.find((c) => c.id === cardId)
    if (!card || !card.unlocked || card.progress >= card.maxProgress) return

    const energyNeeded = clicks * 1
    if (gameState.energy < energyNeeded) {
      showNotification(`Need ${energyNeeded} energy! You have ${gameState.energy}`)
      return
    }

    // Calculate progress increase
    const progressToAdd = clicks * 2
    const newProgress = Math.min(card.maxProgress, card.progress + progressToAdd)
    const leveledUp = newProgress >= card.maxProgress && card.progress < card.maxProgress

    let updatedState = {
      ...gameState,
      energy: gameState.energy - energyNeeded,
      cards: gameState.cards.map((c) => (c.id === cardId ? { ...c, progress: newProgress } : c)),
    }

    // Handle level up - unlock next level cards
    if (leveledUp) {
      const cardsToUnlock = gameState.cards.filter((c) => c.requiredCardId === cardId && !c.unlocked)

      if (cardsToUnlock.length > 0) {
        updatedState = {
          ...updatedState,
          cards: updatedState.cards.map((c) =>
            cardsToUnlock.some((unlock) => unlock.id === c.id) ? { ...c, unlocked: true } : c,
          ),
        }

        const maxLevel = Math.max(...cardsToUnlock.map((c) => c.level))
        if (maxLevel > 0 && !updatedState.unlockedLevels.includes(maxLevel)) {
          updatedState = {
            ...updatedState,
            unlockedLevels: [...updatedState.unlockedLevels, maxLevel],
          }
        }

        showNotification(`🔓 Level ${maxLevel} unlocked!`)
      }

      showNotification(`🎉 ${card.name} completed with ${clicks}x upgrade!`)
    } else {
      showNotification(`⚡ ${clicks}x upgrade applied!`)
    }

    // Save to localStorage and update state
    gameStorage.saveGameState(updatedState)
    setGameState(updatedState)
  }

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      gameStorage.clearGameState()
      // Reinitialize with default state
      const defaultState = {
        cards: [...INITIAL_CARDS],
        energy: 100,
        maxEnergy: 100,
        lastEnergyUpdate: Date.now(),
        energyRegenRate: 1,
        unlockedLevels: [1],
      }
      gameStorage.saveGameState(defaultState)
      setGameState(defaultState)
      showNotification("🔄 Progress reset successfully!")
    }
  }

  const filteredCards =
    gameState?.cards.filter((card) => {
      const categoryMatch = selectedCategory === "all" || card.category === selectedCategory
      const levelMatch = selectedLevel === "all" || card.level === selectedLevel
      return categoryMatch && levelMatch
    }) || []

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">⚔️ Loading battle arena...</div>
      </div>
    )
  }

  if (!gameState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">❌ Failed to load battle arena</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-red-400">⚔️ Card Upgrade Game</h1>
            <Link
              href="/items"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <List className="w-4 h-4" />
              Item Listesi
            </Link>
            <button
              onClick={resetProgress}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              🔄 Reset
            </button>
          </div>

          <div className="flex-1 max-w-md">
            <EnergyBar current={gameState.energy} max={gameState.maxEnergy} regenRate={gameState.energyRegenRate} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
          <LevelFilter selected={selectedLevel} onSelect={setSelectedLevel} unlockedLevels={gameState.unlockedLevels} />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onUpgrade={handleCardClick}
              onBatchUpgrade={handleBatchUpgrade}
              canUpgrade={gameState.energy > 0 && card.progress < card.maxProgress && card.unlocked}
            />
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center text-white/70 text-lg mt-12">No cards available with current filters</div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={cn(
            "fixed top-4 right-4 bg-black/80 text-white px-6 py-3 rounded-lg",
            "backdrop-blur-sm border border-white/20 shadow-lg",
            "animate-in slide-in-from-top-2 duration-300",
          )}
        >
          {notification}
        </div>
      )}
    </div>
  )
}
