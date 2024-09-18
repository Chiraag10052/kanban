// src/components/Navbar.js
import React from 'react';

export function Navbar({ grouping, setGrouping, ordering, setOrdering }) {
  return (
    <div className="navbar">
      <div className="navbar-item">
        <span>Grouping:</span>
        <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
          <option value="status">Status</option>
          <option value="user">User</option>
        </select>
      </div>
      <div className="navbar-item">
        <span>Ordering:</span>
        <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>
  );
}


