# ProcureHub — Vendor Procurement Management

A full-stack digital procurement platform where companies issue RFQs (Request for Quote) and vendor networks submit competitive bids.

## Tech Stack

- **Backend**: Python, Flask, MySQL, PyJWT, bcrypt
- **Frontend**: React 18, Vite, React Router v6, Axios
- **Styling**: Vanilla CSS (premium dark theme with glassmorphism)

## Quick Start

### 1. Database Setup
```bash
mysql -u root -p < backend/migrations/001_create_tables.sql
```

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
# Update .env with your MySQL credentials
python run.py
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1/health

## User Roles

| Role | Access |
|------|--------|
| **Procurement Manager** | Create RFQs, view bids, award contracts |
| **Vendor** | Browse tenders, submit bids, track proposals |

## Project Structure

```
procurehub/
├── backend/           # Python Flask API
│   ├── run.py         # Entry point
│   ├── src/
│   │   ├── app.py     # Flask app factory
│   │   ├── config/    # DB connection pool
│   │   ├── models/    # User, PurchaseOrder, Bid
│   │   ├── controllers/
│   │   ├── routes/    # Flask Blueprints
│   │   ├── middleware/ # JWT auth, role check
│   │   └── utils/     # Validators
│   └── migrations/    # SQL schema
│
└── frontend/          # React + Vite
    └── src/
        ├── api/       # Axios client
        ├── auth/      # AuthContext, ProtectedRoute
        ├── pages/     # Login, Manager, Vendor pages
        └── components/
```
