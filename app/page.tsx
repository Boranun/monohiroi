'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface RoomHistory {
  roomId: string;
  lastVisited: string;
  playerNames: string[];
}

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [roomHistory, setRoomHistory] = useState<RoomHistory[]>([]);
  const [useJapanese, setUseJapanese] = useState(true);

  useEffect(() => {
    const savedHistory = localStorage.getItem('repo-tracker-room-history');
    if (savedHistory) {
      const history: RoomHistory[] = JSON.parse(savedHistory);
      setRoomHistory(history.sort((a, b) => 
        new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
      ));
    }

    const savedLanguage = localStorage.getItem('repo-tracker-language');
    if (savedLanguage === 'en') {
      setUseJapanese(false);
    }
  }, []);

  const toggleLanguage = () => {
    const newValue = !useJapanese;
    setUseJapanese(newValue);
    localStorage.setItem('repo-tracker-language', newValue ? 'ja' : 'en');
  };

  const createRoom = () => {
    setIsCreating(true);
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/room/${roomId}`);
  };

  const goToRoom = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  const deleteHistory = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = roomHistory.filter(room => room.roomId !== roomId);
    setRoomHistory(newHistory);
    localStorage.setItem('repo-tracker-room-history', JSON.stringify(newHistory));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (useJapanese) {
      if (diffMins < 60) return `${diffMins}分前`;
      if (diffHours < 24) return `${diffHours}時間前`;
      if (diffDays < 7) return `${diffDays}日前`;
      return date.toLocaleDateString('ja-JP');
    } else {
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US');
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Monohiroi',
    description: 'Real-time ability tracking tool for R.E.P.O. game players',
    url: 'https://monohiroi.vercel.app',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time ability tracking',
      'Multiplayer room sharing',
      'Enemy information database',
      'Multi-language support (Japanese/English)',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 mb-6">
              <div className="flex justify-end mb-4">
                <button
                  onClick={toggleLanguage}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm"
                >
                  {useJapanese ? '🇯🇵 日本語' : '🇺🇸 English'}
                </button>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-2 text-center">
                Monohiroi
              </h1>
              <p className="text-gray-400 text-center mb-2 text-sm">
                {useJapanese ? '物拾い' : 'Monohiroi'}
              </p>
              <p className="text-gray-400 text-center mb-8">
                {useJapanese 
                  ? 'R.E.P.O.プレイヤーのための能力値共有ツール'
                  : 'Ability tracking tool for R.E.P.O. players'}
              </p>
              
              <button
                onClick={createRoom}
                disabled={isCreating}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg transition text-lg mb-4"
              >
                {isCreating 
                  ? (useJapanese ? 'ルーム作成中...' : 'Creating Room...') 
                  : (useJapanese ? '新しいルームを作成' : 'Create New Room')}
              </button>

              <div className="pt-6 border-t border-gray-700">
                <h2 className="text-white font-semibold mb-2">
                  {useJapanese ? '使い方:' : 'How to use:'}
                </h2>
                <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
                  <li>{useJapanese ? '新しいルームを作成' : 'Create a new room'}</li>
                  <li>{useJapanese ? 'URLをDiscordでフレンドと共有' : 'Share the URL with your friends on Discord'}</li>
                  <li>{useJapanese ? '全員でリアルタイムに能力値を管理' : 'Everyone can track abilities together in real-time'}</li>
                </ol>
              </div>
            </div>

            {roomHistory.length > 0 && (
              <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700 mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {useJapanese ? '最近のルーム' : 'Recent Rooms'}
                </h2>
                <div className="space-y-3">
                  {roomHistory.map((room) => (
                    <div
                      key={room.roomId}
                      onClick={() => goToRoom(room.roomId)}
                      className="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition border border-gray-600"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-white font-bold text-lg">
                            {useJapanese ? 'ルーム:' : 'Room:'} {room.roomId}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {formatDate(room.lastVisited)}
                          </span>
                        </div>
                        {room.playerNames.length > 0 && (
                          <div className="text-gray-300 text-sm">
                            {useJapanese ? 'プレイヤー:' : 'Players:'} {room.playerNames.join(', ')}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => deleteHistory(room.roomId, e)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-3">
                {useJapanese ? 'コミュニティ' : 'Community'}
              </h2>
              <Link
                href="/feedback"
                className="block w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition text-center"
              >
                <div className="text-white font-bold text-lg mb-1">
                  💬 {useJapanese ? 'フィードバック・Q&A' : 'Feedback & Q&A'}
                </div>
                <div className="text-blue-100 text-sm">
                  {useJapanese 
                    ? '機能リクエスト、バグ報告、質問などをお寄せください'
                    : 'Share feature requests, bug reports, questions, and more'}
                </div>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}