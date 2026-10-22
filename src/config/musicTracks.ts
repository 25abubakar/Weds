/**
 * Music / media in src/assets/music/ or public/music/
 */
export const MUSIC_SECTIONS = [
  'gate',
  'hero',
  'welcome',
  'scratch',
  'slide-1',
  'slide-2',
  'slide-3',
  'countdown',
  'details',
  'map',
  'dress-code',
  'rsvp',
  'closing',
  'footer',
] as const;

export type MusicSectionId = (typeof MUSIC_SECTIONS)[number];

export const MUSIC_FILE_BY_SECTION: Record<MusicSectionId, string> = {
  gate: 'Screengate.mp3',
  hero: 'Welcome page.mp3',
  welcome: 'welcome.mp3',
  scratch: 'Scratch here.mp3',
  'slide-1': 'slide-1.mp3',
  'slide-2': 'slide-2.mp3',
  'slide-3': 'slide-3.mp3',
  countdown: 'countdown.mp3',
  details: 'details.mp3',
  map: 'map.mp3',
  'dress-code': 'dress-code.mp3',
  rsvp: 'rsvp.mp3',
  closing: 'closing.mp3',
  footer: 'Footer.mov',
};

const musicModules = {
  ...import.meta.glob<string>('../assets/music/*.mp3', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
  ...import.meta.glob<string>('../assets/music/*.MP3', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
  ...import.meta.glob<string>('../assets/music/*.{mov,MOV,mp4,MP4}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
};

function fileNameToSectionId(fileName: string): string {
  const base = fileName.replace(/\.(mp3|mov|mp4|m4v|webm)$/i, '').toLowerCase().trim();
  if (base === 'screengate' || base === 'gate') return 'gate';
  if (base === 'welcome page' || base === 'welcome-page' || base === 'welcomepage') {
    return 'hero';
  }
  if (base === 'scratch here' || base === 'scratch-here' || base === 'scratch') {
    return 'scratch';
  }
  if (base === 'footer') return 'footer';
  return base.replace(/\s+/g, '-');
}

function publicMusicUrl(fileName: string): string {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}music/${encodeURIComponent(fileName)}`;
}

export function getMusicTracks(): Partial<Record<MusicSectionId, string>> {
  const tracks: Partial<Record<MusicSectionId, string>> = {};

  for (const [path, url] of Object.entries(musicModules)) {
    const fileName = path.split('/').pop();
    if (!fileName) continue;
    const id = fileNameToSectionId(fileName);
    if (MUSIC_SECTIONS.includes(id as MusicSectionId)) {
      tracks[id as MusicSectionId] = url;
    }
  }

  const heroPreferred = Object.entries(musicModules).find(([path]) =>
    /\/Welcome page\.mp3$/i.test(path.replace(/\\/g, '/'))
  );
  if (heroPreferred) tracks.hero = heroPreferred[1];

  const scratchPreferred = Object.entries(musicModules).find(([path]) =>
    /\/Scratch here\.mp3$/i.test(path.replace(/\\/g, '/'))
  );
  if (scratchPreferred) tracks.scratch = scratchPreferred[1];

  const footerPreferred = Object.entries(musicModules).find(([path]) =>
    /\/Footer\.mov$/i.test(path.replace(/\\/g, '/'))
  );
  if (footerPreferred) tracks.footer = footerPreferred[1];

  for (const id of MUSIC_SECTIONS) {
    if (!tracks[id]) {
      tracks[id as MusicSectionId] = publicMusicUrl(MUSIC_FILE_BY_SECTION[id]);
    }
  }

  return tracks;
}
