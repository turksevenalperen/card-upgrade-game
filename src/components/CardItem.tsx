"use client"

import { useState } from "react"
import Image from "next/image"
import { Sword, Shield, Gem, Zap, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

// Assuming Card type is defined elsewhere, e.g., in '@/types/game'
interface Card {
  id: string
  name: string
  level: number
  category: "weapon" | "armor" | "accessory"
  image?: string
  description: string
  progress: number
  maxProgress: number
  unlocked: boolean
  requiredCardId?: string
  weaponType?: string
}

interface CardItemProps {
  card: Card
  onUpgrade: (cardId: string) => void
  onBatchUpgrade: (cardId: string, clicks: number) => void
  canUpgrade: boolean
}

const BATCH_OPTIONS = [1, 5, 10, 25, 50]

export function CardItem({ card, onUpgrade, onBatchUpgrade, canUpgrade }: CardItemProps) {
  const [showBatchOptions, setShowBatchOptions] = useState(false)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "weapon":
        return Sword
      case "armor":
        return Shield
      case "accessory":
        return Gem
      default:
        return Sword
    }
  }

  const Icon = getCategoryIcon(card.category)
  const progressPercentage = (card.progress / card.maxProgress) * 100
  const isMaxed = card.progress >= card.maxProgress
  const isLocked = !card.unlocked

  const handleBatchUpgrade = (clicks: number) => {
    onBatchUpgrade(card.id, clicks)
    setShowBatchOptions(false)
  }

  return (
    <div
      className={cn(
        "relative bg-gradient-to-br rounded-xl p-4 border transition-all duration-300",
        isLocked
          ? "from-gray-800 to-gray-900 border-gray-600 opacity-75"
          : isMaxed
            ? "from-slate-800 to-slate-900 border-green-500 shadow-lg shadow-green-500/25"
            : "from-slate-800 to-slate-900 border-slate-600 hover:border-slate-500 hover:shadow-lg",
      )}
    >
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute top-2 left-2 bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
          <Lock className="w-3 h-3" />
          Kilitli
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-1.5 rounded-lg",
              isLocked && "opacity-50",
              card.category === "weapon" && "bg-red-500/20 text-red-400",
              card.category === "armor" && "bg-blue-500/20 text-blue-400",
              card.category === "accessory" && "bg-purple-500/20 text-purple-400",
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className={cn("font-bold text-base", isLocked ? "text-gray-400" : "text-white")}>{card.name}</h3>
            <p className={cn("text-xs capitalize", isLocked ? "text-gray-500" : "text-white/60")}>
              Level {card.level} • {card.category}
            </p>
          </div>
        </div>

        {isMaxed && !isLocked && (
          <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">MAX</div>
        )}
      </div>

      {/* Card Image */}
      <div className="relative w-full h-48 mb-3">
        {card.image ? (
          <Image
            src={card.image || "/placeholder.svg"}
            alt={card.name}
            fill
            className={cn("object-contain rounded-lg transition-all duration-300", isLocked && "opacity-50 grayscale")}
            sizes="300px"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-gradient-to-br rounded-lg flex items-center justify-center",
              isLocked ? "from-gray-700 to-gray-800" : "from-slate-700 to-slate-800",
            )}
          >
            <Icon className={cn("w-12 h-12", isLocked ? "text-gray-500" : "text-white/30")} />
          </div>
        )}
      </div>

      {/* Description */}
      <p className={cn("text-xs mb-3", isLocked ? "text-gray-500" : "text-white/70")}>{card.description}</p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className={cn("text-xs", isLocked ? "text-gray-500" : "text-white/70")}>Progress</span>
          <span className={cn("text-xs", isLocked ? "text-gray-500" : "text-white/70")}>
            {card.progress}/{card.maxProgress}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              isLocked
                ? "bg-gradient-to-r from-gray-500 to-gray-600"
                : isMaxed
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : "bg-gradient-to-r from-blue-400 to-blue-600",
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Upgrade Buttons */}
      {!isMaxed && (
        <div className="space-y-2">
          {/* Single Upgrade Button */}
          <button
            onClick={() => onUpgrade(card.id)}
            disabled={!canUpgrade}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-200",
              canUpgrade
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-600 text-gray-400 cursor-not-allowed",
            )}
          >
            <Zap className="w-4 h-4" />
            {isLocked ? "Önce önceki seviyeyi bitirin" : "Upgrade (+2%)"}
          </button>

          {/* Batch Upgrade Options */}
          {canUpgrade && !isLocked && (
            <div className="relative">
              <button
                onClick={() => setShowBatchOptions(!showBatchOptions)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-4 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                Toplu Yükseltme
              </button>

              {showBatchOptions && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-2 z-10">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1">
                    {" "}
                    {/* Adjusted for responsiveness */}
                    {BATCH_OPTIONS.map((clicks) => (
                      <button
                        key={clicks}
                        onClick={() => handleBatchUpgrade(clicks)}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-xs font-medium transition-all duration-200"
                      >
                        {clicks}x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Weapon Type Badge */}
      {card.weaponType && (
        <div className="absolute top-2 right-2">
          <div className="bg-black/50 backdrop-blur-sm text-white/70 px-2 py-1 rounded text-xs">{card.weaponType}</div>
        </div>
      )}
    </div>
  )
}
