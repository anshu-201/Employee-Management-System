import React, { useState } from 'react'

function Header({ setIsAdding, setShowStats, onSearch, searchTerm }) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleSearchChange = (e) => {
    setLocalSearchTerm(e.target.value);
    // Debounced search - search as user types
    const timeoutId = setTimeout(() => {
      onSearch(e.target.value);
    }, 500);
    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="header">
      <div className="header-content">
        <h1>Employee Management System</h1>
        <div className="header-actions">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              type="text"
              placeholder="Search employees..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
          <div className="header-buttons">
            <button className='round-button stats-button' onClick={() => setShowStats(true)}>
              📊 Statistics
            </button>
            <button className='round-button' onClick={() => setIsAdding(true)}>
              ➕ Add Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header