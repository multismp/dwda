export interface Player {
  id: string;
  name: string;
  points: number;
  region: string;
  title: string;
  titleIcon: string;
  tiers: Record<string, string>;
}

export interface PlayerFormData {
  name: string;
  points: number;
  region: string;
  title: string;
  titleIcon: string;
  tiers: Record<string, string>;
}

export type Category = 'overall' | 'uhc' | 'pot' | 'vanilla' | 'sword' | 'axe' | 'mace' | 'smp' | 'nethop';

export const categories: Record<Category, { name: string; icon: string; color: string }> = {
  overall: { name: 'Overall', icon: 'fas fa-trophy', color: 'text-primary' },
  uhc: { name: 'UHC', icon: 'fas fa-heart', color: 'text-red-500' },
  pot: { name: 'Pot', icon: 'fas fa-flask', color: 'text-blue-500' },
  vanilla: { name: 'Vanilla', icon: 'fas fa-cube', color: 'text-amber-600' },
  sword: { name: 'Sword', icon: 'fas fa-sword', color: 'text-gray-400' },
  axe: { name: 'Axe', icon: 'fas fa-hammer', color: 'text-orange-500' },
  mace: { name: 'Mace', icon: 'fas fa-gavel', color: 'text-purple-500' },
  smp: { name: 'SMP', icon: 'fas fa-mountain', color: 'text-green-500' },
  nethop: { name: 'NethOP', icon: 'fas fa-fire', color: 'text-red-600' },
};
