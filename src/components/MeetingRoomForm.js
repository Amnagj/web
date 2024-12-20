import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Updated to use useNavigate
import './MeetingRoomForm.css';

function MeetingRoomForm() {
  const [peopleCount, setPeopleCount] = useState(3);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [workspaceType, setWorkspaceType] = useState('Meeting room');
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [errorMessage, setErrorMessage] = useState(null);

  const isLoggedIn = () => {
    return document.cookie.includes('access_token');
  };
  // Counter handlers
  const incrementPeople = () => setPeopleCount((prev) => prev + 1);
  const decrementPeople = () => peopleCount > 1 && setPeopleCount((prev) => prev - 1);

  // Time handlers
  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    if (newStartTime > endTime) {
      setEndTime(newStartTime);
    }
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    if (newEndTime >= startTime) {
      setEndTime(newEndTime);
    }
  };

  // Search button handler
  const handleSearch = async () => {
    if (!selectedDate || !startTime || !endTime) {
      setAvailabilityMessage('Please fill in all required fields.');
      return;
    }
  
    try {
      // Make a POST request to check room availability
      const response = await axios.post(
        '/rooms/check-availability', 
        {
          type: workspaceType,
          date: selectedDate,
          startTime,
          endTime,
        },
        { withCredentials: true } // Send cookies along with the request
      );
  
      if (response.data.available) {
        navigate('/available-rooms', { state: { rooms: response.data.rooms } });
      } else {
        setAvailabilityMessage('No rooms are available at this time.');
      }
    } catch (error) {
      // Check for authentication error or any other error
      if (error.response && error.response.status === 401) {
        setErrorMessage('You must be logged in to book a room.');
      } else {
        setAvailabilityMessage('An error occurred while checking availability.');
      }
      console.error(error);
    }
  };
  

  return (
    <div className="booking-form">
      <h2>Book a meeting room</h2>
      <p>Get the space you need to impress clients, hold memorable workshops, or deliver a winning pitch.</p>

      <input
        type="text"
        placeholder="Enter a city, area or location name"
        className="location-input"
      />

      <div className="form-group">
        <label>Type of workspace*</label>
        <select
          className="select-input"
          value={workspaceType}
          onChange={(e) => setWorkspaceType(e.target.value)}
        >
          <option>Meeting room</option>
          <option>Private office</option>
          <option>Coworking space</option>
        </select>
      </div>

      <div className="form-group">
        <label>Number of people*</label>
        <div className="people-count">
          <button type="button" onClick={decrementPeople} disabled={peopleCount <= 1}>
            -
          </button>
          <span>{peopleCount}</span>
          <button type="button" onClick={incrementPeople}>+</button>
        </div>
      </div>

      <div className="form-group">
        <label>Date*</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="form-group">
        <label>Start and end time*</label>
        <div className="time-slots">
          <div className="time-slot">
            <label>Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              min="09:00"
              max="18:00"
              className="time-input"
            />
          </div>
          <div className="time-slot">
            <label>End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              min="09:00"
              max="18:00"
              className="time-input"
            />
          </div>
        </div>
      </div>

      <button className="search-button" onClick={handleSearch}>
        Search
      </button>

      {availabilityMessage && (
        <div className="availability-message">
          <p>{availabilityMessage}</p>
        </div>
      )}
    </div>
  );
}

export default MeetingRoomForm;
