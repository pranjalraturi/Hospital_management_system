# 🏥 Hospital Management System API

A RESTful API built using **Node.js**, **Express.js**, and **MongoDB** for managing a hospital's internal data including users, patients, doctors, medicines, and more.

---

## 🚀 Features

- 👥 User Registration & Login with security questions
- 🏥 Patient admission tracking
- 🧑‍⚕️ Doctor-patient visit management
- 💊 Medicine assignment & prescription system
- 🧾 Payment and bed allotment
- 🧑‍💼 Employee salary records
- 📦 Department & ward management

---

## 🧱 Entity Schema Overview

### 📌 `users`
Stores user credentials and roles (e.g., doctor, admin).

| Field | Type | Description |
|-------|------|-------------|
| id | ObjectId | Unique identifier |
| firstName | String | First name |
| lastName | String | Last name |
| email | String | Email address |
| password | String | Encrypted password |
| cellNo | String | Phone number |
| role | String | e.g., `doctor`, `admin` |
| securityQuestion | String | Custom question |
| securityAnswer | String | Answer to the question |

---

### 📌 `patients`

| Field | Type | Description |
|-------|------|-------------|
| id | ObjectId | Unique identifier |
| user_id | ObjectId | Refers to `users` |
| ward_id | ObjectId | Refers to `wards` |
| doctor_id | ObjectId | Refers to `users` with role `doctor` |
| date_of_adm | Date | Date of admission |
| blood_group | String | Blood group |
| dob | Date | Date of birth |
| prescription | String | Prescription note |
| bed_alloted | String | Bed number |
| payment_status | String | Paid / Unpaid |
| patient_problem | String | Health issues |

---

### 📌 `employees`

| Field | Type |
|-------|------|
| id | INT |
| user_id | INT |
| dob | Date |
| hire_date | Date |
| salary | Double |

---

### 📌 `doctorVisits`

| Field | Type |
|-------|------|
| pat_id | ObjectId |
| doctor_id | ObjectId |
| visits | String / Date[] |

---

### 📌 `medicines`

| Field | Type |
|-------|------|
| id | ObjectId |
| name | String |
| price | Number |

---

### 📌 `medicines_assigned`

| Field | Type |
|-------|------|
| pat_id | ObjectId |
| medicine_id | ObjectId |
| prescription | String |
| medicine_qty | Number |

---

### 📌 `wards`

| Field | Type |
|-------|------|
| id | ObjectId |
| type | String |
| charges | Number |
| availability | Boolean |
| max_cap | Number |

---

### 📌 `data`

| Field | Type |
|-------|------|
| id | INT |
| emp_id | INT |
| charges | Number |

---

## 📬 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login existing user |
| GET | `/api/patients` | List all patients |
| POST | `/api/patients/add` | Add a new patient |
| GET | `/api/employees` | List all employees |
| POST | `/api/medicines/assign` | Assign medicine to patient |
| GET | `/api/wards` | Get all wards |
> 📌 Note: More routes can be added based on your implementation.

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Testing:** Postman
- **Data Viewer:** MongoDB Compass

---

## 📦 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd hospital-management-system
Install dependencies:

bash
Copy
Edit
npm install
Run MongoDB locally (default port 27017):

bash
Copy
Edit
mongod
Start the server:

bash
Copy
Edit
npm run dev
🔐 Environment Variables
Create a .env file in the root:

ini
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/hospitaldb
JWT_SECRET=your_jwt_secret
📷 Postman Usage
Use Postman to test API endpoints.

Set body to raw > JSON.

Example Register Body:

json
Copy
Edit
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "cellNo": "1234567890",
  "role": "doctor",
  "securityQuestion": "Your favorite color?",
  "securityAnswer": "Blue"
}
📌 Future Improvements
Admin dashboard UI

Email verification & password reset

File uploads (medical records, images)

Analytics for patient inflow/outflow

Appointment scheduling

👨‍💻 Author
Developed by [Your Name]

📄 License
MIT License

yaml
Copy
Edit

---

Let me know if you'd like a version in `.docx` or PDF, or if you want to include ER diagrams too!
