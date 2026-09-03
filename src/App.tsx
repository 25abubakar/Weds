import { useState, useEffect, useRef } from 'react';
import Countdown from 'react-countdown';
import { MapPin, Clock, Navigation, Users } from 'lucide-react';
import Confetti from 'react-confetti';

const config = {
  couple1: {
    groom: { name: 'Muhammad Umar', parent: 'S/o Ayaz Hussain' },
    bride: { parentName: 'Muhammad Jan', relation: 'Daughter of' },
  },
  couple2: {
    groom: { name: 'Muhammad Abu Bakar', parent: 'S/o Ayaz Hussain' },
    bride: { parentName: 'Muhammad Abid', relation: 'Daughter of' },
  },
  event: {
    date: '5 December 2026',
    day: 'Saturday',
    time: '7:30 PM',
    targetDate: 'December 5, 2026 19:30:00',
  },
  slides: [
    'https://iqrash-weds-ayesha.pages.dev/slides/slide-1.jpg',
    'https://iqrash-weds-ayesha.pages.dev/slides/slide-2.jpg',
    'https://iqrash-weds-ayesha.pages.dev/slides/slide-3.jpg',
  ],
  venue: {
    name: 'Galaxy Marriage Hall',
    area: 'Grid Road Dera Ismail Khan',
    address: 'Grid Road, Dera Ismail Khan, KPK',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3307.0!2d70.902!3d31.833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDQ5JzU4LjgiTiA3MMKwNTQnMDcuMiJF!5e0!3m2!1sen!2s!4v1!5m2!1sen!2s',
    googleMapsLink: 'https://maps.google.com/?q=Galaxy+Marriage+Hall+Dera+Ismail+Khan',
  },
  lookingForward: ['Mudassir Hameed', 'Hafiz Muhammad Muzamil', 'Muhammad Zakwan'],
  reception: 'All Family Members & Relatives',
};

