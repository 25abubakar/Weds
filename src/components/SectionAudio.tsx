import { useMemo } from 'react';
import { getMusicTracks, type MusicSectionId } from '../config/musicTracks';
import { SECTION_MUSIC_MANIFEST } from '../config/sectionMusicManifest';

type SectionAudioProps = {
  section: MusicSectionId;
  isActiveSlide?: boolean;
};

function isVideoSoundSrc(src: string) {
  return /\.(mov|mp4|webm|m4v)(\?|$)/i.test(src);
}

export function SectionAudio({ section, isActiveSlide }: SectionAudioProps) {
  const src = useMemo(() => getMusicTracks()[section], [section]);
  const audioId = useMemo(() => {
    const fromManifest = SECTION_MUSIC_MANIFEST.find((e) => e.sectionId === section)?.audioDomId;
    if (fromManifest) return fromManifest;
    return section === 'scratch' ? 'audio-scratch' : `audio-${section}`;
  }, [section]);

  if (!src) return null;

  if (isVideoSoundSrc(src)) {
    return (
      <video
        id={audioId}
        className="section-audio sr-only"
        data-section-audio={section}
        data-active-slide={isActiveSlide ? 'true' : undefined}
        src={src}
        loop
        playsInline
        preload="auto"
        aria-hidden
        tabIndex={-1}
      />
    );
  }

  return (
    <audio
      id={audioId}
      className="section-audio sr-only"
      data-section-audio={section}
      data-active-slide={isActiveSlide ? 'true' : undefined}
      src={src}
      loop
      preload="auto"
    />
  );
}
