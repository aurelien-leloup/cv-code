import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import en from '../src/content/en.mjs';
import fr from '../src/content/fr.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root  = resolve(__dir, '..');
const read  = f => readFileSync(resolve(root, f), 'utf-8');
const e     = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const tMain    = read('src/template.html');
const tLangRow = read('src/partials/lang-row.html');
const tEduItem = read('src/partials/edu-item.html');
const tJob     = read('src/partials/job.html');

function sub(template, tokens) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in tokens)) throw new Error(`Unknown token: {{${key}}}`);
    return tokens[key];
  });
}

function list(partial, items, tokenFn) {
  return items.map(item => sub(partial, tokenFn(item))).join('\n');
}

function jobTokens(j, currentBadge) {
  const when = j.periodLine2
    ? `<span style="color:rgb(241,196,15);font-weight:600;font-size:9px">${e(j.period)}</span><br/><span style="color:rgb(241,196,15);font-weight:600;font-size:9px">${e(j.periodLine2)}</span><span class="total" style="color:rgb(138,138,138);font-weight:400;font-size:9px">${e(j.total)}</span>`
    : `<span style="color:rgb(241,196,15);font-weight:600;font-size:9px">${e(j.period)}</span><span class="total" style="color:rgb(138,138,138);font-weight:400;font-size:9px">${e(j.total)}</span>`;

  const company = j.isCurrent
    ? `<span class="company" style="color:rgb(26,26,26);font-weight:700;font-size:13px">${e(j.company)} <span class="now" style="background:rgb(241,196,15);color:rgb(26,26,26);font-weight:700;font-size:8px">${e(currentBadge)}</span></span>`
    : `<span class="company" style="color:rgb(26,26,26);font-weight:700;font-size:13px">${e(j.company)}</span>`;

  return {
    JOB_CLASS:     j.flagship ? 'job flagship' : 'job',
    WHEN:          when,
    COMPANY:       company,
    JOB_TITLE:     e(j.jobTitle),
    CONTRACT_TYPE: e(j.contractType),
    DESC:          e(j.desc),
    STACK_BOLD:    e(j.stackBold),
    STACK_REST:    e(j.stackRest),
  };
}

function buildTokens(c) {
  const eduTokens = item => ({ YEAR: e(item.year), TITLE: e(item.title), SUB: e(item.sub) });
  return {
    LANG:                c.lang,
    TITLE:               e(c.title),
    EYEBROW:             e(c.eyebrow),
    ROLE_STRONG:         e(c.roleStrong),
    ROLE_SPAN:           e(c.roleSpan),
    SUMMARY_BOLD1:       e(c.summaryBold1),
    SUMMARY_TEXT:        e(c.summaryText),
    STAT_LBL:            e(c.statLbl),
    PHONE:               e(c.phone),
    S_CONTACT:           e(c.sContact),
    S_SKILLS:            e(c.sSkills),
    S_LANGUAGES:         e(c.sLanguages),
    LANGUAGES_LIST:      list(tLangRow, c.languages, item => ({ NAME: e(item.name), LEVEL: e(item.level) })),
    S_CERTIFICATIONS:    e(c.sCertifications),
    CERTIFICATIONS_LIST: list(tEduItem, c.certifications, eduTokens),
    S_EDUCATION:         e(c.sEducation),
    EDUCATION_LIST:      list(tEduItem, c.education, eduTokens),
    S_INVOLVEMENT:       e(c.sInvolvement),
    INVOLVEMENT_LIST:    list(tEduItem, c.involvement, eduTokens),
    EXPERIENCE_TITLE:    e(c.experienceTitle),
    EXPERIENCE_META:     e(c.experienceMeta),
    JOBS_LIST:           list(tJob, c.jobs, j => jobTokens(j, c.currentBadge)),
  };
}

mkdirSync(resolve(root, 'dist'), { recursive: true });
for (const [content, name] of [[en, 'CV-en.html'], [fr, 'CV-fr.html']]) {
  const out = resolve(root, 'dist', name);
  writeFileSync(out, sub(tMain, buildTokens(content)), 'utf-8');
  console.log('Built', out);
}
