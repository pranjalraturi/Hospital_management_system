

🏥 Healthcare Management System API

A Node.js backend API for managing hospital operations like user management, patient admissions, doctor visits, medicine allocation, employee records, and ward tracking.


---

✅ Features Implemented

👤 User Management
Register and login users with roles (admin, doctor, patient, employee,medicine).

🧑‍💼 Employee Management
Manage employees, including salary, DOB, joining date, and user mapping.

🧾 Patient Admission & Tracking
Add patients, assign doctors and wards, record prescriptions, and health issues.

👨‍⚕️ Doctor Visits
Track visits of doctors to patients.

💊 Medicine Assignment
Assign medicines to patients with dosage and prescription tracking.

🛏️ Ward Management
View and manage ward types, charges, availability, and capacity.



---

🚧 Features in Progress

💰 Billing System
Auto-generate invoices based on treatment, medicine, ward charges.

📊 Admin Analytics Dashboard
Daily/weekly reports on admissions, expenses, ward usage, and more.

🔐 Role-Based Access Control (RBAC)
Secure APIs and features based on user roles.



---

⚙️ Tech Stack

Node.js + Express

MongoDB + Mongoose

RESTful APIs

Postman for testing

dotenv for environment config



---

📁 Project Structure

├── models/             # Mongoose schema definitions
├── routes/             # API route definitions
├── controllers/        # Business logic for APIs
├── config/             # MongoDB connection
├── middleware/         # Auth middleware (WIP)
├── utils/              # Helper functions (WIP)
├── .env                # Env variables (PORT, DB URI, etc.)
├── index.js            # Entry point
└── README.md


---

🛠️ Setup & Run Locally

git clone https://github.com/your-username/healthcare-api.git
cd healthcare-api
npm install
npm run dev

Then create a .env file in the root directory:

MONGO_URI=mongodb://127.0.0.1:27017/hospitalDB
JWT_SECRET=your_jwt_secret
PORT=5000


---

🔗 API Endpoints


---

🤝 Contributions Welcome

Have ideas for billing, analytics, or improvements? Fork the repo and raise a PR!


---

📌 TODOs

[ ] 💸 Billing Controller & Route

[ ] 📊 Admin Dashboard Analytics

[ ] 🔐 RBAC Middleware

[ ] 🧪 Test Suites for Routes

[ ] 🌐 Optional Frontend with React





