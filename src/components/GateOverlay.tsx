import { useEffect, useRef, useState } from 'react';
import {
  continueGateMusic,
  startGateMusic,
  unlockSectionAudioForUserGesture,
} from '../lib/sectionMusicObserver';

/** Gate open animation kitni der (seconds) — zyada fast clip ko slow kar deta hai */
export const GATE_OPEN_MAX_SECONDS = 12;

function applyGateVideoPlaybackRate(video: HTMLVideoElement) {
  const d = video.duration;
  if (!d || !Number.isFinite(d) || d <= 0) return;
  const rate = d / GATE_OPEN_MAX_SECONDS;
  video.playbackRate = Math.min(4, Math.max(0.2, rate));
}

type GateOverlayProps = {
  /** Screen par dikhnay wali gate video (hamesha mute) */
  gateVideo: string;
  previewImage: string;
  /** Sirf is clip ka sound — video dikhai nahi deti (hidden) */
  gateSoundVideo?: string;
  gateMusic?: string;
  onOpen: () => void;
};

function captureVideoPoster(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const probe = document.createElement('video');
    probe.muted = true;
    probe.playsInline = true;
    probe.setAttribute('playsinline', '');
    probe.setAttribute('webkit-playsinline', 'true');
    probe.preload = 'auto';
    probe.src = src;

    const cleanup = () => {
      probe.removeAttribute('src');
      probe.load();
    };

    const fail = () => {
      cleanup();
      resolve(null);
    };

    probe.addEventListener('error', fail, { once: true });

    probe.addEventListener(
      'loadeddata',
      () => {
        probe.currentTime = 0.08;
      },
      { once: true }
    );

    probe.addEventListener(
      'seeked',
      () => {
        try {
          if (!probe.videoWidth || !probe.videoHeight) {
            fail();
            return;
          }
          const canvas = document.createElement('canvas');
          canvas.width = probe.videoWidth;
          canvas.height = probe.videoHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            fail();
            return;
          }
          ctx.drawImage(probe, 0, 0);
          const url = canvas.toDataURL('image/jpeg', 0.86);
          cleanup();
          resolve(url);
        } catch {
          fail();
        }
      },
      { once: true }
    );

    probe.load();
  });
}

