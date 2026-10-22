import { useState, useEffect, useRef } from 'react';
import Countdown from 'react-countdown';
import { MapPin, Clock, Navigation, Users, ChevronDown, Shirt } from 'lucide-react';
import Confetti from 'react-confetti';

const config = {
  siteUrl: 'https://abubakarndumar.abubakar-devv.workers.dev',
  gateImage: '/gate.jpg',
  groomPortraitImage: '/hero.jpg',
  heroImage: '/hero.jpg',
  family: { fatherName: 'Ayaz Hussain', phone: '03330613735' },
  couple1: {
    groom: { name: 'Muhammad Abubakar', parent: 'S/o Ayaz Hussain' },
    bride: { parentName: 'Muhammad Abid' },
  },
  couple2: {
    groom: { name: 'Muhammad Umar', parent: 'S/o Ayaz Hussain' },
    bride: { parentName: 'Ghulam Hussain' },
  },
  event: {
    date: '5 December 2026',
    dateShort: '5 Dec 2026',
    day: 'Saturday',
    time: '7:30 PM',
    targetDate: '2026-12-05T19:30:00',
    inshaAllah: 'IN SHA ALLAH',
  },
  schedule: [
    {
      time: '7:00 PM',
      title: 'Guest Arrival',
      detail: 'Welcoming our honorable guests to the venue',
    },
    {
      time: '7:30 PM',
      title: 'Walima Ceremony',
      detail: 'Welcoming the newlyweds & post-wedding celebrations',
    },
    {
      time: '8:00 PM',
      title: 'Dinner / Reception',
      detail: 'Festive feast & celebration with family',
    },
  ],
  slides: ['/slides/slide-1.jpg', '/slides/slide-2.jpg', '/hero.jpg'],
  venue: {
    name: 'Galaxy Marriage Lawn',
    area: 'Dera Ismail Khan',
    address: 'Grid Road, Dera Ismail Khan, KPK',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3310.744!2d70.899029!3d31.845421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzHCsDUwJzQzLjUiTiA3MMKwNTMnNTYuNSJF!5e0!3m2!1sen!2s!4v1725366600000!5m2!1sen!2s',
    googleMapsLink: 'https://maps.app.goo.gl/KoBMzAeRw2UC6NLb7',
  },
  lookingForward: [
    { name: 'Mudassir Hameed', phone: '03339958576' },
    { name: 'Hafiz Muhammad Muzamil' },
    { name: 'Muhammad Zakwan' },
  ],
  dressCode: {
    men: 'Suit / Traditional Formal Attire',
    women: 'Modest & Elegant Formal Attire',
  },
  reception: 'All Family Members & Relatives',
};

function SectionHeart() {
  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="h-8 w-px bg-gradient-to-b from-transparent via-[#c9a96e] to-[#c9a96e]" />
      <span className="text-2xl text-[#b87a7a] drop-shadow-sm">♥</span>
      <div className="h-8 w-px bg-gradient-to-b from-[#c9a96e] via-[#c9a96e] to-transparent" />
    </div>
  );
}

function GateOverlay({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 1300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#1a1410] gate-overlay-fade ${opening ? 'gate-overlay-hidden' : ''}`}
      aria-hidden={opening}
    >
      <div className={`gate-panel gate-panel-left ${opening ? 'gate-panel-open-left' : ''}`}>
        <img src={config.gateImage} alt="" className="gate-panel-image gate-panel-image-left" />
      </div>
      <div className={`gate-panel gate-panel-right ${opening ? 'gate-panel-open-right' : ''}`}>
        <img src={config.gateImage} alt="" className="gate-panel-image gate-panel-image-right" />
      </div>
      {!opening && (
        <button
          type="button"
          onClick={handleOpen}
          className="absolute inset-0 z-30 cursor-pointer border-0 bg-transparent"
          aria-label="Click to open the gate"
        >
          <span className="absolute bottom-[12%] left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-5 py-2.5 text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white font-montserrat backdrop-blur-sm shadow-lg">
            Click to open the gate
          </span>
        </button>
      )}
    </div>
  );
}

