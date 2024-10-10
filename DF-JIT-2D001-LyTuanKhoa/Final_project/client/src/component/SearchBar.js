import React, { useState } from 'react';
import './SearchBar.css'; // Import file CSS

const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery); // Gọi hàm onSearch từ props với từ khóa tìm kiếm
    }
  };

  return (
    <form className='search-form' onSubmit={handleSearch}>
      <div className='input-container'>
        <input 
          type="search" 
          placeholder='Type here...' 
          className='search-input'
          value={searchQuery}
          onChange={handleInputChange}
        />
        <button className='search-button' type="submit">
          <label>Search</label>
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
