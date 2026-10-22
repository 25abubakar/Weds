import type { MusicSectionId } from './musicTracks';

/** 14 sections — jis order par page scroll hota hai. Aap har file capture karke isi naam se save karein. */
export type SectionMusicEntry = {
  order: number;
  sectionId: MusicSectionId;
  sectionDomId: string;
  audioDomId: string;
  fileName: string;
  labelEn: string;
  labelUr: string;
};

export const SECTION_MUSIC_MANIFEST: SectionMusicEntry[] = [
  {
    order: 1,
    sectionId: 'gate',
    sectionDomId: 'gate-section',
    audioDomId: 'audio-gate',
    fileName: 'Screengate.mp3',
    labelEn: 'Gate (click to open)',
    labelUr: 'Gate — click par',
  },
  {
    order: 2,
    sectionId: 'hero',
    sectionDomId: 'hero-section',
    audioDomId: 'audio-hero',
    fileName: 'Welcome page.mp3',
    labelEn: 'Hero / Walima names screen',
    labelUr: 'Hero — Welcome page sound',
  },
  {
    order: 3,
    sectionId: 'welcome',
    sectionDomId: 'welcome-section',
    audioDomId: 'audio-welcome',
    fileName: 'welcome.mp3',
    labelEn: 'Optional (ab welcome + scratch ek section mein)',
    labelUr: 'Reserved',
  },
  {
    order: 4,
    sectionId: 'scratch',
    sectionDomId: 'scratch-section',
    audioDomId: 'audio-scratch',
    fileName: 'Scratch here.mp3',
    labelEn: 'Welcome text + scratch card (full screen block)',
    labelUr: 'Welcome + scratch screen',
  },
  {
    order: 5,
    sectionId: 'slide-1',
    sectionDomId: 'slideshow-section',
    audioDomId: 'audio-slide-1',
    fileName: 'slide-1.mp3',
    labelEn: 'Slideshow — photo 1',
    labelUr: 'Slideshow pehli slide',
  },
  {
    order: 6,
    sectionId: 'slide-2',
    sectionDomId: 'slideshow-section',
    audioDomId: 'audio-slide-2',
    fileName: 'slide-2.mp3',
    labelEn: 'Slideshow — photo 2',
    labelUr: 'Slideshow doosri slide',
  },
  {
    order: 7,
    sectionId: 'slide-3',
    sectionDomId: 'slideshow-section',
    audioDomId: 'audio-slide-3',
    fileName: 'slide-3.mp3',
    labelEn: 'Slideshow — photo 3',
    labelUr: 'Slideshow teesri slide',
  },
  {
    order: 8,
    sectionId: 'countdown',
    sectionDomId: 'countdown-section',
    audioDomId: 'audio-countdown',
    fileName: 'countdown.mp3',
    labelEn: 'Countdown',
    labelUr: 'Countdown',
  },
  {
    order: 9,
    sectionId: 'details',
    sectionDomId: 'details-section',
    audioDomId: 'audio-details',
    fileName: 'details.mp3',
    labelEn: 'Date, time, venue',
    labelUr: 'Details / venue',
  },
  {
    order: 10,
    sectionId: 'map',
    sectionDomId: 'map-section',
    audioDomId: 'audio-map',
    fileName: 'map.mp3',
    labelEn: 'Map / location',
    labelUr: 'Map',
  },
  {
    order: 11,
    sectionId: 'dress-code',
    sectionDomId: 'dress-code-section',
    audioDomId: 'audio-dress-code',
    fileName: 'dress-code.mp3',
    labelEn: 'Dress code',
    labelUr: 'Dress code',
  },
  {
    order: 12,
    sectionId: 'rsvp',
    sectionDomId: 'rsvp-section',
    audioDomId: 'audio-rsvp',
    fileName: 'rsvp.mp3',
    labelEn: 'RSVP form',
    labelUr: 'RSVP',
  },
  {
    order: 13,
    sectionId: 'closing',
    sectionDomId: 'closing-section',
    audioDomId: 'audio-closing',
    fileName: 'closing.mp3',
    labelEn: 'Closing / thank you',
    labelUr: 'Closing',
  },
  {
    order: 14,
    sectionId: 'footer',
    sectionDomId: 'footer-section',
    audioDomId: 'audio-footer',
    fileName: 'Footer.mov',
    labelEn: 'Slideshow → end of page (footer zone)',
    labelUr: 'Footer — slideshow se end tak',
  },
];
