import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

const links = [
  { to: '/', label: 'Summary', end: true },
  { to: '/inputs', label: 'Inputs' },
  { to: '/calculations', label: 'Calculations' },
]

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Fly Express</p>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Financial Projections</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-sky-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 text-sm text-slate-500">
        Values persist in this browser via localStorage. Currency shown in UGX.
      </footer>
    </div>
  )
}
