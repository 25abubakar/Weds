import { useState, useEffect, useRef } from 'react';
import Countdown from 'react-countdown';
import { MapPin, Clock, Navigation } from 'lucide-react';
import Confetti from 'react-confetti';

const config = {
  groom: { name: 'Iqrash', parent: 'Son of Qazi Zulfiqar' },
  bride: { name: 'Ayesha', parent: 'Daughter of Qamar Farooq' },
  event: {
    date: 'August 30, 2026',
    day: 'Sunday',
    time: '1:00 PM',
    targetDate: 'August 30, 2026 13:00:00'
    },

  slides: [
    'https://iqrash-weds-ayesha.pages.dev/slides/slide-1.jpg',
    'https://iqrash-weds-ayesha.pages.dev/slides/slide-2.jpg',
    'https://iqrash-weds-ayesha.pages.dev/slides/slide-3.jpg'
  ],
  venue: {
    name: 'Bandhan Marquee Abbottabad',
    address: 'Abbottabad, Khyber Pakhtunkhwa',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.32712922835!2d73.25965218288266!3d34.154735295668594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38de316f04666079%3A0xf1c4f5f810ef8f70!2sBandhan%20Marquee%20Abbottabad!5e0!3m2!1sen!2s!4v1785686690025!5m2!1sen!2s',
    googleMapsLink: 'https://maps.app.goo.gl/QB8BKbo2ZVUv6deP9'
  }
};

