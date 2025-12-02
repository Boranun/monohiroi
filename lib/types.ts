export const ABILITIES = [
  'STRENGTH',
  'Extra Jump',
  'STAMINA',
  'HEALTH',
  'RANGE',
  'SPRINT SPEED',
  'TUMBLE LAUNCH',
  'TUMBLE WINGS',
  'CROUCH REST',
  'MAP PLAYER COUNT'
] as const;

export type AbilityType = typeof ABILITIES[number];

export const PLAYER_COLORS = [
  { name: 'Red', value: '#ef4444', border: '#dc2626' },
  { name: 'Blue', value: '#3b82f6', border: '#2563eb' },
  { name: 'Green', value: '#22c55e', border: '#16a34a' },
  { name: 'Yellow', value: '#eab308', border: '#ca8a04' },
  { name: 'Purple', value: '#a855f7', border: '#9333ea' },
  { name: 'Pink', value: '#ec4899', border: '#db2777' },
  { name: 'Orange', value: '#f97316', border: '#ea580c' },
  { name: 'Cyan', value: '#06b6d4', border: '#0891b2' },
  { name: 'Lime', value: '#84cc16', border: '#65a30d' },
  { name: 'Indigo', value: '#6366f1', border: '#4f46e5' },
] as const;

export interface Enemy {
  id: string;
  name: string;
  nameJp: string;
  weight: number;
  hp: number;
  orbValue: string;
  note?: string;
  canCarry: boolean;
  icon?: string;
}

export const ENEMIES: Enemy[] = [
  { id: 'bella', name: 'Bella', nameJp: 'ベラ', weight: 9, hp: 200, orbValue: '$2,200~$3,000', canCarry: true, icon: '/enemies/Monohiroi-Bella.png' },
  { id: 'birthday-boy', name: 'Birthday Boy', nameJp: 'バースデーボーイ', weight: 4, hp: 150, orbValue: '$2,200~$2,900', canCarry: true, icon: '/enemies/birthday-boy.png' },
  { id: 'cleanup-crew', name: 'Cleanup Crew', nameJp: 'クリーンアップクルー', weight: 4, hp: 150, orbValue: '$2,200~$2,900', canCarry: true },
  { id: 'elsa', name: 'Elsa', nameJp: 'エルサ', weight: 999, hp: 600, orbValue: '$6,000~$10,000', canCarry: false, icon: '/enemies/Monohiroi-Elsa.png' },
  { id: 'gambit', name: 'Gambit', nameJp: 'ギャムビット', weight: 9, hp: 150, orbValue: '$3,500~$4,400', canCarry: true, icon: '/enemies/Monohiroi-Gambit.png' },
  { id: 'head-grab', name: 'Head Grab', nameJp: 'ヘッドグラブ', weight: 2, hp: 40, orbValue: '$200~$500', canCarry: true, icon: '/enemies/Monohiroi-Head_Grab.png' },
  { id: 'heart-hugger', name: 'Heart Hugger', nameJp: 'ハートハガー', weight: 9, hp: 300, orbValue: '$3,500~$4,500', canCarry: true, icon: '/enemies/Monohiroi-Heart_Hugger.png' },
  { id: 'loom', name: 'Loom', nameJp: 'ルーム', weight: 13, hp: 500, orbValue: '$5,500~$7,500', canCarry: true },
  { id: 'oogly', name: 'Oogly', nameJp: 'ウーグリー', weight: 9, hp: 200, orbValue: '$3,500~$4,500', canCarry: true },
  { id: 'tick', name: 'Tick', nameJp: 'チック', weight: 0, hp: 10, orbValue: '$0', note: 'エナジードレイン後に倒すと回復エリアを作る', canCarry: true, icon: '/enemies/Monohiroi-Tick.png' },
  { id: 'animal', name: 'Animal', nameJp: 'アニマル', weight: 4, hp: 150, orbValue: '$2,000~$4,300', canCarry: true, icon: '/enemies/Monohiroi-Animal.png' },
  { id: 'apex-predator', name: 'Apex Predator', nameJp: 'エイペックスプレデター', weight: 4, hp: 150, orbValue: '$2,000~$4,300', canCarry: true },
  { id: 'banger', name: 'Banger', nameJp: 'バンガー', weight: 0, hp: 50, orbValue: 'なし', canCarry: true, icon: '/enemies/Monohiroi-Banger.png' },
  { id: 'bowtie', name: 'Bowtie', nameJp: 'ボウタイ', weight: 7, hp: 200, orbValue: '$3,000~$7,000', canCarry: true, icon: '/enemies/Monohiroi-Bowtie.png' },
  { id: 'chef', name: 'Chef', nameJp: 'シェフ', weight: 10, hp: 230, orbValue: '$3,700~$5,000', canCarry: true, icon: '/enemies/Monohiroi-Chef.png' },
  { id: 'clown', name: 'Clown', nameJp: 'クラウン', weight: 13, hp: 250, orbValue: '$5,000~$8,000', canCarry: true, icon: '/enemies/Monohiroi-Clown.png' },
  { id: 'gnome', name: 'Gnome', nameJp: 'ノーム', weight: 0, hp: 20, orbValue: 'なし', canCarry: true, icon: '/enemies/Monohiroi-Gnome.png' },
  { id: 'headman', name: 'Headman', nameJp: 'ヘッドマン', weight: 13, hp: 600, orbValue: '$9,500~$12,000', canCarry: true, icon: '/enemies/Monohiroi-Headman.png' },
  { id: 'hidden', name: 'Hidden', nameJp: 'ヒドゥン', weight: 4, hp: 100, orbValue: '$3,500~$7,000', canCarry: true },
  { id: 'huntsman', name: 'Huntsman', nameJp: 'ハントマン', weight: 9, hp: 250, orbValue: '$3,000~$7,000', canCarry: true, icon: '/enemies/Monohiroi-Huntsman.png' },
  { id: 'mentalist', name: 'Mentalist', nameJp: 'メンタリスト', weight: 4, hp: 150, orbValue: '$3,000~$6,000', canCarry: true },
  { id: 'peeper', name: 'Peeper', nameJp: 'ピーパー', weight: 999, hp: 30, orbValue: '$2,000~$4,000', canCarry: false, icon: '/enemies/Monohiroi-Peeper.png' },
  { id: 'reaper', name: 'Reaper', nameJp: 'リーパー', weight: 9, hp: 250, orbValue: '$6,000~$8,000', canCarry: true },
  { id: 'robe', name: 'Robe', nameJp: 'ローブ', weight: 13, hp: 250, orbValue: '$5,000~$8,000', canCarry: true, icon: '/enemies/Monohiroi-Robe.png' },
  { id: 'rugrat', name: 'Rugrat', nameJp: 'ラグラット', weight: 1, hp: 15, orbValue: '$100~$300', canCarry: true, icon: '/enemies/Monohiroi-Rugrat.png' },
  { id: 'shadow-child', name: 'Shadow Child', nameJp: 'シャドーチャイルド', weight: 9, hp: 150, orbValue: '$2,000~$5,000', canCarry: true, icon: '/enemies/Monohiroi-Shadow_Child.png' },
  { id: 'spewer', name: 'Spewer', nameJp: 'スピュワー', weight: 4, hp: 65, orbValue: '$1,000~$4,000', canCarry: true },
  { id: 'trudge', name: 'Trudge', nameJp: 'トラッジ', weight: 13, hp: 500, orbValue: '$5,000~$8,000', canCarry: true },
  { id: 'upscream', name: 'Upscream', nameJp: 'アップスクリーム', weight: 4, hp: 50, orbValue: '$2,000~$4,000', canCarry: true, icon: '/enemies/Monohiroi-Upscream.png' },
];

