# ProcureHub Backend (Python Flask)

## Setup

1. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   venv\Scripts\activate     # Windows
   # source venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   ```

2. Create the MySQL database:
   ```bash
   mysql -u root -p < migrations/001_create_tables.sql
   ```

3. Configure `.env` with your database credentials.

4. Start the server:
   ```bash
   python run.py
   ```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/signup | Public | Register user |
| POST | /api/v1/auth/login | Public | Login user |
| POST | /api/v1/procurement/po | Manager | Create PO |
| GET | /api/v1/procurement/po | Manager | List my POs |
| GET | /api/v1/procurement/po/:id/bids | Manager | View bids for PO |
| PUT | /api/v1/procurement/bids/:id/accept | Manager | Accept a bid |
| GET | /api/v1/vendor/marketplace | Vendor | Browse open tenders |
| POST | /api/v1/vendor/bids/submit | Vendor | Submit a bid |
| GET | /api/v1/vendor/bids | Vendor | View my bids |

## Project Structure

```
backend/
├── run.py                        # Entry point
├── requirements.txt              # Python dependencies
├── .env                          # Environment variables
├── migrations/
│   └── 001_create_tables.sql     # Database schema
└── src/
    ├── app.py                    # Flask app factory
    ├── config/
    │   └── db.py                 # MySQL connection pool
    ├── models/
    │   ├── User.py
    │   ├── PurchaseOrder.py
    │   └── Bid.py
    ├── controllers/
    │   ├── auth_controller.py
    │   ├── procurement_controller.py
    │   └── vendor_controller.py
    ├── routes/
    │   ├── auth_routes.py
    │   ├── procurement_routes.py
    │   └── vendor_routes.py
    ├── middleware/
    │   ├── auth_middleware.py
    │   └── role_middleware.py
    └── utils/
        └── validators.py
```
