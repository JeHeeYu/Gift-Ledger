import type { FormEvent } from 'react'
import {
  AMOUNT_PRESETS,
  GIFT_METHOD_LABEL,
  GIFT_SIDE_LABEL,
  RELATION_OPTIONS,
} from '../constants'
import type { GiftLedgerFormState } from '../types'
import {
  formatCompactWon,
  formatCurrency,
  normalizeAmountText,
  parseAmount,
} from '../utils/giftLedger'
import { AppButton, AppIcon } from '../../../shared/components'

type GiftLedgerFormProps = {
  duplicateNameCount: number
  form: GiftLedgerFormState
  isEditing: boolean
  onCancelEdit: () => void
  onChange: <FieldName extends keyof GiftLedgerFormState>(
    fieldName: FieldName,
    value: GiftLedgerFormState[FieldName],
  ) => void
  onSubmit: () => void
}

const GiftLedgerForm = ({
  duplicateNameCount,
  form,
  isEditing,
  onCancelEdit,
  onChange,
  onSubmit,
}: GiftLedgerFormProps) => {
  const amount = parseAmount(form.amountText)
  const isSubmitDisabled = !form.guestName.trim() || amount <= 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isSubmitDisabled) {
      onSubmit()
    }
  }

  return (
    <form
      className="ledger-form"
      onSubmit={handleSubmit}
    >
      <div className="panel-heading">
        <div>
          <span>Guest Entry</span>
          <h2>{isEditing ? '명부 수정' : '빠른 등록'}</h2>
        </div>
        {isEditing ? (
          <button
            aria-label="수정 취소"
            className="icon-button"
            onClick={onCancelEdit}
            type="button"
          >
            <AppIcon name="x" />
          </button>
        ) : null}
      </div>

      <div className="segmented-control segmented-control--two">
        {(['groom', 'bride'] as const).map((side) => (
          <button
            className={form.side === side ? 'is-active' : ''}
            key={side}
            onClick={() => onChange('side', side)}
            type="button"
          >
            {GIFT_SIDE_LABEL[side]}
          </button>
        ))}
      </div>

      <label className="form-field">
        <span>이름</span>
        <input
          autoComplete="off"
          onChange={(event) => onChange('guestName', event.target.value)}
          placeholder="하객 이름"
          value={form.guestName}
        />
      </label>

      {duplicateNameCount > 0 ? (
        <div className="duplicate-notice">
          같은 이름으로 등록된 내역이 {duplicateNameCount}건 있습니다.
        </div>
      ) : null}

      <label className="form-field form-field--amount">
        <span>금액</span>
        <input
          inputMode="numeric"
          onChange={(event) =>
            onChange('amountText', normalizeAmountText(event.target.value))
          }
          placeholder="0"
          value={form.amountText ? formatCurrency(amount) : ''}
        />
      </label>

      <div className="amount-preset-grid">
        {AMOUNT_PRESETS.map((preset) => (
          <button
            className={amount === preset ? 'is-active' : ''}
            key={preset}
            onClick={() => onChange('amountText', String(preset))}
            type="button"
          >
            {formatCompactWon(preset)}
          </button>
        ))}
      </div>

      <div className="form-grid form-grid--two">
        <label className="form-field">
          <span>관계</span>
          <select
            onChange={(event) => onChange('relation', event.target.value)}
            value={form.relation}
          >
            <option value="">선택</option>
            {RELATION_OPTIONS.map((relation) => (
              <option
                key={relation}
                value={relation}
              >
                {relation}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>납부</span>
          <select
            onChange={(event) =>
              onChange('method', event.target.value === 'transfer' ? 'transfer' : 'cash')
            }
            value={form.method}
          >
            {(['cash', 'transfer'] as const).map((method) => (
              <option
                key={method}
                value={method}
              >
                {GIFT_METHOD_LABEL[method]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-field">
        <span>소속</span>
        <input
          autoComplete="off"
          onChange={(event) => onChange('affiliation', event.target.value)}
          placeholder="회사, 학교, 모임"
          value={form.affiliation}
        />
      </label>

      <label className="form-field">
        <span>접수자</span>
        <input
          autoComplete="off"
          onChange={(event) => onChange('attendant', event.target.value)}
          placeholder="담당자"
          value={form.attendant}
        />
      </label>

      <label className="form-field">
        <span>메모</span>
        <textarea
          onChange={(event) => onChange('memo', event.target.value)}
          placeholder="동명이인, 전달사항"
          rows={3}
          value={form.memo}
        />
      </label>

      <div className="ledger-form__actions">
        {isEditing ? (
          <AppButton
            onClick={onCancelEdit}
            variant="secondary"
          >
            취소
          </AppButton>
        ) : null}
        <AppButton
          className="ledger-form__submit"
          disabled={isSubmitDisabled}
          leadingIcon={<AppIcon name={isEditing ? 'check' : 'plus'} />}
          type="submit"
        >
          {isEditing ? '수정 완료' : '등록'}
        </AppButton>
      </div>
    </form>
  )
}

export default GiftLedgerForm
