import { AppBadgeText, AppIcon } from '../../../shared/components'
import {
  GIFT_METHOD_LABEL,
  GIFT_SIDE_LABEL,
} from '../constants'
import type { GiftDeskEntry } from '../types'
import {
  formatReceivedAt,
  formatWon,
} from '../utils/giftDesk'

type GiftDeskTableProps = {
  entries: GiftDeskEntry[]
  onDelete: (entry: GiftDeskEntry) => void
  onEdit: (entry: GiftDeskEntry) => void
}

const getSideTone = (side: GiftDeskEntry['side']) =>
  side === 'groom' ? 'blue' : 'pink'

const getMethodTone = (method: GiftDeskEntry['method']) =>
  method === 'cash' ? 'gray' : 'orange'

const GiftDeskTable = ({
  entries,
  onDelete,
  onEdit,
}: GiftDeskTableProps) => {
  if (entries.length === 0) {
    return (
      <div className="ledger-empty">
        <strong>접수 내역이 없습니다.</strong>
        <span>현재 검색 조건과 일치하는 명부가 없습니다.</span>
      </div>
    )
  }

  return (
    <div className="ledger-table">
      <div className="ledger-table__head">
        <span>접수</span>
        <span>이름</span>
        <span>구분</span>
        <span>관계/소속</span>
        <span>금액</span>
        <span>납부</span>
        <span>메모</span>
        <span>관리</span>
      </div>
      <div className="ledger-table__body">
        {entries.map((entry) => (
          <article
            className="ledger-row"
            key={entry.id}
          >
            <div className="ledger-row__time">
              <strong>{formatReceivedAt(entry.receivedAt)}</strong>
            </div>
            <div className="ledger-row__name">
              <strong>{entry.guestName}</strong>
              <span>{entry.attendant || '접수자 미지정'}</span>
            </div>
            <div>
              <AppBadgeText tone={getSideTone(entry.side)}>
                {GIFT_SIDE_LABEL[entry.side]}
              </AppBadgeText>
            </div>
            <div className="ledger-row__sub">
              <strong>{entry.relation || '-'}</strong>
              <span>{entry.affiliation || '-'}</span>
            </div>
            <div className="ledger-row__amount">{formatWon(entry.amount)}</div>
            <div>
              <AppBadgeText tone={getMethodTone(entry.method)}>
                {GIFT_METHOD_LABEL[entry.method]}
              </AppBadgeText>
            </div>
            <div className="ledger-row__memo">{entry.memo || '-'}</div>
            <div className="ledger-row__actions">
              <button
                aria-label={`${entry.guestName} 수정`}
                className="icon-button"
                onClick={() => onEdit(entry)}
                title="수정"
                type="button"
              >
                <AppIcon name="edit" />
              </button>
              <button
                aria-label={`${entry.guestName} 삭제`}
                className="icon-button icon-button--danger"
                onClick={() => onDelete(entry)}
                title="삭제"
                type="button"
              >
                <AppIcon name="trash" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default GiftDeskTable
