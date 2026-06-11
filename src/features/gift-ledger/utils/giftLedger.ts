import {
  GIFT_METHOD_LABEL,
  GIFT_SIDE_LABEL,
} from '../constants'
import type {
  GiftLedgerEntry,
  GiftLedgerFormState,
  GiftLedgerSummary,
} from '../types'

const CSV_HEADERS = [
  '접수시간',
  '이름',
  '구분',
  '관계',
  '소속',
  '금액',
  '납부',
  '접수자',
  '메모',
] as const

export const createEntryId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('ko-KR').format(amount)

export const formatWon = (amount: number) => `${formatCurrency(amount)}원`

export const formatCompactWon = (amount: number) => {
  if (amount >= 10_000) {
    return `${formatCurrency(amount / 10_000)}만`
  }

  return formatWon(amount)
}

export const normalizeAmountText = (value: string) =>
  value.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '')

export const parseAmount = (value: string) => {
  const normalized = normalizeAmountText(value)

  return normalized ? Number(normalized) : 0
}

export const formatReceivedAt = (isoValue: string) => {
  const date = new Date(isoValue)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('ko-KR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
  }).format(date)
}

export const createEmptyFormState = (): GiftLedgerFormState => ({
  affiliation: '',
  amountText: '',
  attendant: '',
  guestName: '',
  memo: '',
  method: 'cash',
  relation: '',
  side: 'groom',
})

export const entryToFormState = (
  entry: GiftLedgerEntry,
): GiftLedgerFormState => ({
  affiliation: entry.affiliation,
  amountText: String(entry.amount),
  attendant: entry.attendant,
  guestName: entry.guestName,
  memo: entry.memo,
  method: entry.method,
  relation: entry.relation,
  side: entry.side,
})

export const createEntryFromForm = (
  form: GiftLedgerFormState,
  receivedAt = new Date().toISOString(),
): GiftLedgerEntry => ({
  affiliation: form.affiliation.trim(),
  amount: parseAmount(form.amountText),
  attendant: form.attendant.trim(),
  guestName: form.guestName.trim(),
  id: createEntryId(),
  memo: form.memo.trim(),
  method: form.method,
  receivedAt,
  relation: form.relation.trim(),
  side: form.side,
})

export const updateEntryFromForm = (
  entryId: string,
  form: GiftLedgerFormState,
  receivedAt: string,
): GiftLedgerEntry => ({
  ...createEntryFromForm(form, receivedAt),
  id: entryId,
})

export const calculateGiftLedgerSummary = (
  entries: GiftLedgerEntry[],
): GiftLedgerSummary =>
  entries.reduce<GiftLedgerSummary>(
    (summary, entry) => {
      summary.count += 1
      summary.total += entry.amount

      if (entry.side === 'groom') {
        summary.groomCount += 1
        summary.groomTotal += entry.amount
      } else {
        summary.brideCount += 1
        summary.brideTotal += entry.amount
      }

      if (entry.method === 'cash') {
        summary.cashTotal += entry.amount
      } else {
        summary.transferTotal += entry.amount
      }

      return summary
    },
    {
      brideCount: 0,
      brideTotal: 0,
      cashTotal: 0,
      count: 0,
      groomCount: 0,
      groomTotal: 0,
      total: 0,
      transferTotal: 0,
    },
  )

export const normalizeSearchText = (value: string) =>
  value.trim().toLocaleLowerCase('ko-KR')

export const doesEntryMatchSearch = (
  entry: GiftLedgerEntry,
  searchQuery: string,
) => {
  const normalizedQuery = normalizeSearchText(searchQuery)

  if (!normalizedQuery) {
    return true
  }

  return [
    entry.guestName,
    entry.relation,
    entry.affiliation,
    entry.attendant,
    entry.memo,
  ].some((value) => normalizeSearchText(value).includes(normalizedQuery))
}

const escapeCsvCell = (value: string | number) => {
  const text = String(value)

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

export const createGiftLedgerCsv = (entries: GiftLedgerEntry[]) => {
  const rows = entries.map((entry) => [
    formatReceivedAt(entry.receivedAt),
    entry.guestName,
    GIFT_SIDE_LABEL[entry.side],
    entry.relation,
    entry.affiliation,
    entry.amount,
    GIFT_METHOD_LABEL[entry.method],
    entry.attendant,
    entry.memo,
  ])

  return [CSV_HEADERS, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n')
}

export const downloadTextFile = (
  contents: string,
  filename: string,
  mimeType: string,
) => {
  const blob = new Blob([`\uFEFF${contents}`], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
