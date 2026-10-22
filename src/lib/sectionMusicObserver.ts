/**
 * Section music: hero → scratch → footer zone (slideshow se end).
 * Scroll par glitch na ho — sirf section badle tab switch; same track chalta rahe.
 */

export const SECTION_MUSIC_THRESHOLD = 0.32;
export const SECTION_MUSIC_EXIT_THRESHOLD = 0.18;
export const FOOTER_SOUND_ZONE_ID = 'footer-sound-zone';
export const SCROLL_MUSIC_SKIP_SECTION_IDS = new Set(['gate-section']);

const MAIN_MUSIC_SECTION_IDS = [
  'hero-section',
  'scratch-section',
  FOOTER_SOUND_ZONE_ID,
] as const;

let activeSectionDomId: string | null = null;
let syncScheduled = false;

export function pauseAllAudios() {
  document.querySelectorAll('audio').forEach((el) => {
    (el as HTMLAudioElement).pause();
  });
  document.querySelectorAll('video.section-audio').forEach((el) => {
    (el as HTMLVideoElement).pause();
  });
}

function pauseOtherMainSectionMedia(keepSectionDomId: string) {
  for (const id of MAIN_MUSIC_SECTION_IDS) {
    if (id === keepSectionDomId) continue;
    const section = document.getElementById(id);
    if (!section) continue;
    section.querySelectorAll('audio.section-audio, video.section-audio').forEach((el) => {
      (el as HTMLMediaElement).pause();
    });
  }
}

/** Gate tap par call karein — baad mein hero/scratch/footer autoplay policy pass ho jati hai. */
export function unlockSectionAudioForUserGesture() {
  document.querySelectorAll('audio.section-audio, video.section-audio').forEach((el) => {
    const media = el as HTMLMediaElement;
    if (!media.src) return;

    const prevVolume = media.volume > 0 ? media.volume : 0.85;
    const isGate = media.id === 'audio-gate';

    media.volume = 0;
    if (media instanceof HTMLVideoElement) {
      media.muted = false;
    }

    void media
      .play()
      .then(() => {
        if (!isGate) {
          media.pause();
          media.currentTime = 0;
        }
        media.volume = prevVolume;
      })
      .catch(() => {
        media.volume = prevVolume;
      });
  });
}

function playMediaEl(media: HTMLMediaElement) {
  if (!media.src) return;
  media.volume = media.volume > 0 ? media.volume : 0.85;
  if (media instanceof HTMLVideoElement) {
    media.muted = false;
  }
  if (!media.paused && media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return;
  }
  void media.play().catch(() => {});
}

export function playSectionAudioElement(section: Element) {
  const audio = section.querySelector('audio.section-audio') as HTMLAudioElement | null;
  const video = section.querySelector('video.section-audio') as HTMLVideoElement | null;

  if (audio?.src) {
    playMediaEl(audio);
    return;
  }

  if (!video?.src) return;

  const startVideo = () => playMediaEl(video);
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
    startVideo();
    return;
  }
  if (video.dataset.loadRequested !== '1') {
    video.dataset.loadRequested = '1';
    video.addEventListener('canplay', startVideo, { once: true });
    video.load();
  } else {
    video.addEventListener('canplay', startVideo, { once: true });
  }
}

function switchToSectionMusic(sectionDomId: string) {
  const section = document.getElementById(sectionDomId);
  if (!section) return;

  if (activeSectionDomId === sectionDomId) {
    playSectionAudioElement(section);
    return;
  }

  activeSectionDomId = sectionDomId;
  pauseOtherMainSectionMedia(sectionDomId);
  playSectionAudioElement(section);
}

/** Gate ke baad ya scroll par kisi section ki music start karein. */
export function playSectionByDomId(sectionDomId: string) {
  switchToSectionMusic(sectionDomId);
}

