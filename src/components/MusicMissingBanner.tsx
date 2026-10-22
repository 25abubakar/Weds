import { useEffect, useState } from 'react';
import { getMusicTracks } from '../config/musicTracks';

/** Dev hint when MP3 files are not on disk yet (404). */
export function MusicMissingBanner() {
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const gateUrl = getMusicTracks().gate;
    if (!gateUrl) return;

    let cancelled = false;
    void fetch(gateUrl, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setMissing(!res.ok);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!missing) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[200] mx-auto max-w-lg rounded-xl border border-amber-300/80 bg-amber-50/95 px-4 py-3 text-left text-xs text-amber-950 shadow-lg backdrop-blur-sm"
      role="status"
    >
      <p className="font-semibold mb-1">Music files missing</p>
      <p>
        Copy your 14 MP3s into{' '}
        <code className="rounded bg-amber-100 px-1">public/music/</code> (see{' '}
        <code className="rounded bg-amber-100 px-1">14-FILES-LIST.txt</code>). Start with{' '}
        <code className="rounded bg-amber-100 px-1">Screengate.mp3</code> +{' '}
        <code className="rounded bg-amber-100 px-1">hero.mp3</code>, then refresh.
      </p>
    </div>
  );
}
