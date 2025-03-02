import { highlighting } from './highlighting';
import { tweaks } from './tweaks';

// initial setup
highlighting();
tweaks();

// route change
addEventListener('hashchange', () => {
  highlighting();
  tweaks();
});

// storage change
chrome.storage.onChanged.addListener(() => {
  highlighting();
});
