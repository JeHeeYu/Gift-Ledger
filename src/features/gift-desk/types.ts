export type GiftSide = 'bride' | 'groom'

export type GiftMethod = 'cash' | 'transfer'

export type GiftDeskEntry = {
  affiliation: string
  amount: number
  attendant: string
  guestName: string
  id: string
  memo: string
  method: GiftMethod
  receivedAt: string
  relation: string
  side: GiftSide
}

export type GiftDeskFormState = {
  affiliation: string
  amountText: string
  attendant: string
  guestName: string
  memo: string
  method: GiftMethod
  relation: string
  side: GiftSide
}

export type GiftDeskSideFilter = 'all' | GiftSide

export type GiftDeskSortMode = 'amountDesc' | 'nameAsc' | 'recent'

export type GiftDeskSyncState = {
  eventId: string
  lastSyncedAt: string | null
  message: string
  mode: 'firebase' | 'local'
  status: 'connecting' | 'error' | 'local' | 'online'
}

export type GiftDeskSummary = {
  brideCount: number
  brideTotal: number
  cashTotal: number
  count: number
  groomCount: number
  groomTotal: number
  total: number
  transferTotal: number
}
