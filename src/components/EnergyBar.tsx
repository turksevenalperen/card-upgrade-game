import { Zap } from 'lucide-react';

interface EnergyBarProps {
  current: number;
  max: number;
  regenRate: number;
}

export function EnergyBar({ current, max, regenRate }: EnergyBarProps) {
  const percentage = (current / max) * 100;
  const timeToFull = current < max ? Math.ceil((max - current) / regenRate) : 0;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-red-400" />
          <span className="text-white font-medium">⚡ Savaş Enerjisi</span>
        </div>
        <span className="text-gray-400 text-sm">
          {current}/{max}
        </span>
      </div>
      
      <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
        <div 
          className="h-3 rounded-full transition-all duration-300 bg-gradient-to-r from-red-500 to-orange-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>+{regenRate}/saniye</span>
        {timeToFull > 0 && (
          <span>{timeToFull}s kala</span>
        )}
      </div>
    </div>
  );
}
