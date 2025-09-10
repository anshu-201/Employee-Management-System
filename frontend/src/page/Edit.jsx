import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import { employeeAPI } from '../services/api.js';

function Edit({ employee, setIsEditing, onEmployeeUpdated }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [salary, setSalary] = useState('');
    const [date, setDate] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (employee) {
            setFirstName(employee.firstName || '');
            setLastName(employee.lastName || '');
            setEmail(employee.email || '');
            setSalary(employee.salary || '');
            setDate(employee.date ? employee.date.split('T')[0] : '');
            setDepartment(employee.department || '');
            setPosition(employee.position || '');
            setPhone(employee.phone || '');
        }
    }, [employee]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !salary || !date) {
            return Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'All required fields must be filled.',
                showConfirmButton: true
            });
        }

        setIsSubmitting(true);

        try {
            const employeeData = {
                firstName,
                lastName,
                email,
                salary: parseFloat(salary),
                date,
                department,
                position,
                phone
            };

            await employeeAPI.updateEmployee(employee._id, employeeData);

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: `${firstName} ${lastName}'s data has been updated successfully.`,
                showConfirmButton: false,
                timer: 1500
            });

            setIsEditing(false);
            onEmployeeUpdated(); // Refresh the employee list
        } catch (error) {
            console.error('Error updating employee:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update employee. Please try again.';
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: errorMessage,
                showConfirmButton: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="small-container">
            <form onSubmit={handleUpdate}>
                <h1>Edit Employee</h1>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <input
                            id="department"
                            type="text"
                            name="department"
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="position">Position</label>
                        <input
                            id="position"
                            type="text"
                            name="position"
                            value={position}
                            onChange={e => setPosition(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="salary">Salary ($) *</label>
                        <input
                            id="salary"
                            type="number"
                            name="salary"
                            value={salary}
                            onChange={e => setSalary(e.target.value)}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Hire Date *</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <input 
                        type="submit" 
                        value={isSubmitting ? "Updating..." : "Update Employee"} 
                        disabled={isSubmitting}
                    />
                    <input
                        className="muted-button"
                        type="button"
                        value="Cancel"
                        onClick={() => setIsEditing(false)}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
}

export default Edit