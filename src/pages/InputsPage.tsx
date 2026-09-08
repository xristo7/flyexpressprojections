import { useLayoutEffect } from 'react'
import { SummaryPage } from './SummaryPage'
import { useInputsDrawer } from '../components/InputsDrawerContext'

/**
 * Visiting /inputs shows Summary underneath and opens the Inputs drawer
 * (no full-page takeover).
 */
export function InputsPage() {
  const { openDrawer } = useInputsDrawer()

  useLayoutEffect(() => {
    openDrawer()
  }, [openDrawer])

  return <SummaryPage />
}
