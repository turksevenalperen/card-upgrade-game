# 🎮 Card Upgrade Game - No Surrender Studio Case Study

> **Full-Stack Developer Case Study Project**
> 
> This project demonstrates advanced game mechanics optimization, persistent data management, and modern web development practices for No Surrender Studio's technical assessment.

## 🎯 **Project Overview**

A Next.js-based card upgrade game featuring:
- **Batch Upgrade System**: Solves the "50-click problem" with optimized 1x-50x upgrades
- **Persistent Game State**: localStorage-based data persistence prevents progress loss on server restarts
- **Energy Management**: Real-time energy regeneration with background tab synchronization
- **Visual Asset Integration**: Figma-designed weapon/armor progression system
- **Dark War Theme**: Immersive UI with red accent colors

## ⚡ **Key Technical Features**

### Game Mechanics
- Energy system (100 max, 1/second regeneration)
- Progressive card unlocking system (3 levels per weapon type)
- Batch upgrade operations (1x, 5x, 10x, 25x, 50x)
- Real-time progress tracking with visual feedback

### Technical Implementation
- **Next.js 14+** with App Router and TypeScript
- **localStorage Integration** for client-side persistence
- **Tab Visibility API** for background energy sync
- **Image Optimization** with Next.js Image component
- **Responsive Design** with TailwindCSS
- **Component Architecture** with proper separation of concerns

### Data Persistence Solution
- Custom `gameStorage` utility prevents data loss
- Background tab energy regeneration
- Automatic state synchronization across browser sessions

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd card-upgrade-game

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎮 **Game Features**

### Card Progression System
- **8 Weapon Types**: Uzun Kılıç, Savaş Baltası, Kalkan, Büyü Asası, etc.
- **3 Levels Each**: Progressive power scaling (Silver → Emerald → Gold)
- **Visual Progression**: Real-time progress bars and completion animations

### User Experience Optimizations
- **Batch Processing**: Prevents repetitive clicking with multi-click options
- **Energy Management**: Strategic resource planning with regeneration
- **Filter System**: Category and level-based card filtering
- **Persistent Progress**: Never lose your advancement

## 🛠 **Technical Architecture**

### Client-Side State Management
```typescript
// localStorage utility for game persistence
const gameStorage = {
  saveGameState,
  loadGameState,
  updateEnergyRegeneration
}
```

### Energy System
```typescript
// Background-aware energy regeneration
useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Sync energy when tab becomes active
      updateEnergyFromStorage();
    }
  };
}, []);
```

### Batch Upgrade Implementation
```typescript
// Optimized batch processing
const handleBatchUpgrade = (cardId: string, clicks: number) => {
  const energyNeeded = clicks * 1;
  const progressToAdd = clicks * 2;
  // ... batch processing logic
};
```

## 📊 **Performance Optimizations**

- **Image Optimization**: Next.js Image component with proper sizing
- **Component Memoization**: Optimized re-renders
- **Efficient State Updates**: Batch state changes for better performance
- **Background Sync**: Energy regeneration during inactive tabs

## 🎨 **Design System**

- **Dark Theme**: Black background with gray card containers
- **War Aesthetic**: Red accent colors throughout
- **Turkish Weapon Names**: Authentic terminology for immersion
- **Responsive Grid**: Adaptive layouts for all screen sizes

## 🔄 **MongoDB Migration Ready**

The current localStorage implementation can be easily migrated to MongoDB:

```typescript
// Future MongoDB integration points:
// - Replace gameStorage.saveGameState() with MongoDB writes
// - Add user authentication system
// - Implement leaderboards and social features
// - Add multiplayer capabilities
```

## 🎯 **Case Study Achievements**

✅ **Batch Processing**: Eliminated repetitive clicking problem  
✅ **Data Persistence**: Solved server restart data loss  
✅ **Performance**: Optimized energy regeneration system  
✅ **User Experience**: Intuitive filtering and navigation  
✅ **Visual Design**: Professional dark theme implementation  
✅ **Code Quality**: TypeScript + proper component architecture  

## 🔧 **Development**

### Tech Stack
- **Frontend**: Next.js 14+, TypeScript, TailwindCSS
- **State Management**: React hooks + localStorage
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components
- **Build**: Turbopack for fast development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── data/               # Game data and configurations
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and localStorage
└── lib/                # Shared libraries and helpers
```

---

**Built for No Surrender Studio Technical Assessment**  
*Demonstrating full-stack capabilities and game development expertise*
