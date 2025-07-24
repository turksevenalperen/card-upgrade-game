// Kart türünü içe aktarır. Her bir kartın yapısı burada tanımlıdır.
import { Card } from '@/types/game';

// GameState arayüzü, oyun durumunun yapısını tanımlar.
export interface GameState {
  cards: Card[];               // Oyuncunun sahip olduğu kartlar
  energy: number;              // Anlık enerji miktarı
  maxEnergy: number;           // Maksimum enerji kapasitesi
  lastEnergyUpdate: number;    // Enerjinin en son güncellendiği zaman (timestamp)
  energyRegenRate: number;     // Saniyede ne kadar enerji yenilenir
  unlockedLevels: number[];    // Açılmış seviye numaraları (örnek: [1, 2, 3])
}

// Oyun durumunun localStorage'da hangi anahtarla saklanacağını tanımlar.
const GAME_STATE_KEY = 'card-upgrade-game-state';

// gameStorage nesnesi, oyun verisini yönetmek için 4 yardımcı fonksiyon içerir.
export const gameStorage = {
  /**
   * Oyun durumunu tarayıcı hafızasına kaydeder.
   * @param gameState Kaydedilecek oyun durumu
   */
  saveGameState: (gameState: GameState): void => {
    try {
      const serialized = JSON.stringify(gameState); // Objeyi string'e çevir
      localStorage.setItem(GAME_STATE_KEY, serialized); // localStorage'a yaz
    } catch (error) {
      console.error('Failed to save game state:', error); // Hata olursa bildir
    }
  },

  /**
   * Oyun durumunu localStorage'dan yükler.
   * @returns Geçerli bir GameState döner veya hata varsa null döner.
   */
  loadGameState: (): GameState | null => {
    try {
      if (typeof window === 'undefined') return null; // Sunucu ortamındaysa çalışmaz
      
      const serialized = localStorage.getItem(GAME_STATE_KEY); // Kaydedilmiş veriyi al
      if (!serialized) return null; // Hiç kayıt yoksa null döner

      const gameState: GameState = JSON.parse(serialized); // String'i tekrar objeye çevir

      // Basit veri doğrulaması
      if (!gameState.cards || !Array.isArray(gameState.cards)) return null;
      if (typeof gameState.energy !== 'number') return null;
      if (!Array.isArray(gameState.unlockedLevels)) return null;

      return gameState; // Her şey doğruysa veriyi döndür
    } catch (error) {
      console.error('Failed to load game state:', error); // Hata varsa logla
      return null;
    }
  },

  /**
   * Oyuncunun ilerlemesini sıfırlar. (localStorage'dan siler)
   */
  clearGameState: (): void => {
    try {
      localStorage.removeItem(GAME_STATE_KEY); // Kaydı tamamen sil
    } catch (error) {
      console.error('Failed to clear game state:', error); // Hata olursa bildir
    }
  },

  /**
   * Enerji yenileme sistemini uygular.
   * Belirli bir süre geçmişse yeni enerji ekler.
   * @param gameState Mevcut oyun durumu
   * @returns Güncellenmiş GameState
   */
  updateEnergyRegeneration: (gameState: GameState): GameState => {
    const now = Date.now(); // Şu anki zamanı al (milisaniye cinsinden)
    
    const timeDiff = (now - gameState.lastEnergyUpdate) / 1000; // Geçen süreyi saniyeye çevir
    const energyToAdd = Math.floor(timeDiff * gameState.energyRegenRate); // Eklenecek enerji miktarı

    // Eğer enerji artacaksa ve maksimum enerjiye ulaşılmamışsa:
    if (energyToAdd > 0 && gameState.energy < gameState.maxEnergy) {
      return {
        ...gameState, // Diğer alanları aynen koru
        energy: Math.min(gameState.maxEnergy, gameState.energy + energyToAdd), // Yeni enerji
        lastEnergyUpdate: now // Zamanı güncelle
      };
    }

    // Eğer enerji eklenmeyecekse aynı gameState'i geri döndür
    return gameState;
  }
};
