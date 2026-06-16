import { Outlet, NavLink } from 'react-router-dom'

const s = {
  wrap:    { minHeight: '100vh', background: '#0f1117', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  topbar:  { background: '#161b27', borderBottom: '1px solid #1e2433', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 24 },
  title:   { fontSize: '0.82rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: 8 },
  nav:     { display: 'flex', gap: 8 },
  link:    { padding: '4px 14px', borderRadius: 16, fontSize: '0.8rem', textDecoration: 'none', color: '#94a3b8', border: '1px solid #2d3748' },
  active:  { color: '#e2e8f0', borderColor: '#4a5568', background: '#1e2433' },
  main:    { padding: '32px' },
}

export default function InternalLayout() {
  return (
    <div style={s.wrap}>
      <div style={s.topbar}>
        <span style={s.title}>Internal</span>
        <nav style={s.nav}>
          <NavLink to="/internal/skills"   style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}>Skills Matrix</NavLink>
          <NavLink to="/internal/job-fit"  style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}>Job Fit</NavLink>
          <NavLink to="/internal/dashboard" style={({ isActive }) => ({ ...s.link, ...(isActive ? s.active : {}) })}>Dashboard</NavLink>
        </nav>
      </div>
      <div style={s.main}>
        <Outlet />
      </div>
    </div>
  )
}
