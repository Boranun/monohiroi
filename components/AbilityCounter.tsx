'use client';

import { AbilityType, isToggleAbility, getDisplayValue, getAbilityName, getCarryableEnemies } from '@/lib/types';

interface AbilityCounterProps {
  ability: AbilityType;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onToggle?: () => void;
  useJapanese?: boolean;
}

export default function AbilityCounter({ 
  ability, 
  value, 
  onIncrement, 
  onDecrement,
  onToggle,
  useJapanese = false
}: AbilityCounterProps) {
  const abilityName = getAbilityName(ability, useJapanese);

  if (isToggleAbility(ability)) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
        <span className="text-white font-medium">{abilityName}</span>
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="text-gray-400">OFF</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={value > 0}
              onChange={onToggle}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
          </div>
          <span className="text-gray-400">ON</span>
        </label>
      </div>
    );
  }

  const displayValue = getDisplayValue(ability, value);
  const showConversion = displayValue !== value.toString();
  const isStrength = ability === 'STRENGTH';
  const carryableEnemies = isStrength ? getCarryableEnemies(value) : [];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between p-4">
        <span className="text-white font-medium">{abilityName}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={onDecrement}
            disabled={value === 0}
            className="w-10 h-10 flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-bold transition"
          >
            -
          </button>
          <div className="flex flex-col items-center min-w-[5rem]">
            <span className="text-2xl font-bold text-white">
              {value}
            </span>
            {showConversion && (
              <span className="text-sm text-green-400 font-semibold">
                → {displayValue}
              </span>
            )}
          </div>
          <button
            onClick={onIncrement}
            className="w-10 h-10 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
          >
            +
          </button>
        </div>
      </div>
      
      {isStrength && carryableEnemies.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">
            {useJapanese ? '持てる敵キャラ:' : 'Can carry:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {carryableEnemies.map((enemy) => (
              <div
                key={enemy.id}
                className="w-10 h-10 bg-white rounded border border-gray-600 flex items-center justify-center text-gray-400 text-xs hover:bg-gray-100 transition relative group overflow-hidden"
                title={`${enemy.name} (${enemy.nameJp})\nWeight: ${enemy.weight} | HP: ${enemy.hp}\n${enemy.orbValue}`}
              >
                {enemy.icon && (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded overflow-hidden flex items-center justify-center bg-gray-700">
                    <img 
                      src={enemy.icon} 
                      alt={enemy.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}