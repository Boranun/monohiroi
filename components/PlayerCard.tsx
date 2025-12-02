'use client';

import { useState } from 'react';
import { Player, getDisplayValue, getAbilityName, getCarryableEnemies } from '@/lib/types';
import { ABILITIES } from '@/lib/types';

interface PlayerCardProps {
  player: Player;
  isCurrentUser?: boolean;
  useJapanese?: boolean;
}

export default function PlayerCard({ player, isCurrentUser, useJapanese = false }: PlayerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const importantAbilities = ABILITIES.slice(0, 5);
  const otherAbilities = ABILITIES.slice(5);
  
  const displayAbilities = isExpanded ? ABILITIES : importantAbilities;
  
  const strengthValue = player.abilities['STRENGTH'] || 0;
  const carryableEnemies = getCarryableEnemies(strengthValue);

  const cardStyle = player.color
    ? {
        borderColor: player.color,
        borderWidth: '3px',
      }
    : {};

  return (
    <div 
      className={`p-4 rounded-lg border-2 ${
        isCurrentUser ? 'bg-blue-950' : 'bg-gray-800'
      }`}
      style={cardStyle}
    >
      <div className="flex items-center gap-2 mb-2">
        {player.color && (
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: player.color }}
          />
        )}
        <h3 className="text-xl font-bold text-white">
          {player.name} {isCurrentUser && '(You)'}
        </h3>
      </div>
      <div className="space-y-1 text-sm">
        {displayAbilities.map((ability) => (
          <div key={ability} className="flex justify-between text-gray-300">
            <span>{getAbilityName(ability, useJapanese)}:</span>
            <span className="font-bold">
              {getDisplayValue(ability, player.abilities[ability])}
            </span>
          </div>
        ))}
      </div>
      
      {carryableEnemies.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">
            {useJapanese ? '持てる敵:' : 'Can carry:'}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {carryableEnemies.map((enemy) => (
              <div
                key={enemy.id}
                className="w-8 h-8 bg-white rounded border border-gray-600 flex items-center justify-center text-gray-800 text-[10px] hover:bg-gray-100 transition overflow-hidden"
                title={`${enemy.name} (${enemy.nameJp})\nWeight: ${enemy.weight} | HP: ${enemy.hp}\n${enemy.orbValue}`}
              >
                {enemy.icon && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded overflow-hidden flex items-center justify-center bg-gray-700">
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
      
      {otherAbilities.length > 0 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition flex items-center justify-center gap-1"
        >
          {isExpanded ? (
            <>
              <span>▲</span>
              <span>Show Less</span>
            </>
          ) : (
            <>
              <span>▼</span>
              <span>Show All Abilities</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}