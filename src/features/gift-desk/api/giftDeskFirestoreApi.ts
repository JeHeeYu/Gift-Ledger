import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  type FirestoreError,
  type Unsubscribe,
} from 'firebase/firestore'
import {
  ensureAnonymousFirebaseUser,
  getFirebaseClient,
  giftDeskEventId,
} from '../../../shared/config/firebase'
import type { GiftDeskEntry } from '../types'

const GIFT_DESK_EVENTS_COLLECTION = 'giftDeskEvents'
const GIFT_DESK_ENTRIES_COLLECTION = 'entries'

const isGiftDeskEntry = (value: unknown): value is GiftDeskEntry => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const entry = value as Record<string, unknown>

  return (
    typeof entry.affiliation === 'string' &&
    typeof entry.amount === 'number' &&
    typeof entry.attendant === 'string' &&
    typeof entry.guestName === 'string' &&
    typeof entry.id === 'string' &&
    typeof entry.memo === 'string' &&
    typeof entry.receivedAt === 'string' &&
    typeof entry.relation === 'string' &&
    (entry.method === 'cash' || entry.method === 'transfer') &&
    (entry.side === 'groom' || entry.side === 'bride')
  )
}

const getEntriesCollection = () => {
  const client = getFirebaseClient()

  if (!client) {
    throw new Error('Firebase is not configured.')
  }

  return collection(
    client.db,
    GIFT_DESK_EVENTS_COLLECTION,
    giftDeskEventId,
    GIFT_DESK_ENTRIES_COLLECTION,
  )
}

const getEntryDocument = (entryId: string) =>
  doc(getEntriesCollection(), entryId)

export const subscribeGiftDeskEntries = async ({
  onChange,
  onError,
}: {
  onChange: (entries: GiftDeskEntry[]) => void
  onError: (error: FirestoreError) => void
}): Promise<Unsubscribe> => {
  await ensureAnonymousFirebaseUser()

  const entriesQuery = query(
    getEntriesCollection(),
    orderBy('receivedAt', 'desc'),
  )

  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      const entries = snapshot.docs
        .map((snapshotDocument) => snapshotDocument.data())
        .filter(isGiftDeskEntry)

      onChange(entries)
    },
    onError,
  )
}

export const upsertGiftDeskEntry = async (entry: GiftDeskEntry) => {
  await ensureAnonymousFirebaseUser()
  await setDoc(getEntryDocument(entry.id), entry)
}

export const removeGiftDeskEntry = async (entryId: string) => {
  await ensureAnonymousFirebaseUser()
  await deleteDoc(getEntryDocument(entryId))
}
