import React, { useState, useRef } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: ''
  });
  const [document, setDocument] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState('');
  const [previewDoc, setPreviewDoc] = useState('');
  
  const photoRef = useRef(null);
  const documentRef = useRef(null);

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

  const handleDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Document size should be less than 10MB');
        return;
      }
      setDocument(file);
      setPreviewDoc(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!formData.name || !formData.age || !formData.address || !document || !photo) {
        throw new Error('All fields are required');
      }

      // Create form data
      const data = new FormData();
      data.append('name', formData.name);
      data.append('age', formData.age);
      data.append('address', formData.address);
      data.append('document', document);
      data.append('photo', photo);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Submit profile data
      const response = await axios.post('/users/complete-profile', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Update local storage and app state with new user data
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update parent component's user state
        if (setUser) {
          setUser(updatedUser);
        }
        
        alert('Profile submitted successfully! Please wait for admin verification.');
        navigate('/profile');
      }
    } catch (err) {
      console.error('Profile completion error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Complete Your Profile</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </div>

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
          <label style={{ display: 'block', marginBottom: '5px' }}>Upload Photo *</label>
          <input
            type="file"
            ref={photoRef}
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ marginBottom: '10px' }}
            required
          />
          {previewPhoto && (
            <img
              src={previewPhoto}
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', marginTop: '10px' }}
            />
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Upload ID Document (Aadhaar/PAN) *</label>
          <input
            type="file"
            ref={documentRef}
            accept=".pdf,image/*"
            onChange={handleDocumentChange}
            style={{ marginBottom: '10px' }}
            required
          />
          {previewDoc && document?.type.startsWith('image/') && (
            <img
              src={previewDoc}
              alt="Document Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', display: 'block', marginTop: '10px' }}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Profile'}
        </button>
      </form>
    </div>
  );
};

export default CompleteProfile; 