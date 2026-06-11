export type GiftSide = 'bride' | 'groom'

export type GiftMethod = 'cash' | 'transfer'

export type GiftLedgerEntry = {
  affiliation: string
  amount: number
  attendant: string
  envelopeNo: string
  guestName: string
  id: string
  memo: string
  method: GiftMethod
  receivedAt: string
  relation: string
  side: GiftSide
}

export type GiftLedgerFormState = {
  affiliation: string
  amountText: string
  attendant: string
  envelopeNo: string
  guestName: string
  memo: string
  method: GiftMethod
  receivedAtLocal: string
  relation: string
  side: GiftSide
}

export type GiftLedgerSideFilter = 'all' | GiftSide

export type GiftLedgerSortMode = 'amountDesc' | 'nameAsc' | 'recent'

export type GiftLedgerSummary = {
  brideCount: number
  brideTotal: number
  cashTotal: number
  count: number
  groomCount: number
  groomTotal: number
  total: number
  transferTotal: number
}
