import React, { useState } from 'react';

const SearchAndFilters = ({ onSearch, onFilter, filters, placeholder = 'Buscar...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    if (onFilter) {
      onFilter(value);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSelectedFilter('');
    if (onSearch) onSearch('');
    if (onFilter) onFilter('');
  };

  return (
    <div className="search-and-filters">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <span className="search-icon">🔍</span>
        {searchTerm && (
          <button className="search-clear" onClick={handleClear}>×</button>
        )}
      </div>

      {filters && filters.length > 0 && (
        <div className="filters-container">
          <select
            className="filter-select"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <option value="">Todos</option>
            {filters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
