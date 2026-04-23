import { useState } from 'react'
import { createPortal } from 'react-dom'
import { formatCurrency } from '../utils/formatCurrency'

const dayFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const parseDateKey = (dateValue) => {
  if (!dateValue) return null
  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) return null
  return parsedDate
}

const formatDayLabel = (dateValue) => {
  const parsedDate = parseDateKey(dateValue)
  return parsedDate ? dayFormatter.format(parsedDate) : 'Không rõ ngày'
}

const sortByDateDesc = (a, b) => {
  const aTime = new Date(a.date).getTime()
  const bTime = new Date(b.date).getTime()
  return bTime - aTime
}

const groupTransactionsByDay = (items) => {
  const dayMap = new Map()
  items.forEach((item) => {
    const dayKey = item.date || 'unknown-day'
    if (!dayMap.has(dayKey)) {
      dayMap.set(dayKey, {
        key: dayKey,
        label: formatDayLabel(item.date),
        totalAmount: 0,
        items: [],
      })
    }
    const dayGroup = dayMap.get(dayKey)
    dayGroup.totalAmount += Number(item.amount || 0)
    dayGroup.items.push(item)
  })
  return Array.from(dayMap.values())
    .map((dayGroup) => ({
      ...dayGroup,
      items: [...dayGroup.items].sort(sortByDateDesc),
    }))
    .sort((a, b) => {
      const aTime = new Date(a.key).getTime()
      const bTime = new Date(b.key).getTime()
      return bTime - aTime
    })
}

export default function TransactionsTable({
  listLoading,
  listError,
  listNotice,
  transactions,
  liveDraftTransaction,
  onReload,
}) {
  const [selectedDayModal, setSelectedDayModal] = useState(null)

  const dayGroupedTransactions = groupTransactionsByDay(
    liveDraftTransaction ? [liveDraftTransaction, ...transactions] : transactions,
  )

  const totalAmount = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  )

  return (
    <section className="panel">
      <div className="list-head">
        <h2>Danh sách chi tiêu</h2>
        <button type="button" onClick={onReload} disabled={listLoading}>
          {listLoading ? 'Đang tải...' : 'Tải lại'}
        </button>
      </div>

      {listError ? <p className="message error">{listError}</p> : null}
      {listNotice ? <p className="message success">{listNotice}</p> : null}

      {!listLoading && !listError && transactions.length === 0 ? (
        <p className="empty">Chưa có giao dịch nào. Hãy thêm khoản chi đầu tiên.</p>
      ) : null}

      {!listError && dayGroupedTransactions.length > 0 ? (
        <div className="day-list">
          <div className="timeline-summary">
            <div>
              <span>Tổng chi danh sách</span>
              <strong>{formatCurrency(totalAmount)}</strong>
            </div>
            <div>
              <span>Số ngày có giao dịch</span>
              <strong>{dayGroupedTransactions.length} ngày</strong>
            </div>
          </div>

          {dayGroupedTransactions.map((dayGroup) => (
            <div className="day-accordion" key={dayGroup.key}>
              <div 
                className="day-accordion__summary" 
                onClick={() => setSelectedDayModal(dayGroup.key)}
              >
                <div>
                  <span>Ngày</span>
                  <h3>{dayGroup.label}</h3>
                </div>
                <div className="day-accordion__meta">
                  <strong>{formatCurrency(dayGroup.totalAmount)}</strong>
                  <span>{dayGroup.items.length} khoản chi</span>
                </div>
              </div>

              {selectedDayModal === dayGroup.key && createPortal(
                <div className="modal-overlay" onClick={() => setSelectedDayModal(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%' }}>
                    <button className="modal-close-btn" onClick={() => setSelectedDayModal(null)}>
                      &times;
                    </button>
                    <h2 className="modal-title">Giao dịch ngày {dayGroup.label}</h2>
                    
                    <div className="table-wrap day-accordion__content" style={{ margin: 0 }}>
                      <table>
                        <thead>
                          <tr>
                            <th>Thời gian thêm</th>
                            <th>Khoản chi</th>
                            <th>Danh mục</th>
                            <th>Số tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayGroup.items.map((item, index) => (
                            <tr
                              key={item.id ?? `${item.title}-${item.date}-${index}`}
                              className={item.isDraft ? 'transaction-row transaction-row--draft' : 'transaction-row'}
                            >
                              <td>{item.createdAtDisplay || (item.createdAt ? new Date(item.createdAt).toLocaleString('vi-VN') : '---')}</td>
                              <td>
                                <div className="transaction-title-cell">
                                  <strong>{item.title}</strong>
                                  {item.isDraft ? <span className="draft-badge">Thời gian thực</span> : null}
                                </div>
                              </td>
                              <td>{item.category || 'Khác'}</td>
                              <td>{item.amountDisplay || formatCurrency(Number(item.amount || 0))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="modal-footer">
                      <button className="btn-secondary" onClick={() => setSelectedDayModal(null)}>Đóng</button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}