function visibleRatio(section: Element): number {
  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight;
  if (rect.height <= 0) return 0;
  const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  if (visiblePx <= 0) return 0;
  return visiblePx / Math.min(rect.height, vh);
}

/** Lamba footer zone — screen par kitna hissa footer ka hai (0–1). */
function footerViewportFraction(zone: Element): number {
  const rect = zone.getBoundingClientRect();
  const vh = window.innerHeight;
  const visiblePx = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  if (visiblePx <= 0) return 0;
  return visiblePx / vh;
}

function sectionQualifies(sectionDomId: string, section: Element): boolean {
  const minRatio =
    activeSectionDomId === sectionDomId
      ? SECTION_MUSIC_EXIT_THRESHOLD
      : SECTION_MUSIC_THRESHOLD;

  if (sectionDomId === FOOTER_SOUND_ZONE_ID) {
    return footerViewportFraction(section) >= minRatio;
  }
  return visibleRatio(section) >= minRatio;
}

function distanceToViewportCenter(section: Element): number {
  const rect = section.getBoundingClientRect();
  const center = (rect.top + rect.bottom) / 2;
  return Math.abs(center - window.innerHeight / 2);
}

/** Jis section ka focus viewport center ke qareeb ho, wahi track — scroll ke darmiyan restart nahi. */
function pickMainMusicSectionId(): string | null {
  let bestId: string | null = null;
  let bestDistance = Infinity;

  for (const id of MAIN_MUSIC_SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el || !sectionQualifies(id, el)) continue;

    const dist = distanceToViewportCenter(el);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestId = id;
    }
  }

  return bestId;
}

export function isSectionHalfVisible(section: Element): boolean {
  return visibleRatio(section) >= SECTION_MUSIC_THRESHOLD;
}

export function syncFirstVisibleSectionAudio() {
  const winner = pickMainMusicSectionId();
  if (!winner) return;

  if (
    activeSectionDomId &&
    winner !== activeSectionDomId &&
    sectionQualifies(activeSectionDomId, document.getElementById(activeSectionDomId)!)
  ) {
    const currentEl = document.getElementById(activeSectionDomId);
    const winnerEl = document.getElementById(winner);
    if (currentEl && winnerEl) {
      const currentDist = distanceToViewportCenter(currentEl);
      const newDist = distanceToViewportCenter(winnerEl);
      if (newDist >= currentDist - 56) {
        switchToSectionMusic(activeSectionDomId);
        return;
      }
    }
  }

  switchToSectionMusic(winner);
}

function scheduleSyncSectionAudio() {
  if (syncScheduled) return;
  syncScheduled = true;
  requestAnimationFrame(() => {
    syncScheduled = false;
    syncFirstVisibleSectionAudio();
  });
}

export function startScrollSectionMusicObserver(enabled: boolean): () => void {
  if (!enabled) return () => {};

  activeSectionDomId = null;

  const onIntersect = () => scheduleSyncSectionAudio();

  const observer = new IntersectionObserver(onIntersect, {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.85, 1],
  });

  document.querySelectorAll('.scroll-section').forEach((section) => {
    if (SCROLL_MUSIC_SKIP_SECTION_IDS.has(section.id)) return;
    observer.observe(section);
  });

  let scrollTimer = 0;
  const onScroll = () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(scheduleSyncSectionAudio, 100);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  const initialTimer = window.setTimeout(scheduleSyncSectionAudio, 120);

  return () => {
    window.clearTimeout(initialTimer);
    window.clearTimeout(scrollTimer);
    window.removeEventListener('scroll', onScroll);
    observer.disconnect();
    activeSectionDomId = null;
    syncScheduled = false;
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
  void el.play().catch(() => {});
}

export function continueGateMusic(gateAudio: HTMLAudioElement | null, src: string) {
  const el = gateAudioElement(gateAudio, src);
  el.loop = true;
  el.volume = 0.85;
  if (el.paused) void el.play().catch(() => {});
}
