# 🎮 Card Upgrade Game - No Surrender Studio Case Study

> **Full-Stack Developer Case Study Project**
> 
> Modern web teknolojileri kullanarak geliştirilmiş kapsamlı kart yükseltme oyunu. Batch processing, persistent data storage ve real-time energy regeneration özellikleri ile kullanıcı deneyimini optimize eden teknik çözümler sunmaktadır.

## 🚀 **Proje Hakkında**

Bu proje, No Surrender Studio için hazırlanmış bir case study çalışmasıdır. Oyun geliştirme süreçlerinde karşılaşılan teknik problemlere modern çözümler getirerek, full-stack geliştirici yetkinliklerini sergiler.

## 💻 **Kullanılan Teknolojiler**

### **Frontend**
- **Next.js 14+** - App Router ile modern React framework
- **TypeScript** - Type safety ve geliştirici deneyimi için
- **TailwindCSS** - Utility-first CSS framework ile responsive tasarım
- **Lucide React** - Modern icon kütüphanesi

### **State Management**
- **React Hooks** - useState, useEffect ile local state yönetimi
- **localStorage API** - Client-side data persistence
- **Custom Storage Utility** - Game state ve energy regeneration logic

### **Backend/API**
- **Next.js API Routes** - Server-side logic ve validation
- **Rate Limiting** - IP bazlı istək sınırlandırması
- **Error Handling** - Kapsamlı hata yönetimi

### **Development Tools**
- **Turbopack** - Hızlı development build tool
- **ESLint** - Code quality ve consistency
- **Git** - Version control ile özellik bazlı commit'ler

## ✨ **Getirdiğimiz Yenilikler**

### **1. Batch Processing Sistemi - "50 Tıklama" Probleminin Çözümü**

**Problem:** Geleneksel kart oyunlarında tek tek tıklama zorunluluğu
**Çözüm:** 1x, 5x, 10x, 25x, 50x toplu yükseltme sistemi

```typescript
const handleBatchUpgrade = async (cardId: string, clicks: number) => {
  const energyNeeded = clicks * 1;
  const progressToAdd = clicks * 2;
  
  // Tek API çağrısı ile çoklu işlem
  const response = await fetch('/api/cards/batch-upgrade', {
    method: 'POST',
    body: JSON.stringify({ cardId, clicks })
  });
};
```

**Faydalar:**
- ✅ Kullanıcı deneyimi iyileştirildi
- ✅ API çağrı sayısı 50x azaltıldı
- ✅ Server load azalması

### **2. Persistent Game State - Veri Kaybı Problemi Çözüldü**

**Problem:** Server restart'larda oyuncu ilerlemesi kayboluyordu
**Çözüm:** localStorage bazlı client-side persistence

```typescript
export const gameStorage = {
  saveGameState: (state: GameState) => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  },
  
  loadGameState: (): GameState | null => {
    const stored = localStorage.getItem(GAME_STATE_KEY);
    return stored ? JSON.parse(stored) : null;
  },
  
  updateEnergyRegeneration: (state: GameState): GameState => {
    const now = Date.now();
    const timeDiff = (now - state.lastEnergyUpdate) / 1000;
    const energyToAdd = Math.floor(timeDiff * state.energyRegenRate);
    
    return {
      ...state,
      energy: Math.min(state.maxEnergy, state.energy + energyToAdd),
      lastEnergyUpdate: now
    };
  }
};
```

**Faydalar:**
- ✅ Zero data loss garanti
- ✅ Hızlı yükleme süreleri
- ✅ Offline capability

### **3. Background Energy Regeneration**

**Problem:** Tab kapatıldığında enerji yenileme duruyordu
**Çözüm:** Tab Visibility API ile background sync

```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden && gameState) {
      // Tab aktif olunca geçen zamanı hesapla
      const loadedState = gameStorage.loadGameState();
      const updatedState = gameStorage.updateEnergyRegeneration(loadedState);
      setGameState(updatedState);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', handleVisibilityChange);
}, [gameState]);
```

**Faydalar:**
- ✅ Realistic energy regeneration
- ✅ Better user retention
- ✅ Fair gameplay mechanics

## �️ **Dosya Yapısı**

