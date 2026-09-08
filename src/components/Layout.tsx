import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { InputsDrawer } from './InputsDrawer'
import { useInputsDrawer } from './InputsDrawerContext'
import { KpiCards } from './KpiCards'

export function Layout({ children }: { children: ReactNode }) {
  const { open, openDrawer, closeDrawer } = useInputsDrawer()
  const location = useLocation()
  const navigate = useNavigate()

  const summaryActive = location.pathname === '/' && !open
  const inputsActive = open

  return (
    <div
      className={[
        'min-h-screen flex flex-col',
        open ? 'h-[100dvh] overflow-hidden' : '',
      ].join(' ')}
    >
      {/* Upper region: full height when closed; remaining viewport above drawer when open */}
      <div
        className={[
          'flex min-h-0 flex-1 flex-col',
          open
            ? 'h-[50dvh] max-h-[50dvh] md:h-[66.667dvh] md:max-h-[66.667dvh]'
            : '',
        ].join(' ')}
      >
        <header className="sticky top-0 z-20 shrink-0 border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                Fly Express
              </p>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Financial Projections
              </h1>
            </div>
            <nav className="flex flex-wrap gap-2" aria-label="Primary">
              <NavLink
                to="/"
                end
                onClick={() => closeDrawer()}
                className={() =>
                  [
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    summaryActive
                      ? 'bg-sky-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  ].join(' ')}
                }
              >
                Summary
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  if (location.pathname !== '/' && location.pathname !== '/inputs') {
                    navigate('/')
                  }
                  openDrawer()
                }}
                className={[
                  'rounded-full px-4 py-2 text-sm font-medium transition',
                  inputsActive
                    ? 'bg-sky-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                ].join(' ')}
                aria-expanded={open}
              >
                Inputs
              </button>
            </nav>
          </div>
        </header>

        {/* Sticky live KPIs while inputs drawer is open */}
        {open && (
          <div className="sticky top-0 z-10 shrink-0 border-b border-slate-200/80 bg-white/95 px-4 py-2.5 backdrop-blur sm:py-3">
            <div className="mx-auto w-full max-w-6xl">
              <KpiCards compact />
            </div>
          </div>
        )}

        <main
          className={[
            'scroll-panel mx-auto w-full max-w-6xl flex-1 px-4 py-8',
            open ? 'min-h-0 overflow-y-auto' : '',
          ].join(' ')}
        >
          {children}
        </main>

        <footer
          className={[
            'mx-auto w-full max-w-6xl shrink-0 px-4 pb-10 text-sm text-slate-500',
            open ? 'hidden' : '',
          ].join(' ')}
        >
          <p>
            Values persist in this browser via localStorage. Currency shown in UGX.
            {' · '}
            <Link
              to="/calculations"
              onClick={() => closeDrawer()}
              className="font-medium text-sky-700 underline-offset-2 hover:underline"
            >
              How calculations work
            </Link>
          </p>
        </footer>
      </div>

      <InputsDrawer />
    </div>
  )
}
