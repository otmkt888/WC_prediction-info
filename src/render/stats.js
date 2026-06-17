import { getTeams, getCurrentMatch } from '../store.js';
import { t } from '../i18n.js';
import { teamName } from './utils.js';

function statBar(hVal, aVal, hColor, aColor) {
  const total = hVal + aVal;
  if (total === 0) {
    return `<div class="stat-bar">
      <div class="stat-bar-h" style="width:50%;background:${hColor};opacity:0.15"></div>
      <div class="stat-bar-a" style="width:50%;--bar-color:${aColor};opacity:0.15"></div>
    </div>`;
  }
  const hPct = Math.round(hVal / total * 100);
  return `<div class="stat-bar">
    <div class="stat-bar-h" style="width:${hPct}%;background:${hColor}"></div>
    <div class="stat-bar-a" style="width:${100 - hPct}%;--bar-color:${aColor}"></div>
  </div>`;
}

function statRow(label, hVal, aVal, hColor, aColor, suffix = '') {
  return `<div class="stat-row">
    <div class="stat-h" style="color:${hColor}">${hVal}${suffix}</div>
    <div class="stat-center">
      <div class="stat-name">${label}</div>
      ${statBar(hVal, aVal, hColor, aColor)}
    </div>
    <div class="stat-a" style="color:${aColor}">${aVal}${suffix}</div>
  </div>`;
}

function possessionRow(ls, hColor, aColor) {
  const [h, a] = ls.possession;
  const mid = 100 - h - a;
  return `<div class="stat-row">
    <div class="stat-h" style="color:${hColor}">${h}%</div>
    <div class="stat-center">
      <div class="stat-name">${t('stats.possession')}</div>
      <div class="stat-bar">
        <div class="stat-bar-h" style="width:${h}%;background:${hColor}"></div>
        ${mid > 0 ? `<div style="width:${mid}%;background:#475569"></div>` : ''}
        <div class="stat-bar-a" style="width:${a}%;--bar-color:${aColor}"></div>
      </div>
    </div>
    <div class="stat-a" style="color:${aColor}">${a}%</div>
  </div>`;
}

function statsCard(title, rows) {
  return `<div class="stats-card">
    <div class="stats-card-title">${title}</div>
    ${rows}
  </div>`;
}

export function renderStats() {
  const m = getCurrentMatch();
  const ls = m.liveStats;
  if (!ls) return '';

  const TEAMS = getTeams();
  const h = TEAMS[m.homeCode];
  const a = TEAMS[m.awayCode];
  const hc = h.color;
  const ac = a.color;

  const hPassPct = ls.passes[0] ? Math.round(ls.passes_completed[0] / ls.passes[0] * 100) : 0;
  const aPassPct = ls.passes[1] ? Math.round(ls.passes_completed[1] / ls.passes[1] * 100) : 0;

  const attacking = statsCard(t('stats.section.attacking'), [
    possessionRow(ls, hc, ac),
    statRow(t('stats.goals'), ls.goals[0], ls.goals[1], hc, ac),
    statRow(t('stats.attempts_total'), ls.attempts_total[0], ls.attempts_total[1], hc, ac),
    statRow(t('stats.attempts_on'), ls.attempts_on[0], ls.attempts_on[1], hc, ac),
    statRow(t('stats.attempts_off'), ls.attempts_off[0], ls.attempts_off[1], hc, ac),
  ].join(''));

  const distribution = statsCard(t('stats.section.distribution'), [
    statRow(t('stats.passes'), ls.passes[0], ls.passes[1], hc, ac),
    statRow(t('stats.pass_pct'), hPassPct, aPassPct, hc, ac, '%'),
    statRow(t('stats.crosses'), ls.crosses[0], ls.crosses[1], hc, ac),
    statRow(t('stats.crosses_completed'), ls.crosses_completed[0], ls.crosses_completed[1], hc, ac),
  ].join(''));

  const setPlays = statsCard(t('stats.section.setplays'), [
    statRow(t('stats.corners'), ls.corners[0], ls.corners[1], hc, ac),
    statRow(t('stats.free_kicks'), ls.free_kicks[0], ls.free_kicks[1], hc, ac),
  ].join(''));

  const discipline = statsCard(t('stats.section.discipline'), [
    statRow(t('stats.yellow_cards'), ls.yellow_cards[0], ls.yellow_cards[1], hc, ac),
    statRow(t('stats.red_cards'), ls.red_cards[0], ls.red_cards[1], hc, ac),
    statRow(t('stats.fouls'), ls.fouls[0], ls.fouls[1], hc, ac),
    statRow(t('stats.offsides'), ls.offsides[0], ls.offsides[1], hc, ac),
  ].join(''));

  const defending = statsCard(t('stats.section.defending'), [
    statRow(t('stats.forced_turnovers'), ls.forced_turnovers[0], ls.forced_turnovers[1], hc, ac),
    statRow(t('stats.pressing'), ls.pressing[0], ls.pressing[1], hc, ac),
    statRow(t('stats.line_breaks_comp'), ls.line_breaks_completed[0], ls.line_breaks_completed[1], hc, ac),
  ].join(''));

  return `
    <div class="stats-legend">
      <div class="stats-legend-team" style="color:${hc}">
        <span class="stats-legend-flag">${h.flag}</span>
        <span>${teamName(h)}</span>
        <span class="stats-legend-swatch stats-legend-swatch-solid" style="background:${hc}"></span>
      </div>
      <div class="stats-legend-sep"></div>
      <div class="stats-legend-team stats-legend-right" style="color:${ac}">
        <span class="stats-legend-swatch stats-legend-swatch-stripe" style="--bar-color:${ac}"></span>
        <span>${teamName(a)}</span>
        <span class="stats-legend-flag">${a.flag}</span>
      </div>
    </div>
    ${attacking}
    ${distribution}
    ${setPlays}
    ${discipline}
    ${defending}
    <div class="stats-source">${t('stats.source')}</div>
  `;
}
