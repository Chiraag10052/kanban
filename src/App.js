import React, { useState, useEffect } from "react";
import "./App.css";
const priorityMap = {
  4: { name: "Urgent", color: "#CF3A3A" },
  3: { name: "High", color: "#F39C12" },
  2: { name: "Medium", color: "#F5C300" },
  1: { name: "Low", color: "#4CAF50" },
  0: { name: "No priority", color: "#90A4AE" },
};

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [displayOptions, setDisplayOptions] = useState({
    grouping: "status",
    ordering: "priority",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
      });
  }, []);

  const groupTickets = () => {
    return tickets.reduce((acc, ticket) => {
      let key;
      switch (displayOptions.grouping) {
        case "user":
          key =
            users.find((user) => user.id === ticket.userId)?.name ||
            "Unassigned";
          break;
        case "priority":
          key = priorityMap[ticket.priority].name;
          break;
        default:
          key = ticket.status;
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    }, {});
  };

  const sortTickets = (ticketsToSort) => {
    return ticketsToSort.sort((a, b) => {
      if (displayOptions.ordering === "priority") {
        return b.priority - a.priority;
      }
      return a.title.localeCompare(b.title);
    });
  };

  const groupedAndSortedTickets = Object.entries(groupTickets()).reduce(
    (acc, [key, value]) => {
      acc[key] = sortTickets(value);
      return acc;
    },
    {}
  );

  const renderCard = (ticket) => {
    const assignedUser = users.find((user) => user.id === ticket.userId);
    return (
      <div className="card">
        <div className="card-header">
          <span className="ticket-id">{ticket.id}</span>
          <div className="user-avatar">{assignedUser?.name[0]}</div>
        </div>
        <h3 className="card-title">{ticket.title}</h3>
        <div className="card-footer">
          <span
            className="priority-indicator"
            style={{ backgroundColor: priorityMap[ticket.priority].color }}
          ></span>
          <span className="tag">{ticket.tag[0]}</span>
        </div>
      </div>
    );
  };

  const handleOptionChange = (option, value) => {
    setDisplayOptions((prev) => ({ ...prev, [option]: value }));
    setIsDropdownOpen(false);
  };

  const DisplayDropdown = () => (
    <div className={`dropdown ${isDropdownOpen ? "open" : ""}`}>
      <button
        className="dropdown-toggle"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span>Display</span>
        <svg className="icon" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-section">
            <h4>Grouping</h4>
            <select
              value={displayOptions.grouping}
              onChange={(e) => handleOptionChange("grouping", e.target.value)}
            >
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="dropdown-section">
            <h4>Ordering</h4>
            <select
              value={displayOptions.ordering}
              onChange={(e) => handleOptionChange("ordering", e.target.value)}
            >
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="board-header">
        <DisplayDropdown />
      </div>
      <div className="kanban-board">
      <div className="board-columns">
        {Object.entries(groupedAndSortedTickets).map(
          ([group, groupTickets]) => (
            <div key={group} className="board-column">
              <div className="column-header">
                <h2>{group}</h2>
                <div className="column-actions">
                  <svg className="icon" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <svg className="icon" viewBox="0 0 24 24">
                    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </div>
              </div>
              {groupTickets.map((ticket) => renderCard(ticket))}
            </div>
          )
        )}
      </div>
    </div>
    </>
  );
};

export default App;