function CouplePairBlock({
  groomName,
  groomParent,
  brideParentName,
}: {
  groomName: string;
  groomParent: string;
  brideParentName: string;
}) {
  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-[#c9a96e]/45 bg-black/30 backdrop-blur-[2px] p-4 sm:p-5 shadow-lg">
      <InvitePersonCard variant="groom" name={groomName} subtitle={groomParent} />
      <p className="font-great-vibes text-xl sm:text-2xl text-[#e8d0a0] my-4 italic text-center">
        with the daughter of
      </p>
      <InvitePersonCard variant="bride" badge="Daughter of" name={brideParentName} />
    </div>
  );
}

function InvitePersonCard({
  badge,
  name,
  subtitle,
  variant,
}: {
  badge?: string;
  name: string;
  subtitle?: string;
  variant: 'groom' | 'bride';
}) {
  const ornament = variant === 'groom' ? '❧' : '♥';
  return (
    <div className="w-full max-w-[220px] sm:max-w-none mx-auto">
      <div className="relative rounded-2xl border-2 border-[#d4b896] bg-gradient-to-b from-[#fffcf7] via-[#fdf4e7] to-[#f8ead8] px-4 py-5 sm:px-5 sm:py-6 shadow-[0_8px_24px_rgba(122,79,45,0.08)]">
        <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a96e] to-transparent" />
        <div className="pointer-events-none absolute -inset-px rounded-2xl border border-white/60" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-[#e8d0a0] bg-[#fdf8f0] px-3 py-0.5 shadow-sm">
          <span className="text-[#c9a96e] text-sm leading-none">{ornament}</span>
        </div>
        {badge ? (
          <p className="mt-1 uppercase tracking-[0.22em] text-[10px] sm:text-[11px] text-[#9b7856] font-semibold">
            {badge}
          </p>
        ) : (
          <div className="mt-1 h-[14px] sm:h-[15px]" aria-hidden />
        )}
        <p className="font-great-vibes text-[1.65rem] sm:text-4xl text-[#7a4f2d] leading-snug mt-2 px-1">
          {name}
        </p>
        <div className="flex items-center gap-2 justify-center mt-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#e8d0a0]" />
          <span className="text-[#c9a96e] text-[10px]">{ornament}</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#e8d0a0]" />
        </div>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#6b5344] mt-2 font-montserrat">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function AmpersandDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="font-great-vibes text-4xl sm:text-6xl text-[#c9a96e] drop-shadow-sm">&</span>
    </div>
  );
}

function ScratchDateContent() {
  return (
    <>
      <p className="font-montserrat text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#9b7856] mb-1">
        You&apos;re Invited
      </p>
      <p className="font-great-vibes text-2xl sm:text-3xl text-[#7a4f2d] leading-tight">{config.event.date}</p>
      <p className="font-montserrat text-xs sm:text-sm text-gray-600 mt-1 tracking-widest uppercase">
        {config.event.day} &nbsp;|&nbsp; {config.event.time}
      </p>
      <p className="font-montserrat text-[10px] sm:text-xs text-[#c9a96e] mt-1 tracking-wide">
        {config.event.inshaAllah}
      </p>
    </>
  );
}

// ─── Scratch Card ─────────────────────────────────────────────────
const SCRATCH_REVEAL_RATIO = 0.45;

