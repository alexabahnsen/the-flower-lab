// The Flower Lab — Interactive Website
// Scientific meets Sensorial · Botanical Studio · Est. 2025

const { useState, useEffect, useRef } = React;

// ─── Tokens ──────────────────────────────────────────────────
const C = {
  cream: '#EDE8DF',
  creamDark: '#E0D9CE',
  blushPale: '#DAAEB5',
  blush: '#C8818C',
  blushDeep: '#A5606B',
  sage: '#5C6E4A',
  sageLight: '#A3B391',
  wine: '#6E2A38',
  gold: '#B8994E',
  ink: '#1C1410',
  inkSoft: '#3D3028',
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "wine",
  "heroLayout": "centered",
  "showPattern": true,
  "fontScale": 1
}/*EDITMODE-END*/;

// ─── Inline SVG Patterns ────────────────────────────────────
function BotanicalDotPattern({ color = C.blushPale, opacity = 0.35 }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
      <defs>
        <pattern id="dot-pat" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="14" cy="14" r="1.5" fill={color} opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pat)" />
    </svg>
  );
}

function DiamondPattern({ color = C.wine, opacity = 0.08 }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
      <defs>
        <pattern id="diamond-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="none" stroke={color} strokeWidth="0.6" opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamond-pat)" />
    </svg>
  );
}

function GridPattern({ color = C.sage, opacity = 0.06 }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true">
      <defs>
        <pattern id="grid-pat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pat)" />
    </svg>
  );
}

// ─── Placeholder Image ───────────────────────────────────────
function PlaceholderImg({ label, width = '100%', height = 400, bg = C.creamDark, stripe = C.blushPale, style = {} }) {
  const id = `stripe-${label.replace(/\s/g, '')}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 400 ${height}`} preserveAspectRatio="xMidYMid slice" style={{ display: 'block', ...style }}>
      <defs>
        <pattern id={id} patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
          <rect width="20" height="20" fill={bg} />
          <rect width="10" height="20" fill={stripe} opacity="0.3" />
        </pattern>
      </defs>
      <rect width="400" height={height} fill={`url(#${id})`} />
      <text x="200" y={height / 2 - 8} textAnchor="middle" fontFamily="'Jost', sans-serif" fontSize="11" fontWeight="200" letterSpacing="3" fill={C.ink} opacity="0.5">{label.toUpperCase()}</text>
    </svg>
  );
}

// ─── Collections Data ─────────────────────────────────────────
// ─── Collections Data ─────────────────────────────────────────
const COLLECTIONS = [
  {
    id: 'condolencias',
    name: 'Condolencias',
    tagline: 'Con profundo respeto',
    desc: 'Arreglos serenos y dignos, compuestos para acompañar en los momentos más difíciles. Blancos, verdes y tonos suaves que transmiten paz.',
    flowers: 'Lilium blanco · Rosa blanca · Crisantemo · Eucalipto',
    price: 'desde $1,200',
    accent: '#5C6E4A',
    accentLight: '#D6DFD0',
    bg: '#EEF2EB',
  },
  {
    id: 'amor',
    name: 'Amor & Aniversario',
    tagline: 'Dramático y eterno',
    desc: 'Composiciones voluminosas y sensuales para celebrar el amor. Tonos profundos, pétalos en capas, y flores que se sienten como couture.',
    flowers: 'Rosa roja · Peonía · Ranunculus · Anemone negra',
    price: 'desde $1,800',
    accent: '#6E2A38',
    accentLight: '#F0DDE0',
    bg: '#F5E8EA',
  },
  {
    id: 'gender-reveal',
    name: 'Baby on the Way',
    tagline: 'La gran revelación',
    desc: 'Arreglos lúdicos y festivos cargados de sorpresa. Disponibles en paleta rosa o azul, con elementos que dramatizan el momento.',
    flowers: "Hortensia · Baby's breath · Tulipán · Ranunculus",
    price: 'desde $1,400',
    accent: '#9E8B7A',
    accentLight: '#EDE5DC',
    bg: '#F5F0EA',
  },
  {
    id: 'bride',
    name: 'Bride to Be',
    tagline: 'Sublime y nupcial',
    desc: 'Para la novia antes del gran día. Blanco puro, verde delicado, y ese toque de lujo botánico que lo hace inolvidable.',
    flowers: 'Rosa garden blanca · Gypsophila · Eucalipto · Peonía',
    price: 'desde $2,200',
    accent: '#DAAEB5',
    accentLight: '#F5EEF0',
    bg: '#FAF5F6',
  },
  {
    id: 'graduacion',
    name: 'Graduación',
    tagline: 'Un logro que florece',
    desc: 'Composiciones alegres y aspiracionales para celebrar el esfuerzo. Coloridas, estructuradas, y listas para la foto.',
    flowers: 'Girasol · Protea · Solidago · Rosa salmón',
    price: 'desde $1,100',
    accent: '#B8994E',
    accentLight: '#F5EDD6',
    bg: '#FAF3E0',
  },
  {
    id: 'cumpleanos',
    name: 'Cumpleaños',
    tagline: 'Vivo y celebratorio',
    desc: 'El regalo que nadie espera pero todos desean. Arreglos llenos de personalidad, volumen y color que hacen el momento.',
    flowers: 'Rosa garden · Ranunculus · Anemone · Snapdragon',
    price: 'desde $900',
    accent: '#A5606B',
    accentLight: '#F2E2E4',
    bg: '#F8ECED',
  },
  {
    id: 'agradecimientos',
    name: 'Agradecimientos',
    tagline: 'Gratitud hecha flor',
    desc: 'Elegante y considerado. Para decir gracias de una manera que no se olvida. Sutiles, fragantes, y siempre bien recibidos.',
    flowers: 'Tulipán · Lavanda · Eucalipto · Rosa nude',
    price: 'desde $800',
    accent: '#A3B391',
    accentLight: '#EAF0E5',
    bg: '#F1F5EE',
  },
  {
    id: 'menos900',
    name: 'Regalos por menos de $900',
    tagline: 'Accesible y hermoso',
    desc: 'Porque el lujo botánico no tiene que costar una fortuna. Arreglos cuidadosamente compuestos, con el mismo ojo editorial, a un precio accesible.',
    flowers: 'Rosa · Clavel · Crisantemo · Follaje',
    price: 'desde $500',
    accent: '#8B7355',
    accentLight: '#EDE8DE',
    bg: '#F5F1EB',
  },
  {
    id: 'bolos',
    name: 'Bolos',
    tagline: 'Para llevar y regalar',
    desc: 'Pequeños ramos de mano, perfectos como detalle o souvenir. Envueltos con papel y listón de la marca, listos para entregar.',
    flowers: 'Ranunculus · Tulipán · Gypsophila · Rosa miniatura',
    price: 'desde $350',
    accent: '#C8818C',
    accentLight: '#F5E0E3',
    bg: '#FBF0F1',
  },
  {
    id: 'siemprevivas',
    name: 'Flores Siempre Vivas',
    tagline: 'Eternas por diseño',
    desc: 'Flores preservadas y secas que duran años sin agua ni cuidados. El regalo perfecto para quien quiere que el momento no se olvide.',
    flowers: 'Rosa preservada · Pampas · Lagurus · Helecho seco',
    price: 'desde $650',
    accent: '#B8994E',
    accentLight: '#F0E8D0',
    bg: '#FAF4E6',
  },
];

