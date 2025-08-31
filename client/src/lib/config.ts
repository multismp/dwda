// Website configuration
export interface SiteConfig {
  serverIP: string;
  serverName: string;
  siteName: string;
}

// Default configuration
const DEFAULT_CONFIG: SiteConfig = {
  serverIP: 'mcpvp.club',
  serverName: 'PvP Club',
  siteName: 'StarTiers'
};

// Load configuration from localStorage with fallback to defaults
export const loadConfig = (): SiteConfig => {
  try {
    const savedConfig = localStorage.getItem('startiers_config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load config from localStorage:', error);
  }
  
  return DEFAULT_CONFIG;
};

// Save configuration to localStorage
export const saveConfig = (config: Partial<SiteConfig>): void => {
  try {
    const currentConfig = loadConfig();
    const newConfig = { ...currentConfig, ...config };
    localStorage.setItem('startiers_config', JSON.stringify(newConfig));
  } catch (error) {
    console.error('Failed to save config to localStorage:', error);
  }
};

// Get current configuration
export const getConfig = (): SiteConfig => {
  return loadConfig();
};