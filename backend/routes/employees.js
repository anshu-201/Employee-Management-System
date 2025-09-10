const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateEmployee = [
  body('firstName').notEmpty().withMessage('First name is required').trim(),
  body('lastName').notEmpty().withMessage('Last name is required').trim(),
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('salary').isNumeric().withMessage('Salary must be a number').custom(value => {
    if (value < 0) throw new Error('Salary cannot be negative');
    return true;
  }),
  body('date').optional().isISO8601().withMessage('Please enter a valid date')
];

// GET /api/employees - Get all employees
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    
    // Search functionality
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const employees = await Employee.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/employees/:id - Get single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-__v');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/employees - Create new employee
router.post('/', validateEmployee, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, salary, date, department, position, phone, address } = req.body;

    // Check if employee with email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }

    const employee = new Employee({
      firstName,
      lastName,
      email,
      salary,
      date: date || new Date(),
      department,
      position,
      phone,
      address
    });

    const savedEmployee = await employee.save();
    res.status(201).json({
      message: 'Employee created successfully',
      employee: savedEmployee
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', validateEmployee, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, salary, date, department, position, phone, address } = req.body;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingEmployee = await Employee.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      if (existingEmployee) {
        return res.status(400).json({ message: 'Employee with this email already exists' });
      }
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        firstName,
        lastName,
        email,
        salary,
        date,
        department,
        position,
        phone,
        address
      },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ 
      message: 'Employee deleted successfully',
      employee: {
        id: employee._id,
        firstName: employee.firstName,
        lastName: employee.lastName
      }
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/employees/stats/summary - Get employee statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const avgSalary = await Employee.aggregate([
      { $group: { _id: null, averageSalary: { $avg: '$salary' } } }
    ]);
    
    const departmentStats = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalEmployees,
      averageSalary: avgSalary[0]?.averageSalary || 0,
      departmentStats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
