# 🎨 MyStudio Pro – Backend

This repository contains the backend services for **MyStudio Pro**, a comprehensive studio management solution that powers the React Native mobile app. The platform offers a full suite of tools including photo editing services, room calibration, service management, online booking, and secure payment processing—all accessible through a sleek mobile interface.

---

## 🚀 Core Features

- **Studio Service Management:**
  - Manage services, room setups, and customizable offerings.
  - CRUD operations for services and studio settings.

- **Booking & Scheduling:**
  - Real-time booking system integrated with:
    - **Calendly API**
    - **Acuity Scheduling API**
  - Calendar sync and appointment reminders.

- **Payment Gateway Integrations:**
  - Process payments via:
    - **PayPal**
    - **Square**
    - **Stripe**
  - Subscription management with automated billing cycles.

- **User Authentication & Role Management:**
  - JWT-based authentication.
  - Multi-role support: Admin, Staff, Clients.

- **File & Media Storage:**
  - Secure image and document uploads to **Google Cloud Storage Buckets**.
  - CDN-ready URLs for optimized content delivery.

- **Push Notifications:**
  - Notify users of booking confirmations, reminders, and service updates.
  - Integration with Firebase Cloud Messaging (FCM) and Apple Push Notification Service (APNS).

- **Analytics & Reporting:**
  - Track bookings, payments, and user activity.
  - Generate performance reports and insights.

---

## 🛠️ Tech Stack

- **Backend Framework:**
  - Node.js with Express.js REST API.

- **Database:**
  - PostgreSQL (SQL-based relational database for transactional data).

- **Cloud & Hosting:**
  - **Google Cloud Platform (GCP)**
  - Cloud Storage for files & media.
  - Compute Engine for server hosting.

- **Payment Processing:**
  - PayPal REST APIs
  - Stripe API
  - Square API

- **Calendar & Booking APIs:**
  - Calendly API
  - Acuity Scheduling API

- **Authentication:**
  - JSON Web Tokens (JWT)
  - OAuth2 (optional)

- **Monitoring & Logging:**
  - Winston/Morgan for logs.
  - GCP Monitoring / Datadog for performance.

---

## 🔗 API Endpoints (Sample)

| Method | Endpoint                       | Description                                   |
|--------|--------------------------------|-----------------------------------------------|
| POST   | `/api/auth/login`              | User login                                    |
| POST   | `/api/auth/register`           | Register new user                             |
| GET    | `/api/services`                | Get list of services                          |
| POST   | `/api/bookings`                | Create new booking                            |
| GET    | `/api/bookings/:id`            | Get booking details                           |
| POST   | `/api/payments/charge`         | Process payment                               |
| POST   | `/api/notifications/send`      | Send push notification                        |
| POST   | `/api/uploads/media`           | Upload media file                             |

---

## 🚦 Deployment & Setup

1️⃣ **Clone the Repository:**

```bash
git clone https://github.com/razinasir007/react-native-msp-backend.git
cd react-native-msp-backend