export function GateOverlay({
  gateVideo,
  previewImage,
  gateSoundVideo,
  gateMusic,
  onOpen,
}: GateOverlayProps) {
  const useClipSound = Boolean(gateSoundVideo);
  const [phase, setPhase] = useState<'idle' | 'opening' | 'revealed'>('idle');
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gateSoundRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;
  const gateAudioRef = useRef<HTMLAudioElement | null>(null);
  const gateSoundStartedRef = useRef(false);
  const gateVisualStartedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    void captureVideoPoster(gateVideo).then((url) => {
      if (!cancelled && url) setPosterUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [gateVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');

    const primeFirstFrame = () => {
      try {
        video.pause();
        video.currentTime = 0.08;
      } catch {
        /* ignore */
      }
    };

    const onMeta = () => applyGateVideoPlaybackRate(video);

    video.addEventListener('loadeddata', primeFirstFrame, { once: true });
    video.addEventListener('loadedmetadata', onMeta);
    video.load();

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      gateSoundRef.current?.pause();
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
      video.removeEventListener('loadeddata', primeFirstFrame);
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [gateVideo]);

  useEffect(() => {
    if (!gateSoundVideo) return;

    const tryAutoplayClip = () => {
      const sound = gateSoundRef.current;
      if (!sound || phase !== 'idle') return;

      sound.muted = false;
      sound.volume = 1;
      sound.loop = true;
      sound.playsInline = true;
      sound.setAttribute('playsinline', '');
      sound.setAttribute('webkit-playsinline', 'true');

      if (!gateSoundStartedRef.current) {
        sound.currentTime = 0;
      }

      void sound
        .play()
        .then(() => {
          gateSoundStartedRef.current = true;
        })
        .catch(() => {
          /* mobile/desktop: bina tap ke block ho sakta hai — tap par chale ga */
        });
    };

    tryAutoplayClip();
    const sound = gateSoundRef.current;
    sound?.addEventListener('loadeddata', tryAutoplayClip, { once: true });
    sound?.addEventListener('canplaythrough', tryAutoplayClip, { once: true });

    const retry1 = window.setTimeout(tryAutoplayClip, 250);
    const retry2 = window.setTimeout(tryAutoplayClip, 900);

    return () => {
      sound?.removeEventListener('loadeddata', tryAutoplayClip);
      sound?.removeEventListener('canplaythrough', tryAutoplayClip);
      window.clearTimeout(retry1);
      window.clearTimeout(retry2);
    };
  }, [gateSoundVideo, phase]);

  useEffect(() => {
    if (!gateMusic || useClipSound) return;
    const audio = gateAudioRef.current;
    if (!audio || phase !== 'idle') return;

    const tryAutoplay = () => {
      audio.loop = true;
      audio.volume = 0.85;
      void audio
        .play()
        .then(() => {
          gateSoundStartedRef.current = true;
        })
        .catch(() => {});
    };

    if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      tryAutoplay();
      return;
    }

    audio.addEventListener('canplaythrough', tryAutoplay, { once: true });
    return () => audio.removeEventListener('canplaythrough', tryAutoplay);
  }, [gateMusic, phase, useClipSound]);

  const playGateClipSound = (restartFromBeginning: boolean) => {
    const sound = gateSoundRef.current;
    if (!sound) return;

    sound.muted = false;
    sound.volume = 1;

    if (restartFromBeginning && !gateSoundStartedRef.current) {
      sound.currentTime = 0;
      gateSoundStartedRef.current = true;
      void sound.play().catch(() => {});
      return;
    }

    gateSoundStartedRef.current = true;
    if (sound.paused) void sound.play().catch(() => {});
  };

  const playVisibleGateVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    applyGateVideoPlaybackRate(video);
    if (!gateVisualStartedRef.current) {
      video.currentTime = 0;
      gateVisualStartedRef.current = true;
    }
    void video.play().catch(() => {
      video.currentTime = 0;
      void video.play();
    });
  };

  const beginGateSoundOnTap = () => {
    if (phase !== 'idle') return;
    unlockSectionAudioForUserGesture();

    if (useClipSound) {
      playGateClipSound(!gateSoundStartedRef.current);
      return;
    }

    if (!gateMusic) return;
    if (gateSoundStartedRef.current) {
      continueGateMusic(gateAudioRef.current, gateMusic);
      return;
    }
    startGateMusic(gateAudioRef.current, gateMusic);
    gateSoundStartedRef.current = true;
  };

  const handleOpen = () => {
    if (phase !== 'idle') return;
    unlockSectionAudioForUserGesture();
    finishedRef.current = false;
    setPhase('opening');

    if (useClipSound) {
      playGateClipSound(!gateSoundStartedRef.current);
      playVisibleGateVideo();
      return;
    }

    if (gateMusic) {
      if (!gateSoundStartedRef.current) {
        startGateMusic(gateAudioRef.current, gateMusic);
        gateSoundStartedRef.current = true;
      } else {
        continueGateMusic(gateAudioRef.current, gateMusic);
      }
    }

    playVisibleGateVideo();
  };

  const isOpening = phase === 'opening' || phase === 'revealed';
  const showWriting = phase === 'opening' || phase === 'revealed';
  const fadeVideo = phase === 'revealed';
  const showIdlePoster = phase === 'idle' && posterUrl;

  return (
    <div
      id="gate-section"
      className={`scroll-section gate-overlay-screen fixed inset-0 z-[100] gate-overlay-fade ${phase === 'revealed' ? 'gate-overlay-hidden' : ''}`}
      aria-hidden={phase === 'revealed'}
    >
      {gateSoundVideo && (
        <video
          id="audio-gate"
          ref={gateSoundRef}
          className="section-audio sr-only"
          src={gateSoundVideo}
          autoPlay
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          aria-hidden
        />
      )}

      {gateMusic && !useClipSound && (
        <audio
          id="audio-gate"
          ref={gateAudioRef}
          className="section-audio sr-only"
          src={gateMusic}
          loop
          preload="auto"
        />
      )}

      <div
        className={`gate-couple-bg ${phase === 'idle' ? 'gate-couple-bg-idle' : ''} ${isOpening ? 'gate-couple-bg-show' : ''}`}
        style={{ backgroundImage: `url(${previewImage})` }}
        aria-hidden
      />
      <div className={`gate-couple-bg-shade ${isOpening ? 'gate-couple-bg-shade-open' : ''}`} aria-hidden />

      {showIdlePoster && (
        <img src={posterUrl} alt="" className="gate-idle-poster" aria-hidden />
      )}

      <video
        ref={videoRef}
        src={gateVideo}
        poster={posterUrl ?? undefined}
        className={`gate-video-fullscreen ${phase === 'idle' ? 'gate-video-idle' : ''} ${fadeVideo ? 'gate-video-fade-out' : ''}`}
        muted
        playsInline
        preload="auto"
      />

      <div className={`gate-hero-writing ${showWriting ? 'gate-hero-writing-show' : ''}`}>
        <p className="uppercase tracking-[0.35em] text-[11px] sm:text-xs text-[#f0dcc8] font-montserrat mb-3">
          We are getting married
        </p>
        <p className="uppercase tracking-[0.35em] text-[10px] sm:text-xs text-[#f0dcc8] font-montserrat font-semibold">
          Together With Their Families
        </p>
      </div>

      <button
        id="open-gate-btn"
        type="button"
        onPointerDown={beginGateSoundOnTap}
        onClick={handleOpen}
        disabled={phase !== 'idle'}
        className="absolute inset-0 z-40 cursor-pointer border-0 bg-transparent disabled:cursor-default"
        aria-label="Gate kholen / Open the gate"
      >
        {phase === 'idle' && (
          <span className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-5 py-2.5 text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white font-montserrat backdrop-blur-sm shadow-lg">
            Gate Kholen · Click to open
          </span>
        )}
      </button>
    </div>
  );
}
