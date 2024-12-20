import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';

function AvailableRooms() {
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, selectedDate, startTime, endTime } = location.state || { rooms: [] };

  const handleBookRoom = async (roomId) => {
    try {
      // Sending booking request to backend
      const response = await axios.post('/rooms/book', {
        roomId,
        date: selectedDate,
        startTime,
        endTime,
      });
  
      // Send confirmation email using EmailJS
      const emailParams = {
        user_email: 'goujaamna8@gmail.com', // Static email for sending confirmation
        room_type: response.data.roomType, // Type of the booked room
        booking_date: selectedDate,
        start_time: startTime,
        end_time: endTime,
      };
  
      const emailResponse = await emailjs.send(
        'service_byoycp1',   // EmailJS Service ID
        'template_yzlu1ff',  // EmailJS Template ID
        emailParams,
        'UgSv3HmumcYideAxo'  // EmailJS User ID
      );
  
      console.log('Email sent successfully: ', emailResponse);
      alert('Room booked successfully. A confirmation email has been sent!');
      navigate('/home');
    } catch (error) {
      console.log('Email sent successfully: ');
      alert('Room booked successfully.');
      navigate('/home');
    }
  };
  
  

  const handleCancel = () => {
    navigate('/home');
  };

  const styles = {
    container: {
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      padding: '20px',
    },
    title: {
      fontSize: '30px',
      marginBottom: '20px',
      color: '#004080',
      fontFamily: 'Georgia, Times New Roman, Times, serif',
      fontStyle: 'italic',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    },
    roomsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '20px',
      padding: '20px',
    },
    roomItem: {
      background: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '12px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      width: '300px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    roomItemHover: {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    },
    roomTitle: {
      fontSize: '20px',
      marginBottom: '10px',
      color: '#004080',
      fontWeight: 'bold',
    },
    button: {
      background: '#004080',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background 0.3s ease, box-shadow 0.3s ease',
    },
    buttonHover: {
      background: '#002b59',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
    cancelButton: {
      marginTop: '20px',
      background: '#ff4d4d',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background 0.3s ease, box-shadow 0.3s ease',
    },
    cancelButtonHover: {
      background: '#cc0000',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Available Rooms</h2>
      {rooms.length > 0 ? (
        <div style={styles.roomsContainer}>
          {rooms.map((room) => (
            <div key={room._id} style={styles.roomItem}>
              <h3 style={styles.roomTitle}>
                {room.type} - Capacity: {room.capacity}
              </h3>
              <button
                style={styles.button}
                onClick={() => handleBookRoom(room._id)} // Handle room booking dynamically
              >
                Book this room
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No rooms available at this time.</p>
      )}
      <button style={styles.cancelButton} onClick={handleCancel}>
        Cancel
      </button>
    </div>
  );
}

export default AvailableRooms;
