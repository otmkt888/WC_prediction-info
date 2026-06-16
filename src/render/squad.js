import { getTeams, getCurrentMatch } from '../store.js';
import { t } from '../i18n.js';
import { TAG_STYLES, POS_STYLES, posType, teamName, renderPlaceholder } from './utils.js';

function renderPlayerCard(p, team) {
  const type = posType(p.pos);
  const posStyle = POS_STYLES[type];
  const tagKeys = (p.tags || '').split(',').map(k => k.trim()).filter(Boolean);
  const tags = tagKeys.map(k => {
    const style = TAG_STYLES[k] || TAG_STYLES.squad;
    return `<span class="player-tag" style="${style}">${t('tag.' + k) || k}</span>`;
  }).join('');
  const bench = p.bench === 'true';
  const bar = `width:${p.prob}%;background:${team.barColor}`;
  return `
    <div class="player-card${bench ? ' bench' : ''}">
      <div class="player-accent" style="background:${team.barColor}"></div>
      <div class="player-header">
        <span class="player-pos" style="${posStyle}">${p.pos}</span>
        <span class="player-num">${p.num}</span>
      </div>
      <div class="player-name">${p.name}</div>
      <div class="player-club">${p.flag || ''} ${p.club}</div>
      <div class="player-tags">${tags}</div>
      <div class="player-prob-label">${bench ? t('squad.prob_sub') : t('squad.prob')}</div>
      <div class="player-bar-bg"><div class="player-bar" style="${bar}"></div></div>
      <div class="player-prob-val">${p.prob}%</div>
      <div class="player-desc">${p.desc}</div>
    </div>`;
}

export function renderSquad(side) {
  const m = getCurrentMatch();
  if (m.placeholder) return renderPlaceholder(m);
  const TEAMS = getTeams();
  const squad = side === 'home' ? m.homeSquad : m.awaySquad;
  const code = side === 'home' ? m.homeCode : m.awayCode;
  const formation = side === 'home' ? m.homeFormation : m.awayFormation;
  const coach = side === 'home' ? m.homeCoach : m.awayCoach;
  const note = side === 'home' ? m.homeNote : m.awayNote;
  const team = TEAMS[code];

  return `
    <div class="section-title">
      <span class="section-dot" style="background:${team.color}"></span>
      ${teamName(team)} — ${t('squad.title')} (${formation})
    </div>
    <div class="squad-meta">
      <div class="squad-meta-card">
        <div class="meta-label">${t('squad.formation')}</div>
        <div class="meta-value" style="color:${team.color}">${formation}</div>
      </div>
      <div class="squad-meta-card">
        <div class="meta-label">${t('squad.coach')}</div>
        <div class="meta-value" style="color:${team.color};font-size:15px">${coach}</div>
      </div>
    </div>
    <div class="note-box">${note}</div>
    <div class="player-grid">
      ${squad.map(p => renderPlayerCard(p, team)).join('')}
    </div>`;
}