export interface Player {
  id: string;
  name: string;
  color?: string;
  abilities: Record<AbilityType, number>;
}

export interface Room {
  creatorId?: string;
  players: Record<string, Player>;
  lastResetState?: {
    timestamp: string;
    players: Record<string, Player>;
  };
}

export const ABILITY_NAMES_JP: Record<AbilityType, string> = {
  'STRENGTH': '筋力',
  'Extra Jump': '追加ジャンプ',
  'STAMINA': 'スタミナ',
  'HEALTH': '体力',
  'RANGE': '範囲',
  'SPRINT SPEED': 'ダッシュ速度',
  'TUMBLE LAUNCH': 'タンブルローンチ',
  'TUMBLE WINGS': 'タンブルウィング',
  'CROUCH REST': 'しゃがみ休憩',
  'MAP PLAYER COUNT': 'マップ表示人数'
};

export function getDisplayValue(ability: AbilityType, internalValue: number): string {
  switch (ability) {
    case 'HEALTH':
      return (100 + internalValue * 20).toString();
    case 'STAMINA':
      return (40 + internalValue * 10).toString();
    case 'SPRINT SPEED':
      return `${100 + internalValue * 20}%`;
    case 'MAP PLAYER COUNT':
      return internalValue > 0 ? 'ON' : 'OFF';
    default:
      return internalValue.toString();
  }
}

export function isToggleAbility(ability: AbilityType): boolean {
  return ability === 'MAP PLAYER COUNT';
}

export function getAbilityName(ability: AbilityType, useJapanese: boolean): string {
  return useJapanese ? ABILITY_NAMES_JP[ability] : ability;
}

export function getCarryableEnemies(strengthValue: number): Enemy[] {
  return ENEMIES.filter(enemy => enemy.canCarry && enemy.weight <= strengthValue);
}

export function getEnemyName(enemy: Enemy, useJapanese: boolean): string {
  return useJapanese ? enemy.nameJp : enemy.name;
}

export interface Feedback {
  id: string;
  author: string;
  title: string;
  content: string;
  category: 'feature-request' | 'bug-report' | 'question' | 'other';
  timestamp: string;
  replies?: Reply[];
}

export interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export const FEEDBACK_CATEGORIES = [
  { value: 'feature-request', label: '機能リクエスト', labelEn: 'Feature Request' },
  { value: 'bug-report', label: 'バグ報告', labelEn: 'Bug Report' },
  { value: 'question', label: '質問', labelEn: 'Question' },
  { value: 'other', label: 'その他', labelEn: 'Other' },
] as const;