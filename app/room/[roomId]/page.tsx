'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ref, onValue, set, update, remove, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Player, ABILITIES, AbilityType, PLAYER_COLORS, ENEMIES, getEnemyName } from '@/lib/types';
import AbilityCounter from '@/components/AbilityCounter';
import PlayerCard from '@/components/PlayerCard';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface RoomHistory {
  roomId: string;
  lastVisited: string;
  playerNames: string[];
}

type TabType = 'abilities' | 'enemies';

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [managedPlayerIds, setManagedPlayerIds] = useState<string[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('');
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(PLAYER_COLORS[0].value);
  const [isJoined, setIsJoined] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerColor, setNewPlayerColor] = useState<string>(PLAYER_COLORS[0].value);
  const [useJapanese, setUseJapanese] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerPlayerId, setColorPickerPlayerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('abilities');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const saveToHistory = (playerNames: string[]) => {
    const savedHistory = localStorage.getItem('repo-tracker-room-history');
    let history: RoomHistory[] = savedHistory ? JSON.parse(savedHistory) : [];
    
    const existingIndex = history.findIndex(room => room.roomId === roomId);
    const newEntry: RoomHistory = {
      roomId,
      lastVisited: new Date().toISOString(),
      playerNames,
    };

    if (existingIndex !== -1) {
      history[existingIndex] = newEntry;
    } else {
      history.unshift(newEntry);
    }

    history = history.slice(0, 10);
    localStorage.setItem('repo-tracker-room-history', JSON.stringify(history));
  };

  useEffect(() => {
    const savedManagedIds = localStorage.getItem(`repo-tracker-managed-${roomId}`);
    const ids = savedManagedIds ? JSON.parse(savedManagedIds) : [];
    setManagedPlayerIds(ids);

    if (ids.length > 0) {
      setCurrentPlayerId(ids[0]);
      setIsJoined(true);
    }

    const savedLanguage = localStorage.getItem('repo-tracker-language');
    if (savedLanguage === 'ja') {
      setUseJapanese(true);
    }

    const roomRef = ref(database, `rooms/${roomId}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayers(data.players || {});
        
        // Check if current user is creator
        if (ids.length > 0 && data.creatorId === ids[0]) {
          setIsCreator(true);
        }
        
        // Check if undo is available
        if (data.lastResetState) {
          setCanUndo(true);
        } else {
          setCanUndo(false);
        }
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    if (isJoined && managedPlayerIds.length > 0) {
      const playerNames = managedPlayerIds
        .map(id => players[id]?.name)
        .filter(name => name);
      if (playerNames.length > 0) {
        saveToHistory(playerNames);
      }
    }
  }, [isJoined, managedPlayerIds, players]);

  const toggleLanguage = () => {
    const newValue = !useJapanese;
    setUseJapanese(newValue);
    localStorage.setItem('repo-tracker-language', newValue ? 'ja' : 'en');
  };

  const joinRoom = async () => {
    if (!playerName.trim()) return;

    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const initialAbilities = ABILITIES.reduce((acc, ability) => {
      acc[ability] = 0;
      return acc;
    }, {} as Record<AbilityType, number>);

    const newPlayer: Player = {
      id: userId,
      name: playerName.trim(),
      color: selectedColor,
      abilities: initialAbilities,
    };

    // Check if room exists
    const roomRef = ref(database, `rooms/${roomId}`);
    const roomSnapshot = await get(roomRef);
    const roomData = roomSnapshot.val();

    // Set creator if room doesn't exist
    if (!roomData || !roomData.creatorId) {
      await update(roomRef, {
        creatorId: userId,
      });
      setIsCreator(true);
    }

    await set(ref(database, `rooms/${roomId}/players/${userId}`), newPlayer);
    
    const newManagedIds = [userId];
    setManagedPlayerIds(newManagedIds);
    setCurrentPlayerId(userId);
    localStorage.setItem(`repo-tracker-managed-${roomId}`, JSON.stringify(newManagedIds));
    setIsJoined(true);
  };

  const addPlayer = async () => {
    if (!newPlayerName.trim()) return;

    const userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const initialAbilities = ABILITIES.reduce((acc, ability) => {
      acc[ability] = 0;
      return acc;
    }, {} as Record<AbilityType, number>);

    const newPlayer: Player = {
      id: userId,
      name: newPlayerName.trim(),
      color: newPlayerColor,
      abilities: initialAbilities,
    };

    await set(ref(database, `rooms/${roomId}/players/${userId}`), newPlayer);
    
    const newManagedIds = [...managedPlayerIds, userId];
    setManagedPlayerIds(newManagedIds);
    setCurrentPlayerId(userId);
    localStorage.setItem(`repo-tracker-managed-${roomId}`, JSON.stringify(newManagedIds));
    setNewPlayerName('');
    setNewPlayerColor(PLAYER_COLORS[0].value);
    setShowAddPlayer(false);
  };

  const confirmDeletePlayer = (playerId: string) => {
    setDeleteTargetId(playerId);
    setShowDeleteConfirm(true);
  };

  const deletePlayer = async () => {
    if (!deleteTargetId) return;

    await remove(ref(database, `rooms/${roomId}/players/${deleteTargetId}`));
    
    const newManagedIds = managedPlayerIds.filter(id => id !== deleteTargetId);
    setManagedPlayerIds(newManagedIds);
    localStorage.setItem(`repo-tracker-managed-${roomId}`, JSON.stringify(newManagedIds));

    if (currentPlayerId === deleteTargetId) {
      setCurrentPlayerId(newManagedIds[0] || '');
    }

    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const openColorPicker = (playerId: string) => {
    setColorPickerPlayerId(playerId);
    setShowColorPicker(true);
  };

  const updatePlayerColor = async (color: string) => {
    if (!colorPickerPlayerId) return;
    
    await update(ref(database, `rooms/${roomId}/players/${colorPickerPlayerId}`), {
      color: color,
    });
    setShowColorPicker(false);
    setColorPickerPlayerId(null);
  };

  const updateAbility = async (ability: AbilityType, delta: number) => {
    if (!isJoined || !players[currentPlayerId]) return;

    const currentValue = players[currentPlayerId].abilities[ability];
    const newValue = Math.max(0, currentValue + delta);

    await update(ref(database, `rooms/${roomId}/players/${currentPlayerId}/abilities`), {
      [ability]: newValue,
    });
  };

  const toggleAbility = async (ability: AbilityType) => {
    if (!isJoined || !players[currentPlayerId]) return;

    const currentValue = players[currentPlayerId].abilities[ability];
    const newValue = currentValue > 0 ? 0 : 1;

    await update(ref(database, `rooms/${roomId}/players/${currentPlayerId}/abilities`), {
      [ability]: newValue,
    });
  };

  const copyRoomLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAllAbilities = async () => {
  if (!isCreator) return;

  // Save current state for undo
  const currentState = { ...players };
  await update(ref(database, `rooms/${roomId}`), {
    lastResetState: {
      timestamp: new Date().toISOString(),
      players: currentState,
    },
  });

  // Reset all abilities to 0
  const updates: any = {};
    Object.keys(players).forEach((playerId) => {
      ABILITIES.forEach((ability) => {
        updates[`players/${playerId}/abilities/${ability}`] = 0;
      });
    });

    await update(ref(database, `rooms/${roomId}`), updates);
    setShowResetConfirm(false);
  };

  const undoReset = async () => {
    if (!isCreator || !canUndo) return;

    const roomRef = ref(database, `rooms/${roomId}`);
    const roomSnapshot = await get(roomRef);
    const roomData = roomSnapshot.val();

    if (roomData?.lastResetState?.players) {
      await update(roomRef, {
        players: roomData.lastResetState.players,
        lastResetState: null,
      });
    }
  };

  if (!isJoined) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 transition text-sm"
          >
            ← {useJapanese ? 'トップに戻る' : 'Back to Home'}
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Join Room</h1>
          <p className="text-gray-400 mb-6">Room ID: {roomId}</p>
          
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
            className="w-full px-4 py-3 sm:py-3 bg-gray-700 text-white text-base rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none mb-4"
            style={{ fontSize: '16px' }}
          />

          <div className="mb-4">
            <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Choose your color:</label>
            <div className="grid grid-cols-5 gap-2">
              {PLAYER_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-full h-12 sm:h-14 rounded-lg transition touch-manipulation ${
                    selectedColor === color.value ? 'ring-4 ring-white' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={joinRoom}
            disabled={!playerName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            Join Room
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

  const currentPlayer = players[currentPlayerId];
  const otherPlayers = Object.values(players).filter(p => p.id !== currentPlayerId);

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
    <main className="flex-1 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="w-full sm:w-auto">
              <Link href="/" className="inline-block hover:opacity-80 transition">
                <h1 className="text-2xl sm:text-3xl font-bold text-white cursor-pointer">Monohiroi</h1>
              </Link>
              <p className="text-gray-400 text-sm sm:text-base">Room: {roomId}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={toggleLanguage}
                className="flex-1 sm:flex-initial bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition text-sm touch-manipulation"
              >
                {useJapanese ? '🇯🇵 日本語' : '🇺🇸 English'}
              </button>
              <button
                onClick={copyRoomLink}
                className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition text-sm sm:text-base touch-manipulation"
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl mb-6 border border-gray-700 overflow-hidden">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('abilities')}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-semibold transition text-sm sm:text-base touch-manipulation ${
                activeTab === 'abilities'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 active:bg-gray-600'
              }`}
            >
              {useJapanese ? '能力管理' : 'Abilities'}
            </button>
            <button
              onClick={() => setActiveTab('enemies')}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 font-semibold transition text-sm sm:text-base touch-manipulation ${
                activeTab === 'enemies'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 active:bg-gray-600'
              }`}
            >
              {useJapanese ? '敵情報' : 'Enemies'}
            </button>
          </div>
        </div>

        {activeTab === 'abilities' && (
          <>
            {otherPlayers.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Team Members ({otherPlayers.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {otherPlayers.map((player) => (
                    <PlayerCard key={player.id} player={player} useJapanese={useJapanese} />
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {useJapanese ? 'あなたのプレイヤー' : 'Your Players'}
                </h2>
                <div className="flex gap-2">
                  {isCreator && canUndo && (
                    <button
                      onClick={undoReset}
                      className="bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition text-sm touch-manipulation"
                    >
                      ↶ {useJapanese ? '元に戻す' : 'Undo'}
                    </button>
                  )}
                  {isCreator && (
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition text-sm touch-manipulation"
                    >
                      {useJapanese ? 'リセット' : 'Reset All'}
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddPlayer(true)}
                    className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg transition text-sm touch-manipulation"
                  >
                    + {useJapanese ? 'プレイヤー追加' : 'Add Player'}
                  </button>
                </div>
              </div>

              {showAddPlayer && (
                <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <input
                    type="text"
                    placeholder="Enter player name"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none mb-3"
                  />
                  <div className="mb-3">
                    <label className="block text-white font-semibold mb-2 text-sm">Choose color:</label>
                    <div className="grid grid-cols-10 gap-2">
                      {PLAYER_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setNewPlayerColor(color.value)}
                          className={`w-full h-10 rounded-lg transition ${
                            newPlayerColor === color.value ? 'ring-4 ring-white' : ''
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addPlayer}
                      disabled={!newPlayerName.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddPlayer(false);
                        setNewPlayerName('');
                        setNewPlayerColor(PLAYER_COLORS[0].value);
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {managedPlayerIds.map((playerId) => {
                  const player = players[playerId];
                  if (!player) return null;
                  
                  return (
                    <div 
                      key={playerId}
                      onClick={() => setCurrentPlayerId(playerId)}
                      className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                        currentPlayerId === playerId
                          ? 'border-white'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      style={
                        player.color
                          ? { backgroundColor: currentPlayerId === playerId ? player.color : `${player.color}20` }
                          : { backgroundColor: currentPlayerId === playerId ? '#374151' : '#1f2937' }
                      }
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1">
                          {player.color && (
                            <div
                              className="w-5 h-5 rounded-full border-2 border-white flex-shrink-0"
                              style={{ backgroundColor: player.color }}
                            />
                          )}
                          <span className="text-white font-bold text-lg">{player.name}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeletePlayer(playerId);
                          }}
                          className="text-red-400 hover:text-red-300 active:text-red-200 hover:bg-red-900/30 p-2 rounded transition touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          title="Delete player"
                        >
                          ✕
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openColorPicker(playerId);
                        }}
                        className="w-full bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white font-semibold py-2 px-3 rounded-lg transition text-sm touch-manipulation"
                      >
                        CHANGE COLOR
                      </button>
                    </div>
                  );
                })}
              </div>

              {currentPlayer && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Editing: {currentPlayer.name}
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {ABILITIES.map((ability) => (
                      <AbilityCounter
                        key={ability}
                        ability={ability}
                        value={currentPlayer.abilities[ability] || 0}
                        onIncrement={() => updateAbility(ability, 1)}
                        onDecrement={() => updateAbility(ability, -1)}
                        onToggle={() => toggleAbility(ability)}
                        useJapanese={useJapanese}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {activeTab === 'enemies' && (
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              {useJapanese ? '敵キャラ情報' : 'Enemy Information'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ENEMIES.map((enemy) => (
                <div
                  key={enemy.id}
                  className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition"
                >
                  <div className="w-24 h-24 bg-white rounded-lg mb-3 flex items-center justify-center text-gray-800 text-sm mx-auto overflow-hidden border border-gray-600">
                    {enemy.icon && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center bg-gray-700 border border-gray-600">
                        <img 
                          src={enemy.icon} 
                          alt={enemy.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 text-center">
                    {getEnemyName(enemy, useJapanese)}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>{useJapanese ? '必要筋力:' : 'Required STR:'}</span>
                      <span className="font-bold text-yellow-400">
                        {enemy.canCarry ? enemy.weight : (useJapanese ? '持ち上げ不可' : 'Cannot carry')}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>HP:</span>
                      <span className="font-bold text-red-400">{enemy.hp}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>{useJapanese ? 'オーブ価値:' : 'Orb Value:'}</span>
                      <span className="font-bold text-green-400">{enemy.orbValue}</span>
                    </div>
                    {enemy.note && (
                      <div className="pt-2 border-t border-gray-600 text-blue-400 text-xs">
                        {enemy.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showColorPicker && colorPickerPlayerId && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowColorPicker(false);
            setColorPickerPlayerId(null);
          }}
        >
          <div 
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Choose Color for {players[colorPickerPlayerId]?.name}
            </h3>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {PLAYER_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updatePlayerColor(color.value)}
                  className={`w-full h-16 rounded-lg transition hover:scale-110 ${
                    players[colorPickerPlayerId]?.color === color.value ? 'ring-4 ring-white' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <button
              onClick={() => {
                setShowColorPicker(false);
                setColorPickerPlayerId(null);
              }}
              className="w-full bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showDeleteConfirm && deleteTargetId && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => {
            setShowDeleteConfirm(false);
            setDeleteTargetId(null);
          }}
        >
          <div 
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              {useJapanese ? 'プレイヤーを削除しますか？' : 'Delete Player?'}
            </h3>
            <p className="text-gray-300 mb-6">
              {useJapanese 
                ? `${players[deleteTargetId]?.name}を削除してもよろしいですか？この操作は取り消せません。`
                : `Are you sure you want to delete ${players[deleteTargetId]?.name}? This action cannot be undone.`
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={deletePlayer}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                {useJapanese ? '削除' : 'Delete'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteTargetId(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                {useJapanese ? 'キャンセル' : 'Cancel'}
              
              </button>
            </div>
          </div>
        </div>
      )}
      {showResetConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowResetConfirm(false)}
        >
          <div 
            className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              {useJapanese ? '全プレイヤーをリセットしますか？' : 'Reset All Players?'}
            </h3>
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              {useJapanese 
                ? 'すべてのプレイヤーの能力値が0にリセットされます。この操作は「元に戻す」で取り消せます。'
                : 'All player abilities will be reset to 0. You can undo this action.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={resetAllAbilities}
                className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-semibold py-3 px-6 rounded-lg transition touch-manipulation"
              >
                {useJapanese ? 'リセット' : 'Reset'}
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-full bg-gray-600 hover:bg-gray-500 active:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition touch-manipulation"
              >
                {useJapanese ? 'キャンセル' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
    <Footer />
  </div>
);
}