const ScratchCard = ({
  isRevealed,
  setIsRevealed,
}: {
  isRevealed: boolean;
  setIsRevealed: (v: boolean) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cardSize, setCardSize] = useState({ width: 320, height: 160 });

  const syncCanvasSize = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const { width, height } = container.getBoundingClientRect();
    const w = Math.max(1, Math.floor(width));
    const h = Math.max(1, Math.floor(height));
    setCardSize({ width: w, height: h });

    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#b6a598';
    ctx.fillRect(0, 0, w, h);
    ctx.font = 'bold 16px Montserrat, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ Scratch to Reveal ✦', w / 2, h / 2);
  };

  useEffect(() => {
    if (isRevealed) return;
    syncCanvasSize();
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => syncCanvasSize());
    ro.observe(container);
    return () => ro.disconnect();
  }, [isRevealed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDrawing = false;
    let framePending = false;

    const checkReveal = () => {
      framePending = false;
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) return;
      const pixels = ctx.getImageData(0, 0, w, h).data;
      let transparent = 0;
      const step = 16;
      for (let i = 3; i < pixels.length; i += 4 * step) if (pixels[i] === 0) transparent++;
      const sampled = pixels.length / 4 / step;
      if (transparent / sampled > SCRATCH_REVEAL_RATIO) setIsRevealed(true);
    };

    const scratchAt = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();
      if (!framePending) {
        framePending = true;
        requestAnimationFrame(checkReveal);
      }
    };

    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      if (e instanceof TouchEvent) {
        e.preventDefault();
        for (const touch of Array.from(e.touches)) scratchAt(touch.clientX, touch.clientY);
      } else {
        scratchAt(e.clientX, e.clientY);
      }
    };

    const start = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      scratch(e);
    };
    const stop = () => (isDrawing = false);

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mouseleave', stop);
    canvas.addEventListener('mousemove', scratch as EventListener);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchend', stop);
    canvas.addEventListener('touchmove', scratch as EventListener, { passive: false });
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mouseleave', stop);
      canvas.removeEventListener('mousemove', scratch as EventListener);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchend', stop);
      canvas.removeEventListener('touchmove', scratch as EventListener);
    };
  }, [isRevealed, setIsRevealed]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-sm h-40 sm:h-44 mx-auto my-8 overflow-hidden rounded-2xl shadow-xl border-2 border-[#c9a96e] bg-[#fdf8f0]"
    >
      {isRevealed && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
          <Confetti width={cardSize.width} height={cardSize.height} recycle={false} numberOfPieces={220} />
        </div>
      )}

      {/* Date stays fixed in the center — visible while scratching and after reveal */}
      <div className="absolute inset-0 z-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <ScratchDateContent />
      </div>

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-10 cursor-pointer transition-opacity duration-500 ease-out ${
          isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ touchAction: 'none' }}
        aria-hidden={isRevealed}
      />
    </div>
  );
};

