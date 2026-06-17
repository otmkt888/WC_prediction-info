import { getTeams, getState, getCurrentMatch } from '../store.js';
import { t } from '../i18n.js';
import { teamName } from './utils.js';

export function renderTabs() {
  const m = getCurrentMatch();
  const TEAMS = getTeams();
  const h = TEAMS[m.homeCode], a = TEAMS[m.awayCode];
  const st = getState();
  const tabs = [
    { id: 'summary', label: t('tabs.summary'), color: '#F59E0B' },
    { id: 'home', label: `${h.flag} ${teamName(h)} ${t('tabs.players')}`, color: h.color },
    { id: 'away', label: `${a.flag} ${teamName(a)} ${t('tabs.players')}`, color: a.color },
    { id: 'other', label: t('tabs.other'), color: '#F59E0B' },
  ];
  if (m.liveStats) tabs.push({ id: 'stats', label: t('tabs.stats'), color: '#10B981' });
  return tabs.map(tab => {
    const active = tab.id === st.tab;
    return `<button class="tab-btn${active ? ' active' : ''}" data-tab="${tab.id}"
      style="border-bottom-color:${active ? tab.color : 'transparent'};color:${active ? tab.color : '#94A3B8'}"
    >${tab.label}</button>`;
  }).join('');
}
