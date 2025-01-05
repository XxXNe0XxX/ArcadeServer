# Arcade Business Backend

IF the server is online you can visit at:
https://arcadeclient.onrender.com/
ALSO you can check the backend at:
https://github.com/XxXNe0XxX/ArcadeServer

A Node.js-based backend that powers an arcade credit system through secure QR code generation. This system supports multiple user roles (administrators and business owners) to manage QR codes, users, and arcade credit transactions.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Roles](#roles)
- [Installation & Setup](#installation--setup)
- [Environment variables](#environment--variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This backend provides a secure way to generate and manage QR codes for an arcade system. It offers role-based controllers and endpoints, enabling administrators and business owners to view, manage, and retrieve QR codes and user information. The system also provides basic business analytics and user management functionalities.

---

## Tech Stack

- **Node.js** – JavaScript runtime
- **Express** – Web application framework
- **Sequelize** – ORM for data modeling and database operations
- **JWT** – Token-based authentication

---

## Features

1. **QR Code Generation**

   - Create secure QR codes for arcade credits.
   - Retrieve existing codes for validation or usage statistics.

2. **User Management**

   - Create, read, update, and delete users.
   - Role-based permissions (administrator and business owner).

3. **Business Statistics**

   - Retrieve basic business analytics (e.g., usage counts, credit transactions).

4. **Secure Endpoints**
   - JWT authentication for all protected routes.
   - Custom error handling and validation logic for robust security.

---

## Roles

- **Administrator**

  - Full access to all data and functionalities.
  - Can manage user roles, generate and retrieve QR codes, and monitor business statistics.

- **Business Owner**
  - Limited access to their own data scope (e.g., credits, QR codes, and stats related to their business).
  - Can generate and manage QR codes for their business.

---

## Installation & Setup

1. **Clone or Fork the Repository**
   ```bash
   git clone https://github.com/XxXNe0XxX/ArcadeServer.git
   cd ArcadeServer
   Install Dependencies
   ```

npm install

yarn install

Environment Variables

Create a .env file in the project root.
Include variables for database connection and other functionalities

## Environment Variables

- NODE_ENV
- PORT
- HOST
- NETWORKHOST
- ACCESS_TOKEN_SECRET
- REFRESH_TOKEN_SECRET

- DB_URI
- DB_HOST
- DB_USER
- DB_NAME
- DB_PASSWORD
- DB_PORT

- EMAIL
- EMAIL_PASSWORD
- MYSQL_URL

Database Setup

Configure your database credentials in config/config.js (or wherever your Sequelize config is located).
Run migrations (if any) to set up your database schema:

npx sequelize db:migrate

yarn sequelize db:migrate

Start the Server

npm start

yarn start

By default, it should run on http://localhost:3000 (unless configured otherwise).

Usage
Once the server is running, you can interact with the API endpoints (e.g., via Postman or a frontend client). Administrators and business owners can authenticate using JWT tokens to access protected routes for generating or retrieving QR codes, managing users, and viewing business statistics.

Contributing
Contributions are welcome! To contribute:

Fork this repository.
Create a new branch for your feature or bug fix.
Implement your changes and commit.
Open a Pull Request, describing your changes.
Please open an issue if you find a bug or have a feature request.

License
This project is available under the MIT License. Feel free to modify and distribute it as you see fit.

Thank you for checking out the Arcade Business Backend!
If you have any questions, feel free to contact the repository owner or open an issue.

IF the server is online you can visit at:
https://arcadeclient.onrender.com/
ALSO you can check the backend at:
https://github.com/XxXNe0XxX/ArcadeServer
