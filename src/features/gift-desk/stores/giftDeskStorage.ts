import {
  GIFT_DESK_STORAGE_KEY,
  LEGACY_GIFT_LEDGER_STORAGE_KEY,
} from '../constants'
import type { GiftDeskEntry } from '../types'

const isGiftDeskEntry = (value: unknown): value is GiftDeskEntry => {
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

export const loadGiftDeskEntries = (): GiftDeskEntry[] => {
  try {
    const rawValue =
      window.localStorage.getItem(GIFT_DESK_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_GIFT_LEDGER_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue: unknown = JSON.parse(rawValue)

    if (!Array.isArray(parsedValue)) {
      return []
    }

    return parsedValue.filter(isGiftDeskEntry)
  } catch {
    return []
  }
}

export const saveGiftDeskEntries = (entries: GiftDeskEntry[]) => {
  window.localStorage.setItem(GIFT_DESK_STORAGE_KEY, JSON.stringify(entries))
}
