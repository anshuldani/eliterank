// Constants barrel export
export * from './hobbies';
export * from './mockData';

// Navigation tabs
export const ADMIN_TABS = [
  { id: 'overview', label: 'Overview', icon: 'BarChart3' },
  { id: 'nominations', label: 'Nominations', icon: 'UserPlus' },
  { id: 'community', label: 'Community', icon: 'FileText' },
  { id: 'settings', label: 'Settings', icon: 'Settings' },
  { id: 'profile', label: 'Profile', icon: 'User' },
];

export const PUBLIC_SITE_TABS = [
  { id: 'contestants', label: 'Contestants', icon: 'Users' },
  { id: 'events', label: 'Events', icon: 'Calendar' },
  { id: 'announcements', label: 'Announcements', icon: 'Sparkles' },
  { id: 'about', label: 'About', icon: 'Award' },
];

// Status configurations
export const STATUS_CONFIG = {
  pending: { label: 'Pending Review', variant: 'warning' },
  'pending-approval': { label: 'Needs Approval', variant: 'warning' },
  'awaiting-profile': { label: 'Awaiting Profile', variant: 'purple' },
  'profile-complete': { label: 'Ready to Convert', variant: 'info' },
  approved: { label: 'Contestant', variant: 'success' },
  active: { label: 'Active', variant: 'success' },
  completed: { label: 'Completed', variant: 'success' },
  upcoming: { label: 'Upcoming', variant: 'purple' },
};

// Sponsor tiers
export const SPONSOR_TIERS = ['Platinum', 'Gold', 'Silver'];

// Announcement types
export const ANNOUNCEMENT_TYPES = [
  { value: 'announcement', label: 'Announcement', color: 'gold' },
  { value: 'update', label: 'Update', color: 'success' },
  { value: 'news', label: 'News', color: 'info' },
];

// Vote pricing
export const VOTE_PRICE = 1; // $1 per vote
export const VOTE_PRESETS = [1, 10, 25, 50, 100];

// Host payout percentage
export const HOST_PAYOUT_PERCENTAGE = 0.20; // 20%
