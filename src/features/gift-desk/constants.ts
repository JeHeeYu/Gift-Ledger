import type {
  GiftDeskSideFilter,
  GiftDeskSortMode,
  GiftMethod,
  GiftSide,
} from './types'

export const GIFT_DESK_STORAGE_KEY = 'gift-desk:v1:entries'
export const LEGACY_GIFT_LEDGER_STORAGE_KEY = 'gift-ledger:v1:entries'

export const GIFT_SIDE_LABEL: Record<GiftSide, string> = {
  bride: '신부측',
  groom: '신랑측',
}

export const GIFT_SIDE_FILTER_LABEL: Record<GiftDeskSideFilter, string> = {
  all: '전체',
  bride: GIFT_SIDE_LABEL.bride,
  groom: GIFT_SIDE_LABEL.groom,
}

export const GIFT_METHOD_LABEL: Record<GiftMethod, string> = {
  cash: '현금',
  transfer: '계좌',
}

export const GIFT_SORT_LABEL: Record<GiftDeskSortMode, string> = {
  amountDesc: '금액 높은순',
  nameAsc: '이름순',
  recent: '최근 등록순',
}

export const AMOUNT_PRESETS = [
  50_000,
  100_000,
  150_000,
  200_000,
  300_000,
  500_000,
  1_000_000,
] as const

export const RELATION_OPTIONS = [
  '친구',
  '직장',
  '가족',
  '친척',
  '지인',
  '동호회',
  '거래처',
] as const
