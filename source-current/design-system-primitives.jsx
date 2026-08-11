// ===== Design System Primitives =====
// 5 core components to reduce inline styles across screens

// Card with standardized padding
const Card = ({ padding = 'md', children, style, className = '', ...rest }) => {
  const pad = padding === 'sm' ? 12 : padding === 'lg' ? 24 : padding === 'none' ? 0 : 16;
  return (
    <div className={`card ${className}`} style={{padding: pad, ...style}} {...rest}>{children}</div>
  );
};

// Chip — unified variants
const Chip = ({ variant = 'default', size = 'md', dot, children, style }) => {
  const palette = {
    default:  { bg: 'var(--admin-bg)',                  fg: 'var(--admin-muted)',     bd: 'var(--admin-line)' },
    primary:  { bg: 'rgba(0,181,226,0.12)',             fg: 'var(--hycu-cyan-deep)',  bd: 'rgba(0,181,226,0.25)' },
    success:  { bg: 'rgba(34,160,107,0.12)',            fg: '#166B4A',                bd: 'rgba(34,160,107,0.25)' },
    warning:  { bg: 'rgba(229,142,64,0.14)',            fg: '#9C5B1F',                bd: 'rgba(229,142,64,0.3)' },
    critical: { bg: 'rgba(229,72,77,0.12)',             fg: '#B12126',                bd: 'rgba(229,72,77,0.3)' },
    neutral:  { bg: '#EEF1F5',                          fg: '#6B7280',                bd: '#D7DDE5' }};
  const c = palette[variant] || palette.default;
  const sz = size === 'sm' ? { p: '2px 7px', f: 10 } : size === 'lg' ? { p: '5px 12px', f: 12 } : { p: '3px 9px', f: 11 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: sz.p, fontSize: sz.f, borderRadius: 999,
      background: c.bg, color: c.fg, border: `1px solid ${c.bd}`,
      fontFamily: 'inherit', fontWeight: 600,
      ...style}}>
      {dot && <span style={{width: 5, height: 5, borderRadius: '50%', background: c.fg}}></span>}
      {children}
    </span>
  );
};

// Typography
const H1 = ({ children, style }) => (
  <h1 style={{fontFamily: 'inherit', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--admin-ink)', margin: 0, ...style}}>{children}</h1>
);
const H2 = ({ children, style }) => (
  <h2 style={{fontFamily: 'inherit', fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--admin-ink)', margin: 0, ...style}}>{children}</h2>
);
const H3 = ({ children, style }) => (
  <h3 style={{fontFamily: 'inherit', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--admin-ink)', margin: 0, ...style}}>{children}</h3>
);
const Body = ({ children, style, muted }) => (
  <span style={{fontSize: 14, color: muted ? 'var(--admin-muted)' : 'var(--admin-ink)', ...style}}>{children}</span>
);
const Caption = ({ children, style, muted = true }) => (
  <span style={{fontSize: 12, color: muted ? 'var(--admin-muted)' : 'var(--admin-ink)', ...style}}>{children}</span>
);

// Stack — vertical spacing
const Stack = ({ gap = 4, direction = 'column', children, style }) => {
  const gapMap = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 32, 8: 40 };
  return (
    <div style={{display: 'flex', flexDirection: direction, gap: gapMap[gap] || gap, ...style}}>{children}</div>
  );
};

Object.assign(window, { Card, Chip, H1, H2, H3, Body, Caption, Stack });
