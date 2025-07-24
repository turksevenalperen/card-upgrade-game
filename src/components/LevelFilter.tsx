import { cn } from '@/lib/utils';

interface LevelFilterProps {
  selected: number | 'all';
  onSelect: (level: number | 'all') => void;
  unlockedLevels: number[];
}

export function LevelFilter({ selected, onSelect, unlockedLevels }: LevelFilterProps) {
  const levels = [
    { id: 'all' as const, name: 'All Levels' },
    { id: 1, name: 'Level 1', unlocked: unlockedLevels.includes(1) },
    { id: 2, name: 'Level 2', unlocked: unlockedLevels.includes(2) },
    { id: 3, name: 'Level 3', unlocked: unlockedLevels.includes(3) }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {levels.map(level => {
        const isSelected = selected === level.id;
        const isUnlocked = level.id === 'all' || level.unlocked;
        
        return (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={cn(
              "px-4 py-2 rounded-lg transition-all duration-200 font-medium",
              "border",
              isSelected
                ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-500/25"
                : isUnlocked
                ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                : "bg-gray-900 border-gray-700 text-gray-500 hover:bg-gray-800 hover:text-gray-400"
            )}
          >
            {level.name}
          </button>
        );
      })}
    </div>
  );
}
