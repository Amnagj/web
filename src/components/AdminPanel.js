import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css"; // Ensure this file exists and contains the necessary styles
import graph1 from "./user_signups_by_month.jpg";
import graph2 from "./user_repartition.jpg";
import graph3 from "./room_bookings.jpg";
import graph4 from "./room_occupancy_rate.jpg";

// Component for the dashboard
const DashboardContent = () => (
  <div className="dashboard-container">
    <header>
      <h1>Tableau de Bord du Coworking</h1>
    </header>
    
    <section className="card-container">
      <div className="card">
        <h2>Utilisateurs Inscrits par Mois</h2>
        <img src={graph1} alt="Utilisateurs Inscrits par Mois" />
      </div>

      <div className="card">
        <h2>Répartition des Utilisateurs : Admin vs Non-Admin</h2>
        <img src={graph2} alt="Répartition des Utilisateurs" />
      </div>

      <div className="card">
        <h2>Réservations par Type de Salle</h2>
        <img src={graph3} alt="Réservations par Type de Salle" />
      </div>

      <div className="card">
        <h2>Taux d'Occupation des Salles</h2>
        <img src={graph4} alt="Taux d'Occupation des Salles" />
      </div>
    </section>
  </div>
);

const AdminPanel = () => {
  const [users, setUsers] = useState([]); // List of users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [newUser, setNewUser] = useState({ name: "", mail: "", password: "" }); // New user data
  const [success, setSuccess] = useState(null); // Success message
  const [contacts, setContacts] = useState([]); // Contacts state

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true, // Ensure cookies are sent
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch contacts from the backend
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/contacts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true, // Ensure cookies are sent
        });
        setContacts(response.data);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError(err.message);
      }
    };

    fetchContacts();
  }, []);

  // Handle adding a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error("Failed to add user.");
      }
      const addedUser = await response.json();
      setUsers([...users, addedUser]); // Add user to the list
      setNewUser({ name: "", mail: "", password: "" }); // Reset form
      setSuccess("User added successfully!");
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      console.error("Token is missing. Please login first.");
      setError("Token is missing. Please login first.");
      return; // Stop execution if token is missing
    }
  
    console.log("Token being sent:", token); // Debugging line
    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Send token in header
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }
      const result = await response.json();
      setUsers(users.filter((user) => user._id !== userId)); // Remove user from the list
      setSuccess("User deleted successfully!");
      setError(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Error deleting user: " + err.message);
      setSuccess(null);
    }
  };
  
  
  

  return (
    <div className="admin-panel">
      <div className="admin-content">
        <h1 className="admin-title">Admin Panel</h1>
        {loading && <p className="loading">Loading users...</p>}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        {/* User Table */}
        {!loading && !error && (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.mail}</td>
                  <td>{user.isAdmin ? "Admin" : "User"}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Dashboard Section */}
        <DashboardContent />

        {/* Contacts Table */}
        <div className="contacts-section">
          <h2>Registered Contacts</h2>
          {contacts.length > 0 ? (
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact._id}</td>
                    <td>{contact.name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No contacts available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
