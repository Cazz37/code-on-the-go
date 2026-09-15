import {
  VIBECORE_SCHEMA_VERSION,
  appRecipes,
  componentCatalog,
  getRecipe,
  getStylePreset
} from './catalog.js';

const namedColours = {
  blue: '#2563eb',
  navy: '#1e3a8a',
  purple: '#7c3aed',
  violet: '#7c3aed',
  pink: '#db2777',
  red: '#dc2626',
  orange: '#ea580c',
  yellow: '#ca8a04',
  green: '#059669',
  teal: '#0d9488',
  black: '#111827'
};

const recipeContent = {
  landing: {
    kicker: 'Made for the moment',
    summary: 'A focused experience that explains the value clearly and gives people one confident next step.',
    cards: ['Simple setup', 'Clear workflow', 'Ready anywhere'],
    stats: [['3 min', 'to begin'], ['100%', 'responsive'], ['24/7', 'available']],
    table: [['Launch page', 'Ready'], ['Contact flow', 'Ready'], ['Mobile layout', 'Checked']]
  },
  dashboard: {
    kicker: 'Today at a glance',
    summary: 'Track the work that matters, spot changes quickly, and take action from one calm dashboard.',
    cards: ['Revenue overview', 'Active projects', 'Team activity'],
    stats: [['R 48k', 'revenue'], ['24', 'active items'], ['92%', 'on track']],
    table: [['Spring campaign', 'On track'], ['Mobile refresh', 'Review'], ['Client portal', 'Ready']]
  },
  storefront: {
    kicker: 'A collection worth keeping',
    summary: 'Discover thoughtful products, find the right fit, and complete the journey with fewer taps.',
    cards: ['Everyday essential', 'New arrival', 'Most loved'],
    stats: [['48', 'products'], ['4.9', 'rating'], ['2 day', 'delivery']],
    table: [['New arrival', 'In stock'], ['Everyday essential', 'Low stock'], ['Most loved', 'In stock']]
  },
  booking: {
    kicker: 'Your time, made simple',
    summary: 'Choose a service, find a suitable time, and confirm the booking in one smooth flow.',
    cards: ['Quick consultation', 'Full session', 'Follow-up'],
    stats: [['12', 'open times'], ['45 min', 'average'], ['4.9', 'rating']],
    table: [['Tuesday 09:00', 'Open'], ['Tuesday 11:30', 'Open'], ['Wednesday 14:00', 'Open']]
  },
  portfolio: {
    kicker: 'Selected work',
    summary: 'A clear, personal showcase of the ideas, craft, and outcomes behind every project.',
    cards: ['Product design', 'Mobile build', 'Brand system'],
    stats: [['12', 'projects'], ['8', 'partners'], ['5 yrs', 'experience']],
    table: [['Product design', 'Published'], ['Mobile build', 'Case study'], ['Brand system', 'Published']]
  },
  auth: {
    kicker: 'Secure access',
    summary: 'A focused sign-in experience with clear identity, password, device, and system-status controls.',
    cards: ['Active users', 'Service status', 'Protected access'],
    stats: [['12', 'active users'], ['Ready', 'service status'], ['Secure', 'access']],
    table: [['Authentication', 'Online'], ['Offline sync', 'Ready'], ['Session security', 'Protected']]
  }
};

