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
      message: '이 기기에만 저장',
      mode: 'local',
      status: 'local',
    }
  }

  return {
    eventId: giftDeskEventId,
    lastSyncedAt: null,
    message: '연결 중',
    mode: 'firebase',
    status: 'connecting',
  }
}

const getSyncErrorMessage = (error: unknown) => {
  if (!(error instanceof Error)) {
    return '서버 점검 필요'
  }

  if (error.message.includes('auth/configuration-not-found')) {
    return '인증 설정 필요'
  }

  if (error.message.includes('permission-denied')) {
    return '권한 확인 필요'
  }

  return '서버 점검 필요'
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
          message: '정상',
          status: 'online',
        }))
      },
      onError: (error) => {
        if (!isMounted) {
          return
        }

        setSyncState((currentState) => ({
          ...currentState,
          message: getSyncErrorMessage(error),
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
          message: getSyncErrorMessage(error),
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
      message: getSyncErrorMessage(error),
      status: 'error',
    }))
  }

  const runRemoteWrite = async (write: () => Promise<void>) => {
    if (!isFirebaseConfigured) {
      return
    }

    try {
      await write()
    } catch (error) {
      reportWriteError(error)
      throw error
    }
  }

  const addEntry = async (entry: GiftDeskEntry) => {
    setEntries((currentEntries) => [entry, ...currentEntries])

    await runRemoteWrite(() => upsertGiftDeskEntry(entry))
  }

  const updateEntry = async (entry: GiftDeskEntry) => {
    setEntries((currentEntries) =>
      currentEntries.map((currentEntry) =>
        currentEntry.id === entry.id ? entry : currentEntry,
      ),
    )

    await runRemoteWrite(() => upsertGiftDeskEntry(entry))
  }

  const deleteEntry = async (entryId: string) => {
    setEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== entryId),
    )

    await runRemoteWrite(() => removeGiftDeskEntry(entryId))
  }

  return {
    addEntry,
    deleteEntry,
    entries,
    syncState,
    updateEntry,
  }
}
