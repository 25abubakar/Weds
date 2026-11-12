import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_MS = 1500;
const TRANSITION_MS = 380;

type StackedPhotoDeckProps = {
  slides: string[];
  id?: string;
  className?: string;
};

function mod(n: number, len: number) {
  return ((n % len) + len) % len;
}

export function StackedPhotoDeck({ slides, id, className = '' }: StackedPhotoDeckProps) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const busyRef = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      if (slides.length < 2 || busyRef.current) return;
      busyRef.current = true;
      setAnimating(true);
      setActive((i) => mod(i + delta, slides.length));
      window.setTimeout(() => {
        setAnimating(false);
        busyRef.current = false;
      }, TRANSITION_MS);
    },
    [slides.length]
  );

  const goTo = useCallback(
    (index: number) => {
      if (slides.length < 2 || busyRef.current || index === active) return;
      busyRef.current = true;
      setAnimating(true);
      setActive(index);
      window.setTimeout(() => {
        setAnimating(false);
        busyRef.current = false;
      }, TRANSITION_MS);
    },
    [active, slides.length]
  );

  const goNext = useCallback(() => go(1), [go]);
  const goPrev = useCallback(() => go(-1), [go]);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(goNext, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [goNext, slides.length]);

  if (slides.length === 0) return null;

  const offsets = [-1, 0, 1] as const;

  return (
    <section className={`fan-carousel ${className}`.trim()} id={id} aria-roledescription="carousel">
      <div className={`fan-carousel__shell ${animating ? 'fan-carousel__shell--motion' : ''}`}>
        <div className="fan-carousel__pill" role="tablist" aria-label="Photo gallery">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Photo ${i + 1} of ${slides.length}`}
              className={i === active ? 'fan-carousel__pill-dot fan-carousel__pill-dot--on' : 'fan-carousel__pill-dot'}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <div
          className="fan-carousel__stage"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(dx) < 48) return;
            if (dx < 0) goNext();
            else goPrev();
          }}
        >
          {offsets.map((offset) => {
            const slideIndex = mod(active + offset, slides.length);
            const isCenter = offset === 0;
            const posKey = offset === 0 ? '0' : offset < 0 ? 'l' : 'r';

            const handleClick = () => {
              if (offset < 0) goPrev();
              else if (offset > 0) goNext();
            };

            const card = (
              <>
                <img
                  src={slides[slideIndex]}
                  alt={isCenter ? 'Walima celebration photo' : ''}
                  className="fan-carousel__img"
                  draggable={false}
                />
                <div className="fan-carousel__card-shade" aria-hidden="true" />
              </>
            );

            if (isCenter) {
              return (
                <div
                  key={posKey}
                  className="fan-carousel__card fan-carousel__card--center"
                  aria-live="polite"
                >
                  {card}
                </div>
              );
            }

            return (
              <button
                key={posKey}
                type="button"
                className={`fan-carousel__card fan-carousel__card--side fan-carousel__card--side-${posKey}`}
                onClick={handleClick}
                aria-label={offset < 0 ? 'Previous photo' : 'Next photo'}
              >
                {card}
              </button>
            );
          })}

          <div className="fan-carousel__nav">
            <button type="button" className="fan-carousel__nav-btn" onClick={goPrev} aria-label="Previous">
              ‹
            </button>
            <button type="button" className="fan-carousel__nav-btn" onClick={goNext} aria-label="Next">
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
