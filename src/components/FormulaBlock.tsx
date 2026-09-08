import type { ReactNode } from 'react'

export function FormulaBlock({
  title,
  symbolic,
  substituted,
  results,
  children,
}: {
  title: string
  symbolic: string[]
  substituted: string[]
  results: { label: string; value: string }[]
  children?: ReactNode
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {children}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Symbolic</p>
          <ul className="mt-2 space-y-2 font-mono text-xs text-slate-700 sm:text-sm">
            {symbolic.map((line) => (
              <li key={line} className="rounded-lg bg-slate-50 px-3 py-2">{line}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Substituted</p>
          <ul className="mt-2 space-y-2 font-mono text-xs text-slate-700 sm:text-sm">
            {substituted.map((line) => (
              <li key={line} className="rounded-lg bg-amber-50 px-3 py-2">{line}</li>
            ))}
          </ul>
        </div>
      </div>
      <dl className="mt-4 grid gap-2 sm:grid-cols-2">
        {results.map((r) => (
          <div key={r.label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
            <dt className="text-xs text-slate-500">{r.label}</dt>
            <dd className="text-sm font-semibold text-slate-900">{r.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
