import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

import Header from "./Header.jsx";
import List from "./List.jsx";
import Add from "./Add.jsx";
import Edit from "./Edit.jsx";
import Stats from "./Stats.jsx";

import { employeeAPI } from '../services/api.js';

function index() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showStats, setShowStats] = useState(false);

    // Load employees from API
    const loadEmployees = async () => {
        try {
            setIsLoading(true);
            const response = await employeeAPI.getEmployees({
                page: currentPage,
                limit: 10,
                search: searchTerm,
                sortBy,
                sortOrder
            });
            setEmployees(response.employees);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error('Error loading employees:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load employees. Please try again.',
                showConfirmButton: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Load employees on component mount and when dependencies change
    useEffect(() => {
        loadEmployees();
    }, [currentPage, searchTerm, sortBy, sortOrder]);

    const handleEdit = (id) => {
        const employee = employees.find(emp => emp._id === id);
        setSelectedEmployee(employee);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: "You won't be able to delete this!",
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            if (result.value) {
                try {
                    const employee = employees.find(emp => emp._id === id);
                    await employeeAPI.deleteEmployee(id);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: `${employee.firstName} ${employee.lastName}'s data has been deleted.`,
                        showConfirmButton: false,
                        timer: 1500,
                    });

                    // Reload employees after deletion
                    loadEmployees();
                } catch (error) {
                    console.error('Error deleting employee:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to delete employee. Please try again.',
                        showConfirmButton: true
                    });
                }
            }
        });
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
        setCurrentPage(1); // Reset to first page when sorting
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container">
            {/* List */}
            {!isAdding && !isEditing && !showStats && (
                <>
                    <Header
                        setIsAdding={setIsAdding}
                        setShowStats={setShowStats}
                        onSearch={handleSearch}
                        searchTerm={searchTerm}
                    />
                    <List
                        employees={employees}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        isLoading={isLoading}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onSort={handleSort}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                    />
                </>
            )}
            {/* ADD */}
            {isAdding && (
                <Add
                    setIsAdding={setIsAdding}
                    onEmployeeAdded={loadEmployees}
                />
            )}
            {/* EDIT */}
            {isEditing && (
                <Edit
                    employee={selectedEmployee}
                    setIsEditing={setIsEditing}
                    onEmployeeUpdated={loadEmployees}
                />
            )}
            {/* STATS */}
            {showStats && (
                <Stats
                    setShowStats={setShowStats}
                />
            )}
        </div>
    )
}

export default index;