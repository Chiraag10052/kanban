import React, { useState, useEffect } from 'react';
import './App.css';

// Import images
// import threeDotMenu from '/assets/menu.svg';
// import addIcon from './assets/add.svg';
// import backlogIcon from './assets/Backlog.svg';
// import cancelledIcon from './assets/Cancelled.svg';
// import displayIcon from './assets/Display.svg';
// import doneIcon from './assets/Done.svg';
// import downIcon from './assets/Down.svg';
// import highPriorityIcon from './assets/Img - High Priority.svg';
// import lowPriorityIcon from './assets/Img - Low Priority.svg';
// import mediumPriorityIcon from './assets/Img - Medium Priority.svg';
// import inProgressIcon from './assets/in-progress.svg';
// import noPriorityIcon from './assets/No-priority.svg';
// import urgentPriorityColorIcon from './assets/UrgentPriorityColour.svg';
// import urgentPriorityGreyIcon from './assets/UrgentPriorityGrey.svg';
// import todoIcon from './assets/ToDo.svg';

const API_ENDPOINT = 'https://api.quicksell.co/v1/internal/frontend-assignment';

function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_ENDPOINT);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTickets(data.tickets);
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGroupingChange = (value) => {
    setGrouping(value);
    setIsDropdownOpen(false);
  };

  const handleOrderingChange = (value) => {
    setOrdering(value);
    setIsDropdownOpen(false);
  };

  const groupTickets = () => {
    if (grouping === 'status') {
      return tickets.reduce((acc, ticket) => {
        (acc[ticket.status] = acc[ticket.status] || []).push(ticket);
        return acc;
      }, {});
    } else if (grouping === 'user') {
      return tickets.reduce((acc, ticket) => {
        const user = users.find(u => u.id === ticket.userId);
        (acc[user.name] = acc[user.name] || []).push(ticket);
        return acc;
      }, {});
    }
  };

  const sortTickets = (ticketGroup) => {
    return Object.keys(ticketGroup).reduce((acc, key) => {
      acc[key] = ticketGroup[key].sort((a, b) => b.priority - a.priority);
      return acc;
    }, {});
  };

  const groupedAndSortedTickets = sortTickets(groupTickets());

  return (
    <div className="app">
      <h1>Kanban Board</h1>
      <div className="dropdown-container">
        <button className="dropdown-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          Display Options
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item">
              <span>Grouping:</span>
              <select value={grouping} onChange={(e) => handleGroupingChange(e.target.value)}>
                <option value="status">Status</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="dropdown-item">
              <span>Ordering:</span>
              <select value={ordering} onChange={(e) => handleOrderingChange(e.target.value)}>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>
        )}
      </div>
      <div className="board">
        {Object.entries(groupedAndSortedTickets).map(([group, tickets]) => (
          <div key={group} className="column">
            <h2>{group}</h2>
            {tickets.map(ticket => (
              <div key={ticket.id} className="card">
                <div className="card-header">
                  <span>{ticket.id}</span>
                  <span>{users.find(u => u.id === ticket.userId)?.name}</span>
                </div>
                <h3>{ticket.title}</h3>
                <div className="card-footer">
                  <span className="priority">Priority: {ticket.priority}</span>
                  <span className="tag">{ticket.tag[0]}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;