'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sword, Shield, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItemGroup {
  name: string;
  category: 'weapon' | 'armor' | 'accessory';
  weaponType: string;
  levels: {
    level: number;
    name: string;
    description: string;
    image: string;
  }[];
}

const ITEM_GROUPS: ItemGroup[] = [
  {
    name: 'Uzun Kılıç',
    category: 'weapon',
    weaponType: 'Uzun Kılıç',
    levels: [
      {
        level: 1,
        name: 'Gümüş Diş',
        description: 'Sade, keskin bir savaş kılıcı.',
        image: '/images/paint1.png'
      },
      {
        level: 2,
        name: 'Zümrüt Yürek',
        description: 'Can alıcı darbeler için güçlendirildi.',
        image: '/images/zumrutyurek.png'
      },
      {
        level: 3,
        name: 'Altın Pençe',
        description: 'Kralların kanını döken efsanevi keskinlik.',
        image: '/images/altınpence.png'
      }
    ]
  },
  {
    name: 'Savaş Baltası',
    category: 'weapon',
    weaponType: 'Savaş Baltası',
    levels: [
      {
        level: 1,
        name: 'Ay Parçası',
        description: 'Hafif ve hızlı bir balta.',
        image: '/images/ayparcası.png'
      },
      {
        level: 2,
        name: 'Zümrüt Kesik',
        description: 'Derin yaralar açan büyülü çelik.',
        image: '/images/zumrutkesik.png'
      },
      {
        level: 3,
        name: 'Efsane Yarma',
        description: 'Tek vuruşta kale kapısı deler.',
        image: '/images/efsaneyarma.png'
      }
    ]
  },
 
  {
    name: 'Kalkan',
    category: 'armor',
    weaponType: 'Kalkan',
    levels: [
      {
        level: 1,
        name: 'Gümüş Siperi',
        description: 'Basit bir koruma aracı.',
        image: '/images/gumussıperi.png'
      },
      {
        level: 2,
        name: 'Zümrüt Zırh',
        description: 'Gelen saldırıyı yansıtır.',
        image: '/images/zumrutzırh.png'
      },
      {
        level: 3,
        name: 'Altın Duvar',
        description: 'Tanrılar bile geçemez.',
        image: '/images/altınduvar.png'
      }
    ]
  },
   {
    name: 'Büyü Asası',
    category: 'weapon',
    weaponType: 'Büyü Asası',
    levels: [
      {
        level: 1,
        name: 'Gölge Dalı',
        description: 'Temel büyü asası.',
        image: '/images/golgedalı.png'
      },
      {
        level: 2,
        name: 'Zümrüt Kök',
        description: 'Doğanın gücüyle titreşir.',
        image: '/images/zumrutkok.png'
      },
      {
        level: 3,
        name: 'Altın Kök',
        description: 'Yıldızları yere indirir, zamanı büker.',
        image: '/images/altınkok.png'
      }
    ]
  },
  {
    name: 'Savaş Çekici',
    category: 'weapon',
    weaponType: 'Savaş Çekici',
    levels: [
      {
        level: 1,
        name: 'Taş Parçalayıcı',
        description: 'Ağır ve yıkıcı.',
        image: '/images/tasparcalayıcı.png'
      },
      {
        level: 2,
        name: 'Zümrüt Ezici',
        description: 'Zırhları paramparça eder.',
        image: '/images/zumrutezici.png'
      },
      {
        level: 3,
        name: 'Altın Hüküm',
        description: 'Dünyayı çatlatır, düşmanları ezer.',
        image: '/images/altınhukum.png'
      }
    ]
  },
  {
    name: 'Eğri Kılıç',
    category: 'weapon',
    weaponType: 'Eğri Kılıç',
    levels: [
      {
        level: 1,
        name: 'Gümüş Pençe',
        description: 'Hafif ve çevik bir bıçak.',
        image: '/images/gumuspence.png'
      },
      {
        level: 2,
        name: 'Zümrüt Çengel',
        description: 'Derin kesikler için eğildi.',
        image: '/images/zumrutcengel.png'
      },
      {
        level: 3,
        name: 'Altın Yılan',
        description: 'Gölge gibi kayar, kaderi biçer.',
        image: '/images/altınyılan.png'
      }
    ]
  },
  {
    name: 'Kısa Kılıç',
    category: 'weapon',
    weaponType: 'Kısa Kılıç',
    levels: [
      {
        level: 1,
        name: 'Gölge Kesik',
        description: 'Hızlı saldırılar için ideal.',
        image: '/images/golgekesik.png'
      },
      {
        level: 2,
        name: 'Zümrüt Fısıltı',
        description: 'Sessiz ama ölümcül.',
        image: '/images/zumrutfısıltı.png'
      },
      {
        level: 3,
        name: 'Altın Dilim',
        description: 'Zamanda bile iz bırakır.',
        image: '/images/altındılım.png'
      }
    ]
  },
  {
    name: 'Büyü Kitabı',
    category: 'accessory',
    weaponType: 'Büyü Kitabı',
    levels: [
      {
        level: 1,
        name: 'Gümüş Sayfalar',
        description: 'Temel büyüleri içerir.',
        image: '/images/gumussayfalar.png'
      },
      {
        level: 2,
        name: 'Zümrüt Kehanet',
        description: 'Geleceği okur, kaderi değiştirir.',
        image: '/images/zumrutkehanet.png'
      },
      {
        level: 3,
        name: 'Altın Kitabe',
        description: 'Evrenin sırlarını fısıldar, gerçekliği ezer.',
        image: '/images/altınkitabe.png'
      }
    ]
  }
];

