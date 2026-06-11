import { AppIcon } from '../../../shared/components'
import type { GiftDeskSummary } from '../types'
import { formatWon } from '../utils/giftDesk'

type GiftDeskSummaryCardsProps = {
  summary: GiftDeskSummary
}

const GiftDeskSummaryCards = ({ summary }: GiftDeskSummaryCardsProps) => {
  return (
    <section className="summary-grid">
      <article className="summary-card summary-card--primary">
        <div className="summary-card__icon">
          <AppIcon name="wallet" />
        </div>
        <div>
          <span>전체 접수</span>
          <strong>{formatWon(summary.total)}</strong>
          <small>{summary.count}명</small>
        </div>
      </article>
      <article className="summary-card">
        <div className="summary-card__icon summary-card__icon--blue">
          <AppIcon name="users" />
        </div>
        <div>
          <span>신랑측</span>
          <strong>{formatWon(summary.groomTotal)}</strong>
          <small>{summary.groomCount}명</small>
        </div>
      </article>
      <article className="summary-card">
        <div className="summary-card__icon summary-card__icon--pink">
          <AppIcon name="users" />
        </div>
        <div>
          <span>신부측</span>
          <strong>{formatWon(summary.brideTotal)}</strong>
          <small>{summary.brideCount}명</small>
        </div>
      </article>
      <article className="summary-card">
        <div className="summary-card__icon summary-card__icon--orange">
          <AppIcon name="chart" />
        </div>
        <div>
          <span>현금 / 계좌</span>
          <strong>
            {formatWon(summary.cashTotal)} / {formatWon(summary.transferTotal)}
          </strong>
          <small>수납 방식 기준</small>
        </div>
      </article>
    </section>
  )
}

export default GiftDeskSummaryCards
