import { useEffect, useId, useRef } from 'react'
import { useDrivers } from './DriversContext'
import { InputsForm } from './InputsForm'
import { useInputsDrawer } from './InputsDrawerContext'

export function InputsDrawer() {
  const { open, closeDrawer } = useInputsDrawer()
  const { reset } = useDrivers()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer()
    }
    window.addEventListener('keydown', onKey)
    closeBtnRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeDrawer])

  if (!open) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={[
        // Scroll lives on the drawer itself — input cards sit on this surface
        'scroll-panel z-50 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-white shadow-2xl',
        'rounded-t-2xl border-t border-slate-200',
        'md:mx-[100px]',
      ].join(' ')}
    >
      <div className="sticky top-0 z-10 flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="min-w-0">
          <h2 id={titleId} className="text-lg font-bold text-slate-900">
            Inputs
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Changes save automatically to localStorage.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset to defaults
          </button>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Close inputs"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>
      </div>

      {/* Padding so card shadows sit fully on the drawer surface */}
      <div className="px-4 pt-[50px] pb-[70px] md:px-6">
        <InputsForm compact hideHeader />
      </div>
    </div>
  )
}
