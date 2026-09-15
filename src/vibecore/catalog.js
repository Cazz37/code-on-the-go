export const VIBECORE_SCHEMA_VERSION = '0.2.0';

export const componentCatalog = [
  {
    id: 'header',
    label: 'Header',
    description: 'Brand, page title, and primary action.',
    keywords: ['header', 'brand', 'logo', 'top bar']
  },
  {
    id: 'hero',
    label: 'Hero',
    description: 'Opening message and clear call to action.',
    keywords: ['hero', 'headline', 'intro', 'call to action']
  },
  {
    id: 'stats',
    label: 'Stats',
    description: 'Compact metrics for dashboards and summaries.',
    keywords: ['stats', 'metrics', 'numbers', 'analytics', 'summary']
  },
  {
    id: 'search',
    label: 'Search',
    description: 'Accessible search and filter control.',
    keywords: ['search', 'filter', 'find']
  },
  {
    id: 'cards',
    label: 'Cards',
    description: 'Responsive cards for products, projects, or content.',
    keywords: ['cards', 'products', 'projects', 'services', 'items', 'list']
  },
  {
    id: 'form',
    label: 'Form',
    description: 'Labelled inputs and a validated submit action.',
    keywords: ['form', 'contact', 'signup', 'register', 'booking', 'appointment']
  },
  {
    id: 'table',
    label: 'Table',
    description: 'Structured records with a mobile-safe overflow area.',
    keywords: ['table', 'records', 'orders', 'transactions', 'users', 'inventory']
  },
  {
    id: 'navigation',
    label: 'Navigation',
    description: 'Phone-first navigation with large touch targets.',
    keywords: ['navigation', 'menu', 'tabs', 'bottom bar', 'sidebar']
  },
  {
    id: 'media',
    label: 'Images & media',
    description: 'Reference imagery, illustrations, and visual backdrops.',
    keywords: ['image', 'photo', 'picture', 'background', 'illustration', 'media']
  },
  {
    id: 'status',
    label: 'Status indicators',
    description: 'Online states, badges, alerts, and operational summaries.',
    keywords: ['status', 'online', 'offline', 'badge', 'alert', 'operational']
  },
  {
    id: 'footer',
    label: 'Footer',
    description: 'Product details, version information, and secondary links.',
    keywords: ['footer', 'version', 'copyright', 'credits']
  }
];

export const appRecipes = [
  {
    id: 'landing',
    label: 'Landing page',
    keywords: ['landing', 'homepage', 'website', 'marketing', 'launch'],
    components: ['header', 'hero', 'cards', 'form', 'navigation'],
    action: 'Get started'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    keywords: ['dashboard', 'analytics', 'admin', 'metrics', 'reporting'],
    components: ['header', 'stats', 'search', 'cards', 'table', 'navigation'],
    action: 'Add record'
  },
  {
    id: 'storefront',
    label: 'Storefront',
    keywords: ['shop', 'store', 'storefront', 'product', 'ecommerce', 'cart'],
    components: ['header', 'hero', 'search', 'cards', 'navigation'],
    action: 'View cart'
  },
  {
    id: 'booking',
    label: 'Booking app',
    keywords: ['booking', 'appointment', 'reservation', 'calendar', 'schedule'],
    components: ['header', 'hero', 'cards', 'form', 'navigation'],
    action: 'Book now'
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    keywords: ['portfolio', 'profile', 'showcase', 'resume', 'gallery'],
    components: ['header', 'hero', 'cards', 'form', 'navigation'],
    action: 'View work'
  },
  {
    id: 'auth',
    label: 'Secure sign-in',
    keywords: ['login', 'log in', 'sign in', 'authentication', 'password', 'pin', 'secure access', 'crew'],
    components: ['header', 'media', 'form', 'stats', 'status', 'footer'],
    action: 'Sign in'
  }
];

export const targetOptions = [
  { id: 'auto', label: 'Auto choose', description: 'VibeCore applies the stack-selection rules.' },
  { id: 'react', label: 'React PWA', description: 'Component-based JavaScript with Vite.' },
  { id: 'static', label: 'HTML website', description: 'Portable HTML, CSS, and JavaScript.' }
];

export const stylePresets = [
  {
    id: 'soft',
    label: 'Soft glass',
    palette: ['#7c3aed', '#3b82f6', '#f8f5ff', '#211538']
  },
  {
    id: 'minimal',
    label: 'Clean minimal',
    palette: ['#111827', '#4f46e5', '#f8fafc', '#0f172a']
  },
  {
    id: 'bold',
    label: 'Bold colour',
    palette: ['#e11d48', '#f97316', '#fff7ed', '#431407']
  },
  {
    id: 'natural',
    label: 'Calm natural',
    palette: ['#047857', '#0d9488', '#f0fdf4', '#052e16']
  }
];

export const navigationOptions = [
  { id: 'bottom', label: 'Bottom tabs' },
  { id: 'top', label: 'Top links' },
  { id: 'none', label: 'Single page' }
];

export const referenceModes = [
  {
    id: 'exact',
    label: 'Exact pixels',
    description: 'Preserve the complete image and align interactions over it.'
  },
  {
    id: 'inspired',
    label: 'Editable layout',
    description: 'Use its colours while generating reusable components.'
  }
];

export function getRecipe(recipeId) {
  return appRecipes.find((recipe) => recipe.id === recipeId) ?? appRecipes[0];
}

export function getStylePreset(styleId) {
  return stylePresets.find((style) => style.id === styleId) ?? stylePresets[0];
}
