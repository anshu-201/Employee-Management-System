# Employee Management System

A modern, full-stack employee management system built with React.js and MongoDB. This application provides a comprehensive solution for managing employee data with a beautiful, responsive user interface.

## Features

### Frontend (React.js)
- **Modern UI/UX**: Beautiful, responsive design with gradient backgrounds and smooth animations
- **Employee CRUD Operations**: Create, Read, Update, and Delete employee records
- **Advanced Search**: Real-time search functionality across multiple fields
- **Sorting**: Sort employees by name, salary, date, etc.
- **Pagination**: Efficient data loading with pagination support
- **Statistics Dashboard**: View employee statistics and department breakdowns
- **Form Validation**: Client-side validation with user-friendly error messages
- **Loading States**: Smooth loading indicators for better user experience

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Well-structured API endpoints for all operations
- **Data Validation**: Server-side validation using express-validator
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Database Indexing**: Optimized database queries with proper indexing
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Environment Configuration**: Configurable environment variables

## Technology Stack

### Frontend
- **React 19.1.1**: Modern React with hooks
- **Axios**: HTTP client for API communication
- **SweetAlert2**: Beautiful alert dialogs
- **CSS3**: Modern styling with gradients and animations

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Express-validator**: Input validation
- **CORS**: Cross-origin resource sharing
- **Dotenv**: Environment variable management

## Screenshots

Place these images at `frontend/public/screenshots/` so they render on GitHub and in the deployed app docs.

### Add Employee
![Add Employee](frontend/public/screenshots/add-employee.png)

### Edit Employee
![Edit Employee](frontend/public/screenshots/edit-employee.png)

### Employee List
![Employee List](frontend/public/screenshots/employee-list.png)

### Employee Statistics
![Employee Statistics](frontend/public/screenshots/statistics.png)

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd employee-management-system
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create environment file:
```bash
# Create .env file in backend directory
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Start MongoDB service:
```bash
# On Windows (if MongoDB is installed as a service)
net start MongoDB

# On macOS (if using Homebrew)
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

Start the backend server:
```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend application will start on `http://localhost:5173`

## API Endpoints

### Employee Management
- `GET /api/employees` - Get all employees (with pagination, search, sorting)
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/stats/summary` - Get employee statistics

### Health Check
- `GET /api/health` - API health status

## Usage

### Adding Employees
1. Click the "➕ Add Employee" button
2. Fill in the required fields (First Name, Last Name, Email, Salary, Hire Date)
3. Optionally add Department, Position, and Phone
4. Click "Add Employee"

### Editing Employees
1. Click the "Edit" button next to any employee
2. Modify the information as needed
3. Click "Update Employee"

### Deleting Employees
1. Click the "Delete" button next to any employee
2. Confirm the deletion in the popup dialog

### Searching Employees
1. Use the search bar in the header
2. Search by name, email, department, or position
3. Results update in real-time

### Viewing Statistics
1. Click the "📊 Statistics" button
2. View total employees, average salary, department breakdown
3. Click "🔄 Refresh Statistics" to update data

## Database Schema

### Employee Model
```javascript
{
  firstName: String (required, max 50 chars)
  lastName: String (required, max 50 chars)
  email: String (required, unique, valid email)
  salary: Number (required, min 0)
  date: Date (required, default: now)
  department: String (optional, max 50 chars)
  position: String (optional, max 50 chars)
  phone: String (optional, valid phone format)
  address: {
    street: String
    city: String
    state: String
    zipCode: String
    country: String
  }
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## Project Structure

```
employee-management-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── Employee.js
│   ├── routes/
│   │   └── employees.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── page/
│   │   │   ├── Add.jsx
│   │   │   ├── Edit.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── index.jsx
│   │   │   ├── List.jsx
│   │   │   └── Stats.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Contact the development team

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Role-based access control
- [ ] Employee photo upload
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Data export functionality
- [ ] Mobile app development
- [ ] Real-time updates with WebSockets
# Employee-Management-System