// ─── Collections Dropdown ────────────────────────────────────
function CollectionsDropdown({ open, onClose }) {
  const [hovered, setHovered] = useState(null);

  const openContact = () => {
    onClose();
    setTimeout(() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' }), 100);
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90,
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 91,
          background: 'rgba(237,232,223,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: `1px solid rgba(110,42,56,0.1)`,
          padding: '24px 80px 32px',
          animation: 'dropIn 0.35s cubic-bezier(0.16,1,0.3,1)',
          maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
        }}
      >
        <style>{`@keyframes dropIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }`}</style>

        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {COLLECTIONS.map((col) => (
              <div
                key={col.id}
                onMouseEnter={() => setHovered(col.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { onClose(); window.location.href = 'collection.html?id=' + col.id; }}
                style={{
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 20,
                  background: hovered === col.id ? col.bg : 'transparent',
                  borderLeft: `3px solid ${hovered === col.id ? col.accent : 'transparent'}`,
                  padding: '16px 24px',
                  transition: 'all 0.2s ease',
                  borderBottom: '1px solid rgba(110,42,56,0.06)',
                }}
              >
                <div style={{ width: 10, height: 10, background: col.accent, flexShrink: 0, borderRadius: '50%' }} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', gap: 14 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 22, color: C.ink }}>{col.name}</span>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 11, letterSpacing: 3, color: col.accent, opacity: 1 }}>{col.tagline.toUpperCase()}</span>
                </div>
                {hovered === col.id && (
                  <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, color: C.inkSoft, opacity: 0.6 }}>{col.flowers}</span>
                )}
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18, color: col.accent, flexShrink: 0 }}>{col.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────
function Nav({ scrolled, activeSection, cartCount = 0, onCartOpen, onNavigate }) {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const links = ['contact'];

  const scrollTo = (id) => {
    setCollectionsOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 12, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
        height: scrolled ? 64 : 80,
        background: scrolled || collectionsOpen ? 'rgba(237,232,223,0.97)' : 'transparent',
        backdropFilter: scrolled || collectionsOpen ? 'blur(12px)' : 'none',
        borderBottom: scrolled || collectionsOpen ? '1px solid rgba(200,129,140,0.15)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}>
        {/* Logo */}
        <button onClick={() => { setCollectionsOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2,
        }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 6, color: C.ink, opacity: 0.6 }}>the</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18, letterSpacing: 5, color: C.ink }}>FLOWER LAB</span>
          <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 7, letterSpacing: 5, color: C.wine, opacity: 0.8 }}>BOTANICAL STUDIO</span>
        </button>

        {/* Desktop Links */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginLeft: 'auto', paddingLeft: 60 }}>
          {/* Colecciones dropdown trigger */}
          <button
            onClick={() => setCollectionsOpen(o => !o)}
            style={{
              background: C.wine, border: 'none', cursor: 'pointer',
              fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9,
              letterSpacing: 4, textTransform: 'uppercase',
              color: C.cream,
              transition: 'all 0.3s ease',
              padding: '10px 22px',
              display: 'flex', alignItems: 'center', gap: 6,
              opacity: collectionsOpen ? 0.85 : 1,
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.blushDeep}
            onMouseLeave={e => e.currentTarget.style.background = C.wine}
          >
            Colecciones
            <span style={{ fontSize: 8, transition: 'transform 0.3s ease', display: 'inline-block', transform: collectionsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
          </button>

          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background: C.wine, border: 'none', cursor: 'pointer',
              fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9,
              letterSpacing: 4, textTransform: 'uppercase', color: C.cream,
              padding: '10px 22px',
              transition: 'all 0.3s ease',
              opacity: activeSection === l ? 0.85 : 1,
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.blushDeep}
            onMouseLeave={e => e.currentTarget.style.background = C.wine}
            >Contacto</button>
          ))}
          <button onClick={onCartOpen} style={{
            background: C.wine, border: 'none', cursor: 'pointer',
            fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9,
            letterSpacing: 4, textTransform: 'uppercase', color: C.cream,
            padding: '10px 22px',
            transition: 'all 0.3s ease',
            display: 'flex', alignItems: 'center', gap: 8, position: 'relative',
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.blushDeep}
          onMouseLeave={e => e.currentTarget.style.background = C.wine}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.66a2 2 0 001.98-1.68L23 6H6"/><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            </svg>
            Ordenar
            {cartCount > 0 && (
              <span style={{
                background: C.cream, color: C.wine,
                fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: 9,
                width: 16, height: 16, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{cartCount}</span>
            )}
          </button>
        </div>

      </nav>

      <CollectionsDropdown open={collectionsOpen} onClose={() => setCollectionsOpen(false)} />
    </>
  );
}

// ─── Email Popup ─────────────────────────────────────────────
function EmailPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('flowerlab_popup_seen');
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 1800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('flowerlab_popup_seen', '1');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    localStorage.setItem('flowerlab_popup_seen', '1');
    setTimeout(() => setOpen(false), 2800);
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(28,20,16,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.4s ease',
    }}>
      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }`}
      </style>
      <div style={{
        background: C.cream,
        maxWidth: 480, width: '90%',
        padding: '56px 48px 48px',
        position: 'relative',
        animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
        textAlign: 'center',
      }}>
        {/* Close */}
        <button onClick={handleClose} style={{
          position: 'absolute', top: 16, right: 20,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Jost', sans-serif", fontWeight: 200,
          fontSize: 20, color: C.ink, opacity: 0.4,
          lineHeight: 1,
        }}>✕</button>

        {!submitted ? <>
          {/* Label */}
          <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 6, textTransform: 'uppercase', color: C.wine, marginBottom: 16 }}>Bienvenida</div>

          {/* Headline */}
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 42, lineHeight: 1.1, color: C.ink, marginBottom: 16 }}>
            10% de descuento<br />en tu primera compra
          </h2>

          {/* Divider */}
          <div style={{ width: 40, height: 1, background: C.blush, margin: '0 auto 20px' }} />

          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 13, lineHeight: 1.7, color: C.ink, opacity: 0.7, marginBottom: 32 }}>
            Suscríbete y recibe tu código de descuento al instante. También te avisaremos cuando lleguen flores nuevas al studio.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 13,
                letterSpacing: 1, color: C.ink,
                border: `1px solid rgba(110,42,56,0.25)`,
                background: 'transparent',
                padding: '14px 18px',
                outline: 'none',
                width: '100%',
              }}
            />
            <button type="submit" style={{
              background: C.wine, border: 'none', cursor: 'pointer',
              fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9,
              letterSpacing: 5, textTransform: 'uppercase', color: C.cream,
              padding: '16px',
              transition: 'background 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.blushDeep}
            onMouseLeave={e => e.currentTarget.style.background = C.wine}
            >Quiero mi descuento</button>
          </form>

          <button onClick={handleClose} style={{
            marginTop: 16, background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10,
            letterSpacing: 2, color: C.ink, opacity: 0.4,
            textDecoration: 'underline',
          }}>No gracias</button>
        </> : <>
          <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 6, textTransform: 'uppercase', color: C.wine, marginBottom: 16 }}>¡Listo!</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontStyle: 'italic', fontSize: 38, lineHeight: 1.2, color: C.ink, marginBottom: 20 }}>
            Tu código llega<br />en un momento 🌸
          </h2>
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 13, color: C.ink, opacity: 0.6 }}>
            Revisa tu correo — te enviamos el 10% de descuento.
          </p>
        </>}
      </div>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────
const HERO_IMGS = [
  'hero1.jpg',
  'hero2.jpg',
  'hero3.jpg',
  'hero4.jpg',
  'hero5.jpg',
];
// Note: images are in the same folder as index.html

function Hero({ tweaks }) {
  const [visible, setVisible] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const fs = tweaks.fontScale || 1;

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setImgIdx(i => (i + 1) % HERO_IMGS.length);
        setFade(true);
      }, 600);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" data-screen-label="01 Hero" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '120px 48px 80px',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(' + HERO_IMGS[imgIdx] + ')',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: fade ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }} />
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(20,12,8,0.5) 0%, rgba(20,12,8,0.4) 50%, rgba(20,12,8,0.72) 100%)',
      }} />

      {/* Top label */}
      <div style={{
        position: 'absolute', top: 96, left: 0, right: 0, zIndex: 1,
        display: 'flex', justifyContent: 'center',
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'all 1s ease 0.2s',
      }}>
        <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 8, textTransform: 'uppercase', color: '#fff', opacity: 0.55 }}>
          Flores Exóticas · Botanical Studio · Luxury Gifting
        </span>
      </div>

      {/* Headline */}
      <div style={{
        textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: 900,
        opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s',
      }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 120 * fs, lineHeight: 0.88, letterSpacing: -2, color: '#fff', textShadow: '0 2px 40px rgba(0,0,0,0.25)' }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 28 * fs, letterSpacing: 10, textTransform: 'uppercase', color: '#fff', opacity: 1, display: 'block', marginBottom: 12 }}>The</span>
          Flower<br /><em style={{ color: C.blushPale, fontStyle: 'italic' }}>Lab</em>
        </h1>
        <div style={{ marginTop: 24, fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 8, textTransform: 'uppercase', color: C.blushPale, opacity: 0.85 }}>
          Botanical Studio · Est. 2025
        </div>
        <p style={{ marginTop: 32, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 22 * fs, lineHeight: 1.6, color: '#fff', opacity: 0.85, maxWidth: 480, margin: '32px auto 0' }}>
          Cada arreglo es un experimento vivo — flores exóticas compuestas con ojo científico y alma sensorial.
        </p>
        <div style={{ marginTop: 48, display: 'flex', gap: 20, justifyContent: 'center' }}>
          <button onClick={() => document.getElementById('collections').scrollIntoView({ behavior: 'smooth' })} style={{ background: C.wine, border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: C.cream, padding: '16px 36px', transition: 'background 0.3s ease' }}
            onMouseEnter={e => e.currentTarget.style.background = C.blushDeep}
            onMouseLeave={e => e.currentTarget.style.background = C.wine}>Ver Colecciones</button>
          <button onClick={() => document.getElementById('studio').scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: '#fff', padding: '16px 36px', transition: 'background 0.3s ease' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>Nuestro Studio</button>
        </div>
      </div>

      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 1, opacity: visible ? 0.75 : 0, transition: 'opacity 1s ease 2s' }}>
        {HERO_IMGS.map((_, i) => (
          <button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 24 : 6, height: 6, background: '#fff', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s ease', opacity: i === imgIdx ? 1 : 0.4 }} />
        ))}
      </div>
    </section>
  );
}
// ─── Studio ──────────────────────────────────────────────────
function Studio() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const pillars = [
    { label: 'Rare', desc: 'Sourced from specialty growers across four continents. Never a common bloom.' },
    { label: 'Curated', desc: 'Each arrangement is considered like a composition — not assembled, but authored.' },
    { label: 'Elevated', desc: 'The packaging is part of the gift. Every detail is intentional.' },
    { label: 'Intentional', desc: 'We compose with a scientific eye. Structure, volume, and life — never decoration.' },
  ];

  return (
    <section id="studio" data-screen-label="02 Studio" ref={ref} style={{
      background: C.wine, color: C.cream, position: 'relative', overflow: 'hidden',
    }}>
      <DiamondPattern color={C.cream} opacity={0.05} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

          {/* Left: Text */}
          <div style={{
            opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(-40px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 8, color: C.blushPale, marginBottom: 24, opacity: 0.7 }}>
              THE STUDIO
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 72, lineHeight: 1, color: C.cream, marginBottom: 12 }}>
              Scientific<br /><em style={{ fontStyle: 'italic', color: C.blushPale }}>meets</em><br />Sensorial
            </h2>
            <div style={{ width: 40, height: 1, background: C.gold, margin: '32px 0' }} />
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 20, lineHeight: 1.7, color: C.cream, opacity: 0.85, marginBottom: 24 }}>
              El Lab habla de precisión y obsesión. Cada arreglo es un experimento en belleza botánica — una composición viva que solo puede venir de este studio.
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 13, lineHeight: 1.8, color: C.cream, opacity: 0.65 }}>
              We don't make bouquets. We compose botanical experiences — dramatic, sculptural, editorial. Flowers that feel like couture, with layers, structure, and life.
            </p>
          </div>

          {/* Right: Image + pillars */}
          <div style={{
            opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(40px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>
            <div style={{ marginBottom: 40, border: `1px solid rgba(255,255,255,0.1)` }}>
              <PlaceholderImg label="Studio interior · botanical workspace" height={300} bg="#4A1E28" stripe="#6E2A38" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.1)' }}>
              {pillars.map((p, i) => (
                <div key={p.label} style={{
                  background: C.wine, padding: '24px',
                  opacity: vis ? 1 : 0, transition: `all 0.8s ease ${0.4 + i * 0.1}s`,
                }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 22, color: C.gold, marginBottom: 8 }}>{p.label}</div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 11, lineHeight: 1.6, color: C.cream, opacity: 0.65 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Collections Section ─────────────────────────────────────
function Collections({ onNavigate }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const openContact = () => {
    setSelected(null);
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="collections" data-screen-label="03 Colecciones" ref={ref} style={{
      background: C.cream, position: 'relative', overflow: 'hidden',
    }} className="section-pad">
      <GridPattern />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          textAlign: 'center', marginBottom: 72,
          opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
        }}>
          <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 8, color: C.wine, marginBottom: 16, opacity: 0.7 }}>COLECCIONES</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 64, lineHeight: 1.1, color: C.ink }}>
            Compuesto con<br /><em style={{ fontStyle: 'italic', color: C.wine }}>intención</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, background: C.creamDark }}>
          {COLLECTIONS.map((col, i) => (
            <div
              key={col.id}
              onMouseEnter={() => setHovered(col.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onNavigate ? onNavigate(col.id) : setSelected(col)}
              style={{
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                background: hovered === col.id ? col.bg : C.cream,
                transition: 'background 0.35s ease',
                opacity: vis ? 1 : 0,
                transform: vis ? 'translateY(0)' : 'translateY(16px)',
                transitionDelay: (0.1 + i * 0.07) + 's',
                transitionProperty: 'opacity, transform, background',
                transitionDuration: '0.7s, 0.7s, 0.35s',
                transitionTimingFunction: 'ease',
              }}
            >
              <PlaceholderImg label={col.name} height={220} bg={col.accentLight} stripe={col.accent} />
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 220,
                background: 'linear-gradient(to top, ' + col.accent + 'BB 0%, ' + col.accent + '00 55%)',
                opacity: hovered === col.id ? 1 : 0,
                transition: 'opacity 0.35s ease',
              }} />
              <div style={{ padding: '18px 20px 22px', position: 'relative' }}>
                <div style={{
                  width: hovered === col.id ? 36 : 20, height: 2, background: col.accent,
                  marginBottom: 10, transition: 'width 0.3s ease',
                }} />
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 22, color: C.ink, lineHeight: 1.2, marginBottom: 4 }}>
                  {col.name}
                </h3>
                <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: 3, color: col.accent, marginBottom: 10, opacity: 0.85 }}>
                  {col.tagline.toUpperCase()}
                </div>
                {hovered === col.id && (
                  <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, color: C.inkSoft, lineHeight: 1.5, opacity: 0.7, marginBottom: 8 }}>
                    {col.flowers}
                  </div>
                )}
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 17, color: col.accent }}>
                  {col.price}
                </div>
              </div>
            </div>
          ))}


        </div>
      </div>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(28,20,16,0.5)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: C.cream, maxWidth: 560, width: '90%',
              padding: '52px 48px', position: 'relative',
              animation: 'fadeUp 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <style>{'@keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }'}</style>
            <button onClick={() => setSelected(null)} style={{
              position: 'absolute', top: 20, right: 24, background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9,
              letterSpacing: 3, color: C.ink, opacity: 0.4,
            }}>CERRAR ×</button>
            <div style={{ width: 32, height: 3, background: selected.accent, marginBottom: 24 }} />
            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 5, color: selected.accent, marginBottom: 12, opacity: 0.8 }}>
              {selected.tagline.toUpperCase()}
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 48, color: C.ink, marginBottom: 20, lineHeight: 1.1 }}>
              {selected.name}
            </h3>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 19, lineHeight: 1.7, color: C.inkSoft, opacity: 0.8, marginBottom: 24 }}>
              {selected.desc}
            </p>
            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 3, color: C.inkSoft, opacity: 0.5, marginBottom: 6 }}>FLORES SUGERIDAS</div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 13, color: C.inkSoft, opacity: 0.75, marginBottom: 32, lineHeight: 1.6 }}>
              {selected.flowers}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 24 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 28, color: selected.accent }}>{selected.price}</div>
              <button onClick={openContact} style={{
                background: selected.accent, border: 'none', cursor: 'pointer',
                fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9,
                letterSpacing: 4, textTransform: 'uppercase', color: C.cream,
                padding: '14px 28px',
              }}>Solicitar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


// ─── Gifting ─────────────────────────────────────────────────
function Gifting() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const giftTiers = [
    { name: 'The Letter', desc: 'Handwritten note + stem. Minimal. Considered.', price: '—', accent: C.blushPale },
    { name: 'The Offering', desc: 'Curated arrangement in signature box with tissue wrap.', price: '—', accent: C.blush },
    { name: 'The Opus', desc: 'Bespoke commission. Full styling. White-glove delivery.', price: '—', accent: C.wine },
  ];

  return (
    <section id="gifting" data-screen-label="04 Gifting" ref={ref} style={{
      background: C.creamDark, padding: '120px 80px', position: 'relative', overflow: 'hidden',
    }}>
      <BotanicalDotPattern color={C.blush} opacity={0.15} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 100, alignItems: 'start' }}>

          {/* Left */}
          <div style={{
            opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 1s ease',
          }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 8, color: C.wine, marginBottom: 24, opacity: 0.7 }}>LUXURY GIFTING</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 64, lineHeight: 1.05, color: C.ink, marginBottom: 32 }}>
              Regala con<br /><em style={{ fontStyle: 'italic', color: C.wine }}>intención</em>
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 19, lineHeight: 1.7, color: C.inkSoft, opacity: 0.8, marginBottom: 24 }}>
              She knows the difference between a phalaenopsis and a cymbidium. She expects the box to be as beautiful as what's inside.
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 13, lineHeight: 1.8, color: C.inkSoft, opacity: 0.6, marginBottom: 48 }}>
              Every gift from The Flower Lab arrives as an experience. Tissue. Box. Note. Each layer considered. Each material chosen.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, background: C.cream }}>
              <PlaceholderImg label="Packaging · cajas" height={220} bg="#D5C9BC" stripe={C.blushPale} />
              <PlaceholderImg label="Tissue wrap · bolsas" height={220} bg="#D5C9BC" stripe={C.blush} />
            </div>
          </div>

          {/* Right: Tiers */}
          <div style={{
            opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(30px)',
            transition: 'all 1s ease 0.2s',
          }}>
            <div style={{ marginBottom: 40 }}>
              <PlaceholderImg label="Gift presentation · studio styling" height={280} bg="#D5C9BC" stripe={C.wine} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {giftTiers.map((t, i) => (
                <div key={t.name} style={{
                  background: C.cream, padding: '28px 32px',
                  display: 'flex', alignItems: 'center', gap: 24,
                  borderLeft: `3px solid ${t.accent}`,
                  opacity: vis ? 1 : 0,
                  transition: `all 0.6s ease ${0.4 + i * 0.15}s`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.creamDark; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.cream; }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 26, color: C.ink, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 11, color: C.inkSoft, opacity: 0.6, lineHeight: 1.5 }}>{t.desc}</div>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 20, color: t.accent }}>{t.price}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <button onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })} style={{
                width: '100%', background: C.wine, border: 'none', cursor: 'pointer',
                fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9,
                letterSpacing: 5, textTransform: 'uppercase', color: C.cream,
                padding: '18px', transition: 'background 0.3s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.blushDeep}
              onMouseLeave={e => e.currentTarget.style.background = C.wine}
              >Begin a Gift</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ─────────────────────────────────────────────────
function Contact() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', type: 'arrangement', message: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid rgba(110,42,56,0.25)`,
    padding: '12px 0',
    fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 14,
    color: C.ink,
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" data-screen-label="05 Contact" ref={ref} style={{
      background: C.cream, padding: '120px 80px 80px', position: 'relative', overflow: 'hidden',
    }}>
      <GridPattern color={C.sage} opacity={0.04} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 120, alignItems: 'start' }}>

          {/* Left */}
          <div style={{
            opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease',
          }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 8, color: C.wine, marginBottom: 24, opacity: 0.7 }}>CONTACT</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 64, lineHeight: 1.05, color: C.ink, marginBottom: 32 }}>
              Begin your<br /><em style={{ fontStyle: 'italic', color: C.wine }}>experiment</em>
            </h2>
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 13, lineHeight: 1.9, color: C.inkSoft, opacity: 0.65, marginBottom: 56 }}>
              Every arrangement starts with a conversation. Tell us the occasion, the feeling, the recipient. We handle the rest — from sourcing to delivery.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {[
                { label: 'Studio', val: 'theflowerlab.com' },
                { label: 'Social', val: '@theflowerlab' },
                { label: 'Hours', val: 'Mon–Sat · 9am–7pm' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: 5, color: C.wine, opacity: 0.6, marginBottom: 4 }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 20, color: C.ink }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div style={{
            opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease 0.2s',
          }}>
            {!sent ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                <div>
                  <label style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: 5, color: C.wine, opacity: 0.6, display: 'block', marginBottom: 8 }}>YOUR NAME</label>
                  <input
                    style={inputStyle}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onFocus={e => e.target.style.borderBottomColor = C.wine}
                    onBlur={e => e.target.style.borderBottomColor = 'rgba(110,42,56,0.25)'}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: 5, color: C.wine, opacity: 0.6, display: 'block', marginBottom: 8 }}>EMAIL</label>
                  <input
                    type="email"
                    style={inputStyle}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onFocus={e => e.target.style.borderBottomColor = C.wine}
                    onBlur={e => e.target.style.borderBottomColor = 'rgba(110,42,56,0.25)'}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: 5, color: C.wine, opacity: 0.6, display: 'block', marginBottom: 12 }}>TYPE OF INQUIRY</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['arrangement', 'gifting', 'event', 'other'].map(t => (
                      <button
                        key={t} type="button"
                        onClick={() => setForm(f => ({ ...f, type: t }))}
                        style={{
                          background: form.type === t ? C.wine : 'transparent',
                          border: `1px solid ${form.type === t ? C.wine : 'rgba(110,42,56,0.25)'}`,
                          cursor: 'pointer',
                          fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8,
                          letterSpacing: 4, textTransform: 'uppercase',
                          color: form.type === t ? C.cream : C.ink,
                          padding: '8px 14px', transition: 'all 0.2s ease',
                        }}
                      >{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: 5, color: C.wine, opacity: 0.6, display: 'block', marginBottom: 8 }}>MESSAGE</label>
                  <textarea
                    rows={5}
                    style={{ ...inputStyle, resize: 'none', borderBottom: 'none', border: `1px solid rgba(110,42,56,0.2)`, padding: '12px 16px' }}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" style={{
                  background: C.wine, border: 'none', cursor: 'pointer',
                  fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 9,
                  letterSpacing: 5, textTransform: 'uppercase', color: C.cream,
                  padding: '18px', transition: 'background 0.3s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.blushDeep}
                onMouseLeave={e => e.currentTarget.style.background = C.wine}
                >Send Inquiry</button>
              </form>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: 400, textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 60, color: C.wine, marginBottom: 24 }}>✿</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 32, color: C.ink, marginBottom: 16 }}>Thank you, {form.name}.</h3>
                <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 13, color: C.inkSoft, opacity: 0.65, lineHeight: 1.7 }}>
                  We'll be in touch within 24 hours to begin composing your arrangement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 1200, margin: '80px auto 0', paddingTop: 40, borderTop: `1px solid rgba(110,42,56,0.12)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 4, color: C.ink, opacity: 0.4 }}>
          © 2025 The Flower Lab · Botanical Studio · Confidential
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: C.wine, opacity: 0.6 }}>
          the Flower Lab
        </div>
        <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 4, color: C.ink, opacity: 0.4 }}>
          Rare · Curated · Elevated · Intentional
        </div>
      </div>
    </section>
  );
}