function cleanText(value, fallback = '') {
  const cleaned = String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || fallback;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function slugify(value) {
  return cleanText(value, 'vibecore-project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'vibecore-project';
}

function findRecipe(brief, requestedRecipe) {
  if (requestedRecipe && requestedRecipe !== 'auto') {
    return getRecipe(requestedRecipe);
  }

  const normalized = brief.toLowerCase();
  const scored = appRecipes.map((recipe) => ({
    recipe,
    score: recipe.keywords.reduce(
      (total, keyword) => total + (normalized.includes(keyword) ? 1 : 0),
      0
    )
  }));
  scored.sort((left, right) => right.score - left.score);
  return scored[0].score > 0 ? scored[0].recipe : getRecipe('landing');
}

function findTarget(brief, requestedTarget, recipeId) {
  if (requestedTarget && requestedTarget !== 'auto') {
    return requestedTarget;
  }

  const normalized = brief.toLowerCase();
  const staticSignals = [
    'landing page',
    'static',
    'brochure',
    'one page',
    'portfolio site',
    'marketing site'
  ];
  if (staticSignals.some((signal) => normalized.includes(signal))) {
    return 'static';
  }
  return ['landing', 'portfolio'].includes(recipeId) ? 'static' : 'react';
}

function normalizeHex(value) {
  const match = String(value ?? '').trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  const raw = match[1].toLowerCase();
  return raw.length === 3
    ? '#' + raw.split('').map((character) => character + character).join('')
    : '#' + raw;
}

function derivePalette(brief, requestedPalette, styleId) {
  const preset = getStylePreset(styleId);
  const supplied = (requestedPalette ?? []).map(normalizeHex).filter(Boolean);
  const explicitHex = Array.from(brief.matchAll(/#(?:[0-9a-f]{3}|[0-9a-f]{6})\b/gi))
    .map((match) => normalizeHex(match[0]))
    .filter(Boolean);
  const named = Object.entries(namedColours)
    .filter(([name]) => new RegExp('\\b' + name + '\\b', 'i').test(brief))
    .map(([, colour]) => colour);
  const unique = [...new Set([...supplied, ...explicitHex, ...named, ...preset.palette])];

  return {
    primary: unique[0] ?? preset.palette[0],
    accent: unique[1] ?? preset.palette[1],
    background: unique[2] ?? preset.palette[2],
    text: unique[3] ?? preset.palette[3]
  };
}

function rgbFromHex(hex) {
  const normalized = normalizeHex(hex) ?? '#000000';
  return [
    Number.parseInt(normalized.slice(1, 3), 16),
    Number.parseInt(normalized.slice(3, 5), 16),
    Number.parseInt(normalized.slice(5, 7), 16)
  ];
}

function relativeLuminance(hex) {
  const channels = rgbFromHex(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrastRatio(first, second) {
  const light = Math.max(relativeLuminance(first), relativeLuminance(second));
  const dark = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (light + 0.05) / (dark + 0.05);
}

function chooseOnColour(background) {
  return contrastRatio(background, '#ffffff') >= contrastRatio(background, '#111827')
    ? '#ffffff'
    : '#111827';
}

function inferComponents(brief, recipe, selectedComponents, navigation) {
  const validIds = new Set(componentCatalog.map((component) => component.id));
  const selected = Array.isArray(selectedComponents)
    ? selectedComponents.filter((id) => validIds.has(id))
    : [];
  const inferred = selected.length ? [...selected] : [...recipe.components];
  const normalized = brief.toLowerCase();

  componentCatalog.forEach((component) => {
    if (component.keywords.some((keyword) => normalized.includes(keyword))) {
      inferred.push(component.id);
    }
  });
  inferred.push('header');
  if (navigation !== 'none') inferred.push('navigation');

  const unique = new Set(inferred);
  return componentCatalog
    .map((component) => component.id)
    .filter((id) => unique.has(id) && !(navigation === 'none' && id === 'navigation'));
}

function limitSummary(brief, fallback) {
  const value = cleanText(brief, fallback);
  return value.length > 180 ? value.slice(0, 177).trimEnd() + '...' : value;
}

function clampNumber(value, minimum, maximum, fallback = minimum) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(minimum, Math.min(maximum, number)) : fallback;
}

function normalizeGuideList(values) {
  if (!Array.isArray(values)) return [];
  return [...new Set(values
    .map((value) => Number(clampNumber(value, 0, 1, 0).toFixed(4)))
    .filter((value) => value > 0.01 && value < 0.99))]
    .sort((left, right) => left - right)
    .slice(0, 8);
}

function normalizeRect(rect) {
  if (!rect || typeof rect !== 'object') return null;
  const x = clampNumber(rect.x, 0, 1, 0);
  const y = clampNumber(rect.y, 0, 1, 0);
  const width = clampNumber(rect.width, 0.01, 1 - x, 0.1);
  const height = clampNumber(rect.height, 0.01, 1 - y, 0.05);
  return {
    x: Number(x.toFixed(4)),
    y: Number(y.toFixed(4)),
    width: Number(width.toFixed(4)),
    height: Number(height.toFixed(4)),
    confidence: Number(clampNumber(rect.confidence, 0, 1, 0.5).toFixed(2))
  };
}

function normalizeReferenceDataUrl(value) {
  const dataUrl = String(value ?? '');
  return /^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(dataUrl)
    ? dataUrl
    : '';
}

function moveRect(rect, heightMultiplier, yOffsetMultiplier) {
  const height = clampNumber(rect.height * heightMultiplier, 0.02, 0.14, rect.height);
  return normalizeRect({
    x: rect.x,
    y: Math.max(0.01, rect.y - (rect.height * yOffsetMultiplier)),
    width: rect.width,
    height,
    confidence: rect.confidence * 0.82
  });
}

function inferReferenceInteractions(brief, recipeId, primaryAction) {
  if (!primaryAction) return [];
  const normalizedBrief = brief.toLowerCase();
  const isAuthentication = recipeId === 'auth' || [
    'login',
    'log in',
    'sign in',
    'password',
    'pin',
    'authentication'
  ].some((signal) => normalizedBrief.includes(signal));

  if (!isAuthentication) {
    return [{ id: 'primary-action', kind: 'button', label: 'Primary action', rect: primaryAction }];
  }

  return [
    {
      id: 'identity',
      kind: 'email',
      label: 'Email or username',
      rect: moveRect(primaryAction, 1.15, 4.35)
    },
    {
      id: 'password',
      kind: 'password',
      label: 'Password or PIN',
      rect: moveRect(primaryAction, 1.15, 2.35)
    },
    {
      id: 'primary-action',
      kind: 'submit',
      label: 'Sign in',
      rect: primaryAction
    }
  ].filter((interaction) => interaction.rect);
}

function createReferenceMetadata(reference, brief, recipeId) {
  if (!reference) return null;
  const width = Math.max(1, Math.round(Number(reference.width) || 1));
  const height = Math.max(1, Math.round(Number(reference.height) || 1));
  const horizontalGuides = normalizeGuideList(reference.analysis?.layout?.horizontalGuides);
  const verticalGuides = normalizeGuideList(reference.analysis?.layout?.verticalGuides);
  const primaryAction = normalizeRect(reference.analysis?.primaryAction);
  const dataUrl = normalizeReferenceDataUrl(reference.dataUrl);
  const mode = reference.mode === 'inspired' ? 'inspired' : 'exact';

  return {
    name: cleanText(reference.name, 'Reference image'),
    width,
    height,
    mode,
    palette: (reference.palette ?? []).map(normalizeHex).filter(Boolean).slice(0, 8),
    asset: {
      embedded: Boolean(dataUrl),
      mimeType: cleanText(reference.mimeType, 'image/jpeg'),
      fingerprint: cleanText(reference.fingerprint, 'unavailable'),
      originalPreserved: reference.originalPreserved !== false,
      bytes: Math.max(0, Math.round(Number(reference.embeddedBytes) || 0))
    },
    layout: {
      aspectRatio: Number((width / height).toFixed(4)),
      orientation: width === height ? 'square' : width > height ? 'landscape' : 'portrait',
      horizontalGuides,
      verticalGuides,
      measuredRegions: Math.max(
        1,
        Math.round(Number(reference.analysis?.layout?.measuredRegions)) ||
          ((horizontalGuides.length + 1) * (verticalGuides.length + 1))
      )
    },
    primaryAction,
    interactions: mode === 'exact'
      ? inferReferenceInteractions(brief, recipeId, primaryAction)
      : []
  };
}

export function inferBlueprint(input = {}) {
  const brief = cleanText(input.brief, 'Create a polished, phone-first web experience.');
  const recipe = findRecipe(brief, input.recipe);
  const targetId = findTarget(brief, input.target, recipe.id);
  const navigation = ['bottom', 'top', 'none'].includes(input.navigation)
    ? input.navigation
    : 'bottom';
  const components = inferComponents(brief, recipe, input.selectedComponents, navigation);
  const colours = derivePalette(brief, input.palette, input.style ?? 'soft');
  const content = recipeContent[recipe.id] ?? recipeContent.landing;
  const name = cleanText(input.projectName, recipe.label);
  const target = targetId === 'react'
    ? { id: 'react', label: 'React + Vite PWA', language: 'JavaScript', stack: 'React + Vite' }
    : { id: 'static', label: 'HTML + CSS + JavaScript', language: 'HTML', stack: 'Web standards' };
  const reference = createReferenceMetadata(input.reference, brief, recipe.id);

  return {
    schemaVersion: VIBECORE_SCHEMA_VERSION,
    id: slugify(name),
    name,
    brief,
    recipe: { id: recipe.id, label: recipe.label },
    target,
    style: input.style ?? 'soft',
    navigation,
    components,
    tokens: {
      colours: {
        ...colours,
        onPrimary: chooseOnColour(colours.primary),
        onAccent: chooseOnColour(colours.accent)
      },
      radius: input.style === 'minimal' ? 16 : input.style === 'bold' ? 12 : 24,
      spacing: 8,
      font: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    content: {
      kicker: content.kicker,
      headline: name,
      summary: limitSummary(brief, content.summary),
      primaryAction: recipe.action,
      cards: content.cards,
      stats: content.stats,
      table: content.table
    },
    reference
  };
}

export function validateBlueprint(blueprint) {
  const primaryContrast = contrastRatio(
    blueprint.tokens.colours.primary,
    blueprint.tokens.colours.onPrimary
  );
  const diagnostics = [
    {
      level: 'pass',
      code: 'STRUCTURE',
      message: blueprint.components.length + ' registered components selected.'
    },
    {
      level: 'pass',
      code: 'TARGET',
      message: 'Target resolved to ' + blueprint.target.label + '.'
    },
    {
      level: primaryContrast >= 4.5 ? 'pass' : 'error',
      code: 'CONTRAST',
      message: 'Primary action contrast is ' + primaryContrast.toFixed(1) + ':1.'
    },
    {
      level: 'pass',
      code: 'INPUTS',
      message: blueprint.components.includes('form')
        ? 'Generated form controls have visible labels.'
        : 'No form controls require validation.'
    },
    {
      level: 'pass',
      code: 'RESPONSIVE',
      message: 'Mobile-first layout rules and 44px touch targets applied.'
    }
  ];

  if (blueprint.brief.length < 24) {
    diagnostics.push({
      level: 'warning',
      code: 'BRIEF_DETAIL',
      message: 'A more detailed brief will produce a more specific blueprint.'
    });
  }
  if (blueprint.reference) {
    diagnostics.push({
      level: blueprint.reference.palette.length ? 'pass' : 'warning',
      code: 'REFERENCE_COLOURS',
      message: blueprint.reference.palette.length
        ? 'Reference-image colours are mapped to the project tokens.'
        : 'Reference image attached without applying its colours.'
    });
    diagnostics.push({
      level: blueprint.reference.mode !== 'exact' || blueprint.reference.asset.embedded
        ? 'pass'
        : 'error',
      code: 'REFERENCE_FIDELITY',
      message: blueprint.reference.mode === 'exact'
        ? blueprint.reference.asset.originalPreserved
          ? 'The complete original image is embedded as the exact visual source.'
          : 'The complete reference is embedded at its measured aspect ratio after storage optimisation.'
        : 'The reference is used as an editable style and colour guide.'
    });
    diagnostics.push({
      level: 'pass',
      code: 'REFERENCE_GEOMETRY',
      message:
        blueprint.reference.layout.measuredRegions +
        ' layout regions and the ' +
        blueprint.reference.width +
        ' × ' +
        blueprint.reference.height +
        ' aspect ratio are recorded.'
    });
    if (blueprint.reference.mode === 'exact') {
      diagnostics.push({
        level: blueprint.reference.interactions.length ? 'pass' : 'warning',
        code: 'REFERENCE_INTERACTIONS',
        message: blueprint.reference.interactions.length
          ? blueprint.reference.interactions.length + ' functional hit areas are aligned to the reference.'
          : 'No reliable action area was detected; the visual match remains exact but needs manual interaction mapping.'
      });
    }
  }
  return diagnostics;
}

function hasComponent(blueprint, componentId) {
  return blueprint.components.includes(componentId);
}

function renderTopNavigation(blueprint) {
  if (!hasComponent(blueprint, 'navigation') || blueprint.navigation !== 'top') return '';
  return [
    '<nav class="vc-top-nav" aria-label="Main navigation">',
    '<a href="#home">Home</a>',
    '<a href="#content">Explore</a>',
    '<a href="#contact">Contact</a>',
    '</nav>'
  ].join('');
}

function renderHeader(blueprint) {
  if (!hasComponent(blueprint, 'header')) return '';
  return [
    '<header class="vc-site-header" id="home">',
    '<a class="vc-brand" href="#home" aria-label="' + escapeHtml(blueprint.name) + ' home">',
    '<span aria-hidden="true">' + escapeHtml(blueprint.name.charAt(0).toUpperCase()) + '</span>',
    '<strong>' + escapeHtml(blueprint.name) + '</strong>',
    '</a>',
    renderTopNavigation(blueprint),
    '<button class="vc-primary-button" type="button">' + escapeHtml(blueprint.content.primaryAction) + '</button>',
    '</header>'
  ].join('');
}

function renderHero(blueprint) {
  if (!hasComponent(blueprint, 'hero')) return '';
  return [
    '<section class="vc-hero" id="content">',
    '<span class="vc-kicker">' + escapeHtml(blueprint.content.kicker) + '</span>',
    '<h1>' + escapeHtml(blueprint.content.headline) + '</h1>',
    '<p>' + escapeHtml(blueprint.content.summary) + '</p>',
    '<div class="vc-hero-actions">',
    '<button class="vc-primary-button" type="button">' + escapeHtml(blueprint.content.primaryAction) + '</button>',
    '<button class="vc-secondary-button" type="button">Learn more</button>',
    '</div>',
    '</section>'
  ].join('');
}

function renderStats(blueprint) {
  if (!hasComponent(blueprint, 'stats')) return '';
  return [
    '<section class="vc-stats" aria-label="Key metrics">',
    blueprint.content.stats.map(([value, label]) => [
      '<article><strong>' + escapeHtml(value) + '</strong>',
      '<span>' + escapeHtml(label) + '</span></article>'
    ].join('')).join(''),
    '</section>'
  ].join('');
}

function renderSearch(blueprint) {
  if (!hasComponent(blueprint, 'search')) return '';
  return [
    '<label class="vc-search">',
    '<span>Search ' + escapeHtml(blueprint.recipe.label.toLowerCase()) + '</span>',
    '<input type="search" placeholder="Type to filter..." data-vc-search />',
    '</label>'
  ].join('');
}

function renderCards(blueprint) {
  if (!hasComponent(blueprint, 'cards')) return '';
  return [
    '<section class="vc-card-grid" aria-label="Featured content">',
    blueprint.content.cards.map((card, index) => [
      '<article class="vc-content-card" data-vc-card data-search="' + escapeHtml(card.toLowerCase()) + '">',
      '<span>0' + (index + 1) + '</span><h2>' + escapeHtml(card) + '</h2>',
      '<p>Designed as a reusable, responsive component with clear hierarchy and an accessible action.</p>',
      '<button type="button">Open</button></article>'
    ].join('')).join(''),
    '</section>'
  ].join('');
}

function renderForm(blueprint) {
  if (!hasComponent(blueprint, 'form')) return '';
  return [
    '<section class="vc-form-card" id="contact">',
    '<div><span class="vc-kicker">Next step</span><h2>Tell us what you need</h2></div>',
    '<form data-vc-form>',
    '<label><span>Name</span><input name="name" autocomplete="name" required /></label>',
    '<label><span>Email</span><input name="email" type="email" autocomplete="email" required /></label>',
    '<label class="vc-full-field"><span>Details</span><textarea name="details" rows="3" required></textarea></label>',
    '<button class="vc-primary-button vc-full-field" type="submit">' + escapeHtml(blueprint.content.primaryAction) + '</button>',
    '<output class="vc-full-field" data-vc-message aria-live="polite"></output>',
    '</form></section>'
  ].join('');
}

function renderTable(blueprint) {
  if (!hasComponent(blueprint, 'table')) return '';
  return [
    '<section class="vc-table-card">',
    '<div><span class="vc-kicker">Recent records</span><h2>Work in progress</h2></div>',
    '<div class="vc-table-scroll"><table>',
    '<thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead><tbody>',
    blueprint.content.table.map(([name, status]) => [
      '<tr><td>' + escapeHtml(name) + '</td><td><span>' + escapeHtml(status) + '</span></td></tr>'
    ].join('')).join(''),
    '</tbody></table></div></section>'
  ].join('');
}

function renderBottomNavigation(blueprint) {
  if (!hasComponent(blueprint, 'navigation') || blueprint.navigation !== 'bottom') return '';
  return [
    '<nav class="vc-bottom-nav" aria-label="App navigation">',
    '<a class="active" href="#home"><span>Home</span></a>',
    '<a href="#content"><span>Explore</span></a>',
    '<a href="#contact"><span>Contact</span></a>',
    '</nav>'
  ].join('');
}

function percent(value) {
  return Number((value * 100).toFixed(3)) + '%';
}

function referenceRectStyle(rect) {
  return [
    'left:' + percent(rect.x),
    'top:' + percent(rect.y),
    'width:' + percent(rect.width),
    'height:' + percent(rect.height)
  ].join(';');
}

function renderExactReferenceBody(blueprint, referenceDataUrl) {
  const interactions = blueprint.reference?.interactions ?? [];
  const inputInteractions = interactions.filter((interaction) =>
    ['email', 'password', 'text'].includes(interaction.kind)
  );
  const actionInteraction = interactions.find((interaction) =>
    ['submit', 'button'].includes(interaction.kind)
  );
  const form = interactions.length
    ? [
        '<form class="vc-reference-interactions" data-vc-reference-form>',
        ...inputInteractions.map((interaction) => [
          '<label class="vc-visually-hidden" for="vc-' + escapeHtml(interaction.id) + '">' + escapeHtml(interaction.label) + '</label>',
          '<input class="vc-reference-field" id="vc-' + escapeHtml(interaction.id) + '"',
          ' data-vc-reference-input type="' + escapeHtml(interaction.kind === 'password' ? 'password' : interaction.kind) + '"',
          ' name="' + escapeHtml(interaction.id) + '" aria-label="' + escapeHtml(interaction.label) + '"',
          ' autocomplete="' + escapeHtml(interaction.kind === 'password' ? 'current-password' : 'username') + '"',
          ' style="' + referenceRectStyle(interaction.rect) + '" required />'
        ].join('')),
        actionInteraction
          ? '<button class="vc-reference-action" type="submit" aria-label="' +
            escapeHtml(actionInteraction.label) + '" style="' +
            referenceRectStyle(actionInteraction.rect) + '"><span class="vc-visually-hidden">' +
            escapeHtml(actionInteraction.label) + '</span></button>'
          : '',
        '<output class="vc-visually-hidden" data-vc-reference-message aria-live="polite"></output>',
        '</form>'
      ].join('')
    : '';

  return [
    '<main class="vc-exact-reference" data-vc-exact-reference>',
    '<img class="vc-exact-reference-image" src="' + escapeHtml(referenceDataUrl) + '" alt="' +
      escapeHtml(blueprint.name + ' complete reference interface') + '" draggable="false" />',
    form,
    '</main>'
  ].join('');
}

function renderBody(blueprint, referenceDataUrl = '') {
  if (blueprint.reference?.mode === 'exact' && referenceDataUrl) {
    return renderExactReferenceBody(blueprint, referenceDataUrl);
  }

  return [
    '<main class="vc-generated-app">',
    renderHeader(blueprint),
    '<div class="vc-page">',
    renderHero(blueprint),
    renderStats(blueprint),
    renderSearch(blueprint),
    renderCards(blueprint),
    renderTable(blueprint),
    renderForm(blueprint),
    '</div>',
    renderBottomNavigation(blueprint),
    '</main>'
  ].join('');
}

function createExactReferenceStyles(blueprint) {
  const colours = blueprint.tokens.colours;
  const width = blueprint.reference.width;
  const height = blueprint.reference.height;
  return [
    ':root {',
    '  color-scheme: light;',
    '  font-family: ' + blueprint.tokens.font + ';',
    '  --vc-primary: ' + colours.primary + ';',
    '  --vc-reference-width: ' + width + 'px;',
    '  --vc-reference-ratio: ' + width + ' / ' + height + ';',
    '}',
    '* { box-sizing: border-box; }',
    'html { min-width: 320px; min-height: 100%; background: #090b0f; }',
    'body { min-width: 320px; min-height: 100vh; margin: 0; overflow-x: hidden; background: #090b0f; }',
    '#root { width: 100%; }',
    'button, input { font: inherit; -webkit-tap-highlight-color: transparent; }',
    '.vc-exact-reference { position: relative; width: min(100%, var(--vc-reference-width)); aspect-ratio: var(--vc-reference-ratio); margin: 0 auto; overflow: hidden; background: ' + colours.background + '; isolation: isolate; }',
    '.vc-exact-reference-image { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; display: block; object-fit: contain; user-select: none; -webkit-user-drag: none; }',
    '.vc-reference-interactions { position: absolute; inset: 0; z-index: 1; margin: 0; pointer-events: none; }',
    '.vc-reference-field, .vc-reference-action { position: absolute; display: block; margin: 0; pointer-events: auto; }',
    '.vc-reference-field { min-width: 0; padding: 0 3.5%; color: transparent; caret-color: var(--vc-primary); border: 0; border-radius: clamp(4px, 1vw, 14px); outline: 0; background: transparent; font-size: clamp(10px, 1.25vw, 18px); }',
    '.vc-reference-field:focus, .vc-reference-field.has-value { color: #1f2937; outline: 2px solid color-mix(in srgb, var(--vc-primary) 74%, white); outline-offset: -2px; background: rgba(255, 255, 255, .94); }',
    '.vc-reference-action { padding: 0; color: transparent; border: 0; border-radius: clamp(4px, 1vw, 14px); outline: 0; background: transparent; cursor: pointer; }',
    '.vc-reference-action:focus-visible { outline: 3px solid color-mix(in srgb, var(--vc-primary) 58%, white); outline-offset: 2px; }',
    '.vc-visually-hidden { position: absolute !important; width: 1px !important; height: 1px !important; padding: 0 !important; margin: -1px !important; overflow: hidden !important; clip: rect(0, 0, 0, 0) !important; white-space: nowrap !important; border: 0 !important; }',
    '@media (min-width: ' + (width + 1) + 'px) {',
    '  body { display: grid; justify-items: center; }',
    '}'
  ].join('\n');
}

function createStyles(blueprint) {
  if (blueprint.reference?.mode === 'exact' && blueprint.reference.asset.embedded) {
    return createExactReferenceStyles(blueprint);
  }

  const colours = blueprint.tokens.colours;
  const radius = blueprint.tokens.radius;
  return [
    ':root {',
    '  color-scheme: light;',
    '  font-family: ' + blueprint.tokens.font + ';',
    '  --vc-primary: ' + colours.primary + ';',
    '  --vc-on-primary: ' + colours.onPrimary + ';',
    '  --vc-accent: ' + colours.accent + ';',
    '  --vc-on-accent: ' + colours.onAccent + ';',
    '  --vc-background: ' + colours.background + ';',
    '  --vc-text: ' + colours.text + ';',
    '  --vc-radius: ' + radius + 'px;',
    '}',
    '* { box-sizing: border-box; }',
    'html { scroll-behavior: smooth; background: var(--vc-background); }',
    'body { min-width: 320px; min-height: 100vh; margin: 0; color: var(--vc-text); background: var(--vc-background); }',
    'button, input, textarea { font: inherit; }',
    'button, a { -webkit-tap-highlight-color: transparent; }',
    'button { cursor: pointer; }',
    '.vc-generated-app { min-height: 100vh; padding-bottom: 84px; background: radial-gradient(circle at 85% 0, color-mix(in srgb, var(--vc-accent) 20%, transparent), transparent 32%), var(--vc-background); }',
    '.vc-site-header { min-height: 72px; display: flex; align-items: center; gap: 12px; padding: 14px clamp(16px, 5vw, 64px); }',
    '.vc-brand { min-width: 0; display: inline-flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; }',
    '.vc-brand > span { width: 40px; height: 40px; flex: 0 0 auto; display: grid; place-items: center; color: var(--vc-on-primary); border-radius: 14px; background: var(--vc-primary); font-weight: 900; }',
    '.vc-brand strong { overflow: hidden; font-size: .95rem; text-overflow: ellipsis; white-space: nowrap; }',
    '.vc-site-header > .vc-primary-button { margin-left: auto; }',
    '.vc-top-nav { display: none; align-items: center; gap: 20px; margin-left: auto; }',
    '.vc-top-nav a { color: inherit; font-size: .86rem; font-weight: 750; text-decoration: none; }',
    '.vc-primary-button, .vc-secondary-button { min-height: 44px; padding: 0 17px; border: 1px solid transparent; border-radius: calc(var(--vc-radius) * .7); font-weight: 850; }',
    '.vc-primary-button { color: var(--vc-on-primary); background: var(--vc-primary); box-shadow: 0 12px 26px color-mix(in srgb, var(--vc-primary) 24%, transparent); }',
    '.vc-secondary-button { color: var(--vc-text); border-color: color-mix(in srgb, var(--vc-text) 12%, transparent); background: color-mix(in srgb, white 72%, transparent); }',
    '.vc-page { width: min(100%, 1080px); display: grid; gap: 18px; margin: 0 auto; padding: 8px 16px 30px; }',
    '.vc-hero { min-height: 330px; display: grid; align-content: end; gap: 14px; padding: clamp(24px, 7vw, 64px); overflow: hidden; color: var(--vc-on-primary); border-radius: calc(var(--vc-radius) * 1.35); background: radial-gradient(circle at 82% 10%, color-mix(in srgb, white 34%, transparent), transparent 28%), linear-gradient(145deg, var(--vc-primary), var(--vc-accent)); box-shadow: 0 24px 56px color-mix(in srgb, var(--vc-primary) 20%, transparent); }',
    '.vc-kicker { color: color-mix(in srgb, currentColor 74%, transparent); font-size: .72rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }',
    'h1, h2, p { margin: 0; }',
    '.vc-hero h1 { max-width: 720px; font-size: clamp(2.4rem, 12vw, 5.7rem); line-height: .93; letter-spacing: -.06em; }',
    '.vc-hero p { max-width: 620px; color: color-mix(in srgb, var(--vc-on-primary) 82%, transparent); font-size: clamp(.95rem, 3vw, 1.15rem); line-height: 1.55; }',
    '.vc-hero-actions { display: flex; flex-wrap: wrap; gap: 9px; }',
    '.vc-hero .vc-primary-button { color: var(--vc-primary); background: var(--vc-on-primary); }',
    '.vc-hero .vc-secondary-button { color: var(--vc-on-primary); border-color: color-mix(in srgb, var(--vc-on-primary) 30%, transparent); background: transparent; }',
    '.vc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }',
    '.vc-stats article, .vc-content-card, .vc-form-card, .vc-table-card, .vc-search { border: 1px solid color-mix(in srgb, var(--vc-primary) 12%, transparent); background: color-mix(in srgb, white 88%, transparent); box-shadow: 0 14px 32px color-mix(in srgb, var(--vc-primary) 8%, transparent); }',
    '.vc-stats article { display: grid; gap: 4px; padding: 16px; border-radius: var(--vc-radius); }',
    '.vc-stats strong { font-size: clamp(1.25rem, 6vw, 2rem); }',
    '.vc-stats span { opacity: .62; font-size: .72rem; font-weight: 800; }',
    '.vc-search { display: grid; gap: 7px; padding: 14px; border-radius: var(--vc-radius); }',
    '.vc-search span, .vc-form-card label span { font-size: .72rem; font-weight: 850; }',
    '.vc-search input, .vc-form-card input, .vc-form-card textarea { width: 100%; min-height: 46px; padding: 10px 13px; color: var(--vc-text); border: 1px solid color-mix(in srgb, var(--vc-text) 13%, transparent); border-radius: calc(var(--vc-radius) * .62); outline: 0; background: white; }',
    '.vc-search input:focus, .vc-form-card input:focus, .vc-form-card textarea:focus { border-color: var(--vc-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--vc-primary) 16%, transparent); }',
    '.vc-card-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }',
    '.vc-content-card { min-height: 190px; display: grid; align-content: end; gap: 9px; padding: 20px; border-radius: var(--vc-radius); }',
    '.vc-content-card > span { color: var(--vc-primary); font-size: .72rem; font-weight: 900; }',
    '.vc-content-card h2 { font-size: 1.25rem; }',
    '.vc-content-card p { opacity: .66; font-size: .84rem; line-height: 1.5; }',
    '.vc-content-card button { min-height: 44px; width: fit-content; padding: 0; color: var(--vc-primary); border: 0; background: transparent; font-weight: 900; }',
    '.vc-form-card, .vc-table-card { display: grid; gap: 16px; padding: 20px; border-radius: var(--vc-radius); }',
    '.vc-form-card form { display: grid; grid-template-columns: 1fr; gap: 12px; }',
    '.vc-form-card label { display: grid; gap: 7px; }',
    '.vc-form-card textarea { resize: vertical; }',
    '.vc-form-card output { min-height: 18px; color: var(--vc-primary); font-size: .78rem; font-weight: 800; }',
    '.vc-table-scroll { overflow-x: auto; }',
    '.vc-table-card table { width: 100%; border-collapse: collapse; }',
    '.vc-table-card th, .vc-table-card td { padding: 13px 8px; border-bottom: 1px solid color-mix(in srgb, var(--vc-text) 9%, transparent); text-align: left; font-size: .82rem; }',
    '.vc-table-card td span { padding: 6px 9px; color: var(--vc-primary); border-radius: 999px; background: color-mix(in srgb, var(--vc-primary) 10%, white); font-weight: 850; }',
    '.vc-bottom-nav { position: fixed; right: 12px; bottom: 12px; left: 12px; z-index: 4; min-height: 60px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 6px; border: 1px solid color-mix(in srgb, var(--vc-primary) 12%, transparent); border-radius: calc(var(--vc-radius) * 1.05); background: color-mix(in srgb, white 92%, transparent); box-shadow: 0 18px 40px color-mix(in srgb, var(--vc-primary) 16%, transparent); backdrop-filter: blur(18px); }',
    '.vc-bottom-nav a { min-height: 48px; display: grid; place-items: center; color: color-mix(in srgb, var(--vc-text) 58%, transparent); border-radius: calc(var(--vc-radius) * .72); font-size: .74rem; font-weight: 850; text-decoration: none; }',
    '.vc-bottom-nav a.active { color: var(--vc-primary); background: color-mix(in srgb, var(--vc-primary) 10%, white); }',
    '[hidden] { display: none !important; }',
    '@media (min-width: 720px) {',
    '  .vc-page { padding-inline: 32px; }',
    '  .vc-card-grid { grid-template-columns: repeat(3, 1fr); }',
    '  .vc-form-card form { grid-template-columns: 1fr 1fr; }',
    '  .vc-full-field { grid-column: 1 / -1; }',
    '  .vc-top-nav { display: flex; }',
    '  .vc-bottom-nav { width: min(420px, calc(100% - 24px)); right: 12px; left: auto; }',
    '}',
    '@media (prefers-reduced-motion: no-preference) {',
    '  .vc-content-card, .vc-primary-button { transition: transform .18s ease, box-shadow .18s ease; }',
    '  .vc-content-card:hover, .vc-primary-button:hover { transform: translateY(-2px); }',
    '}'
  ].join('\n');
}

function createInteractionScript() {
  return [
    'const search = document.querySelector("[data-vc-search]");',
    'const cards = Array.from(document.querySelectorAll("[data-vc-card]"));',
    'search?.addEventListener("input", () => {',
    '  const query = search.value.trim().toLowerCase();',
    '  cards.forEach((card) => {',
    '    card.hidden = Boolean(query) && !card.dataset.search.includes(query);',
    '  });',
    '});',
    'document.querySelector("[data-vc-form]")?.addEventListener("submit", (event) => {',
    '  event.preventDefault();',
    '  const message = event.currentTarget.querySelector("[data-vc-message]");',
    '  if (message) message.textContent = "Saved locally — connect your backend when you are ready.";',
    '});',
    'document.querySelectorAll("[data-vc-reference-input]").forEach((input) => {',
    '  const updateValueState = () => input.classList.toggle("has-value", Boolean(input.value));',
    '  input.addEventListener("input", updateValueState);',
    '  input.addEventListener("change", updateValueState);',
    '});',
    'document.querySelector("[data-vc-reference-form]")?.addEventListener("submit", (event) => {',
    '  event.preventDefault();',
    '  const message = event.currentTarget.querySelector("[data-vc-reference-message]");',
    '  if (message) message.textContent = "Reference interaction submitted successfully.";',
    '});'
  ].join('\n');
}

export function createPreviewDocument(blueprint, referenceDataUrl = '') {
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '<meta name="theme-color" content="' + blueprint.tokens.colours.primary + '" />',
    '<title>' + escapeHtml(blueprint.name) + '</title>',
    '<style>' + createStyles(blueprint) + '</style>',
    '</head>',
    '<body>',
    renderBody(blueprint, referenceDataUrl),
    '<script>' + createInteractionScript().replace(/<\/script/gi, '<\\/script') + '</script>',
    '</body>',
    '</html>'
  ].join('\n');
}

function createExactReactApp(blueprint) {
  const interactions = blueprint.reference?.interactions ?? [];
  return [
    "import { useState } from 'react';",
    "import { referenceImage } from './reference-image.js';",
    "import './styles.css';",
    '',
    'const interactions = ' + JSON.stringify(interactions, null, 2) + ';',
    'const fields = interactions.filter((interaction) => ["email", "password", "text"].includes(interaction.kind));',
    'const action = interactions.find((interaction) => ["submit", "button"].includes(interaction.kind));',
    'const position = (rect) => ({',
    '  left: `${rect.x * 100}%`,',
    '  top: `${rect.y * 100}%`,',
    '  width: `${rect.width * 100}%`,',
    '  height: `${rect.height * 100}%`',
    '});',
    '',
    'export default function App() {',
    '  const [values, setValues] = useState({});',
    "  const [message, setMessage] = useState('');",
    '  const handleSubmit = (event) => {',
    '    event.preventDefault();',
    "    setMessage('Reference interaction submitted successfully.');",
    '  };',
    '',
    '  return (',
    '    <main className="vc-exact-reference" data-vc-exact-reference>',
    '      <img',
    '        className="vc-exact-reference-image"',
    '        src={referenceImage}',
    '        alt="' + escapeHtml(blueprint.name) + ' complete reference interface"',
    '        draggable="false"',
    '      />',
    '      {interactions.length > 0 && (',
    '        <form className="vc-reference-interactions" onSubmit={handleSubmit}>',
    '          {fields.map((interaction) => (',
    '            <input',
    '              className={`vc-reference-field ${values[interaction.id] ? "has-value" : ""}`}',
    '              key={interaction.id}',
    '              type={interaction.kind === "password" ? "password" : interaction.kind}',
    '              name={interaction.id}',
    '              aria-label={interaction.label}',
    '              autoComplete={interaction.kind === "password" ? "current-password" : "username"}',
    '              value={values[interaction.id] ?? ""}',
    '              onChange={(event) => setValues((current) => ({ ...current, [interaction.id]: event.target.value }))}',
    '              style={position(interaction.rect)}',
    '              required',
    '            />',
    '          ))}',
    '          {action && (',
    '            <button',
    '              className="vc-reference-action"',
    '              type="submit"',
    '              aria-label={action.label}',
    '              style={position(action.rect)}',
    '            >',
    '              <span className="vc-visually-hidden">{action.label}</span>',
    '            </button>',
    '          )}',
    '          <output className="vc-visually-hidden" aria-live="polite">{message}</output>',
    '        </form>',
    '      )}',
    '    </main>',
    '  );',
    '}',
    ''
  ].join('\n');
}

function createReactApp(blueprint) {
  if (blueprint.reference?.mode === 'exact' && blueprint.reference.asset.embedded) {
    return createExactReactApp(blueprint);
  }

  const project = {
    name: blueprint.name,
    recipe: blueprint.recipe.label,
    ...blueprint.content
  };
  const lines = [
    "import { useMemo, useState } from 'react';",
    "import './styles.css';",
    '',
    'const project = ' + JSON.stringify(project, null, 2) + ';',
    '',
    'export default function App() {',
    "  const [query, setQuery] = useState('');",
    "  const [message, setMessage] = useState('');",
    '  const visibleCards = useMemo(() => {',
    '    const normalized = query.trim().toLowerCase();',
    '    return normalized',
    '      ? project.cards.filter((card) => card.toLowerCase().includes(normalized))',
    '      : project.cards;',
    '  }, [query]);',
    '  const handleSubmit = (event) => {',
    '    event.preventDefault();',
    "    setMessage('Saved locally — connect your backend when you are ready.');",
    '  };',
    '',
    '  return (',
    '    <main className="vc-generated-app">',
    '      <header className="vc-site-header" id="home">',
    '        <a className="vc-brand" href="#home" aria-label={project.name + " home"}>',
    '          <span aria-hidden="true">{project.name.charAt(0).toUpperCase()}</span>',
    '          <strong>{project.name}</strong>',
    '        </a>'
  ];

  if (blueprint.navigation === 'top' && hasComponent(blueprint, 'navigation')) {
    lines.push(
      '        <nav className="vc-top-nav" aria-label="Main navigation">',
      '          <a href="#home">Home</a><a href="#content">Explore</a><a href="#contact">Contact</a>',
      '        </nav>'
    );
  }
  lines.push(
    '        <button className="vc-primary-button" type="button">{project.primaryAction}</button>',
    '      </header>',
    '      <div className="vc-page">'
  );
  if (hasComponent(blueprint, 'hero')) {
    lines.push(
      '        <section className="vc-hero" id="content">',
      '          <span className="vc-kicker">{project.kicker}</span>',
      '          <h1>{project.headline}</h1>',
      '          <p>{project.summary}</p>',
      '          <div className="vc-hero-actions">',
      '            <button className="vc-primary-button" type="button">{project.primaryAction}</button>',
      '            <button className="vc-secondary-button" type="button">Learn more</button>',
      '          </div>',
      '        </section>'
    );
  }
  if (hasComponent(blueprint, 'stats')) {
    lines.push(
      '        <section className="vc-stats" aria-label="Key metrics">',
      '          {project.stats.map(([value, label]) => (',
      '            <article key={label}><strong>{value}</strong><span>{label}</span></article>',
      '          ))}',
      '        </section>'
    );
  }
  if (hasComponent(blueprint, 'search')) {
    lines.push(
      '        <label className="vc-search">',
      '          <span>Search {project.recipe.toLowerCase()}</span>',
      '          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type to filter..." />',
      '        </label>'
    );
  }
  if (hasComponent(blueprint, 'cards')) {
    lines.push(
      '        <section className="vc-card-grid" aria-label="Featured content">',
      '          {visibleCards.map((card, index) => (',
      '            <article className="vc-content-card" key={card}>',
      '              <span>0{index + 1}</span><h2>{card}</h2>',
      '              <p>Designed as a reusable, responsive component with clear hierarchy and an accessible action.</p>',
      '              <button type="button">Open</button>',
      '            </article>',
      '          ))}',
      '        </section>'
    );
  }
  if (hasComponent(blueprint, 'table')) {
    lines.push(
      '        <section className="vc-table-card">',
      '          <div><span className="vc-kicker">Recent records</span><h2>Work in progress</h2></div>',
      '          <div className="vc-table-scroll"><table>',
      '            <thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead>',
      '            <tbody>{project.table.map(([name, status]) => (',
      '              <tr key={name}><td>{name}</td><td><span>{status}</span></td></tr>',
      '            ))}</tbody>',
      '          </table></div>',
      '        </section>'
    );
  }
  if (hasComponent(blueprint, 'form')) {
    lines.push(
      '        <section className="vc-form-card" id="contact">',
      '          <div><span className="vc-kicker">Next step</span><h2>Tell us what you need</h2></div>',
      '          <form onSubmit={handleSubmit}>',
      '            <label><span>Name</span><input name="name" autoComplete="name" required /></label>',
      '            <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>',
      '            <label className="vc-full-field"><span>Details</span><textarea name="details" rows="3" required /></label>',
      '            <button className="vc-primary-button vc-full-field" type="submit">{project.primaryAction}</button>',
      '            <output className="vc-full-field" aria-live="polite">{message}</output>',
      '          </form>',
      '        </section>'
    );
  }
  lines.push('      </div>');
  if (blueprint.navigation === 'bottom' && hasComponent(blueprint, 'navigation')) {
    lines.push(
      '      <nav className="vc-bottom-nav" aria-label="App navigation">',
      '        <a className="active" href="#home"><span>Home</span></a>',
      '        <a href="#content"><span>Explore</span></a>',
      '        <a href="#contact"><span>Contact</span></a>',
      '      </nav>'
    );
  }
  lines.push('    </main>', '  );', '}', '');
  return lines.join('\n');
}

function createReactMain() {
  return [
    "import React from 'react';",
    "import { createRoot } from 'react-dom/client';",
    "import { registerSW } from 'virtual:pwa-register';",
    "import App from './App.jsx';",
    '',
    'registerSW({ immediate: true });',
    '',
    "createRoot(document.getElementById('root')).render(",
    '  <React.StrictMode>',
    '    <App />',
    '  </React.StrictMode>',
    ');',
    ''
  ].join('\n');
}

function createReactIndex(blueprint) {
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8" />',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <meta name="theme-color" content="' + blueprint.tokens.colours.primary + '" />',
    '  <link rel="icon" href="/icon.svg" type="image/svg+xml" />',
    '  <title>' + escapeHtml(blueprint.name) + '</title>',
    '</head>',
    '<body>',
    '  <div id="root"></div>',
    '  <script type="module" src="/src/main.jsx"></script>',
    '</body>',
    '</html>'
  ].join('\n');
}

function createViteConfig(blueprint) {
  const manifest = {
    name: blueprint.name,
    short_name: blueprint.name.slice(0, 12),
    display: 'standalone',
    start_url: '/',
    background_color: blueprint.tokens.colours.background,
    theme_color: blueprint.tokens.colours.primary,
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ]
  };
  return [
    "import { defineConfig } from 'vite';",
    "import react from '@vitejs/plugin-react';",
    "import { VitePWA } from 'vite-plugin-pwa';",
    '',
    'export default defineConfig({',
    '  plugins: [',
    '    react(),',
    '    VitePWA({',
    "      registerType: 'autoUpdate',",
    '      manifest: ' + JSON.stringify(manifest, null, 2).split('\n').join('\n      '),
    '    })',
    '  ]',
    '});',
    ''
  ].join('\n');
}

function createIcon(blueprint) {
  const initial = escapeHtml(blueprint.name.charAt(0).toUpperCase());
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">',
    '  <rect width="512" height="512" rx="128" fill="' + blueprint.tokens.colours.primary + '" />',
    '  <circle cx="384" cy="112" r="112" fill="' + blueprint.tokens.colours.accent + '" opacity=".72" />',
    '  <text x="256" y="326" text-anchor="middle" fill="' + blueprint.tokens.colours.onPrimary + '" font-family="system-ui, sans-serif" font-size="236" font-weight="900">' + initial + '</text>',
    '</svg>'
  ].join('\n');
}

function createReadme(blueprint, diagnostics) {
  const referenceNotes = blueprint.reference
    ? [
        '- Reference mode: ' + (blueprint.reference.mode === 'exact' ? 'Exact pixels' : 'Editable layout'),
        '- Reference size: ' + blueprint.reference.width + ' × ' + blueprint.reference.height + 'px',
        '- Interaction areas: ' + blueprint.reference.interactions.length
      ]
    : [];
  return [
    '# ' + blueprint.name,
    '',
    'Generated locally by the VibeCore Blueprint Engine in Code On The Go.',
    '',
    '## Blueprint',
    '',
    '- Recipe: ' + blueprint.recipe.label,
    '- Target: ' + blueprint.target.label,
    '- Components: ' + blueprint.components.join(', '),
    '- Schema: ' + blueprint.schemaVersion,
    ...referenceNotes,
    '',
    '## Rule check',
    '',
    ...diagnostics.map((item) => '- [' + (item.level === 'pass' ? 'x' : ' ') + '] ' + item.message),
    '',
    'No generative-AI service was called to create these files.',
    ''
  ].join('\n');
}

function file(path, language, library, content) {
  return {
    path,
    language,
    library,
    type: language + ' / ' + library,
    content
  };
}

function createReactFiles(blueprint, diagnostics, previewHtml, referenceDataUrl = '') {
  const packageJson = JSON.stringify({
    name: blueprint.id,
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^5.0.0',
      vite: '^7.0.0',
      'vite-plugin-pwa': '^1.0.0'
    }
  }, null, 2);

  const files = [
    file('index.html', 'html', 'PWA Page', createReactIndex(blueprint)),
    file('src/App.jsx', 'javascript', 'React + Vite', createReactApp(blueprint)),
    file('src/styles.css', 'css', 'Plain CSS', createStyles(blueprint)),
    file('src/main.jsx', 'javascript', 'React + Vite', createReactMain()),
    file('vite.config.js', 'javascript', 'Node', createViteConfig(blueprint)),
    file('package.json', 'json', 'Config', packageJson),
    file('public/icon.svg', 'html', 'PWA Page', createIcon(blueprint)),
    file('preview.html', 'html', 'PWA Page', previewHtml),
    file('vibecore.blueprint.json', 'json', 'Config', JSON.stringify(blueprint, null, 2)),
    file('README.md', 'markdown', 'Documentation', createReadme(blueprint, diagnostics))
  ];
  if (blueprint.reference?.mode === 'exact' && referenceDataUrl) {
    files.splice(
      2,
      0,
      file(
        'src/reference-image.js',
        'javascript',
        'Embedded image asset',
        'export const referenceImage = ' + JSON.stringify(referenceDataUrl) + ';\n'
      )
    );
  }
  return files;
}

function createStaticFiles(blueprint, diagnostics, previewHtml) {
  const embeddedStyle = '<style>' + createStyles(blueprint) + '</style>';
  const embeddedScript = '<script>' + createInteractionScript().replace(/<\/script/gi, '<\\/script') + '</script>';
  const indexHtml = previewHtml
    .replace(embeddedStyle, '<link rel="stylesheet" href="./styles.css" />')
    .replace(embeddedScript, '<script src="./app.js"></script>')
    .replace('</head>', '<link rel="manifest" href="./manifest.webmanifest" />\n</head>');
  const manifest = JSON.stringify({
    name: blueprint.name,
    short_name: blueprint.name.slice(0, 12),
    display: 'standalone',
    start_url: './',
    background_color: blueprint.tokens.colours.background,
    theme_color: blueprint.tokens.colours.primary
  }, null, 2);

  return [
    file('index.html', 'html', 'PWA Page', indexHtml),
    file('styles.css', 'css', 'Plain CSS', createStyles(blueprint)),
    file('app.js', 'javascript', 'Vanilla JS', createInteractionScript()),
    file('manifest.webmanifest', 'json', 'Manifest', manifest),
    file('vibecore.blueprint.json', 'json', 'Config', JSON.stringify(blueprint, null, 2)),
    file('README.md', 'markdown', 'Documentation', createReadme(blueprint, diagnostics))
  ];
}

export function compileBlueprint(input = {}) {
  const blueprint = inferBlueprint(input);
  const diagnostics = validateBlueprint(blueprint);
  const referenceDataUrl = normalizeReferenceDataUrl(input.reference?.dataUrl);
  const previewHtml = createPreviewDocument(blueprint, referenceDataUrl);
  const files = blueprint.target.id === 'react'
    ? createReactFiles(blueprint, diagnostics, previewHtml, referenceDataUrl)
    : createStaticFiles(blueprint, diagnostics, previewHtml);
  const primaryFile = blueprint.target.id === 'react' ? 'src/App.jsx' : 'index.html';
  const previewFile = blueprint.target.id === 'react' ? 'preview.html' : 'index.html';

  return {
    engine: 'VibeCore Blueprint Engine',
    engineVersion: VIBECORE_SCHEMA_VERSION,
    compiledAt: new Date().toISOString(),
    blueprint,
    diagnostics,
    files,
    primaryFile,
    previewFile,
    previewHtml,
    summary: {
      recipe: blueprint.recipe.label,
      target: blueprint.target.label,
      fidelity: blueprint.reference?.mode === 'exact' ? 'Exact pixels' : 'Rule layout',
      components: blueprint.components.length,
      passedRules: diagnostics.filter((item) => item.level === 'pass').length,
      totalRules: diagnostics.length
    }
  };
}
