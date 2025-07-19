import React, { useState, useRef, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = ({ user }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    address: ''
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState('');
  
  const photoRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        age: user.age || '',
        address: user.address || ''
      });
      if (user.photoPath) {
        setPreviewPhoto(`${import.meta.env.VITE_API_URL}/uploads/photos/${user.photoPath}`);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Photo size should be less than 5MB');
        return;
      }
      setPhoto(file);
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const data = new FormData();
      data.append('age', formData.age);
      data.append('address', formData.address);
      if (photo) {
        data.append('photo', photo);
      }

      const response = await axios.put(`/users/update/${user._id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Update local storage with new user data
        localStorage.setItem('user', JSON.stringify(response.data.user));
        alert('Profile updated successfully!');
        navigate('/profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Edit Profile</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Age *</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            min="18"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '100px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Update Photo</label>
          <input
            type="file"
            ref={photoRef}
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ marginBottom: '10px' }}
          />
          {previewPhoto && (
            <img
              src={previewPhoto}
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', marginTop: '10px' }}
            />
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
