import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api.js';

function Stats({ setShowStats }) {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setIsLoading(true);
            const data = await employeeAPI.getEmployeeStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return (
            <div className="stats-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading statistics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stats-container">
            <div className="stats-header">
                <h1>📊 Employee Statistics</h1>
                <button 
                    className="back-button"
                    onClick={() => setShowStats(false)}
                >
                    ← Back to Employee List
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Employees</h3>
                        <p className="stat-number">{stats?.totalEmployees || 0}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>Average Salary</h3>
                        <p className="stat-number">
                            {stats?.averageSalary ? formatCurrency(stats.averageSalary) : '$0'}
                        </p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏢</div>
                    <div className="stat-content">
                        <h3>Departments</h3>
                        <p className="stat-number">{stats?.departmentStats?.length || 0}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>Total Payroll</h3>
                        <p className="stat-number">
                            {stats?.totalEmployees && stats?.averageSalary 
                                ? formatCurrency(stats.totalEmployees * stats.averageSalary)
                                : '$0'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {stats?.departmentStats && stats.departmentStats.length > 0 && (
                <div className="department-stats">
                    <h2>Department Breakdown</h2>
                    <div className="department-list">
                        {stats.departmentStats.map((dept, index) => (
                            <div key={index} className="department-item">
                                <div className="department-name">
                                    {dept._id || 'Unassigned'}
                                </div>
                                <div className="department-count">
                                    {dept.count} employee{dept.count !== 1 ? 's' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="stats-footer">
                <button 
                    className="refresh-button"
                    onClick={loadStats}
                >
                    🔄 Refresh Statistics
                </button>
            </div>
        </div>
    );
}

export default Stats;
