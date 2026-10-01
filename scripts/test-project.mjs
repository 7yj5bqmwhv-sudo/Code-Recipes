import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';

// These are DOM/component tests, not a browser layout or image-loading test.
const virtualConsole = new VirtualConsole();
const domErrors = [];
virtualConsole.on('jsdomError', (error) => {
  // jsdom cannot parse Chakra's modern CSS layers; it has no layout engine.
  if (error.type !== 'css parsing') domErrors.push(error.message);
});
const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
  url: 'http://localhost/', pretendToBeVisual: true, virtualConsole,
});
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'Event', 'MouseEvent', 'MutationObserver', 'File', 'FileList', 'Blob', 'HTMLInputElement']) {
  Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true });
}
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.localStorage = dom.window.localStorage;

let osDark = true;
const mediaQueries = new Set();
window.matchMedia = (media) => {
  const listeners = new Set();
  const query = {
    media, matches: media.includes('prefers-color-scheme: dark') && osDark,
    addListener: (listener) => listeners.add(listener), removeListener: (listener) => listeners.delete(listener),
    addEventListener: (_event, listener) => listeners.add(listener), removeEventListener: (_event, listener) => listeners.delete(listener),
    update: () => { query.matches = media.includes('prefers-color-scheme: dark') && osDark; for (const listener of listeners) listener(query); },
  };
  mediaQueries.add(query);
  return query;
};
globalThis.matchMedia = window.matchMedia;
const scrollCalls = [];
window.scrollTo = (options) => { scrollCalls.push(options); Object.defineProperty(window, 'scrollY', { value: options.top, configurable: true }); };

const require = createRequire(import.meta.url);
const React = require('react');
const { act, createElement: h } = React;
const { createRoot } = require('react-dom/client');
const bundle = await build({
  stdin: { contents: `export { App } from './src/App.jsx'; export { Provider } from './src/components/ui/provider.jsx'; export { recipes, filterRecipes, formatNutrient, nutrients } from './src/utils/recipes.js';`, resolveDir: process.cwd(), loader: 'jsx' },
  bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', jsx: 'automatic',
});
const module = { exports: {} };
new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(require, module, module.exports);
const { App, Provider, recipes, filterRecipes, formatNutrient, nutrients } = module.exports;

const consoleIssues = [];
const previousError = console.error;
const previousWarn = console.warn;
console.error = (...args) => consoleIssues.push(args.map(String).join(' '));
console.warn = (...args) => consoleIssues.push(args.map(String).join(' '));
let assertions = 0;
const check = (condition, message) => { assert.ok(condition, message); assertions++; };
const exact = (actual, expected, message) => { assert.deepEqual(actual, expected, message); assertions++; };
const host = document.getElementById('root');
let root = createRoot(host);
const click = async (element) => { check(Boolean(element), 'Expected clickable element exists'); await act(async () => element.click()); };
const button = (text) => [...host.querySelectorAll('button')].find((element) => element.textContent === text);
const theme = () => host.querySelector('button[aria-label^="Color mode:"]');
const cards = () => [...host.querySelectorAll('article')];
const setQuery = async (value) => {
  const input = host.querySelector('input');
  await act(async () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, value);
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
};

