import { useState } from 'react'
import { createPortal } from 'react-dom'
import { formatCurrency } from '../utils/formatCurrency'

const getFilterLabel = (filterType) => {
  if (filterType === 'day') return 'Theo ngày'
  if (filterType === 'month') return 'Theo tháng'
  if (filterType === 'range') return 'Khoảng thời gian'
  return 'Tất cả giao dịch'
}

export default function TimeFilterPanel({
  filterType,
  dayFilter,
  monthFilter,
  rangeFilter,
  totalAmount,
  filteredCount,
  setFilterType,
  setDayFilter,
  setMonthFilter,
  setRangeFilter,
  onOpenFilteredList, // <-- Thêm prop này để nhận lệnh mở Modal Danh sách từ App.jsx
}) {
  const [showDetailModal, setShowDetailModal] = useState(false)

  return (
    <section className="panel">
      <h2>Tổng chi theo thời gian</h2>
      <div className="filters">
        <label>
          Kiểu thống kê
          <select value={filterType} onChange={(event) => setFilterType(event.target.value)}>
            <option value="all">Tất cả</option>
            <option value="day">Theo ngày</option>
            <option value="month">Theo tháng</option>
            <option value="range">Khoảng thời gian</option>
          </select>
        </label>

        {filterType === 'day' ? (
          <label>
            Chọn ngày
            <input
              type="date"
              value={dayFilter}
              onChange={(event) => setDayFilter(event.target.value)}
            />
          </label>
        ) : null}

        {filterType === 'month' ? (
          <label>
            Chọn tháng
            <input
              type="month"
              value={monthFilter}
              onChange={(event) => setMonthFilter(event.target.value)}
            />
          </label>
        ) : null}

        {filterType === 'range' ? (
          <>
            <label>
              Từ ngày
              <input
                type="date"
                value={rangeFilter.from}
                onChange={(event) =>
                  setRangeFilter((current) => ({
                    ...current,
                    from: event.target.value,
                  }))
                }
              />
            </label>

            <label>
              Đến ngày
              <input
                type="date"
                value={rangeFilter.to}
                onChange={(event) =>
                  setRangeFilter((current) => ({
                    ...current,
                    to: event.target.value,
                  }))
                }
              />
            </label>
          </>
        ) : null}
      </div>

      <div className="summary-card summary-card--expandable" aria-live="polite">
        <div 
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', padding: '1rem 1.05rem', cursor: 'pointer' }}
          onClick={() => setShowDetailModal(true)}
        >
          <div>
            <p style={{ margin: 0, color: 'var(--muted)' }}>Tổng chi tiêu</p>
            <strong style={{ fontSize: 'clamp(1.5rem, 4vw, 2.3rem)', lineHeight: 1, color: 'var(--accent)', fontWeight: 800, display: 'block', margin: '0.2rem 0' }}>
              {formatCurrency(totalAmount)}
            </strong>
            <span style={{ margin: 0, color: 'var(--muted)' }}>{filteredCount} giao dịch phù hợp</span>
          </div>
          <span className="summary-card__toggle">Xem chi tiết</span>
        </div>

        {/* Sử dụng createPortal để bốc Modal ra ngoài body */}
        {showDetailModal && createPortal(
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <button className="modal-close-btn" onClick={() => setShowDetailModal(false)}>&times;</button>
              <h2 className="modal-title">Chi tiết thống kê</h2>

              <div className="summary-card__details" style={{ padding: 0 }}>
                <div>
                  <span>Bộ lọc hiện tại</span>
                  <strong>{getFilterLabel(filterType)}</strong>
                </div>
                
                <div>
                  <span>Số giao dịch phù hợp</span>
                  <strong>{filteredCount}</strong>
                </div>

                {/* === Ô TỔNG TIỀN CHO PHÉP CLICK ĐỂ XEM DANH SÁCH === */}
                <div 
                  onClick={() => {
                    setShowDetailModal(false); // 1. Đóng Modal hiện tại (Chi tiết thống kê)
                    if (onOpenFilteredList) onOpenFilteredList(); // 2. Kích hoạt mở Modal Danh Sách lọc bên App.jsx
                  }}
                  style={{ 
                    cursor: 'pointer', 
                    background: 'rgba(45, 212, 191, 0.1)', 
                    border: '1px solid var(--accent)',
                    gridColumn: '1 / -1' // Ép ô này trải dài hết 2 cột cho nổi bật
                  }}
                  title="Nhấn để xem danh sách chi tiết các giao dịch này"
                >
                  <span>Tổng tiền đã lọc (Nhấn xem danh sách)</span>
                  <strong style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>
                    {formatCurrency(totalAmount)}
                  </strong>
                </div>

                <div>
                  <span>Chi tiêu trung bình</span>
                  <strong>{formatCurrency(filteredCount > 0 ? totalAmount / filteredCount : 0)}</strong>
                </div>
                
                <div>
                  <span>Ngày đang xem</span>
                  <strong>
                    {filterType === 'day'
                      ? dayFilter
                      : filterType === 'month'
                        ? monthFilter
                        : filterType === 'range'
                          ? `${rangeFilter.from || '...'} - ${rangeFilter.to || '...'}`
                          : 'Tất cả'}
                  </strong>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Đóng</button>
              </div>
            </div>
          </div>,
          document.body // <- Đích đến của Portal
        )}
      </div>
    </section>
  )
}