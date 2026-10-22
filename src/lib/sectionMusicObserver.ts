/**
 * Section music: hero/scratch @ 50% visible; footer zone (slideshow → end) @ ~8% viewport.
 */

export const SECTION_MUSIC_THRESHOLD = 0.5;
export const FOOTER_SOUND_ZONE_ID = 'footer-sound-zone';
export const FOOTER_ZONE_VIEWPORT_THRESHOLD = 0.08;

export const SCROLL_MUSIC_SKIP_SECTION_IDS = new Set(['gate-section']);

export function pauseAllAudios() {
  document.querySelectorAll('audio').forEach((el) => {
    (el as HTMLAudioElement).pause();
  });
  document.querySelectorAll('video.section-audio').forEach((el) => {
    (el as HTMLVideoElement).pause();
  });
}

function playMediaEl(media: HTMLMediaElement) {
  if (!media.src) return;
  media.volume = media.volume > 0 ? media.volume : 0.85;
  if (media instanceof HTMLVideoElement) {
    media.muted = false;
  }
  const playPromise = media.play();
  if (playPromise !== undefined) {
    void playPromise.catch((error) => {
      if (import.meta.env.DEV) {
        console.log('Media play ruka — pehle gate par click karein ya file missing ho.', error);
      }
    });
  }
}

export function playSectionAudioElement(section: Element) {
  const video = section.querySelector('video.section-audio') as HTMLVideoElement | null;
  const audio = section.querySelector('audio.section-audio') as HTMLAudioElement | null;
  const media = audio ?? video;
  if (media) playMediaEl(media);
}

function scratchSectionDominates(): boolean {
  const scratch = document.getElementById('scratch-section');
  if (!scratch) return false;
  const rect = scratch.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.height <= 0) return false;
  const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  if (visiblePx <= 0) return false;
  const ratio = visiblePx / Math.min(rect.height, vh);
  return ratio >= SECTION_MUSIC_THRESHOLD;
}

function footerZoneShouldPlay(): boolean {
  const zone = document.getElementById(FOOTER_SOUND_ZONE_ID);
  if (!zone) return false;
  if (scratchSectionDominates()) return false;

  const rect = zone.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.bottom <= 0 || rect.top >= vh) return false;

  const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return visiblePx / vh >= FOOTER_ZONE_VIEWPORT_THRESHOLD;
}

function playFooterZoneSound() {
  const zone = document.getElementById(FOOTER_SOUND_ZONE_ID);
  if (!zone) return;
  pauseAllAudios();
  playSectionAudioElement(zone);
}

export function isSectionHalfVisible(section: Element): boolean {
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.height <= 0) return false;

  const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  if (visiblePx <= 0) return false;

  const ratio = visiblePx / Math.min(rect.height, vh);
  return ratio >= SECTION_MUSIC_THRESHOLD;
}

export function syncFirstVisibleSectionAudio() {
  if (footerZoneShouldPlay()) {
    playFooterZoneSound();
    return;
  }

  const vh = window.innerHeight;
  let bestEl: Element | null = null;
  let bestRatio = 0;

  document.querySelectorAll('.scroll-section').forEach((section) => {
    if (SCROLL_MUSIC_SKIP_SECTION_IDS.has(section.id)) return;
    if (section.id === FOOTER_SOUND_ZONE_ID) return;

    const rect = section.getBoundingClientRect();
    if (rect.height <= 0) return;

    const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    if (visiblePx <= 0) return;

    const ratio = visiblePx / Math.min(rect.height, vh);
    if (ratio >= SECTION_MUSIC_THRESHOLD && ratio > bestRatio) {
      bestEl = section;
      bestRatio = ratio;
    }
  });

  if (!bestEl) return;
  pauseAllAudios();
  playSectionAudioElement(bestEl);
}

export function startScrollSectionMusicObserver(enabled: boolean): () => void {
  if (!enabled) return () => {};

  const standardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (entry.target.id === FOOTER_SOUND_ZONE_ID) return;
        if (footerZoneShouldPlay()) return;
        pauseAllAudios();
        playSectionAudioElement(entry.target);
      });
    },
    { root: null, rootMargin: '0px', threshold: SECTION_MUSIC_THRESHOLD }
  );

  const footerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target.id !== FOOTER_SOUND_ZONE_ID) return;
        if (!entry.isIntersecting) {
          if (entry.intersectionRatio === 0) {
            pauseAllAudios();
          }
          return;
        }
        if (footerZoneShouldPlay()) playFooterZoneSound();
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.05, 0.08, 0.12, 0.2, 0.35, 0.5],
    }
  );

  document.querySelectorAll('.scroll-section').forEach((section) => {
    if (SCROLL_MUSIC_SKIP_SECTION_IDS.has(section.id)) return;
    if (section.id === FOOTER_SOUND_ZONE_ID) {
      footerObserver.observe(section);
      return;
    }
    standardObserver.observe(section);
  });

  const onScroll = () => {
    if (footerZoneShouldPlay()) playFooterZoneSound();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const initialTimer = window.setTimeout(() => syncFirstVisibleSectionAudio(), 150);

  return () => {
    window.clearTimeout(initialTimer);
    window.removeEventListener('scroll', onScroll);
    standardObserver.disconnect();
    footerObserver.disconnect();
  };
}

function gateAudioElement(gateAudio: HTMLAudioElement | null, src: string): HTMLAudioElement {
  if (gateAudio) return gateAudio;
  const el = new Audio(src);
  el.src = src;
  return el;
}

export function startGateMusic(gateAudio: HTMLAudioElement | null, src: string) {
  const el = gateAudioElement(gateAudio, src);
  pauseAllAudios();
  el.loop = true;
  el.volume = 0.85;
  el.currentTime = 0;
  void el.play().catch((error) => {
    if (import.meta.env.DEV) console.warn('[music] gate start failed:', src, error);
  });
}

export function continueGateMusic(gateAudio: HTMLAudioElement | null, src: string) {
  const el = gateAudioElement(gateAudio, src);
  el.loop = true;
  el.volume = 0.85;
  if (el.paused) {
    void el.play().catch((error) => {
      if (import.meta.env.DEV) console.warn('[music] gate continue failed:', src, error);
    });
  }
}
