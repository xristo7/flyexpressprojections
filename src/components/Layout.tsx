import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { InputsDrawer } from './InputsDrawer'
import { useInputsDrawer } from './InputsDrawerContext'

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
        // Mobile split: when drawer open, constrain main to top 50vh
        open ? 'max-md:h-[100dvh] max-md:overflow-hidden' : '',
      ].join(' ')}
    >
      <header className="sticky top-0 z-20 shrink-0 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Fly Express</p>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Financial Projections</h1>
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
                ].join(' ')
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

      <div
        className={[
          'flex min-h-0 flex-1 flex-col',
          open ? 'max-md:h-[50dvh] max-md:max-h-[50dvh]' : '',
        ].join(' ')}
      >
        <main
          className={[
            'scroll-panel mx-auto w-full max-w-6xl flex-1 px-4 py-8',
            open
              ? 'max-md:min-h-0 max-md:overflow-y-auto md:overflow-y-auto'
              : '',
          ].join(' ')}
        >
          {children}
        </main>
        <footer
          className={[
            'mx-auto w-full max-w-6xl shrink-0 px-4 pb-10 text-sm text-slate-500',
            open ? 'max-md:hidden' : '',
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