// ─── Scratch Card ─────────────────────────────────────────────────
const ScratchCard = ({
  isRevealed,
  setIsRevealed,
}: {
  isRevealed: boolean;
  setIsRevealed: (v: boolean) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#b6a598';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 18px Montserrat';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ Scratch to Reveal ✦', canvas.width / 2, canvas.height / 2);

    let isDrawing = false;
    const scratch = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 4) if (pixels[i] === 0) transparent++;
      if (transparent / (pixels.length / 4) > 0.5) setIsRevealed(true);
    };

    const start = () => (isDrawing = true);
    const stop = () => (isDrawing = false);
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('mousemove', scratch as EventListener);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('touchend', stop);
    canvas.addEventListener('touchmove', scratch as EventListener);
    return () => {
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('mouseup', stop);
      canvas.removeEventListener('mousemove', scratch as EventListener);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('touchend', stop);
      canvas.removeEventListener('touchmove', scratch as EventListener);
    };
  }, [isRevealed, setIsRevealed]);

  return (
    <div className="relative w-80 h-36 mx-auto my-8 overflow-hidden rounded-2xl shadow-xl border-2 border-[#c9a96e] bg-[#fdf8f0] flex flex-col items-center justify-center">
      {isRevealed && <Confetti width={300} height={140} recycle={false} numberOfPieces={250} />}
      <div className="text-center z-0 px-4">
        <p className="font-great-vibes text-3xl text-[#7a4f2d] leading-tight">{config.event.date}</p>
        <p className="font-montserrat text-sm text-gray-600 mt-1 tracking-widest uppercase">
          {config.event.day} &nbsp;|&nbsp; {config.event.time}
        </p>
        <p className="font-montserrat text-xs text-[#c9a96e] mt-1 tracking-wide">{config.venue.name}</p>
      </div>
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-pointer z-10"
          style={{ touchAction: 'none' }}
        />
      )}
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
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % config.slides.length),
      3500
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#fdf8f0', fontFamily: 'Montserrat, sans-serif' }}>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fdf8f0 0%, #f5e9d5 50%, #fdf8f0 100%)' }}
      >
        {/* Decorative corner flowers (SVG) */}
        <div className="absolute top-0 left-0 w-40 h-40 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }} />
        <div className="absolute top-0 right-0 w-40 h-40 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #c9a96e 0%, transparent 70%)' }} />

        {/* Top subtitle */}
        <p className="uppercase tracking-[0.4em] text-xs text-[#9b7856] mb-3 font-montserrat font-semibold">
          Together With Their Families
        </p>
        <p className="uppercase tracking-[0.25em] text-xs text-[#9b7856] mb-2 font-montserrat">
          You Are Cordially Invited To The Wedding Ceremony Of
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 w-full max-w-sm mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a96e]" />
          <span className="text-[#c9a96e] text-lg">❧</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a96e]" />
        </div>

        {/* Two Grooms */}
        <div className="grid grid-cols-3 items-center gap-4 w-full max-w-2xl mx-auto my-4">
          {/* Groom 1 */}
          <div className="text-center">
            <p className="uppercase tracking-widest text-xs text-[#9b7856] mb-2 font-semibold">Groom</p>
            <h1 className="font-great-vibes text-4xl sm:text-5xl text-[#7a4f2d] leading-tight">
              {config.couple1.groom.name}
            </h1>
            <div className="flex items-center gap-2 justify-center mt-2">
              <div className="h-px w-6 bg-[#c9a96e]" />
              <span className="text-[#c9a96e] text-xs">❧</span>
              <div className="h-px w-6 bg-[#c9a96e]" />
            </div>
            <p className="text-sm text-gray-600 mt-2 font-montserrat">{config.couple1.groom.parent}</p>
          </div>

          {/* & */}
          <div className="text-center">
            <span className="font-great-vibes text-5xl sm:text-6xl text-[#c9a96e]">&</span>
          </div>

          {/* Groom 2 */}
          <div className="text-center">
            <p className="uppercase tracking-widest text-xs text-[#9b7856] mb-2 font-semibold">Groom</p>
            <h1 className="font-great-vibes text-4xl sm:text-5xl text-[#7a4f2d] leading-tight">
              {config.couple2.groom.name}
            </h1>
            <div className="flex items-center gap-2 justify-center mt-2">
              <div className="h-px w-6 bg-[#c9a96e]" />
              <span className="text-[#c9a96e] text-xs">❧</span>
              <div className="h-px w-6 bg-[#c9a96e]" />
            </div>
            <p className="text-sm text-gray-600 mt-2 font-montserrat">{config.couple2.groom.parent}</p>
          </div>
        </div>

        {/* "with the daughter of" */}
        <p className="font-great-vibes text-2xl text-[#9b7856] my-6 italic">with the daughter of</p>

        {/* Bride Fathers */}
        <div className="grid grid-cols-3 items-center gap-4 w-full max-w-2xl mx-auto">
          {/* Bride father 1 */}
          <div className="text-center">
            <div className="border-2 border-[#c9a96e] rounded-xl px-4 py-5 bg-[#fdf4e7] shadow-sm relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#fdf8f0] px-2">
                <span className="text-[#c9a96e] text-xs">♥</span>
              </div>
              <p className="font-great-vibes text-3xl sm:text-4xl text-[#7a4f2d] leading-tight">
                {config.couple1.bride.parentName}
              </p>
              <div className="flex items-center gap-1 justify-center mt-2">
                <div className="h-px flex-1 bg-[#e8d0a0]" />
                <span className="text-[#c9a96e] text-xs">♥</span>
                <div className="h-px flex-1 bg-[#e8d0a0]" />
              </div>
            </div>
          </div>

          {/* & */}
          <div className="text-center">
            <span className="font-great-vibes text-5xl sm:text-6xl text-[#c9a96e]">&</span>
          </div>

          {/* Bride father 2 */}
          <div className="text-center">
            <div className="border-2 border-[#c9a96e] rounded-xl px-4 py-5 bg-[#fdf4e7] shadow-sm relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#fdf8f0] px-2">
                <span className="text-[#c9a96e] text-xs">♥</span>
              </div>
              <p className="font-great-vibes text-3xl sm:text-4xl text-[#7a4f2d] leading-tight">
                {config.couple2.bride.parentName}
              </p>
              <div className="flex items-center gap-1 justify-center mt-2">
                <div className="h-px flex-1 bg-[#e8d0a0]" />
                <span className="text-[#c9a96e] text-xs">♥</span>
                <div className="h-px flex-1 bg-[#e8d0a0]" />
              </div>
            </div>
          </div>
        </div>

        {/* Beginning of a beautiful journey */}
        <div className="mt-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-3">
            <div className="h-px w-12 bg-[#c9a96e]" />
            <span className="text-[#c9a96e]">♥</span>
            <div className="h-px w-12 bg-[#c9a96e]" />
          </div>
          <p className="uppercase tracking-[0.35em] text-xs text-[#9b7856] font-semibold">
            Beginning of a Beautiful Journey
          </p>
        </div>

        {/* Event Details Strip */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 w-full max-w-xl mx-auto">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full border-2 border-[#c9a96e] flex items-center justify-center mb-1">
              <span className="text-[#c9a96e] text-lg">📅</span>
            </div>
            <p className="uppercase text-xs tracking-widest text-[#9b7856] font-semibold">Date</p>
            <p className="font-montserrat font-bold text-sm text-[#5a3e28] uppercase tracking-wide">
              {config.event.date}
            </p>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#e8d0a0]" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full border-2 border-[#c9a96e] flex items-center justify-center mb-1">
              <span className="text-[#c9a96e] text-lg">🕐</span>
            </div>
            <p className="uppercase text-xs tracking-widest text-[#9b7856] font-semibold">Time</p>
            <p className="font-montserrat font-bold text-sm text-[#5a3e28]">{config.event.time}</p>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#e8d0a0]" />
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full border-2 border-[#c9a96e] flex items-center justify-center mb-1">
              <span className="text-[#c9a96e] text-lg">📍</span>
            </div>
            <p className="uppercase text-xs tracking-widest text-[#9b7856] font-semibold">Venue</p>
            <p className="font-montserrat font-bold text-sm text-[#5a3e28] text-center">{config.venue.name}</p>
          </div>
        </div>

        {/* Location tag */}
        <div className="mt-6 px-6 py-2 border border-[#c9a96e] rounded-full bg-[#7a4f2d] shadow-sm">
          <p className="text-xs uppercase tracking-widest text-[#fdf8f0] font-semibold">Grid Tion</p>
        </div>
        <p className="font-great-vibes text-3xl sm:text-4xl text-[#7a4f2d] mt-3">{config.venue.area}</p>
      </section>

      {/* ── Date Scratch & Reveal ───────────────────────── */}
      <section className="py-20 px-4 text-center bg-white">
        <h2 className="font-playfair text-3xl text-[#7a4f2d] mb-2">
          {isRevealed ? 'Our Forever Begins ✨' : 'Scratch to Reveal the Date'}
        </h2>
        <p className="text-gray-400 text-sm font-montserrat mb-2">Use your finger or mouse to scratch</p>
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
            <img src={slide} alt="Wedding" className="w-full h-full object-cover" />
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
        <h2 className="font-playfair text-3xl text-[#7a4f2d] mb-1">Countdown to the Wedding</h2>
        <p className="text-[#9b7856] text-sm font-montserrat mb-2">{config.event.date} · {config.event.time}</p>
        <Countdown date={new Date(config.event.targetDate)} renderer={renderer} />
      </section>

      {/* ── Venue & Schedule ───────────────────────────── */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-xs text-[#9b7856] mb-2 font-semibold">Wedding Details</p>
          <h2 className="font-great-vibes text-5xl text-[#7a4f2d]">Wedding Ceremony</h2>
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
              <li className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#c9a96e] mt-1 flex-shrink-0" />
                  <div className="w-px flex-1 bg-[#e8d9c5] mt-1" />
                </div>
                <div>
                  <p className="font-bold font-montserrat text-sm text-[#c9a96e] uppercase tracking-wide">7:30 PM</p>
                  <p className="font-playfair text-lg text-[#7a4f2d]">Guest Arrival</p>
                  <p className="text-gray-400 text-sm">Welcoming our honorable guests</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#7a4f2d] mt-1 flex-shrink-0" />
                  <div className="w-px flex-1 bg-[#e8d9c5] mt-1" />
                </div>
                <div>
                  <p className="font-bold font-montserrat text-sm text-[#c9a96e] uppercase tracking-wide">8:30 PM</p>
                  <p className="font-playfair text-lg text-[#7a4f2d]">Wedding Ceremony</p>
                  <p className="text-gray-400 text-sm">The beautiful union begins</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-[#9b7856] mt-1 flex-shrink-0" />
                </div>
                <div>
                  <p className="font-bold font-montserrat text-sm text-[#c9a96e] uppercase tracking-wide">Dinner</p>
                  <p className="font-playfair text-lg text-[#7a4f2d]">Reception & Dinner</p>
                  <p className="text-gray-400 text-sm">Festive feast & celebration with family</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Venue */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e8d9c5] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#7a4f2d] to-[#c9a96e]" />
            <h3 className="font-playfair text-2xl text-[#7a4f2d] mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#c9a96e]" /> The Venue
            </h3>
            <p className="font-montserrat font-bold text-lg text-[#5a3e28] mb-1">{config.venue.name}</p>
            <p className="text-[#9b7856] text-sm font-montserrat mb-1 font-semibold">Grid Road</p>
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
              {config.lookingForward.map((name, i) => (
                <p key={i} className="font-playfair text-[#7a4f2d] text-sm leading-relaxed">{name}</p>
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

      {/* ── Reception Section ─────────────────────────── */}
      <section className="py-10 px-4 text-center" style={{ background: 'linear-gradient(135deg, #f5e9d5 0%, #fdf8f0 100%)' }}>
        <p className="uppercase tracking-[0.3em] text-xs text-[#9b7856] font-semibold">Reception</p>
        <p className="font-playfair text-xl text-[#7a4f2d] mt-2">{config.reception}</p>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer
        className="py-12 text-center"
        style={{ background: '#5a3e28' }}
      >
        <p className="font-great-vibes text-4xl text-[#e8d0a0] mb-2">
          Muhammad Umar & Muhammad Abu Bakar
        </p>
        <p className="font-montserrat text-xs tracking-widest text-[#c9a96e] uppercase mt-2">
          5 December 2026 · Galaxy Marriage Hall · D.I. Khan
        </p>
        <div className="flex items-center gap-3 justify-center mt-5">
          <div className="h-px w-12 bg-[#c9a96e]/50" />
          <span className="text-[#c9a96e]">♥</span>
          <div className="h-px w-12 bg-[#c9a96e]/50" />
        </div>
        <p className="text-[#9b7856] text-xs mt-4 font-montserrat">Beginning of a Beautiful Journey</p>
      </footer>
    </div>
  );
}
