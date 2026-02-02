Beauty Parlour Web Application

This is a full-stack beauty parlour web application developed to manage salon services, appointments, courses, and online payments. The application includes both user-facing features and an admin panel for managing operations.

Tech Stack

Frontend
React.js
Vite
CSS

Backend
Node.js
Express.js

Database
MongoDB

Application Features

User Side
Browse available beauty services
Book service appointments
Enroll in beauty courses
Book course appointments
Online payment for services and courses

Admin Panel
Manage services
Manage courses
View and manage appointments
View bookings and payment details

Project Structure

Project01/
my-react-app/
src/
public/
.env
package.json
vite.config.js
index.html

Running the Project Locally

Clone the repository
git clone https://github.com/Sahilmokal/Beauty_Parlour_Website.git

Move to the project directory
cd Project01/my-react-app

Install dependencies
npm install

Create a .env file for environment variables
VITE_API_URL=your_backend_api_url
MONGO_URI=your_mongodb_connection_string

Start the development server
npm run dev

Notes

The .env file is ignored using .gitignore
Node modules are not committed
This project is built as a real-world full-stack application

Purpose of the Project

This project was developed to gain hands-on experience with React, Node.js, Express, and MongoDB by building a complete salon management system with admin control and payment integration.