// ─── Countdown Renderer ────────────────────────────────────────────
const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    return (
      <p className="font-great-vibes text-3xl text-[#7a4f2d] mt-4">
        The celebration has begun! 🎉
      </p>
    );
  }
  return (
    <div className="flex gap-4 sm:gap-6 justify-center items-end mt-6 flex-wrap">
      {[
        { label: 'Days', value: days },
        { label: 'Hours', value: hours },
        { label: 'Mins', value: minutes },
        { label: 'Secs', value: seconds },
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center shadow-md border border-[#e8d9c5]">
            <span className="font-playfair text-2xl sm:text-3xl text-[#7a4f2d] font-bold">
              {String(item.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-xs uppercase mt-2 tracking-widest text-[#9b7856] font-montserrat">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Main App ──────────────────────────────────────────────────────
export default function App() {
  const [gateOpen, setGateOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % config.slides.length),
      3500
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = gateOpen ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [gateOpen]);

  const groomShort = `${config.couple1.groom.name.split(' ').pop()} & ${config.couple2.groom.name.split(' ').pop()}`;

  return (
    <div className="min-h-screen" style={{ background: '#fdf8f0', fontFamily: 'Montserrat, sans-serif' }}>
      {!gateOpen && <GateOverlay onOpen={() => setGateOpen(true)} />}

      {/* ── Hero (reference-style intro) ─────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden">
        <img
          src={config.heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/70" />

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center px-2">
          <p className="font-amiri text-2xl sm:text-3xl leading-relaxed text-[#e8d0a0] mb-3">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="uppercase tracking-[0.35em] text-[11px] sm:text-xs text-[#f0dcc8] font-montserrat mb-5">
            We are getting married
          </p>

          <div className="mx-auto mb-6 w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-full overflow-hidden border-4 border-[#c9a96e] shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-2 ring-[#c9a96e]/30">
            <img
              src={config.groomPortraitImage}
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>

          <p className="uppercase tracking-[0.35em] text-[10px] sm:text-xs text-[#f0dcc8] mb-2 font-montserrat font-semibold">
            Together With Their Families
          </p>
          <p className="font-montserrat text-sm text-[#fdf4e7] mb-3 font-medium">
            Sons of {config.family.fatherName}
          </p>
          <p className="uppercase tracking-[0.22em] text-[10px] sm:text-xs text-[#e8d0a0] mb-2 font-montserrat max-w-lg">
            You Are Cordially Invited To The Walima Ceremony Of
          </p>

          <div className="flex items-center gap-3 my-5 w-full max-w-sm mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a96e]/80" />
            <span className="text-[#c9a96e] text-lg">❧</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a96e]/80" />
          </div>

          <div className="w-full max-w-5xl mx-auto my-2 flex flex-col items-center gap-6 lg:flex-row lg:justify-center lg:items-center lg:gap-3">
            <CouplePairBlock
              groomName={config.couple1.groom.name}
              groomParent={config.couple1.groom.parent}
              brideParentName={config.couple1.bride.parentName}
            />
            <AmpersandDivider className="py-0 lg:px-2 shrink-0" />
            <CouplePairBlock
              groomName={config.couple2.groom.name}
              groomParent={config.couple2.groom.parent}
              brideParentName={config.couple2.bride.parentName}
            />
          </div>

        {/* Beginning of a beautiful journey */}
        <div className="mt-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="h-px w-12 bg-[#c9a96e]" />
            <span className="text-[#c9a96e]">♥</span>
            <div className="h-px w-12 bg-[#c9a96e]" />
          </div>
          <p className="uppercase tracking-[0.35em] text-xs text-[#f0dcc8] font-semibold">
            Beginning of a Beautiful Journey
          </p>
        </div>
        </div>

        <ChevronDown className="relative z-10 mt-10 h-8 w-8 text-[#e8d0a0]/80 animate-bounce" aria-hidden />
      </section>

      {/* ── Welcome (reference gradient block) ───────────── */}
      <section
        className="px-6 py-16 sm:py-20 text-center"
        style={{ background: 'linear-gradient(180deg, #6b5344 0%, #9b7856 35%, #f5e9d5 100%)' }}
      >
        <p className="max-w-xl mx-auto font-playfair text-sm sm:text-base italic leading-relaxed text-[#fdf8f0]">
          We are honored to welcome you to the Walima ceremony of{' '}
          <span className="font-semibold not-italic">{config.couple1.groom.name}</span> &{' '}
          <span className="font-semibold not-italic">{config.couple2.groom.name}</span>. As they begin
          their journey together in faith and love, we thank you for being part of this blessed occasion.
        </p>
      </section>

      {/* ── Date Scratch & Reveal ───────────────────────── */}
      <section
        className="py-16 sm:py-20 px-4 text-center"
        style={{ background: 'linear-gradient(180deg, #f5e9d5 0%, #fdf8f0 45%, #ffffff 100%)' }}
      >
        <h2 className="font-great-vibes text-3xl sm:text-4xl text-[#7a4f2d] mb-1">
          {isRevealed ? 'Our Forever Begins ✨' : 'Scratch to reveal date'}
        </h2>
        <SectionHeart />
        <p className="text-gray-400 text-sm font-montserrat mb-2 -mt-4">Use your finger or mouse to scratch</p>
        <ScratchCard isRevealed={isRevealed} setIsRevealed={setIsRevealed} />
      </section>

      {/* ── Slideshow ───────────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto h-[60vh] md:h-[75vh] relative overflow-hidden my-8 shadow-2xl rounded-3xl">
        {config.slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={slide} alt="Walima celebration" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          </div>
        ))}
        {/* Slide indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {config.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-6 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Countdown ──────────────────────────────────── */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(135deg, #f5e9d5 0%, #fdf8f0 100%)' }}>
        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="h-px w-10 bg-[#c9a96e]" />
          <span className="text-[#c9a96e]">♥</span>
          <div className="h-px w-10 bg-[#c9a96e]" />
        </div>
        <h2 className="font-playfair text-3xl text-[#7a4f2d] mb-1">Countdown to the Walima</h2>
        <p className="text-[#9b7856] text-sm font-montserrat mb-2">{config.event.date} · {config.event.time}</p>
        <Countdown date={new Date(config.event.targetDate)} renderer={renderer} />
      </section>

      {/* ── Venue & Schedule ───────────────────────────── */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-xs text-[#9b7856] mb-2 font-semibold">Walima Details</p>
          <h2 className="font-great-vibes text-5xl text-[#7a4f2d]">Walima Ceremony</h2>
          <div className="flex items-center gap-3 justify-center mt-4">
            <div className="h-px w-16 bg-[#c9a96e]" />
            <span className="text-[#c9a96e]">❧</span>
            <div className="h-px w-16 bg-[#c9a96e]" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* Schedule */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8d9c5] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#c9a96e] to-[#e8d0a0]" />
            <h3 className="font-playfair text-2xl text-[#7a4f2d] mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#c9a96e]" /> Schedule
            </h3>
            <ul className="space-y-6">
              {config.schedule.map((item, index) => (
                <li key={item.time} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                        index === 0 ? 'bg-[#c9a96e]' : index === 1 ? 'bg-[#7a4f2d]' : 'bg-[#9b7856]'
                      }`}
                    />
                    {index < config.schedule.length - 1 && (
                      <div className="w-px flex-1 bg-[#e8d9c5] mt-1" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold font-montserrat text-sm text-[#c9a96e] uppercase tracking-wide">
                      {item.time}
                    </p>
                    <p className="font-playfair text-lg text-[#7a4f2d]">{item.title}</p>
                    <p className="text-gray-400 text-sm">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Venue */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8d9c5] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#7a4f2d] to-[#c9a96e]" />
            <h3 className="font-playfair text-2xl text-[#7a4f2d] mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#c9a96e]" /> The Venue
            </h3>
            <p className="font-montserrat font-bold text-lg text-[#5a3e28] mb-1">{config.venue.name}</p>
            <p className="text-[#9b7856] text-sm font-montserrat mb-1 font-semibold">{config.venue.area}</p>
            <p className="text-gray-500 mb-6 font-playfair">{config.venue.address}</p>
            <a
              href={config.venue.googleMapsLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-montserrat text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #7a4f2d, #c9a96e)' }}
            >
              <Navigation className="w-4 h-4" /> Get Directions
            </a>

            {/* Looking Forward */}
            <div className="mt-6 pt-5 border-t border-[#e8d9c5]">
              <p className="uppercase tracking-widest text-xs text-[#9b7856] font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" /> Looking Forward
              </p>
              {config.lookingForward.map((person, i) => (
                <p key={i} className="font-playfair text-[#7a4f2d] text-sm leading-relaxed">
                  {person.phone ? (
                    <>
                      {person.name}{' '}
                      <a href={`tel:${person.phone}`} className="font-montserrat text-[#9b7856] hover:text-[#7a4f2d]">
                        ({person.phone})
                      </a>
                    </>
                  ) : (
                    person.name
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Map ────────────────────────────────────────── */}
      <section className="w-full h-[400px] px-4 pb-8 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-lg">
        <iframe
          src={config.venue.mapEmbedUrl}
          className="w-full h-full border-0 rounded-3xl"
          allowFullScreen
          loading="lazy"
          title="Venue Map"
        />
      </section>

      {/* ── Dress Code ─────────────────────────────────── */}
      <section className="py-16 px-4 max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shirt className="w-5 h-5 text-[#c9a96e]" />
          <h2 className="font-great-vibes text-4xl text-[#7a4f2d]">Dress Code</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 text-left">
          <div className="rounded-2xl border border-[#e8d9c5] bg-white p-6 shadow-sm">
            <h3 className="font-playfair text-lg text-[#7a4f2d] mb-2">Men</h3>
            <p className="font-montserrat text-sm text-gray-600">{config.dressCode.men}</p>
          </div>
          <div className="rounded-2xl border border-[#e8d9c5] bg-white p-6 shadow-sm">
            <h3 className="font-playfair text-lg text-[#7a4f2d] mb-2">Women</h3>
            <p className="font-montserrat text-sm text-gray-600">{config.dressCode.women}</p>
          </div>
        </div>
      </section>

      {/* ── RSVP ───────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="h-px w-10 bg-[#c9a96e]" />
          <span className="text-[#c9a96e]">♥</span>
          <div className="h-px w-10 bg-[#c9a96e]" />
        </div>
        <h2 className="font-playfair text-3xl text-[#7a4f2d] mb-1">RSVP</h2>
        <p className="text-gray-400 mb-8 font-montserrat text-sm">We can't wait to celebrate with you!</p>
        <form
          className="max-w-md mx-auto text-left space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            alert('✅ Thank you for your RSVP! We look forward to celebrating with you.');
          }}
        >
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 font-montserrat uppercase tracking-wide">
              Your Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-[#e8d9c5] rounded-xl focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 font-playfair"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 font-montserrat uppercase tracking-wide">
              Phone / WhatsApp
            </label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 border border-[#e8d9c5] rounded-xl focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 font-playfair"
              placeholder="0300 1234567"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 font-montserrat uppercase tracking-wide">
              Will you be attending?
            </label>
            <select className="w-full px-4 py-3 border border-[#e8d9c5] rounded-xl focus:outline-none focus:border-[#c9a96e] bg-white font-playfair">
              <option>Yes, I will attend</option>
              <option>Sorry, I cannot attend</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 font-montserrat uppercase tracking-wide">
              Message for the Couples
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-[#e8d9c5] rounded-xl focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20 font-playfair resize-none"
              placeholder="Write your warm wishes..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-xl text-white font-montserrat font-bold tracking-widest text-sm transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7a4f2d 0%, #c9a96e 100%)' }}
          >
            SEND RSVP
          </button>
        </form>
      </section>

      {/* ── Closing (reference-style) ──────────────────── */}
      <section className="py-14 px-4 text-center bg-[#fdf8f0]">
        <div className="flex items-center gap-3 justify-center mb-4 max-w-xs mx-auto">
          <div className="h-px flex-1 bg-[#c9a96e]/60" />
          <span className="text-[#c9a96e]">♥</span>
          <div className="h-px flex-1 bg-[#c9a96e]/60" />
        </div>
        <h2 className="font-great-vibes text-3xl sm:text-4xl text-[#7a4f2d] mb-3">
          We can&apos;t wait to celebrate with you!
        </h2>
        <p className="font-great-vibes text-2xl sm:text-3xl text-[#9b7856]">{groomShort}</p>
        <div className="flex items-center gap-3 justify-center mt-6 max-w-sm mx-auto">
          <div className="h-px flex-1 bg-[#c9a96e]/60" />
          <span className="text-[#c9a96e] text-xs">❧</span>
          <div className="h-px flex-1 bg-[#c9a96e]/60" />
        </div>
        <p className="font-montserrat text-xs tracking-widest text-[#9b7856] uppercase mt-6">
          {config.event.date} · {config.event.inshaAllah}
        </p>
      </section>

      {/* ── Footer / contact ───────────────────────────── */}
      <footer className="py-10 px-4 text-center" style={{ background: '#5a3e28' }}>
        <p className="font-montserrat text-[10px] uppercase tracking-[0.25em] text-[#c9a96e] mb-3">
          For Walima inquiries
        </p>
        <p className="font-playfair text-base sm:text-lg text-[#fdf4e7]">
          {config.family.fatherName}{' '}
          <a href={`tel:${config.family.phone}`} className="font-montserrat text-[#e8d0a0] hover:underline">
            ({config.family.phone})
          </a>
        </p>
        <div className="flex items-center gap-3 justify-center mt-6">
          <div className="h-px w-12 bg-[#c9a96e]/50" />
          <span className="text-[#c9a96e]">♥</span>
          <div className="h-px w-12 bg-[#c9a96e]/50" />
        </div>
        <p className="text-[#9b7856] text-xs mt-4 font-montserrat">Beginning of a Beautiful Journey</p>
      </footer>
    </div>
  );
}
