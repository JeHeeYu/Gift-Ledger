import { GIFT_LEDGER_STORAGE_KEY } from '../constants'
import type { GiftLedgerEntry } from '../types'

const isGiftLedgerEntry = (value: unknown): value is GiftLedgerEntry => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const entry = value as Record<string, unknown>

  return (
    typeof entry.id === 'string' &&
    typeof entry.guestName === 'string' &&
    typeof entry.amount === 'number' &&
    typeof entry.receivedAt === 'string' &&
    (entry.side === 'groom' || entry.side === 'bride') &&
    (entry.method === 'cash' || entry.method === 'transfer')
  )
}

export const loadGiftLedgerEntries = (): GiftLedgerEntry[] => {
  try {
    const rawValue = window.localStorage.getItem(GIFT_LEDGER_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue: unknown = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter(isGiftLedgerEntry)
  } catch {
    return []
  }
}

export const saveGiftLedgerEntries = (entries: GiftLedgerEntry[]) => {
  window.localStorage.setItem(GIFT_LEDGER_STORAGE_KEY, JSON.stringify(entries))
}
