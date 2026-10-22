/**
 * Explicit imports only — extra files in assets/music/ do not bloat the bundle.
 * Footer.mov is ~48MB (over Cloudflare 25MB/asset limit) — use Footer.mp3 in repo or fallback URL.
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
  footer: 'Footer.mp3',
};

import welcomePageUrl from '../assets/music/Welcome page.mp3?url';
import scratchHereUrl from '../assets/music/Scratch here.mp3?url';
import gateSoundUrl from '../assets/music/gate.mp4?url';

const footerMp3Glob = import.meta.glob<string>('../assets/music/Footer.mp3', {
  eager: true,
  query: '?url',
  import: 'default',
});

/** GitHub raw — only if Footer.mp3 not bundled (Footer.mov too large for Workers deploy). */
const FOOTER_AUDIO_FALLBACK =
  'https://raw.githubusercontent.com/25abubakar/Weds/master/src/assets/music/Footer.mov';

function publicMusicUrl(fileName: string): string {
  const base = import.meta.env.BASE_URL;
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}music/${encodeURIComponent(fileName)}`;
}

function resolveFooterUrl(): string | undefined {
  const bundled = Object.values(footerMp3Glob)[0];
  if (bundled) return bundled;
  if (import.meta.env.PROD) return FOOTER_AUDIO_FALLBACK;
  return publicMusicUrl('Footer.mp3');
}

export function getMusicTracks(): Partial<Record<MusicSectionId, string>> {
  const tracks: Partial<Record<MusicSectionId, string>> = {
    hero: welcomePageUrl,
    scratch: scratchHereUrl,
  };

  const footer = resolveFooterUrl();
  if (footer) tracks.footer = footer;

  for (const id of MUSIC_SECTIONS) {
    if (tracks[id]) continue;
    if (id === 'gate') {
      tracks.gate = gateSoundUrl;
      continue;
    }
    tracks[id as MusicSectionId] = publicMusicUrl(MUSIC_FILE_BY_SECTION[id]);
  }

  return tracks;
}
