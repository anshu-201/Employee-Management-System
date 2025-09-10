import React from 'react'

function List({ 
  employees, 
  handleEdit, 
  handleDelete, 
  isLoading, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onSort, 
  sortBy, 
  sortOrder 
}) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`pagination-button ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div className='container-table'>
      <table className='striped-table'>
        <thead>
            <tr>
                <th>No.</th>
                <th 
                  className="sortable" 
                  onClick={() => onSort('firstName')}
                  style={{ cursor: 'pointer' }}
                >
                  First Name {getSortIcon('firstName')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => onSort('lastName')}
                  style={{ cursor: 'pointer' }}
                >
                  Last Name {getSortIcon('lastName')}
                </th>
                <th>Email</th>
                <th 
                  className="sortable" 
                  onClick={() => onSort('salary')}
                  style={{ cursor: 'pointer' }}
                >
                  Salary {getSortIcon('salary')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => onSort('date')}
                  style={{ cursor: 'pointer' }}
                >
                  Date {getSortIcon('date')}
                </th>
                <th>Department</th>
                <th colSpan={2} className='text-center'>Actions</th>
            </tr>
        </thead>
        
        <tbody>
            {employees.length > 0 ? (
                employees.map((employee, i) => (
                    <tr key={employee._id}>
                        <td>{(currentPage - 1) * 10 + i + 1}</td>
                        <td>{employee.firstName}</td>
                        <td>{employee.lastName}</td>
                        <td>{employee.email}</td>
                        <td>{formatter.format(employee.salary)}</td>
                        <td>{formatDate(employee.date)}</td>
                        <td>{employee.department || 'N/A'}</td>
                        <td className='text-right'>
                            <button onClick={() => handleEdit(employee._id)}
                                className='button muted-button'>Edit</button>
                        </td>
                        <td className='text-left'>
                            <button onClick={() => handleDelete(employee._id)}
                                className='button muted-button delete-button'>Delete</button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={9} className='text-center'>No employees found</td>
                </tr>
            )}
        </tbody>
      </table>
      
      {totalPages > 1 && renderPagination()}
    </div>
  )
}

export default List