# Library Management System - Login Module

## Overview
This is the login module for a Library Management System that allows both librarians and administrators to authenticate using email and password.

## Setup Instructions

### Database Setup
1. Import the `sql_create_table.txt` file into MySQL to set up the database schema
2. Make sure the database is named `QuanLyThuVien`

### Application Setup
1. Make sure Node.js is installed on your system
2. Open a terminal in the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Configure the database connection in `config/db.js` if needed
5. Start the server:
   ```
   npm start
   ```
   or for development mode with auto-reload:
   ```
   npm run dev
   ```

## Default Access
The database includes sample users:
- Admin: Email: a@gmail.com, Password: matkhau123
- Librarian: Email: b@gmail.com, Password: 123456

## Features
- Login form with email and password
- Different access buttons for librarians and administrators
- Role-based access control
- Session management
- Error handling for incorrect credentials

## Technologies Used
- Node.js with Express.js
- EJS templating
- MySQL database
- Session-based authentication 