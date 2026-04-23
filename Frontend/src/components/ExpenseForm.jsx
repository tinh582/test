import { formatCurrency } from '../utils/formatCurrency'

const categoryOptions = [
  'Ăn uống',
  'Di chuyển',
  'Mua sắm',
  'Hóa đơn',
  'Giải trí',
  'Sức khỏe',
  'Học tập',
  'Gia đình',
  'Khác',
]

const amountOptions = [
  10000,
  20000,
  50000,
  100000,
  200000,
  500000,
  1000000,
]

export default function ExpenseForm({
  formData,
  currentTime,
  isSubmitting,
  submitError,
  submitSuccess,
  onInputChange,
  onSubmit,
}) {
  const previewAmount = Number(formData.amount || 0)

  return (
    <section className="panel">
      <h2>Thêm khoản chi tiêu</h2>

      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          Tên khoản chi
          <input
            name="title"
            value={formData.title}
            onChange={onInputChange}
            placeholder="Ví dụ: Mua đồ ăn"
            required
          />
        </label>

        <label>
          Số tiền (VND)
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={onInputChange}
            min="1"
            step="1"
            inputMode="numeric"
            placeholder="200000"
            list="expense-amount-options"
            required
          />
          <datalist id="expense-amount-options">
            {amountOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <label>
          Loại chi tiêu
          <input
            name="category"
            value={formData.category}
            onChange={onInputChange}
            placeholder="Ví dụ: Ăn uống"
            list="expense-category-options"
          />
          <datalist id="expense-category-options">
            {categoryOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <label>
          Ngày chi
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onInputChange}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu...' : 'Thêm chi tiêu'}
        </button>
      </form>

      <div className="expense-preview" aria-live="polite">
        <div>
          <span>Xem trước giao dịch</span>
          <strong>{formData.title.trim() || 'Tên khoản chi'}</strong>
          <p>{formData.category.trim() || 'Danh mục'}</p>
        </div>
        <div>
          <span>Thời gian thêm</span>
          <strong>{currentTime.toLocaleString('vi-VN')}</strong>
          <p>Sẽ hiển thị trong danh sách chi tiêu</p>
        </div>
        <div>
          <span>Số tiền</span>
          <strong>{formatCurrency(previewAmount)}</strong>
          <p>{formData.date || 'Chưa chọn ngày'}</p>
        </div>
      </div>

      {submitError ? <p className="message error">{submitError}</p> : null}
      {submitSuccess ? <p className="message success">{submitSuccess}</p> : null}
    </section>
  )
}