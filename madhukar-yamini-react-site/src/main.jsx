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
  { src: '/assets/madhukar-yamini-ghibli-mandap.png', label: 'Our sacred mandap moments' },
  { src: '/assets/WhatsApp Image 2026-10-25 at 11.58.52 (2).jpeg', label: 'A joyful memory' },
  { src: '/assets/WhatsApp Image 2026-10-25 at 12.17.10.jpeg', label: 'Together in every moment' },
  { src: '/assets/WhatsApp Image 2026-10-25 at 12.17.51.jpeg', label: 'A smile that stays with us' },
  { src: '/assets/WhatsApp Image 2026-10-25 at 13.50.08.jpeg', label: 'Forever begins here' },
];

function App() {
  const [opened, setOpened] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [music, setMusic] = useState(true);
  const [telugu, setTelugu] = useState(true);
  const [muhurthamRevealed, setMuhurthamRevealed] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const audioRef = useRef(null);
  const ensureMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = 0.7;
    if (music) {
      audio.play().catch(() => undefined);
    }
  };
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (music) {
      audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }, [music]);
  useEffect(() => {
    const startMusicOnInteraction = () => ensureMusic();
    window.addEventListener('pointerdown', startMusicOnInteraction, { once: true });
    return () => window.removeEventListener('pointerdown', startMusicOnInteraction);
  }, [music]);
  const handleTouchStart = (event) => { setTouchStartX(event.touches[0].clientX); };
  const handleTouchEnd = (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (delta < -50) setGalleryIndex((prev) => Math.min(prev + 1, GALLERY_IMAGES.length - 1));
    if (delta > 50) setGalleryIndex((prev) => Math.max(prev - 1, 0));
    setTouchStartX(null);
  };
  const diff = Math.max(0, WEDDING.getTime() - now);
  const units = [ ['Days', Math.floor(diff / 86400000)], ['Hours', Math.floor(diff / 3600000) % 24], ['Minutes', Math.floor(diff / 60000) % 60], ['Seconds', Math.floor(diff / 1000) % 60] ];
  const addCalendar = () => {
    const start = '20261120T043900';
    const end = '20261120T053900';
    const summary = encodeURIComponent('Madhukar Reddy & Yamini Wedding');
    const location = encodeURIComponent(VENUE);
    const details = encodeURIComponent(`Wedding muhurtham 09:39 AM IST. Directions: ${MAPS}`);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${summary}&dates=${start}Z/${end}Z&details=${details}&location=${location}&sf=true&output=1`;

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Madhukar and Yamini//Wedding//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:madhukar-yamini-20261120@example.com',
      'DTSTAMP:20261025T000000Z',
      `DTSTART:${start}Z`,
      `DTEND:${end}Z`,
      'SUMMARY:Madhukar Reddy & Yamini Wedding',
      `LOCATION:${VENUE}`,
      `DESCRIPTION:Wedding muhurtham 09:39 AM IST. Directions: ${MAPS}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const fallbackBlob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const fallbackUrl = URL.createObjectURL(fallbackBlob);
    const fallbackLink = document.createElement('a');
    fallbackLink.href = fallbackUrl;
    fallbackLink.download = 'Madhukar-Yamini-Wedding.ics';
    document.body.appendChild(fallbackLink);

    const popup = window.open(googleCalendarUrl, '_blank');
    if (popup) {
      popup.opener = null;
    }

    fallbackLink.click();
    setTimeout(() => {
      document.body.removeChild(fallbackLink);
      URL.revokeObjectURL(fallbackUrl);
    }, 200);
  };
  return <div className="site">
    <div className="topline"><span>✦</span> {telugu ? 'ప్రేమ మరియు ఆశీర్వాదం' : 'A CELEBRATION OF LOVE'} <span>✦</span></div>
    <nav className="nav"><a href="#home" className="brand">M <span>♥</span> Y</a><div className="navlinks"><a href="#story">{telugu ? 'మా కథ' : 'Our Story'}</a><a href="#details">{telugu ? 'వివాహం' : 'The Wedding'}</a><a href="#gallery">{telugu ? 'గ్యాలరీ' : 'Gallery'}</a></div><div className="language-toggle" aria-label="Choose language"><button className={telugu ? 'lang-button active' : 'lang-button'} type="button" onClick={() => setTelugu(true)}>తెలుగు</button><button className={!telugu ? 'lang-button active' : 'lang-button'} type="button" onClick={() => setTelugu(false)}>English</button></div></nav>
    <main>
      <section className={`hero ${opened ? 'revealed' : ''}`} id="home">
        <div className="hero-image"/><div className="hero-shade"/><div className="hero-ornament top">❦</div><div className="hero-content">
          <p className="eyebrow fade-in">{telugu ? 'మా కుటుంబాల ఆశీర్వాదంతో' : 'WITH THE BLESSINGS OF OUR FAMILIES'}</p><div className="monogram">M <span>✦</span> Y</div>
          <p className="invite-line">{telugu ? 'మా కుటుంబాల సహా, మీరు మా వివాహాన్ని జరుపుకోవడానికి ఆహ్వానిస్తున్నారు' : 'Together with our families, we invite you to celebrate'}</p>
          <h1><span>Madhukar Reddy</span><i>&</i><span>Yamini</span></h1>
          <div className="gold-rule"><b>✦</b></div><p className="date-line">{telugu ? 'శుక్రవారం' : 'FRIDAY'} <span>•</span> {telugu ? '20 నవంబర్ 2026' : '20 NOVEMBER 2026'} <span>•</span> 09:39 AM</p>
          {!opened ? <button className="open-invite" onClick={() => { setOpened(true); ensureMusic(); }}>{telugu ? 'ఆహ్వానాన్ని తెరవండి' : 'Open the Invitation'} <ChevronDown size={17}/></button> : <a className="open-invite" href="#story" onClick={ensureMusic}>{telugu ? 'మా వేడుకను అన్వేషించండి' : 'Explore our celebration'} <ChevronDown size={17}/></a>}
        </div><div className="hero-ornament bottom">❦</div><div className="scroll-cue"><span/> {telugu ? 'ఎక్స్‌ప్లోర్ చేయడానికి స్క్రోల్ చేయండి' : 'SCROLL TO EXPLORE'}</div>
      </section>
      <section className="intro section" id="story"><p className="eyebrow">{telugu ? 'రెండు హృదయాలు · ఒక అందమైన ప్రయాణం' : 'TWO HEARTS · ONE BEAUTIFUL JOURNEY'}</p><h2>{telugu ? 'మా ప్రేమ కథ' : 'A story written in the stars'}</h2><div className="small-rule">✦</div><p className="intro-copy">{telugu ? 'కొన్ని ప్రయాణాలు ముందుగానే నిర్ణయించబడతాయి. మా కుటుంబాల ప్రేమ మరియు పెద్దల ఆశీర్వాదంతో, మేము కొత్త అధ్యాయాన్ని ప్రారంభిస్తున్నాము. మీ ఉనికి మా కోసం ఎంతో శక్తివంతం అవుతుంది.' : 'Some journeys are destined to meet. With the love of our families and the blessings of our elders, we begin a new chapter together. It would mean the world to us to have you by our side as we celebrate the beginning of forever.'}</p><div className="signature">Madhukar <span>&</span> Yamini</div></section>
      <section className="families section"><p className="eyebrow">{telugu ? 'రెండు కుటుంబాలు, ఒక వేడుక' : 'TWO FAMILIES, ONE CELEBRATION'}</p><h2>{telugu ? 'మా కుటుంబాలతో' : 'With Our Families'}</h2><div className="family-grid"><div className="family-card"><p className="family-label">{telugu ? 'పెంకు కుటుంబం' : "GROOM'S FAMILY"}</p><h3>Madhukar Reddy</h3><p className="family-subtitle">{telugu ? 'శ్రీ సురపురెడ్డి కుటుంబం' : 'Surapureddy family'}</p><p className="family-parents">{telugu ? 'శ్రీ సురపురెడ్డి తిరుపతిరెడ్డి గారు' : 'Sri surapureddy Tirupathireddy guru'}</p><p className="family-parents second">{telugu ? 'శ్రీమతి సురపురెడ్డి నాగేంద్ర గారు' : 'Smt surapureddy Nagendra guru'}</p><p className="family-quote">{telugu ? 'శ్రీ స్వామి ఆశీర్వాదంతో' : 'With love and blessings'}</p></div><div className="family-heart">♥</div><div className="family-card"><p className="family-label">{telugu ? 'పెళ్లికొడుకు కుటుంబం' : "BRIDE'S FAMILY"}</p><h3>Yamini</h3><p className="family-subtitle">{telugu ? 'శ్రీ సాండుపట్ల కుటుంబం' : 'Sandupatla family'}</p><p className="family-parents">{telugu ? 'శ్రీ సాండుపట్ల ఇందర రెడ్డి గారు' : 'Sri Sandupatla indra Reddy guru'}</p><p className="family-parents second">{telugu ? 'శ్రీమతి సాండుపట్ల మాధవి గారు' : 'Smt Sandupatla Madhavi guru'}</p><p className="family-quote">{telugu ? 'కుటుంబ ఆశీర్వాదాలతో' : 'With joy and grace'}</p></div></div><p className="family-footer">{telugu ? 'మీరు మా వేడుకను ఈ సంతోషకరమైన సంధి కార్యక్రమంలో చేరవడం వరం.' : 'We invite you to witness this joyful union and bless our new beginning.'}</p></section>
      <section className="details section" id="details"><div className="section-heading"><p className="eyebrow">{telugu ? 'ఎక్కువ వివరాలు' : 'SAVE THE DATE'}</p><h2>{telugu ? 'వివాహ వివరాలు' : 'Wedding Details'}</h2><div className="small-rule">✦</div></div><button className={`detail-banner ${muhurthamRevealed ? 'is-lit' : ''}`} type="button" onClick={() => setMuhurthamRevealed((prev) => !prev)}><div className="banner-diya" aria-hidden="true"><span className="diya-flame" /><span className="diya-base" /></div><div className="banner-copy"><p>{muhurthamRevealed ? (telugu ? 'ముహూర్తం: 09:39 AM' : 'Muhurtham: 09:39 AM') : (telugu ? 'ముహూర్తం చూడడానికి దీపాన్ని తాకండి' : 'Tap the diya to reveal the muhurtham time')}</p></div></button><div className="detail-grid"><div className="detail-card detail-single"><div className="detail-icon"><CalendarDays/></div><p className="eyebrow">{telugu ? 'తేదీ' : 'THE DATE'}</p><h3>{telugu ? 'శుక్రవారం, 20 నవంబర్ 2026' : 'Friday, 20 November 2026'}</h3><p>{telugu ? '20 నవంబర్ 2026' : 'Friday, 20 November 2026'}</p></div><div className="detail-card detail-single"><div className="detail-icon"><CalendarDays/></div><p className="eyebrow">{telugu ? 'ముహూర్తం' : 'MUHURTHAM'}</p><h3>{telugu ? '09:39 AM' : '09:39 AM'}</h3><p>{telugu ? 'అలంకరించిన వేళ' : 'The auspicious time'}</p></div><div className="detail-card detail-single"><div className="detail-icon"><MapPin/></div><p className="eyebrow">{telugu ? 'పట్టణం' : 'THE CITY'}</p><h3>{telugu ? 'హైదరాబాదు, తెలంగాణ' : 'Hyderabad, Telangana'}</h3><p>{telugu ? 'హార్మోనీ కౌర్ట్ యార్డ్' : 'Harmony Courtyard'}</p></div></div><div className="detail-venue-box"><div className="detail-icon"><MapPin/></div><p className="eyebrow">{telugu ? 'వెన్యు' : 'THE VENUE'}</p><h3>Harmony Courtyard</h3><p>{VENUE}</p><a className="gold-button" href={MAPS} target="_blank" rel="noreferrer"><MapPin size={17}/> {telugu ? 'దిశలు చూడండి' : 'Get Directions'}</a><button className="text-button" onClick={addCalendar}><CalendarDays size={16}/> {telugu ? 'క్యాలెండర్లో జోడించండి' : 'Add to Calendar'}</button></div></section>
      <section className="countdown section"><p className="eyebrow">{telugu ? 'మేము ఎదురు చూస్తున్న క్షణం' : 'THE MOMENT WE’VE BEEN WAITING FOR'}</p><h2>{telugu ? 'శాశ్వతంగా గడపడానికి గణన' : 'Counting down to forever'}</h2><div className="count-grid">{units.map(([label,value])=><div className="count-cell" key={label}><strong>{String(value).padStart(2,'0')}</strong><span>{telugu ? (label === 'Days' ? 'రోజులు' : label === 'Hours' ? 'గంటలు' : label === 'Minutes' ? 'నిమిషాలు' : 'సెకన్లు') : label}</span></div>)}</div><div className="small-rule">✦</div><p className="count-note">{telugu ? 'రెండు కుటుంబాలు ఒకటిగా ఉండటానికి.' : 'Until two families become one.'}</p></section>
      <section className="gallery section" id="gallery"><p className="eyebrow">{telugu ? 'మా ప్రపంచానికి కొద్దిపాటి వీక్షణ' : 'A LITTLE GLIMPSE OF OUR WORLD'}</p><h2>{telugu ? 'మా క్షణాలు' : 'Our Moments'}</h2><div className="gallery-carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}><div className="gallery-track" style={{ transform: `translateX(-${galleryIndex * 100}%)` }}>{GALLERY_IMAGES.map((image) => <figure className="gallery-slide" key={image.src}><img src={encodeURI(image.src)} alt={image.label}/><figcaption>{telugu ? 'మా సంతోషకరమైన క్షణాలు' : image.label}</figcaption></figure>)}</div></div><div className="gallery-controls"><button type="button" className="gallery-arrow" onClick={() => setGalleryIndex((prev) => Math.max(prev - 1, 0))} aria-label="Previous photo">←</button><div className="gallery-dots">{GALLERY_IMAGES.map((image, index) => <button key={image.src} type="button" className={index === galleryIndex ? 'dot active' : 'dot'} onClick={() => setGalleryIndex(index)} aria-label={`Show photo ${index + 1}`} />)}</div><button type="button" className="gallery-arrow" onClick={() => setGalleryIndex((prev) => Math.min(prev + 1, GALLERY_IMAGES.length - 1))} aria-label="Next photo">→</button></div></section>
      <section className="closing"><div className="closing-ornament">❦</div><p className="eyebrow">{telugu ? 'మీ ఉనికే మా బహుమతి' : 'YOUR PRESENCE IS OUR PRESENT'}</p><h2>{telugu ? <><span>మా వేడుకను జరుపుకోవడానికి</span><br/><em>మేము ఎదురుచూస్తున్నాము.</em></> : <>We can’t wait to celebrate <em>with you.</em></>}</h2><p>{telugu ? 'ప్రేమ మరియు కృతజ్ఞతలతో,' : 'With love and gratitude,'}</p><div className="signature">Madhukar <span>&</span> Yamini</div><a className="gold-button" href={MAPS} target="_blank" rel="noreferrer"><MapPin size={17}/> {telugu ? 'వెన్యును కనుగొనండి' : 'Find the Venue'}</a></section>
    </main>
    <footer><div className="footer-monogram">M <span>♥</span> Y</div><p>{telugu ? 'ప్రేమతో తయారు చేయబడింది · 20.11.2026' : 'MADE WITH LOVE · 20.11.2026'}</p><small>{telugu ? 'మా కుటుంబాల మరియు పెద్దల ఆశీర్వాదంతో' : 'With the blessings of our families and elders'}</small></footer>
    <audio ref={audioRef} src={SONG_SRC} autoPlay={false} loop playsInline />
    <button className="music-button" aria-label={music ? 'Pause ambient music' : 'Play ambient music'} onClick={() => { setMusic(!music); ensureMusic(); }} title="Music control">{music ? <Pause size={18}/> : <Play size={18}/>} <span>{music ? (telugu ? 'సంగీతం ఆపు' : 'Pause music') : (telugu ? 'సంగీతం' : 'Music')}</span></button>
  </div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
