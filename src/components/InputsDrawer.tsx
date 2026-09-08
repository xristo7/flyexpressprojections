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
    // Focus close button when opening
    closeBtnRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeDrawer])

  return (
    <>
      {/* Backdrop — covers uncovered area only; desktop left ~2/3, mobile top ~1/2 */}
      <div
        aria-hidden={!open}
        className={[
          'fixed z-40 bg-slate-900/40 transition-opacity duration-300',
          // Mobile: top half
          'inset-x-0 top-0 h-[50dvh] md:h-auto',
          // Desktop: left 2/3
          'md:inset-y-0 md:left-0 md:right-[min(100%,33.333vw)] md:w-auto',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!open}
        className={[
          'fixed z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
          // Mobile: bottom half
          'inset-x-0 bottom-0 h-[50dvh] rounded-t-2xl border-t border-slate-200',
          'translate-y-full data-[open=true]:translate-y-0',
          // Desktop: right third
          'md:inset-y-0 md:right-0 md:bottom-auto md:left-auto',
          'md:h-full md:w-[min(100%,33.333vw)] md:min-w-[320px] md:rounded-none md:border-t-0 md:border-l md:border-slate-200',
          'md:translate-y-0 md:translate-x-full md:data-[open=true]:translate-x-0',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
        data-open={open}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-200 px-4 py-3">
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

        <div className="scroll-panel min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <InputsForm compact hideHeader />
        </div>
      </div>
    </>
  )
}
