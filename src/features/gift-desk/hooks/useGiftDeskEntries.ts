import { useEffect, useState } from 'react'
import {
  removeGiftDeskEntry,
  subscribeGiftDeskEntries,
  upsertGiftDeskEntry,
} from '../api'
import {
  giftDeskEventId,
  isFirebaseConfigured,
} from '../../../shared/config/firebase'
import {
  loadGiftDeskEntries,
  saveGiftDeskEntries,
} from '../stores/giftDeskStorage'
import type {
  GiftDeskEntry,
  GiftDeskSyncState,
} from '../types'

const createInitialSyncState = (): GiftDeskSyncState => {
  if (!isFirebaseConfigured) {
    return {
      eventId: giftDeskEventId,
      lastSyncedAt: null,
      message: 'Firebase 설정 없음',
      mode: 'local',
      status: 'local',
    }
  }

  return {
    eventId: giftDeskEventId,
    lastSyncedAt: null,
    message: 'Firebase 연결 중',
    mode: 'firebase',
    status: 'connecting',
  }
}

export const useGiftDeskEntries = () => {
  const [entries, setEntries] = useState<GiftDeskEntry[]>(() =>
    loadGiftDeskEntries(),
  )
  const [syncState, setSyncState] = useState<GiftDeskSyncState>(() =>
    createInitialSyncState(),
  )

  useEffect(() => {
    saveGiftDeskEntries(entries)
  }, [entries])

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return undefined
    }

    let isMounted = true
    let unsubscribe: (() => void) | null = null

    void subscribeGiftDeskEntries({
      onChange: (remoteEntries) => {
        if (!isMounted) {
          return
        }

        setEntries(remoteEntries)
        setSyncState((currentState) => ({
          ...currentState,
          lastSyncedAt: new Date().toISOString(),
          message: '실시간 동기화 중',
          status: 'online',
        }))
      },
      onError: (error) => {
        if (!isMounted) {
          return
        }

        setSyncState((currentState) => ({
          ...currentState,
          message: error.message,
          status: 'error',
        }))
      },
    })
      .then((remoteUnsubscribe) => {
        unsubscribe = remoteUnsubscribe
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return
        }

        setSyncState((currentState) => ({
          ...currentState,
          message:
            error instanceof Error ? error.message : 'Firebase 연결 실패',
          status: 'error',
        }))
      })

    return () => {
      isMounted = false
      unsubscribe?.()
    }
  }, [])

  const reportWriteError = (error: unknown) => {
    setSyncState((currentState) => ({
      ...currentState,
      message: error instanceof Error ? error.message : 'Firebase 저장 실패',
      status: 'error',
    }))
  }

  const addEntry = (entry: GiftDeskEntry) => {
    setEntries((currentEntries) => [entry, ...currentEntries])

    if (isFirebaseConfigured) {
      void upsertGiftDeskEntry(entry).catch(reportWriteError)
    }
  }

  const updateEntry = (entry: GiftDeskEntry) => {
    setEntries((currentEntries) =>
      currentEntries.map((currentEntry) =>
        currentEntry.id === entry.id ? entry : currentEntry,
      ),
    )

    if (isFirebaseConfigured) {
      void upsertGiftDeskEntry(entry).catch(reportWriteError)
    }
  }

  const deleteEntry = (entryId: string) => {
    setEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== entryId),
    )

    if (isFirebaseConfigured) {
      void removeGiftDeskEntry(entryId).catch(reportWriteError)
    }
  }

  return {
    addEntry,
    deleteEntry,
    entries,
    syncState,
    updateEntry,
  }
}
