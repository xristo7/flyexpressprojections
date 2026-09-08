import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { InputsDrawer } from './InputsDrawer'
import { useInputsDrawer } from './InputsDrawerContext'
import { KpiCards } from './KpiCards'

export function Layout({ children }: { children: ReactNode }) {
  const { open, openDrawer, closeDrawer } = useInputsDrawer()
  const location = useLocation()
  const navigate = useNavigate()

  const inputsActive = open

  const goHome = () => {
    closeDrawer()
    if (location.pathname !== '/') {
      navigate('/')
    }
  }

  return (
    <div
      className={[
        'flex min-h-screen flex-col',
        open ? 'h-[100dvh] overflow-hidden' : '',
      ].join(' ')}
    >
      {/*
        When inputs are open: upper region is ONLY header + KPI cards.
        Drawer fills the rest and covers Projection Summary on all breakpoints.
      */}
      <div
        className={[
          'flex min-h-0 flex-col',
          open ? 'shrink-0' : 'flex-1',
        ].join(' ')}
      >
        <header className="sticky top-0 z-20 shrink-0 border-b border-slate-200/80 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
            <button
              type="button"
              onClick={goHome}
              className="min-w-0 text-left transition hover:opacity-90"
              aria-label="Fly Express Financial Projections — back to summary"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                Fly Express
              </p>
              <h1 className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                Financial Projections
              </h1>
            </button>

            <button
              type="button"
              onClick={() => {
                if (location.pathname !== '/' && location.pathname !== '/inputs') {
                  navigate('/')
                }
                openDrawer()
              }}
              className={[
                'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition',
                inputsActive
                  ? 'bg-sky-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              ].join(' ')}
              aria-expanded={open}
            >
              Inputs
            </button>
          </div>
        </header>

        {open && (
          <div className="z-10 shrink-0 border-b border-[#0b3d91]/40 bg-[#0b3d91]/5 px-4 py-2.5 backdrop-blur sm:py-3">
            <div className="mx-auto w-full max-w-6xl">
              <KpiCards compact />
            </div>
          </div>
        )}

        <main
          className={[
            'scroll-panel mx-auto w-full max-w-6xl flex-1 px-4 py-8',
            open ? 'hidden' : '',
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
            Values persist in this browser via localStorage. Currency shown in USh.
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
