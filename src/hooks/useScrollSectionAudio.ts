import { useEffect } from 'react';
import { startScrollSectionMusicObserver } from '../lib/sectionMusicObserver';

/** Gate ke baad scroll-section observer (aapke vanilla script jaisa). */
export function useScrollSectionAudio(enabled: boolean) {
  useEffect(() => startScrollSectionMusicObserver(enabled), [enabled]);
}
