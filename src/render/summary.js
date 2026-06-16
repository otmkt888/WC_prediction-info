import { getTeams, getCurrentMatch } from '../store.js';
import { t } from '../i18n.js';
import { teamName, renderPlaceholder } from './utils.js';

export function renderSummary() {
  const m = getCurrentMatch();
  if (m.placeholder) return renderPlaceholder(m);
  const TEAMS = getTeams();
  const h = TEAMS[m.homeCode], a = TEAMS[m.awayCode];
  const sp = m.scorePredictions || [];

  const topScore = sp[0] || {};
  const winnerCode = topScore.winner === 'away' ? m.awayCode : m.homeCode;
  const winner = TEAMS[winnerCode];

  const paragraphs = (m.summaryVerdict || '')
    .split('\n\n').filter(Boolean)
    .map(p => `<div class="summary-text">${p}</div>`).join('');

  const observations = (m.observations || []).map(o =>
    `<div class="obs-item"><strong class="obs-title">${o.title}：</strong>${o.detail}</div>`
  ).join('');

  const statsData = [
    { v: '55%', l: `${teamName(h)} ${t('summary.possession')}`, c: h.color },
    { v: '45%', l: `${teamName(a)} ${t('summary.possession')}`, c: a.color },
    { v: (m.eventPreds[0] || {}).value || '—', l: t('summary.corners'), c: '#EAB308' },
    { v: (m.eventPreds[1] || {}).value || '—', l: t('summary.yellows'), c: '#EAB308' },
    { v: (m.eventPreds[2] || {}).value || '—', l: t('summary.reds'), c: '#EF4444' },
  ];
  const statsCards = statsData.map(s =>
    `<div class="summary-stat">
      <div class="summary-stat-val" style="color:${s.c}">${s.v}</div>
      <div class="summary-stat-lbl">${s.l}</div>
    </div>`
  ).join('');

  return `
    <div class="section-title"><span class="section-dot"></span>${t('summary.title')}</div>
    <div class="verdict-card">
      <div class="verdict-title">${t('summary.pred_score')}</div>
      <div class="verdict-score">
        <div class="verdict-team">
          <div class="verdict-flag">${h.flag}</div>
          <div class="verdict-zh">${teamName(h)}</div>
        </div>
        <span class="verdict-num" style="color:${h.color}">${m.predScore.home}</span>
        <span class="verdict-dash">–</span>
        <span class="verdict-num" style="color:${a.color}">${m.predScore.away}</span>
        <div class="verdict-team">
          <div class="verdict-flag">${a.flag}</div>
          <div class="verdict-zh">${teamName(a)}</div>
        </div>
      </div>
      <div class="verdict-winner">${winner.flag} ${teamName(winner)} ${t('summary.wins')} · ${t('summary.most_likely')} ${topScore.score || '—'} (${topScore.prob || '—'}%)</div>
      ${paragraphs}
    </div>

    <div class="summary-stats">${statsCards}</div>

    <div class="section-title" style="margin-top:20px"><span class="section-dot"></span>${t('summary.key_obs')}</div>
    ${observations}

    ${m.aiModel ? `<div class="ai-disclaimer">
      <span class="ai-disclaimer-icon">🤖</span>
      <div class="ai-disclaimer-text">
        <span class="ai-disclaimer-title">${t('ai.title')}</span>
        ${t('ai.body', m.aiModel)}
      </div>
    </div>` : ''}
  `;
}
