import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MapPin, CalendarDays, Music2, VolumeX, Heart, Sparkles, ChevronDown, Play, Pause } from 'lucide-react';
import './style.css';

const MAPS = 'https://maps.app.goo.gl/iFpp625BZY8nk6Sw8';
const WEDDING = new Date('2026-11-20T09:39:00+05:30');
const VENUE = 'Harmony Courtyard, near AVN College of Engineering, Hayathnagar Khalsa, Hyderabad, Telangana 501510';
const SONG_SRC = encodeURI('/assets/Seetha Kalyanam - SenSongsMp3.Co.mp3');
const GALLERY_IMAGES = [
  { src: '/assets/madhukar-yamini-original-couple.jpeg', label: 'Our favourite beginning' },
  { src: '/assets/MSR_3412.jpg', label: 'A joyful memory' },
  { src: '/assets/MSR_3443.jpg', label: 'Together in every moment' },
  { src: '/assets/MSR_7333.jpg', label: 'Forever begins here' },
];

function App() {
  const [opened, setOpened] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [music, setMusic] = useState(true);
  const [muhurthamRevealed, setMuhurthamRevealed] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const audioRef = useRef(null);

  const ensureMusic = (shouldPlay = music) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!shouldPlay) {
      audio.pause();
      return;
    }

    audio.volume = 0.7;
    audio.muted = false;
    audio.play().catch(() => undefined);
  };

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!music) return;

    const startMusicOnInteraction = () => ensureMusic(true);
    window.addEventListener('pointerdown', startMusicOnInteraction, { once: true });
    return () => window.removeEventListener('pointerdown', startMusicOnInteraction);
  }, [music]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (music) {
      audio.volume = 0.7;
      audio.muted = false;
      audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }, [music]);

  const diff = WEDDING.getTime() - now;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const minutes = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((diff / 1000) % 60));

  const units = [
    ['Days', days],
    ['Hours', hours],
    ['Minutes', minutes],
    ['Seconds', seconds],
  ];

  const addCalendar = () => {
    const title = 'Madhukar & Yamini Wedding Celebration';
    const start = '20261120T093900';
    const end = '20261120T113900';
    const details = 'Join us for a joyful celebration of love and family.';
    const location = encodeURIComponent(VENUE);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${location}`;

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@madhu1313`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      `LOCATION:${VENUE}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'madhukar-yamini-wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (delta < -50) {
      setGalleryIndex((prev) => Math.min(prev + 1, GALLERY_IMAGES.length - 1));
    }
    if (delta > 50) {
      setGalleryIndex((prev) => Math.max(prev - 1, 0));
    }
    setTouchStartX(null);
  };

  return (
    <div className="site">
      <div className="topline"><span>✦</span> MAHIKA WEDDING <span>✦</span></div>
      <nav className="nav">
        <a href="#home" className="brand">M <span>♥</span> Y</a>
        <div className="navlinks">
          <a href="#story">Our Story</a>
          <a href="#details">The Wedding</a>
          <a href="#gallery">Gallery</a>
        </div>
      </nav>
      <main>
        <section className={`hero ${opened ? 'revealed' : ''}`} id="home">
          <div className="hero-image" />
          <div className="hero-shade" />
          <div className="hero-ornament top">❦</div>
          <div className="hero-content">
            <p className="eyebrow fade-in">WITH THE BLESSINGS OF OUR FAMILIES</p>
            <div className="monogram">M <span>✦</span> Y</div>
            <p className="invite-line">Together with our families, we invite you to celebrate</p>
            <h1>
              <span>Madhukar Reddy</span>
              <i>&</i>
              <span>Yamini</span>
            </h1>
            <div className="gold-rule"><b>✦</b></div>
            <p className="date-line">FRIDAY <span>•</span> 20 NOVEMBER 2026 <span>•</span> 09:39 AM</p>
            <button
              className="open-invite"
              type="button"
              onClick={() => {
                setOpened(true);
                ensureMusic();
              }}
            >
              Explore our celebration <ChevronDown size={17} />
            </button>
          </div>
          <div className="hero-ornament bottom">❦</div>
          <div className="scroll-cue"><span /> SCROLL TO EXPLORE</div>
        </section>

        <section className="intro section" id="story">
          <p className="eyebrow">TWO HEARTS · ONE BEAUTIFUL JOURNEY</p>
          <h2>A story written in the stars</h2>
          <div className="small-rule">✦</div>
          <p className="intro-copy">
            Some journeys are destined to meet. With the love of our families and the blessings of our elders,
            we begin a new chapter together. It would mean the world to us to have you by our side as we celebrate
            the beginning of forever.
          </p>
          <div className="signature">Madhukar <span>&</span> Yamini</div>
        </section>

        <section className="families section">
          <p className="eyebrow">TWO FAMILIES, ONE CELEBRATION</p>
          <h2>With Our Families</h2>
          <div className="family-grid">
            <div className="family-card">
              <p className="family-label">GROOM'S FAMILY</p>
              <h3>Madhukar Reddy</h3>
              <p className="family-subtitle">Surapureddy family</p>
              <p className="family-parents">Sri Surapureddy Tirupathi Reddy</p>
              <p className="family-parents second">Smt. Surapureddy Nagendra</p>
              <p className="family-quote">With love and blessings</p>
            </div>
            <div className="family-heart">♥</div>
            <div className="family-card">
              <p className="family-label">BRIDE'S FAMILY</p>
              <h3>Yamini</h3>
              <p className="family-subtitle">Sandupatla family</p>
              <p className="family-parents">Sri Sandupatla Indra Reddy</p>
              <p className="family-parents second">Smt. Sandupatla Madhavi</p>
              <p className="family-quote">With joy and grace</p>
            </div>
          </div>
          <p className="family-footer">We invite you to witness this joyful union and bless our new beginning.</p>
        </section>

        <section className="details section" id="details">
          <div className="section-heading">
            <p className="eyebrow">SAVE THE DATE</p>
            <h2>Wedding Details</h2>
            <div className="small-rule">✦</div>
          </div>

          <button
            className={`detail-banner ${muhurthamRevealed ? 'is-lit' : ''}`}
            type="button"
            onClick={() => setMuhurthamRevealed((prev) => !prev)}
          >
            <div className="banner-diya" aria-hidden="true">
              <span className="diya-flame" />
              <span className="diya-base" />
            </div>
            <div className="banner-copy">
              <p>{muhurthamRevealed ? 'Muhurtham: 09:39 AM' : 'Tap the diya to reveal the muhurtham time'}</p>
            </div>
          </button>

          <div className="detail-grid">
            <div className="detail-card detail-single date-card">
              <div className="detail-icon"><CalendarDays /></div>
              <p className="eyebrow">THE DATE</p>
              <h3>Friday, 20 November 2026</h3>
            </div>
            <div className="detail-card detail-single">
              <div className="detail-icon"><CalendarDays /></div>
              <p className="eyebrow">MUHURTHAM</p>
              <h3>09:39 AM</h3>
              <p>The auspicious time</p>
            </div>
            <div className="detail-card detail-single">
              <div className="detail-icon"><MapPin /></div>
              <p className="eyebrow">THE CITY</p>
              <h3>Hyderabad, Telangana</h3>
              <p>Harmony Courtyard</p>
            </div>
          </div>

          <div className="detail-venue-box">
            <div className="detail-icon"><MapPin /></div>
            <p className="eyebrow">THE VENUE</p>
            <h3>Harmony Courtyard</h3>
            <p>{VENUE}</p>
            <a className="gold-button" href={MAPS} target="_blank" rel="noreferrer">
              <MapPin size={17} /> Get Directions
            </a>
            <button className="text-button" onClick={addCalendar}>
              <CalendarDays size={16} /> Add to Calendar
            </button>
          </div>
        </section>

        <section className="countdown section">
          <p className="eyebrow">THE MOMENT WE’VE BEEN WAITING FOR</p>
          <h2>Counting down to forever</h2>
          <div className="count-grid">
            {units.map(([label, value]) => (
              <div className="count-cell" key={label}>
                <strong>{String(value).padStart(2, '0')}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="small-rule">✦</div>
          <p className="count-note">Until two families become one.</p>
        </section>

        <section className="gallery section" id="gallery">
          <p className="eyebrow">A LITTLE GLIMPSE OF OUR WORLD</p>
          <h2>Our Moments</h2>
          <div className="gallery-carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="gallery-track" style={{ transform: `translateX(-${galleryIndex * 100}%)` }}>
              {GALLERY_IMAGES.map((image) => (
                <figure className="gallery-slide" key={image.src}>
                  <img src={encodeURI(image.src)} alt={image.label} />
                  <figcaption>{image.label}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="gallery-controls">
            <button
              type="button"
              className="gallery-arrow"
              onClick={() => setGalleryIndex((prev) => Math.max(prev - 1, 0))}
              aria-label="Previous photo"
            >
              ←
            </button>
            <div className="gallery-dots">
              {GALLERY_IMAGES.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  className={index === galleryIndex ? 'dot active' : 'dot'}
                  onClick={() => setGalleryIndex(index)}
                  aria-label={`Show photo ${index + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className="gallery-arrow"
              onClick={() => setGalleryIndex((prev) => Math.min(prev + 1, GALLERY_IMAGES.length - 1))}
              aria-label="Next photo"
            >
              →
            </button>
          </div>
        </section>

        <section className="closing">
          <div className="closing-ornament">❦</div>
          <p className="eyebrow">YOUR PRESENCE IS OUR PRESENT</p>
          <h2>
            We can’t wait to celebrate <em>with you.</em>
          </h2>
          <p>With love and gratitude,</p>
          <div className="signature">Madhukar <span>&</span> Yamini</div>
          <a className="gold-button" href={MAPS} target="_blank" rel="noreferrer">
            <MapPin size={17} /> Find the Venue
          </a>
        </section>
      </main>

      <footer>
        <div className="footer-monogram">M <span>♥</span> Y</div>
        <p>MADE WITH LOVE · 20.11.2026</p>
        <small>With the blessings of our families and elders</small>
      </footer>

      <audio ref={audioRef} src={SONG_SRC} autoPlay loop playsInline />
      <button
        className="music-button"
        aria-label={music ? 'Pause ambient music' : 'Play ambient music'}
        onClick={() => {
          setMusic((prev) => {
            const next = !prev;
            ensureMusic(next);
            return next;
          });
        }}
        title="Music control"
      >
        {music ? <Pause size={18} /> : <Play size={18} />}
        <span>{music ? 'Pause music' : 'Music'}</span>
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
