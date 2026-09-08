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
        'z-50 flex min-h-0 flex-1 flex-col bg-white shadow-2xl',
        'rounded-t-2xl border-t border-slate-200',
        'md:mx-[100px]',
        // Mobile: drawer itself scrolls (current good behavior)
        'max-md:scroll-panel max-md:overflow-y-auto max-md:overscroll-contain',
      ].join(' ')}
    >
      <div
        className={[
          'flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6',
          // Mobile sticky header while drawer scrolls
          'max-md:sticky max-md:top-0 max-md:z-10 max-md:bg-white/95 max-md:backdrop-blur',
        ].join(' ')}
      >
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

      {/*
        Desktop: scroll this padded surface so cards never bleed under the header.
        Mobile: padding only — outer drawer scrolls.
      */}
      <div
        className={[
          'px-4 pt-[50px] pb-[70px] md:px-6',
          'md:scroll-panel md:min-h-0 md:flex-1 md:overflow-y-auto md:overscroll-contain',
        ].join(' ')}
      >
        <InputsForm compact hideHeader />
      </div>
    </div>
  )
}