// ─── Price Utility ────────────────────────────────────────────
function parsePrice(str) {
  const m = str.match(/[\d,]+/);
  return m ? parseInt(m[0].replace(',', '')) : 0;
}

// ─── Cart Drawer ──────────────────────────────────────────────
function CartDrawer({ open, onClose, items, onQty, onRemove }) {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const handleWhatsApp = () => {
    const lines = items.map(i => `• ${i.name} (${i.size}) x${i.qty} — $${(i.price * i.qty).toLocaleString()}`).join('\n');
    const msg = `Hola! Me gustaría ordenar:\n\n${lines}\n\nSubtotal: $${total.toLocaleString()} MXN\nEnvío: $99 MXN\nTotal: $${(total+99).toLocaleString()} MXN\n\nPor favor confirmen disponibilidad. ¡Gracias! 🌸`;
    window.open(`https://wa.me/521XXXXXXXXXX?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(28,20,16,0.4)', zIndex: 200, backdropFilter: 'blur(2px)' }} />}
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, zIndex: 201,
        background: C.cream, boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ padding: '28px 32px 20px', borderBottom: `1px solid rgba(110,42,56,0.1)`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: 5, color: C.wine, opacity: 0.7, marginBottom: 4 }}>TU PEDIDO</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 26, color: C.ink }}>
              {totalItems === 0 ? 'Carrito vacío' : `${totalItems} ${totalItems === 1 ? 'arreglo' : 'arreglos'}`}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: C.ink, opacity: 0.4 }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 48, color: C.blushPale, marginBottom: 16 }}>✿</div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 12, letterSpacing: 2, color: C.ink, opacity: 0.4 }}>Agrega arreglos para comenzar</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 16, paddingBottom: 20, borderBottom: `1px solid rgba(110,42,56,0.08)` }}>
                  {/* Color swatch */}
                  <div style={{ width: 56, height: 56, background: item.accentLight, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 16, height: 16, background: item.accent, borderRadius: '50%' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18, color: C.ink, marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 3, color: item.accent, marginBottom: 10 }}>{item.size.toUpperCase()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                        <button onClick={() => onQty(idx, item.qty - 1)} style={{ width: 28, height: 28, background: 'transparent', border: `1px solid rgba(110,42,56,0.2)`, cursor: 'pointer', fontSize: 14, color: C.ink }}>−</button>
                        <span style={{ width: 32, textAlign: 'center', fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 13 }}>{item.qty}</span>
                        <button onClick={() => onQty(idx, item.qty + 1)} style={{ width: 28, height: 28, background: 'transparent', border: `1px solid rgba(110,42,56,0.2)`, cursor: 'pointer', fontSize: 14, color: C.ink }}>+</button>
                      </div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18, color: C.ink }}>${(item.price * item.qty).toLocaleString()}</div>
                    </div>
                  </div>
                  <button onClick={() => onRemove(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.ink, opacity: 0.25, fontSize: 12, alignSelf: 'flex-start', padding: 4 }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 32px 32px', borderTop: `1px solid rgba(110,42,56,0.1)` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, letterSpacing: 3, color: C.ink, opacity: 0.5 }}>SUBTOTAL</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 20, color: C.ink }}>${total.toLocaleString()} <span style={{ fontSize: 12, opacity: 0.5 }}>MXN</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(110,42,56,0.08)' }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, letterSpacing: 3, color: C.ink, opacity: 0.5 }}>ENVÍO</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 20, color: C.ink }}>$99 <span style={{ fontSize: 12, opacity: 0.5 }}>MXN</span></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, letterSpacing: 3, color: C.ink, opacity: 0.5 }}>TOTAL</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 28, color: C.ink }}>${(total + 99).toLocaleString()} <span style={{ fontSize: 14, opacity: 0.5 }}>MXN</span></span>
            </div>
            <button onClick={handleWhatsApp} style={{
              width: '100%', background: '#25D366', border: 'none', cursor: 'pointer',
              fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 10,
              letterSpacing: 4, textTransform: 'uppercase', color: '#fff',
              padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1da851'}
            onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Ordenar por WhatsApp
            </button>
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, color: C.ink, opacity: 0.35, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
              Confirmamos disponibilidad y precio final por WhatsApp
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Collection Detail Page ───────────────────────────────────
function CollectionDetail({ col, onBack, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState('Mediano');
  const [added, setAdded] = useState(false);
  const basePrice = parsePrice(col.price);

  const sizes = [
    { label: 'Pequeño', price: basePrice, desc: 'Arreglo compacto · ideal como detalle' },
    { label: 'Mediano', price: basePrice + 300, desc: 'Arreglo estándar · el más popular' },
    { label: 'Grande', price: basePrice + 700, desc: 'Arreglo premium · máximo impacto' },
  ];

  const currentSize = sizes.find(s => s.label === selectedSize);

  const handleAdd = () => {
    onAddToCart({
      collectionId: col.id,
      name: col.name,
      size: selectedSize,
      price: currentSize.price,
      accent: col.accent,
      accentLight: col.accentLight,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  return (
    <div style={{ minHeight: '100vh', background: col.bg, paddingTop: 100 }}>

      {/* Back */}
      <div style={{ padding: '0 80px', marginBottom: 0 }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9,
          letterSpacing: 4, color: C.ink, opacity: 0.5, display: 'flex', alignItems: 'center', gap: 8,
          padding: 0,
        }}>
          ← COLECCIONES
        </button>
      </div>

      {/* Hero placeholder */}
      <div style={{ margin: '32px 80px 0', position: 'relative', overflow: 'hidden' }}>
        <PlaceholderImg label={col.name + ' · ' + col.tagline} height={480} bg={col.accentLight} stripe={col.accent} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 160,
          background: `linear-gradient(to top, ${col.bg} 0%, transparent 100%)`,
        }} />
      </div>

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, padding: '60px 80px 120px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Left: Info */}
        <div>
          <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 6, color: col.accent, marginBottom: 16 }}>{col.tagline.toUpperCase()}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 72, lineHeight: 1, color: C.ink, marginBottom: 32 }}>{col.name}</h1>
          <div style={{ width: 40, height: 1, background: col.accent, marginBottom: 32 }} />
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300, fontSize: 20, lineHeight: 1.7, color: C.inkSoft, marginBottom: 32 }}>{col.desc}</p>
          <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 10, letterSpacing: 3, color: C.ink, opacity: 0.5, marginBottom: 8 }}>FLORES</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 18, color: C.ink, lineHeight: 1.6 }}>{col.flowers}</div>

          {/* More placeholder images */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 48 }}>
            <PlaceholderImg label="detalle · composición" height={200} bg={col.accentLight} stripe={col.accent} />
            <PlaceholderImg label="presentación · empaque" height={200} bg={col.accentLight} stripe={col.accent} />
          </div>
        </div>

        {/* Right: Order */}
        <div>
          <div style={{ background: C.cream, padding: '40px', position: 'sticky', top: 120 }}>
            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 5, color: C.wine, marginBottom: 24, opacity: 0.7 }}>SELECCIONA TU ARREGLO</div>

            {/* Size selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {sizes.map(s => (
                <button key={s.label} onClick={() => setSelectedSize(s.label)} style={{
                  background: selectedSize === s.label ? col.accentLight : 'transparent',
                  border: `1px solid ${selectedSize === s.label ? col.accent : 'rgba(110,42,56,0.15)'}`,
                  cursor: 'pointer', padding: '16px 20px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 20, color: C.ink, marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, letterSpacing: 2, color: C.ink, opacity: 0.5 }}>{s.desc}</div>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 20, color: col.accent }}>${s.price.toLocaleString()}</div>
                </button>
              ))}
            </div>

            {/* Add to cart */}
            <button onClick={handleAdd} style={{
              width: '100%', background: added ? col.accent : C.wine, border: 'none', cursor: 'pointer',
              fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: 10,
              letterSpacing: 4, textTransform: 'uppercase', color: C.cream,
              padding: '18px', transition: 'background 0.3s ease',
            }}>
              {added ? '✓ Agregado al carrito' : `Agregar — $${currentSize.price.toLocaleString()}`}
            </button>

            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 9, color: C.ink, opacity: 0.4, textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
              Confirmaremos disponibilidad y fecha de entrega por WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────
function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [currentCollection, setCurrentCollection] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('flowerlab_cart') || '[]'); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const { useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakSlider } = window;
  const [tweaks] = useTweaks(TWEAK_DEFAULTS);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('flowerlab_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const m = hash.match(/^#collection\/(.+)$/);
      setCurrentCollection(m ? m[1] : null);
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ['studio', 'collections', 'gifting', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const addToCart = (item) => {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.collectionId === item.collectionId && i.size === item.size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (idx, qty) => {
    if (qty <= 0) {
      setCartItems(prev => prev.filter((_, i) => i !== idx));
    } else {
      setCartItems(prev => prev.map((item, i) => i === idx ? { ...item, qty } : item));
    }
  };

  const removeItem = (idx) => setCartItems(prev => prev.filter((_, i) => i !== idx));
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);

  const col = currentCollection ? COLLECTIONS.find(c => c.id === currentCollection) : null;

  return (
    <div>
      <EmailPopup />
      <Nav
        scrolled={scrolled}
        activeSection={activeSection}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onNavigate={(id) => { window.location.href = 'collection.html?id=' + id; }}
      />
      {col ? (
        <CollectionDetail
          col={col}
          onBack={() => { window.location.hash = ''; window.scrollTo({ top: 0 }); }}
          onAddToCart={addToCart}
        />
      ) : (
        <>
          <Hero tweaks={tweaks} />
          <Studio />
          <Collections onNavigate={(id) => { window.location.hash = '#collection/' + id; }} />
          <Gifting />
          <Contact />
        </>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} onQty={updateQty} onRemove={removeItem} />
      <TweaksPanel>
        <TweakSection label="Hero">
          <TweakRadio id="heroLayout" label="Layout" options={['centered', 'left']} />
          <TweakToggle id="showPattern" label="Dot Pattern" />
          <TweakSlider id="fontScale" label="Headline Scale" min={0.7} max={1.3} step={0.05} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
