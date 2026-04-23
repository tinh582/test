# Expense Tracker Frontend

Frontend app for quan lý chi tiêu built with React + Vite.

## Features

- Them khoan chi tieu
- Xem danh sach chi tieu
- Tinh tong chi tieu theo ngay, thang, hoac khoang thoi gian
- Gọi backend qua biến môi trường chuẩn Vite: `VITE_API_URL`

## Requirements

- Node.js 20+
- Backend API có endpoint `GET /transactions` và `POST /transactions`

## Environment Variables

Tạo file `.env` từ `.env.example` và cập nhật giá trị phù hợp:

```env
VITE_API_URL=http://localhost:3000/api
```

Không hardcode URL trong code. Toàn bộ request API được lấy từ `import.meta.env.VITE_API_URL`.

When deploying to Vercel, set `VITE_API_URL` to the live backend URL, for example `https://<your-my-app-project>.vercel.app/api`.

## Run Locally

```bash
npm install
npm run dev
```

## Build and Lint

```bash
npm run lint
npm run build
```

## Docker

Build and run the frontend in a container:

```bash
docker build --build-arg VITE_API_URL=http://localhost:3000/api -t expense-frontend .
docker run --rm -p 8080:80 expense-frontend
```

If you start the full workspace compose from the repo root, the frontend is available at `http://localhost:8080`.

## Notes

- App sẽ hiển thị lỗi thân thiện nếu backend chưa cấu hình.
- Mọi request API đều đi qua module riêng trong `src/api/transactions.js`.
