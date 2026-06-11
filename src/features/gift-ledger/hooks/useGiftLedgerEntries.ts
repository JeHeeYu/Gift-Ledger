import { useEffect, useState } from 'react'
import {
  loadGiftLedgerEntries,
  saveGiftLedgerEntries,
} from '../stores/giftLedgerStorage'
import type { GiftLedgerEntry } from '../types'

export const useGiftLedgerEntries = () => {
  const [entries, setEntries] = useState<GiftLedgerEntry[]>(() =>
    loadGiftLedgerEntries(),
  )

  useEffect(() => {
    saveGiftLedgerEntries(entries)
  }, [entries])

  const addEntry = (entry: GiftLedgerEntry) => {
    setEntries((currentEntries) => [entry, ...currentEntries])
  }

  const updateEntry = (entry: GiftLedgerEntry) => {
    setEntries((currentEntries) =>
      currentEntries.map((currentEntry) =>
        currentEntry.id === entry.id ? entry : currentEntry,
      ),
    )
  }

  const deleteEntry = (entryId: string) => {
    setEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== entryId),
    )
  }

  return {
    addEntry,
    deleteEntry,
    entries,
    updateEntry,
  }
}
