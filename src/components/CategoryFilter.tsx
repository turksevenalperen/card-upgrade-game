import { Sword, Shield, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All', icon: null },
  { id: 'weapon', name: 'Weapons', icon: Sword },
  { id: 'armor', name: 'Armor', icon: Shield },
  { id: 'accessory', name: 'Accessories', icon: Gem },
];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => {
        const Icon = category.icon;
        const isSelected = selected === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
              "border font-medium",
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
  );
}
