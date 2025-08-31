export const isAdminAuthenticated = () => {
  return localStorage.getItem('mctiers_admin') === 'true';
};

export const setAdminAuthenticated = (authenticated: boolean) => {
  if (authenticated) {
    localStorage.setItem('mctiers_admin', 'true');
  } else {
    localStorage.removeItem('mctiers_admin');
  }
};

export const getTitle = (points: number): string => {
  if (points >= 400) return 'Combat Grandmaster';
  if (points >= 300) return 'Combat Master';
  if (points >= 150) return 'Combat Ace';
  return 'Combat Novice';
};

export const getTitleIcon = (points: number): string => {
  if (points >= 400) return 'fas fa-crown';
  if (points >= 300) return 'fas fa-medal';
  if (points >= 150) return 'fas fa-star';
  return 'fas fa-shield';
};

export const generateRandomTiers = (): Record<string, string> => {
  const tiers = ['HT1', 'HT2', 'HT3', 'HT4', 'HT5', 'LT1', 'LT2', 'LT3', 'LT4', 'LT5'];
  const categories = ['vanilla', 'uhc', 'pot', 'sword', 'axe', 'mace', 'smp', 'nethop'];
  const result: Record<string, string> = {};
  
  categories.forEach(cat => {
    if (Math.random() > 0.3) { // 70% chance to have a tier in this category
      result[cat] = tiers[Math.floor(Math.random() * tiers.length)];
    }
  });
  
  return result;
};
