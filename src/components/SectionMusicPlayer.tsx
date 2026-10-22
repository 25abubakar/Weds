import { useScrollSectionAudio } from '../hooks/useScrollSectionAudio';

type SectionMusicPlayerProps = {
  enabled: boolean;
};

export function SectionMusicPlayer({ enabled }: SectionMusicPlayerProps) {
  useScrollSectionAudio(enabled);
  return null;
}
