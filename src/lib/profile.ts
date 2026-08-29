import { readFileSync } from 'node:fs';
import path from 'node:path';

export type Skill = { label: string; value: string };
export type OrgItem = { name: string; url: string; description: string };
export type OrgGroup = { title: string; items: OrgItem[] };

export type Profile = {
  name: string;
  welcome: string;
  location: string;
  role: string;
  about: string[];
  focus: string[];
  skills: Skill[];
  continuousLearning: string;
  askAbout: string;
  funFact: string;
  communityBuilder: {
    focus: string;
    blurb: string;
    imageUrl: string;
    href: string;
  };
  volunteering: VolSection[];
  hackathon: { title: string; body: string[] }[];
  orgs: OrgGroup[];
};

type VolSection = {
  title: string;
  subsections: { title: string; items: string[] }[];
};

const PROFILE_ASSET_BASE = 'https://raw.githubusercontent.com/jajera/jajera/main/';

function stripEmojiHeading(title: string) {
  return title.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\s]+/u, '').trim();
}

function splitByHeading(md: string, level: number) {
  const re = new RegExp(`^#{${level}}\\s+(.+)$`, 'gm');
  const matches = [...md.matchAll(re)];
  const sections: { title: string; body: string }[] = [];
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const start = (match.index ?? 0) + match[0].length;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? md.length) : md.length;
    sections.push({
      title: stripEmojiHeading(match[1].trim()),
      body: md.slice(start, end).trim(),
    });
  }
  return sections;
}

function extractBadgeLabel(md: string, key: string) {
  const re = new RegExp(
    `!\\[${key}\\]\\(https://img\\.shields\\.io/badge/([^)?]+)`,
    'i',
  );
  const m = md.match(re);
  if (!m) return '';
  // shields.io path is LABEL-COLOR; drop the trailing hex colour token
  const labelPath = m[1].replace(/-[0-9a-fA-F]{3,8}$/, '');
  return decodeURIComponent(labelPath.replace(/%2C/gi, ','))
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseBulletLines(body: string) {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('* ') || line.startsWith('- '))
    .map((line) => line.replace(/^[*-]\s+/, '').trim());
}

function stripMd(text: string) {
  return text
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function linkifyInline(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" rel="noopener noreferrer">$1</a>',
    );
}

function paragraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .filter((block) => !block.startsWith('#') && !block.startsWith('*') && !block.startsWith('-') && !block.startsWith('!['))
    .map((block) => stripMd(block.replace(/\n/g, ' ')));
}

function parseAbout(body: string) {
  const aboutParas = paragraphs(body);
  const focus: string[] = [];
  const skills: Skill[] = [];
  let continuousLearning = '';
  let askAbout = '';
  let funFact = '';

  const focusMatch = body.match(/\*\s+[^\n]*\*\*My Current Focus\*\*([\s\S]*?)(?=\*\s+[^\n]*\*\*Technical Skills\*\*|\*\s+[^\n]*🌱|$)/i);
  if (focusMatch) {
    for (const line of focusMatch[1].split('\n')) {
      const m = line.match(/^\s+\*\s+(.+)/);
      if (m) focus.push(stripMd(m[1]));
    }
  }

  const skillsMatch = body.match(/\*\s+[^\n]*\*\*Technical Skills\*\*([\s\S]*?)(?=\*\s+[^\n]*🌱|\*\s+[^\n]*❓|\*\s+[^\n]*⚡|$)/i);
  if (skillsMatch) {
    for (const line of skillsMatch[1].split('\n')) {
      const m = line.match(/^\s+\*\s+\*\*([^:*]+):\*\*\s*(.+)/);
      if (m) skills.push({ label: m[1].trim(), value: stripMd(m[2]) });
    }
  }

  for (const line of body.split('\n')) {
    if (/🌱/.test(line)) continuousLearning = stripMd(line.replace(/^\*\s+/, '').replace(/🌱\s*/, ''));
    if (/❓/.test(line) || /\*\*Ask me about\*\*/i.test(line)) {
      askAbout = stripMd(line.replace(/^\*\s+/, '').replace(/❓\s*/, '').replace(/\*\*Ask me about\*\*/i, '').trim());
    }
    if (/⚡/.test(line) || /\*\*Fun fact:\*\*/i.test(line)) {
      funFact = stripMd(line.replace(/^\*\s+/, '').replace(/⚡\s*/, '').replace(/\*\*Fun fact:\*\*/i, '').trim());
    }
  }

  return { aboutParas, focus, skills, continuousLearning, askAbout, funFact };
}

