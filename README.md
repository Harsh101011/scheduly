# Scheduly — Real-Time Expert Session Booking System

A full-stack mobile booking platform built with **React Native (Expo)** + **Node.js + Express + MongoDB Atlas**, featuring real-time slot updates via **Socket.io**.

---

## Features

| Feature | Details |
|---|---|
| Expert Listing | Search, category filters, pagination, skeleton loaders |
| Expert Detail | Profile, time slots grouped by date, live Socket.io updates |
| Booking | Form validation, double-booking prevention, success modal |
| My Bookings | Email-based lookup, status badges (Pending / Confirmed / Completed) |
| Real-Time | Socket.io room per expert — slot turns booked instantly on all devices |
| Race Safety | MongoDB unique compound index on `{ expertId, date, timeSlot }` |

---

## Project Structure

```
scheduly/
├── backend/          # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/   # DB + Socket.io setup
│   │   ├── models/   # Expert, Booking (Mongoose)
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   ├── seed.js       # Populate 12 demo experts
│   └── server.js
│
└── mobile/           # React Native (Expo)
    └── src/
        ├── screens/  # ExpertList, ExpertDetail, Booking, MyBookings
        ├── components/
        ├── context/  # Socket.io context
        ├── services/ # Axios API layer
        └── navigation/
```

---

## Getting Started

### 1. Backend

```bash
cd backend
cp .env.example .env      # Fill in your MongoDB Atlas URI
npm install
npm run seed              # Seed 12 demo experts
npm run dev               # Starts on http://localhost:5000
```

**`.env` variables:**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/scheduly
NODE_ENV=development
```

### 2. Mobile

```bash
cd mobile
npm install

# Edit src/services/api.js → set BASE_IP to your machine's local IP
# (e.g. 192.168.1.x) — find it with ipconfig on Windows

npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS). Phone and PC must be on the **same Wi-Fi**.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/experts` | List experts (`?page&limit&category&search`) |
| `GET` | `/api/experts/:id` | Expert detail + all slots |
| `POST` | `/api/bookings` | Create booking |
| `PATCH` | `/api/bookings/:id/status` | Update booking status |
| `GET` | `/api/bookings?email=` | Get bookings by email |

---

## Tech Stack

**Backend:** Node.js, Express, MongoDB Atlas, Mongoose, Socket.io, express-validator  
**Mobile:** React Native, Expo, React Navigation, Axios, Socket.io-client, Expo Linear Gradient  
**Real-Time:** Socket.io with expert-specific rooms  
**Double-Booking Prevention:** MongoDB unique compound index + app-layer 409 guard
