import { computed } from 'vue';

const COLORS = [
  'bg-indigo-500', 'bg-indigo-600',
  'bg-green-500', 'bg-green-600',
  'bg-emerald-500', 'bg-emerald-600',
  'bg-teal-500', 'bg-teal-600',
  'bg-cyan-500', 'bg-cyan-600',
  'bg-blue-500', 'bg-blue-600',
  'bg-sky-500', 'bg-sky-600',
  'bg-violet-500', 'bg-violet-600',
  'bg-purple-500', 'bg-purple-600',
  'bg-fuchsia-500', 'bg-fuchsia-600',
  'bg-pink-500', 'bg-pink-600',
  'bg-rose-500', 'bg-rose-600',
  'bg-red-500', 'bg-red-600',
  'bg-orange-500', 'bg-orange-600',
  'bg-amber-500', 'bg-amber-600',
  'bg-yellow-500', 'bg-yellow-600',
  'bg-lime-500', 'bg-lime-600'
] as const;

export const useColor = () => {
  const getColor = (name: string) => {
    const hash = name.split('').reduce((acc, char, index) => {
      return char.charCodeAt(0) * (index + 1) + ((acc << 5) - acc);
    }, 0);

    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
  };

  const getColorByIndex = (index: number) => {
    return COLORS[Math.abs(index) % COLORS.length];
  };

  return {
    getColor,
    getColorByIndex,
    colors: computed(() => COLORS)
  };
};