try {
  exact(recipes.length, 20, 'All 20 recipes retained');
  exact(new Set(recipes.map((recipe) => recipe.label)).size, 20, 'Unique recipe labels');
  for (const recipe of recipes) {
    exact(recipe.ingredientLineIds.length, recipe.ingredientLines.length, 'An ID for every ingredient row');
    exact(new Set(recipe.ingredientLineIds).size, recipe.ingredientLines.length, 'Unique fixed ingredient IDs');
    check(filterRecipes(recipe.label.toUpperCase()).includes(recipe), 'Case-insensitive title search');
    for (const label of recipe.healthLabels) check(filterRecipes(label).includes(recipe), `Search supports ${label}`);
  }
  exact(filterRecipes('   ').length, 20, 'Whitespace search returns all recipes');
  exact(filterRecipes('NO-SUCH-RECIPE-XYZ').length, 0, 'No matches is empty');
  exact(filterRecipes('gluten free').map((r) => r.label), filterRecipes('gluten-free').map((r) => r.label), 'Hyphen/space label search');

  await act(async () => root.render(h(React.StrictMode, null, h(Provider, null, h(App)))));
  exact(cards().length, 20, 'Overview renders all 20 cards');
  exact(host.querySelectorAll('main').length, 1, 'One main landmark');
  exact(host.querySelectorAll('h1').length, 1, 'One page heading');
  check(document.documentElement.classList.contains('dark'), 'First load follows dark OS preference');
  exact(theme().textContent, 'Device', 'Default mode is Device');

  for (const [position, recipe] of recipes.entries()) {
    const card = cards()[position];
    const text = card.textContent;
    for (const value of [recipe.label, ...recipe.mealType, ...recipe.dishType, ...recipe.dietLabels, ...recipe.cautions, ...recipe.healthLabels.filter((label) => ['Vegan', 'Vegetarian'].includes(label))]) {
      check(text.includes(value), `Overview includes ${value}`);
    }
    exact(card.querySelector('img').getAttribute('src'), recipe.image, 'Correct image URL');
    exact(card.querySelector('img').getAttribute('alt'), recipe.label, 'Useful image alt');
    const emptyFields = Number(recipe.dietLabels.length === 0) + Number(recipe.cautions.length === 0);
    exact(text.split('Not provided in the source data.').length - 1, emptyFields, 'Explicit missing-data labels');
    check(card.querySelector('button'), 'Every card has a native keyboard-operable button');
  }

  await click(theme());
  exact(theme().textContent, 'Light', 'Switch to Light');
  check(document.documentElement.classList.contains('light'), 'Light theme class applied');
  await click(theme());
  exact(theme().textContent, 'Dark', 'Switch to Dark');
  exact(window.localStorage.getItem('theme'), 'dark', 'Theme saved');
  await act(async () => root.unmount());
  root = createRoot(host);
  await act(async () => root.render(h(Provider, null, h(App))));
  exact(theme().textContent, 'Dark', 'Theme survives remount');
  await click(theme());
  exact(theme().textContent, 'Device', 'Switch back to Device');
  await act(async () => { osDark = false; for (const query of mediaQueries) query.update(); });
  check(document.documentElement.classList.contains('light'), 'Device tracks a changed OS preference');

  await setQuery('  CHICKEN  ');
  exact(cards().length, filterRecipes('CHICKEN').length, 'Input filters the rendered list');
  check(cards().length > 0 && cards().length < 20, 'Search actually narrows results');
  const selectedLabel = cards()[0].querySelector('h2').textContent;
  await click(cards()[0].querySelector('button'));
  exact(host.querySelector('h1').textContent, selectedLabel, 'Search result opens');
  await click(button('Back to recipes'));
  exact(host.querySelector('input').value, '  CHICKEN  ', 'Back preserves search');
  check(document.activeElement.getAttribute('aria-label') === `Open ${selectedLabel}`, 'Back restores focus');
  await setQuery('NO-SUCH-RECIPE-XYZ');
  exact(cards().length, 0, 'Rendered no-results state');
  check(host.textContent.includes('No recipes found'), 'Helpful no-results message');
  await click(button('Clear'));
  exact(cards().length, 20, 'Clear restores all recipes');

  for (const [position, recipe] of recipes.entries()) {
    Object.defineProperty(window, 'scrollY', { value: 1200, configurable: true });
    const card = cards()[position];
    // Exercise both the whole-card pointer action and its native button.
    await click(position % 2 ? card : card.querySelector('button'));
    exact(host.querySelector('h1').textContent, recipe.label, 'Correct detail heading');
    exact(document.activeElement, host.querySelector('h1'), 'Detail heading receives focus');
    exact(scrollCalls.at(-1), { top: 0, behavior: 'instant' }, 'Detail scrolls to top after mounting');
    const text = host.textContent;
    for (const value of [...recipe.mealType, ...recipe.dishType, ...recipe.dietLabels, ...recipe.healthLabels, ...recipe.cautions]) check(text.includes(value), `Details include ${value}`);
    for (const title of ['Diet', 'Health labels', 'Cautions', 'Ingredients', 'Servings', 'Cooking time', 'Total nutrition']) check(text.includes(title), `Details include ${title}`);
    exact([...host.querySelectorAll('li')].map((element) => element.textContent), recipe.ingredientLines, 'All ingredient lines, including duplicates, preserved');
    check(text.includes(recipe.totalTime > 0 ? `${recipe.totalTime} min` : 'N/A'), 'Cooking time or N/A');
    for (const [label, key] of nutrients) check(text.includes(label) && text.includes(formatNutrient(recipe, key)), `Correct total ${label}`);
    check(!host.querySelector('p h1, p h2, p div, button h1, button h2, button p, button button'), 'No invalid paragraph/button nesting');
    await click(button('Back to recipes'));
    exact(cards().length, 20, 'Back restores overview');
    exact(scrollCalls.at(-1), { top: 1200, behavior: 'instant' }, 'Back restores overview scroll');
  }

  const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]);
  for (const path of walk('src').filter((path) => path.endsWith('.jsx'))) {
    check(!/<[a-z][a-z0-9]*\b/.test(readFileSync(path, 'utf8')), `No raw HTML JSX: ${path}`);
  }
  await act(async () => root.unmount());
  exact(consoleIssues, [], 'No React console warnings/errors throughout tested flows');
  exact(domErrors, [], 'No unexpected DOM test errors');
  console.log(`PASS: ${assertions} assertions across all 20 recipes, search, navigation, focus, scroll, theme, ingredients, nutrients, and console output.`);
  console.log('LIMITATION: jsdom does not verify pixel layout, real image loading, or browser CSS rendering.');
} finally {
  console.error = previousError;
  console.warn = previousWarn;
  dom.window.close();
}