const ScratchCard = ({ isRevealed, setIsRevealed }: { isRevealed: boolean, setIsRevealed: (v: boolean) => void }) => {
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
    
    ctx.font = '24px Montserrat';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch Here', canvas.width / 2, canvas.height / 2);
    
    let isDrawing = false;
    
    const scratch = (e: any) => {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
      const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      checkRevealed();
    };
    
    const checkRevealed = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
      }
      
      if (transparent / (pixels.length / 4) > 0.5) {
        setIsRevealed(true);
      }
    };
    
    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('touchstart', () => isDrawing = true);
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchmove', scratch);
    
    return () => {
      canvas.removeEventListener('mousedown', () => isDrawing = true);
      canvas.removeEventListener('mouseup', () => isDrawing = false);
      canvas.removeEventListener('mousemove', scratch);
      canvas.removeEventListener('touchstart', () => isDrawing = true);
      canvas.removeEventListener('touchend', () => isDrawing = false);
      canvas.removeEventListener('touchmove', scratch);
    };
  }, [isRevealed]);

  return (
    <div className="relative w-72 h-32 mx-auto my-8 overflow-hidden rounded-xl shadow-lg border-2 border-heartOutline bg-white flex flex-col items-center justify-center">
      {isRevealed && <Confetti width={280} height={120} recycle={false} numberOfPieces={200} />}
      <div className="text-center z-0">
        <p className="font-playfair text-xl text-titleText mb-1">{config.event.date}</p>
        <p className="font-montserrat text-sm text-gray-600">{config.event.day} | {config.event.time}</p>
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

export default function App() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % config.slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const renderer = ({ days, hours, minutes, seconds }: any) => {
    return (
      <div className="flex gap-4 justify-center items-center mt-6">
        {[
          { label: 'Days', value: days },
          { label: 'Hours', value: hours },
          { label: 'Mins', value: minutes },
          { label: 'Secs', value: seconds }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-bgDarker">
              <span className="font-playfair text-2xl text-titleText">{item.value}</span>
            </div>
            <span className="text-xs uppercase mt-2 tracking-widest text-gray-500 font-montserrat">{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-bgLight">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-bgDarker to-bgLight overflow-hidden">
        <div className="z-10 animate-fade-in-up">
          <p className="uppercase tracking-[0.3em] text-sm text-titleText mb-8 font-montserrat">We are getting married</p>
          <h1 className="font-great-vibes text-6xl md:text-8xl text-titleText mb-6 drop-shadow-sm">
            {config.groom.name} <span className="text-4xl md:text-6xl mx-2">&</span> {config.bride.name}
          </h1>
          <p className="font-playfair italic text-gray-600 max-w-md mx-auto leading-relaxed">
            We are honored to welcome you to the Wedding ceremony as they begin their journey together in faith and love.
          </p>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #864e3c 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </section>

      {/* Date Reveal Section */}
      <section className="py-20 px-4 text-center bg-white">
        <h2 className="font-playfair text-3xl text-titleText mb-4">
          {isRevealed ? 'Our forever begins' : 'Scratch to reveal date'}
        </h2>
        <ScratchCard isRevealed={isRevealed} setIsRevealed={setIsRevealed} />
      </section>

      {/* Slideshow */}
      <section className="w-full max-w-4xl mx-auto h-[60vh] md:h-[80vh] relative overflow-hidden my-12 shadow-2xl rounded-2xl">
        {config.slides.map((slide, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img src={slide} alt="Couple" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}
      </section>

      {/* Countdown */}
      <section className="py-20 px-4 text-center bg-bgDarker">
        <h2 className="font-playfair text-3xl text-titleText mb-2">Countdown to the Wedding</h2>
        <Countdown date={new Date(config.event.targetDate)} renderer={renderer} />
      </section>

      {/* Event Details */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center">
        <h2 className="font-great-vibes text-5xl text-titleText mb-12">Walima</h2>
        
        <div className="grid md:grid-cols-2 gap-12 text-left">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-bgDarker relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-midGradient" />
            <h3 className="font-playfair text-2xl text-titleText mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6" /> Schedule
            </h3>
            <ul className="space-y-6">
              <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-bgDarker before:rounded-full">
                <p className="font-bold font-montserrat">1:00 PM</p>
                <p className="font-playfair text-lg text-titleText">Guest Arrival</p>
                <p className="text-gray-500 text-sm">Welcoming our honorable guests</p>
              </li>
              <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-midGradient before:rounded-full">
                <p className="font-bold font-montserrat">2:00 PM</p>
                <p className="font-playfair text-lg text-titleText">Lunch</p>
                <p className="text-gray-500 text-sm">Festive lunch feast & celebration</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-bgDarker relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-titleText" />
            <h3 className="font-playfair text-2xl text-titleText mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6" /> The Venue
            </h3>
            <p className="font-montserrat font-bold text-lg mb-2">{config.venue.name}</p>
            <p className="text-gray-600 mb-6 font-playfair">{config.venue.address}</p>
            <a 
              href={config.venue.googleMapsLink} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-titleText text-white rounded-full hover:bg-opacity-90 transition-all font-montserrat text-sm"
            >
              <Navigation className="w-4 h-4" /> Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Map Embed */}
      <section className="w-full h-[400px]">
        <iframe 
          src={config.venue.mapEmbedUrl} 
          className="w-full h-full border-0" 
          allowFullScreen 
          loading="lazy"
        />
      </section>

      {/* RSVP Form */}
      <section className="py-20 px-4 bg-white text-center">
        <h2 className="font-playfair text-3xl text-titleText mb-2">RSVP</h2>
        <p className="text-gray-500 mb-8 font-montserrat text-sm">We can't wait to celebrate with you!</p>
        
        <form className="max-w-md mx-auto text-left space-y-6" onSubmit={(e) => { e.preventDefault(); alert('RSVP sent successfully!'); }}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">Your Name</label>
            <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-midGradient focus:ring-1 focus:ring-midGradient font-playfair" placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">Phone / WhatsApp</label>
            <input type="tel" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-midGradient focus:ring-1 focus:ring-midGradient font-playfair" placeholder="0300 1234567" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">Will you be attending?</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-midGradient focus:ring-1 focus:ring-midGradient font-playfair bg-white">
              <option>Yes, I will attend</option>
              <option>Sorry, I cannot attend</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-montserrat">Message for the Couple</label>
            <textarea rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-midGradient focus:ring-1 focus:ring-midGradient font-playfair resize-none" placeholder="Write your warm wishes..."></textarea>
          </div>
          <button type="submit" className="w-full py-4 bg-titleText text-white rounded-lg hover:bg-opacity-90 transition-all font-montserrat font-bold tracking-wide">
            Send RSVP
          </button>
        </form>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center bg-bgDarker text-titleText font-great-vibes text-3xl">
        Iqrash & Ayesha
      </footer>
    </div>
  );
}