export default function ItemsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weapon': return Sword;
      case 'armor': return Shield;
      case 'accessory': return Gem;
      default: return Sword;
    }
  };

  const filteredGroups = ITEM_GROUPS.filter(group => 
    selectedCategory === 'all' || group.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/"
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Savaş Arenasına Dön
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-red-400 mb-8">⚔️ Savaş Ekipmanları</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'all', name: 'Tümü', icon: null },
            { id: 'weapon', name: 'Silahlar', icon: Sword },
            { id: 'armor', name: 'Zırhlar', icon: Shield },
            { id: 'accessory', name: 'Aksesuarlar', icon: Gem },
          ].map(category => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                  "border backdrop-blur-sm font-medium",
                  isSelected
                    ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/25"
                    : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items Grid */}
      <div className="container mx-auto px-4 pb-12">
        <div className="space-y-8">
          {filteredGroups.map(group => {
            const Icon = getCategoryIcon(group.category);
            
            return (
              <div 
                key={group.name}
                className="bg-gray-900 border border-gray-700 rounded-xl p-6"
              >
                {/* Group Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn(
                    "p-2 rounded-lg",
                    group.category === 'weapon' && "bg-red-900/50 text-red-400",
                    group.category === 'armor' && "bg-blue-900/50 text-blue-400",
                    group.category === 'accessory' && "bg-purple-900/50 text-purple-400"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{group.name}</h2>
                    <p className="text-gray-400 capitalize">{group.category}</p>
                  </div>
                </div>

                {/* Level Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {group.levels.map(level => (
                    <div 
                      key={level.level}
                      className="bg-black border border-gray-600 rounded-lg p-4 hover:border-gray-500 transition-colors"
                    >
                      {/* Level Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-sm font-medium">
                          Seviye {level.level}
                        </div>
                      </div>

                      {/* Item Image */}
                      <div className="relative w-full aspect-square mb-3">
                        {level.image ? (
                          <Image
                            src={level.image}
                            alt={level.name}
                            fill
                            className="object-contain rounded-lg"
                            sizes="400px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                            <Icon className="w-8 h-8 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Item Info */}
                      <h3 className="text-white font-bold text-lg mb-2">{level.name}</h3>
                      <p className="text-gray-400 text-sm">{level.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
