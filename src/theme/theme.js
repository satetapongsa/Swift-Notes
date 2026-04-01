export const LightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  white: '#FFFFFF',
  black: '#000000',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  border: '#F2F2F7',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  pill: '#E9E9EB',
  pillActive: '#007AFF',
  badge: '#E5E5EA',
  badgeText: '#8E8E93',
  placeholder: '#C7C7CC',
  lightGray: '#F2F2F7',
};

export const DarkColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  white: '#FFFFFF',
  black: '#000000',
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  success: '#32D74B',
  warning: '#FF9F0A',
  danger: '#FF453A',
  pill: '#38383A',
  pillActive: '#0A84FF',
  badge: '#38383A',
  badgeText: '#8E8E93',
  placeholder: '#8E8E93',
  lightGray: '#2C2C2E',
};

// Default export alias to maintain compatibility during migration
export const Colors = LightColors;

export const Typography = {
  h1: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
};