function parseCommunityBuilder(body: string) {
  const link = body.match(/\[!\[AWS Community Builder\]\(([^)]+)\)\]\(([^)]+)\)/);
  let imageUrl = link?.[1] ?? '';
  if (imageUrl && !/^https?:/i.test(imageUrl)) {
    imageUrl = PROFILE_ASSET_BASE + imageUrl.replace(/^\/+/, '');
  }
  const href = link?.[2] ?? 'https://aws.amazon.com/developer/community/community-builders/';
  const focusLine = body.match(/\*\*Focus area:\*\*\s*(.+)/i);
  const blurb = paragraphs(body).find((p) => /community builder/i.test(p)) ?? paragraphs(body)[0] ?? '';
  return {
    focus: focusLine ? stripMd(focusLine[1]) : '',
    blurb,
    imageUrl,
    href,
  };
}

function parseVolunteering(body: string): VolSection[] {
  const h3 = splitByHeading(body, 3);
  return h3.map((section) => {
    const h4 = splitByHeading(section.body, 4);
    if (h4.length) {
      return {
        title: section.title,
        subsections: h4.map((sub) => ({
          title: sub.title,
          items: parseBulletLines(sub.body).map(linkifyInline),
        })),
      };
    }
    return {
      title: section.title,
      subsections: [
        {
          title: '',
          items: parseBulletLines(section.body).map(linkifyInline),
        },
      ],
    };
  });
}

function parseHackathon(body: string) {
  const items: { title: string; body: string[] }[] = [];
  const blocks = body.split(/\n(?=\* \*\*)/);
  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    if (!lines.length) continue;
    const titleLine = lines[0].replace(/^\*\s+/, '');
    const rest = lines
      .slice(1)
      .filter((l) => l !== '---')
      .map((l) => linkifyInline(l.replace(/^\*\s+/, '')));
    items.push({ title: linkifyInline(titleLine), body: rest });
  }
  return items;
}

function parseOrgs(body: string): OrgGroup[] {
  const groups = splitByHeading(body, 3);
  return groups.map((group) => ({
    title: group.title,
    items: parseBulletLines(group.body).map((line) => {
      const m = line.match(/\[([^\]]+)\]\(([^)]+)\)\s*-\s*(.+)/);
      if (m) {
        return { name: m[1], url: m[2], description: stripMd(m[3]) };
      }
      return { name: stripMd(line), url: '#', description: '' };
    }),
  }));
}

export function loadProfile(profilePath = path.join(process.cwd(), 'data', 'profile.md')): Profile {
  const md = readFileSync(profilePath, 'utf8');
  const h1 = md.match(/^#\s+(.+)$/m)?.[1] ?? 'John Ajera';
  const name = stripEmojiHeading(h1).replace(/^Hi,\s*I'm\s+/i, '').trim();

  const beforeFirstH2 = md.split(/^##\s+/m)[0] ?? '';
  const location = extractBadgeLabel(beforeFirstH2, 'Location') || 'Wellington, New Zealand';
  const role =
    extractBadgeLabel(beforeFirstH2, 'Platform Engineer') || 'Platform Engineer';

  const welcome =
    beforeFirstH2
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith('#') && !l.startsWith('![') && !l.startsWith('[![')) ?? '';

  const sections = Object.fromEntries(
    splitByHeading(md, 2).map((s) => [s.title.toLowerCase(), s.body]),
  );

  const about = parseAbout(sections['about me'] ?? '');
  const communityBuilder = parseCommunityBuilder(sections['aws community builder'] ?? '');
  const volunteering = parseVolunteering(sections['community volunteering'] ?? '');
  const hackathon = parseHackathon(sections['hackathon participation'] ?? '');
  const orgsBody = sections['github organizations'] ?? '';
  // Drop leading blurb before first ### 
  const orgs = parseOrgs(orgsBody.includes('###') ? orgsBody.slice(orgsBody.indexOf('###')) : orgsBody);

  return {
    name,
    welcome: stripMd(welcome),
    location,
    role,
    about: about.aboutParas,
    focus: about.focus,
    skills: about.skills,
    continuousLearning: about.continuousLearning,
    askAbout: about.askAbout,
    funFact: about.funFact,
    communityBuilder,
    volunteering,
    hackathon,
    orgs,
  };
}
