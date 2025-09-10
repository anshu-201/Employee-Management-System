import React, { useState, useRef, useEffect } from 'react'
import Swal from 'sweetalert2';
import { employeeAPI } from '../services/api.js';

function Add({ setIsAdding, onEmployeeAdded }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [salary, setSalary] = useState('');
    const [date, setDate] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const textInput = useRef(null);

    useEffect(() => {
        textInput.current.focus();
    }, [])

    const handleAdd = async (e) => {
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

            await employeeAPI.createEmployee(employeeData);

            Swal.fire({
                icon: 'success',
                title: 'Added!',
                text: `${firstName} ${lastName}'s data has been added successfully.`,
                showConfirmButton: false,
                timer: 1500
            });

            setIsAdding(false);
            onEmployeeAdded(); // Refresh the employee list
        } catch (error) {
            console.error('Error adding employee:', error);
            const errorMessage = error.response?.data?.message || 'Failed to add employee. Please try again.';
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: errorMessage,
                showConfirmButton: true
            });
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="small-container">
            <form onSubmit={handleAdd}>
                <h1>Add Employee</h1>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input
                            id="firstName"
                            type="text"
                            ref={textInput}
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
                        <label htmlFor="salary">Salary (₹) </label>
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
                        value={isSubmitting ? "Adding..." : "Add Employee"} 
                        disabled={isSubmitting}
                    />
                    <input
                        className="muted-button"
                        type="button"
                        value="Cancel"
                        onClick={() => setIsAdding(false)}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
}

export default Add