```
src/
├── app/                     # Next.js App Router
│   ├── page.tsx            # Ana oyun sayfası - Game logic merkezi
│   ├── items/page.tsx      # Item showcase sayfası
│   ├── globals.css         # Global styles ve Tailwind
│   └── api/                # Backend API routes
│       ├── cards/
│       │   ├── progress/   # Tek kart upgrade endpoint
│       │   └── batch-upgrade/ # Batch upgrade endpoint
│       └── energy/         # Energy status endpoint
├── components/             # Reusable UI Components
│   ├── CardItem.tsx       # Kart bileşeni - Progress bar, upgrade buttons
│   ├── EnergyBar.tsx      # Enerji göstergesi - Real-time updates
│   ├── CategoryFilter.tsx # Silah/Zırh/Aksesuar filtresi
│   └── LevelFilter.tsx    # Level 1/2/3 filtresi
├── data/
│   └── cards.ts           # 24 Türk silahı kartı verisi
├── types/
│   └── game.ts           # TypeScript interfaces
├── utils/
│   └── localStorage.ts   # Game persistence utility
└── lib/
    └── utils.ts          # Tailwind className merger
```

## 🎯 **Kritik Kod Açıklamaları**

### **Energy Regeneration Logic**
```typescript
// Her saniye çalışan energy güncelleme sistemi
const updateEnergy = () => {
  const now = Date.now();
  const timeDiff = (now - prev.lastEnergyUpdate) / 1000;
  const energyToAdd = Math.floor(timeDiff * prev.energyRegenRate);
  
  if (energyToAdd > 0) {
    const updated = {
      ...prev,
      energy: Math.min(prev.maxEnergy, prev.energy + energyToAdd),
      lastEnergyUpdate: now
    };
    
    gameStorage.saveGameState(updated); // Her değişiklik persist edilir
    return updated;
  }
};
```

### **Card Unlock Chain System**
```typescript
// Kart tamamlandığında otomatik unlock sistemi
if (leveledUp) {
  const cardsToUnlock = gameState.cards.filter(c => 
    c.requiredCardId === cardId && !c.unlocked
  );
  
  if (cardsToUnlock.length > 0) {
    const maxLevel = Math.max(...cardsToUnlock.map(c => c.level));
    if (!gameState.unlockedLevels.includes(maxLevel)) {
      showNotification(`🔓 Level ${maxLevel} açıldı!`);
    }
  }
}
```

### **Rate Limiting Implementation**
```typescript
// API güvenliği için IP bazlı rate limiting
function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const rateLimitData = rateLimits.get(clientId);
  
  if (!rateLimitData || now > rateLimitData.resetTime) {
    rateLimits.set(clientId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW // 60 saniye
    });
    return true;
  }
  
  return rateLimitData.count < MAX_REQUESTS_PER_WINDOW; // 30 request/dk
}
```

## 📱 **Responsive Design**

Mobil-first yaklaşım ile tüm ekran boyutlarında optimize edilmiş:

```css
/* Grid system - responsive breakpoints */
grid-cols-1          /* Mobile: 1 kart */
sm:grid-cols-2       /* Tablet: 2 kart */
lg:grid-cols-3       /* Desktop: 3 kart */
xl:grid-cols-4       /* Large: 4 kart */

/* Flexible layouts */
flex-col lg:flex-row /* Mobile vertical, desktop horizontal */
```

## � **Ekran Görüntüleri**

### Ana Oyun Ekranı
*[Screenshot placeholder - Ana sayfa ile oyun arayüzü]*

### Item Showcase Sayfası  
*[Screenshot placeholder - Kategorize item listesi]*

### Mobil Responsive
*[Screenshot placeholder - Mobil görünüm]*

### Batch Upgrade Sistemi
*[Screenshot placeholder - 50x upgrade butonu]*

## 🚀 **Kurulum ve Çalıştırma**

```bash
# Repository'yi klonla
git clone https://github.com/turksevenalperen/card-upgrade-game.git
cd card-upgrade-game

# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Production build
npm run build
npm start
```


**MongoDB Migration:** Mevcut localStorage sistemi, minimal değişiklikle MongoDB'ye migrate edilebilir durumda tasarlanmıştır.

---


