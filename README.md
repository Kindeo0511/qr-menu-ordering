# QR Code Based Ordering System

A full-stack ordering system where customers can order food by scanning a table QR code with their phone camera

## Screenshots

![Login page](images/Screenshot%202026-09-07%20154522.png)
![Cashier page](images/Screenshot%202026-09-07%20154544.png)
![Cashier order page](images/Screenshot%202026-09-07%20154558.png)
![Kitchen page](images/Screenshot%202026-09-07%20154613.png)
![Admin dashboard](images/Screenshot%202026-09-07%20154639.png)
![Admin food table](images/Screenshot%202026-09-07%20154650.png)
![Admin QR code table](images/Screenshot%202026-09-07%20155940.png)
![Admin QR code view](images/Screenshot%202026-09-07%20155949.png)
![Customer page](images/Screenshot%202026-09-07%20161257.png)
![Customer cart view](images/Screenshot%202026-09-07%20161311.png)





## Features

- 🔍 Search and filter food items and categories by name
- 📝 Customers can place orders
- 👤 Admins can manage the system
- 💳 Cashiers can process payments
- 🍳 Kitchen staff can update order status
- 🔐 Role-based authentication (admin / cashier)

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL
- **Testing:** Pytest
- **Media Storage:** Cloudinary
- **Auth:** JWT Authentication (`djangorestframework-simplejwt`)
- **Frontend:** React, Tailwind CSS, DaisyUI
- **Hosting:** Backend on Render, Frontend on Vercel
- **WSGI Server:** Gunicorn (production)

## Prerequisites

- Python 3.12.7
- Node.js (for React frontend)
- PostgreSQL (local instance or hosted on Render)
- `pip` and `virtualenv`

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Kindeo0511/qr-menu-ordering.git
cd qr-menu-ordering/back-end
```

### Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd ../front-end
npm install
npm run dev
```

### Environment Variables

Create a `.env` file inside the `back-end` folder:

```env
# DATABASE
DATABASE_NAME=qr_ordering_db
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password
DATABASE_HOST=localhost
DATABASE_PORT=5432

# DJANGO
SECRET_KEY=your_django_secret_key
DEBUG=True

# CLOUDINARY
CLOUD_NAME=your_cloudinary_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```

### Running Locally

```bash

# Apply migrations
python manage.py migrate

# Create a superuser (for admin access)
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

- Backend runs at `http://127.0.0.1:8000`
- Frontend runs at `http://127.0.0.1:5173`

## Usage

- **Customer:** Scan the table's QR code, browse the menu, filter by category or name, and place an order — no account required.
- **Cashier:** Log in to view incoming orders, process payments, and mark orders as paid.
- **Kitchen Staff:** Log in to view active orders and update their status (e.g., preparing, ready, served).
- **Admin:** Manage menu items, categories, users, and view all orders via `/admin`.

## Running Tests

```bash
pytest
```
