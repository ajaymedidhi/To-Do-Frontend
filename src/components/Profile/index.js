
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import './index.css'; // Import the CSS file

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      navigate('/login'); // Redirect if not authenticated
    } else {
      fetchProfile(jwtToken);
    }
  }, [navigate]);

  const fetchProfile = async (token) => {
    try {
      const response = await axios.get('https://to-do-app-ytdb.onrender.com/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data); // Set the fetched profile data
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to fetch profile.');
    }
  };

  const updateProfile = async () => {
    const jwtToken = localStorage.getItem('token');
    try {
      await axios.put('https://to-do-app-ytdb.onrender.com/api/auth/profile', 
        { name: profile.name, email: profile.email, password }, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      alert('Profile updated successfully!');
      setIsEditing(false); // Switch back to view mode
      fetchProfile(jwtToken); // Refetch the profile after updating
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to login page
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>User Profile</h2>
        {!isEditing ? (
          <div className="profile-info">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="profile-edit">
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Name"
            />
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Email"
              disabled // Disable the email input since it's not editable
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password (leave blank if not changing)"
            />
            <button onClick={updateProfile}>Update Profile</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
