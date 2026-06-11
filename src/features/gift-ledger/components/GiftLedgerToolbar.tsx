import {
  GIFT_SIDE_FILTER_LABEL,
  GIFT_SORT_LABEL,
} from '../constants'
import type {
  GiftLedgerSideFilter,
  GiftLedgerSortMode,
} from '../types'
import { AppIcon } from '../../../shared/components'

type GiftLedgerToolbarProps = {
  filter: GiftLedgerSideFilter
  resultCount: number
  searchQuery: string
  sortMode: GiftLedgerSortMode
  totalCount: number
  onFilterChange: (filter: GiftLedgerSideFilter) => void
  onSearchQueryChange: (searchQuery: string) => void
  onSortModeChange: (sortMode: GiftLedgerSortMode) => void
}

const FILTERS: GiftLedgerSideFilter[] = ['all', 'groom', 'bride']
const SORT_MODES: GiftLedgerSortMode[] = ['recent', 'amountDesc', 'nameAsc']

const GiftLedgerToolbar = ({
  filter,
  resultCount,
  searchQuery,
  sortMode,
  totalCount,
  onFilterChange,
  onSearchQueryChange,
  onSortModeChange,
}: GiftLedgerToolbarProps) => {
  return (
    <div className="ledger-toolbar">
      <div className="search-field">
        <AppIcon name="search" />
        <input
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="이름, 관계, 소속, 접수자 검색"
          value={searchQuery}
        />
      </div>
      <div className="ledger-toolbar__controls">
        <div className="segmented-control">
          {FILTERS.map((filterValue) => (
            <button
              className={filter === filterValue ? 'is-active' : ''}
              key={filterValue}
              onClick={() => onFilterChange(filterValue)}
              type="button"
            >
              {GIFT_SIDE_FILTER_LABEL[filterValue]}
            </button>
          ))}
        </div>
        <select
          className="sort-select"
          onChange={(event) =>
            onSortModeChange(event.target.value as GiftLedgerSortMode)
          }
          value={sortMode}
        >
          {SORT_MODES.map((mode) => (
            <option
              key={mode}
              value={mode}
            >
              {GIFT_SORT_LABEL[mode]}
            </option>
          ))}
        </select>
      </div>
      <div className="ledger-toolbar__count">
        {resultCount} / {totalCount}
      </div>
    </div>
  )
}

export default GiftLedgerToolbar
