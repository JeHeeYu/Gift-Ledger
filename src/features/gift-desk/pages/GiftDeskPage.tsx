import { useMemo, useState } from 'react'
import { AppConfirmModal } from '../../../shared/components'
import {
  GiftDeskForm,
  GiftDeskHeader,
  GiftDeskSummaryCards,
  GiftDeskTable,
  GiftDeskToolbar,
} from '../components'
import { useGiftDeskEntries } from '../hooks/useGiftDeskEntries'
import type {
  GiftDeskEntry,
  GiftDeskFormState,
  GiftDeskSideFilter,
  GiftDeskSortMode,
} from '../types'
import {
  calculateGiftDeskSummary,
  createEmptyFormState,
  createEntryFromForm,
  createGiftDeskCsv,
  doesEntryMatchSearch,
  downloadTextFile,
  entryToFormState,
  normalizeSearchText,
  updateEntryFromForm,
} from '../utils/giftDesk'

const sortEntries = (
  entries: GiftDeskEntry[],
  sortMode: GiftDeskSortMode,
) => {
  const nextEntries = [...entries]

  if (sortMode === 'amountDesc') {
    return nextEntries.sort((firstEntry, secondEntry) => (
      secondEntry.amount - firstEntry.amount
    ))
  }

  if (sortMode === 'nameAsc') {
    return nextEntries.sort((firstEntry, secondEntry) =>
      firstEntry.guestName.localeCompare(secondEntry.guestName, 'ko-KR'),
    )
  }

  return nextEntries.sort((firstEntry, secondEntry) => (
    new Date(secondEntry.receivedAt).getTime() -
    new Date(firstEntry.receivedAt).getTime()
  ))
}

const GiftDeskPage = () => {
  const {
    addEntry,
    deleteEntry,
    entries,
    syncState,
    updateEntry,
  } = useGiftDeskEntries()
  const [form, setForm] = useState<GiftDeskFormState>(() =>
    createEmptyFormState(),
  )
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null)
  const [pendingDeleteEntry, setPendingDeleteEntry] =
    useState<GiftDeskEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sideFilter, setSideFilter] = useState<GiftDeskSideFilter>('all')
  const [sortMode, setSortMode] = useState<GiftDeskSortMode>('recent')

  const summary = useMemo(
    () => calculateGiftDeskSummary(entries),
    [entries],
  )

  const visibleEntries = useMemo(() => {
    const filteredEntries = entries.filter((entry) => {
      const isSideMatch = sideFilter === 'all' || entry.side === sideFilter

      return isSideMatch && doesEntryMatchSearch(entry, searchQuery)
    })

    return sortEntries(filteredEntries, sortMode)
  }, [entries, searchQuery, sideFilter, sortMode])

  const duplicateNameCount = useMemo(() => {
    const normalizedName = normalizeSearchText(form.guestName)

    if (!normalizedName) {
      return 0
    }

    return entries.filter((entry) => (
      entry.id !== editingEntryId &&
      normalizeSearchText(entry.guestName) === normalizedName
    )).length
  }, [editingEntryId, entries, form.guestName])

  const handleFormChange = <FieldName extends keyof GiftDeskFormState>(
    fieldName: FieldName,
    value: GiftDeskFormState[FieldName],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value,
    }))
  }

  const resetForm = () => {
    setForm((currentForm) => ({
      ...createEmptyFormState(),
      attendant: currentForm.attendant,
      side: currentForm.side,
    }))
    setEditingEntryId(null)
  }

  const handleSubmit = () => {
    if (editingEntryId) {
      const editingEntry = entries.find((entry) => entry.id === editingEntryId)

      updateEntry(
        updateEntryFromForm(
          editingEntryId,
          form,
          editingEntry?.receivedAt ?? new Date().toISOString(),
        ),
      )
      resetForm()
      return
    }

    addEntry(createEntryFromForm(form))
    resetForm()
  }

  const handleEdit = (entry: GiftDeskEntry) => {
    setEditingEntryId(entry.id)
    setForm(entryToFormState(entry))
  }

  const handleDeleteConfirm = () => {
    if (pendingDeleteEntry) {
      deleteEntry(pendingDeleteEntry.id)

      if (pendingDeleteEntry.id === editingEntryId) {
        resetForm()
      }
    }

    setPendingDeleteEntry(null)
  }

  const handleExport = () => {
    const csv = createGiftDeskCsv(entries)
    const today = new Date().toISOString().slice(0, 10)

    downloadTextFile(csv, `gift-desk-${today}.csv`, 'text/csv;charset=utf-8')
  }

  return (
    <main className="gift-desk-page">
      <GiftDeskHeader
        onExport={handleExport}
        onPrint={() => window.print()}
        summary={summary}
        syncState={syncState}
      />
      <GiftDeskSummaryCards summary={summary} />
      <section className="ledger-workspace">
        <aside className="ledger-sidebar">
          <GiftDeskForm
            duplicateNameCount={duplicateNameCount}
            form={form}
            isEditing={editingEntryId !== null}
            onCancelEdit={resetForm}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
          />
        </aside>
        <section className="ledger-panel">
          <div className="panel-heading panel-heading--list">
            <div>
              <span>Guest List</span>
              <h2>접수 명부</h2>
            </div>
          </div>
          <GiftDeskToolbar
            filter={sideFilter}
            onFilterChange={setSideFilter}
            onSearchQueryChange={setSearchQuery}
            onSortModeChange={setSortMode}
            resultCount={visibleEntries.length}
            searchQuery={searchQuery}
            sortMode={sortMode}
            totalCount={entries.length}
          />
          <GiftDeskTable
            entries={visibleEntries}
            onDelete={setPendingDeleteEntry}
            onEdit={handleEdit}
          />
        </section>
      </section>
      <AppConfirmModal
        body={
          pendingDeleteEntry
            ? `${pendingDeleteEntry.guestName}님의 접수 내역을 삭제합니다.`
            : ''
        }
        confirmLabel="삭제"
        isOpen={pendingDeleteEntry !== null}
        onCancel={() => setPendingDeleteEntry(null)}
        onConfirm={handleDeleteConfirm}
        title="내역 삭제"
      />
    </main>
  )
}

export default GiftDeskPage
