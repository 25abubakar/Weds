import { useEffect, useRef, useState } from 'react';

type GateOverlayProps = {
  gateVideo: string;
  previewImage: string;
  onOpen: () => void;
};

export function GateOverlay({ gateVideo, previewImage, onOpen }: GateOverlayProps) {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'revealed'>('idle');
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setPhase('revealed');
      window.setTimeout(() => onOpenRef.current(), 700);
    };

    const onEnded = () => finish();

    const onTimeUpdate = () => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      if (video.currentTime / video.duration >= 0.92) finish();
    };

    video.addEventListener('ended', onEnded);
    video.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [gateVideo]);

  const handleOpen = () => {
    if (phase !== 'idle') return;
    finishedRef.current = false;
    setPhase('opening');
    videoRef.current?.play().catch(() => {});
  };

  const isOpening = phase === 'opening' || phase === 'revealed';
  const showWriting = phase === 'opening' || phase === 'revealed';
  const fadeVideo = phase === 'revealed';

  return (
    <div
      className={`gate-overlay-screen fixed inset-0 z-[100] gate-overlay-fade ${phase === 'revealed' ? 'gate-overlay-hidden' : ''}`}
      aria-hidden={phase === 'revealed'}
    >
      <div
        className={`gate-couple-bg ${isOpening ? 'gate-couple-bg-show' : ''}`}
        style={{ backgroundImage: `url(${previewImage})` }}
        aria-hidden
      />
      <div className={`gate-couple-bg-shade ${isOpening ? 'gate-couple-bg-shade-open' : ''}`} aria-hidden />

      <video
        ref={videoRef}
        src={gateVideo}
        className={`gate-video-fullscreen ${fadeVideo ? 'gate-video-fade-out' : ''}`}
        muted
        playsInline
        preload="auto"
      />

      <div className={`gate-hero-writing ${showWriting ? 'gate-hero-writing-show' : ''}`}>
        <p className="font-amiri text-2xl sm:text-4xl leading-relaxed text-[#e8d0a0] mb-3 drop-shadow-lg">
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
        <p className="uppercase tracking-[0.35em] text-[11px] sm:text-xs text-[#f0dcc8] font-montserrat mb-3">
          We are getting married
        </p>
        <p className="uppercase tracking-[0.35em] text-[10px] sm:text-xs text-[#f0dcc8] font-montserrat font-semibold">
          Together With Their Families
        </p>
      </div>

      <button
        type="button"
        onClick={handleOpen}
        disabled={phase !== 'idle'}
        className="absolute inset-0 z-40 cursor-pointer border-0 bg-transparent disabled:cursor-default"
        aria-label="Open the gate"
      >
        {phase === 'idle' && (
          <span className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-5 py-2.5 text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white font-montserrat backdrop-blur-sm shadow-lg">
            Click to open the gate
          </span>
        )}
      </button>
    </div>
  );
}
