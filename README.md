# Asset IQ
## Overview
**Asset IQ** is a web-based IT Equipment Asset Management System built by **Codexa**, a software solution provider. The system helps organizations track, manage, and loan out IT assets such as laptops, monitors, desktops, and peripherals.

### Problem We Solve
Companies lose track of IT equipment, have no visibility into who borrowed what, and struggle with manual checkout processes. Asset IQ provides:
- Complete asset lifecycle management
- Role-based borrowing workflows
- Real-time asset availability
- Audit trails and reporting

### Built By Codexa
Codexa creates custom software solutions for businesses. Asset IQ is our ready-to-deploy asset management product for IT departments.

---

## Features
### Must-Have (MVP)
| Feature | Description |
|---------|-------------|
| **User Roles** | Admin, Manager, Borrower with role-based access |
| **Asset Management** | Complete CRUD for IT equipment (laptops, monitors, etc.) |
| **Loan Workflow** | Request → Approve → Checkout → Return |
| **Search & Filter** | Search by name, category, status, location, condition |
| **Dashboard** | Key metrics: total assets, pending loans, overdue |
| **Reports** | Inventory Report, Loan History Report, Overdue Loans Report |
| **Photo Upload** | Upload equipment photos during creation/editing |
| **Security** | Password hashing, session management, role enforcement |

### Stretch Features (Optional)
- Email notifications for overdue loans
- Bulk asset import via CSV
- Condition change history
- Concurrent loan limits per borrower

---

## User Roles & Permissions

| Action | Admin | Manager | Borrower |
|--------|-------|---------|----------|
| Manage assets (CRUD) | ✓ | ✕ | ✕ |
| Approve/reject loans | ✓ | ✓ | ✕ |
| Request loans | ✓ | ✓ | ✓ |
| Return assets | ✓ | ✓ | ✓ |
| View all reports | ✓ | ✓ | ✕* |
| Retire assets | ✓ | ✓ | ✕ |
| Manage users | ✓ | ✕ | ✕ |

*\*Borrowers can only view their own loan history*

---

## Tech Stack
| Layer | Technology |
|-------|------------|
| **Backend** | Java (Spring Boot) |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Database** | PostgreSQL |
| **Server** | Apache Tomcat 9+ |
| **Security** | BCrypt password hashing, Session management |
| **Version Control** | Git + GitHub |

---

## Project Structure
Pending....
