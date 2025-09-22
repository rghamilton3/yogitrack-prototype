import React, { useState, useEffect } from 'react';
import { classApi, instructorApi } from '../utils/api';

function ClassPage() {
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [formData, setFormData] = useState({
    className: '',
    instructorId: '',
    classType: 'General',
    description: '',
    payRate: '',
    daytime: [{ day: 'Mon', time: '09:00:00', duration: 60 }]
  });
  const [mode, setMode] = useState('search');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClasses();
    loadInstructors();
  }, []);

  const loadClasses = async () => {
    try {
      const response = await classApi.get('/getClassIds');
      setClasses(response.data);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  const loadInstructors = async () => {
    try {
      const response = await instructorApi.get('/getInstructorIds');
      setInstructors(response.data);
    } catch (error) {
      console.error('Failed to load instructors:', error);
    }
  };

  const loadClass = async (classId) => {
    try {
      const response = await classApi.get(`/getClass?classId=${classId}`);
      const classData = response.data;
      setFormData({
        className: classData.className || '',
        instructorId: classData.instructorId || '',
        classType: classData.classType || 'General',
        description: classData.description || '',
        payRate: classData.payRate || '',
        daytime: classData.daytime || [{ day: 'Mon', time: '09:00:00', duration: 60 }]
      });
    } catch (error) {
      alert('Error loading class: ' + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDaytimeChange = (index, field, value) => {
    const newDaytime = [...formData.daytime];
    newDaytime[index] = { ...newDaytime[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      daytime: newDaytime
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      daytime: [...prev.daytime, { day: 'Mon', time: '09:00:00', duration: 60 }]
    }));
  };

  const removeTimeSlot = (index) => {
    if (formData.daytime.length > 1) {
      const newDaytime = formData.daytime.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        daytime: newDaytime
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode !== 'add') return;

    setLoading(true);
    try {
      const idResponse = await classApi.get('/getNextId');
      const classData = {
        ...formData,
        classId: idResponse.data.nextId,
        payRate: parseFloat(formData.payRate)
      };

      await handleAddClass(classData);
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async (classData) => {
    try {
      const response = await classApi.post('/add', classData);

      alert(`✅ Class "${classData.className}" added successfully!`);
      if (response.data.confirmationSent) {
        alert('📧 Confirmation messages sent to manager and instructor');
      }
      resetForm();
      loadClasses();
    } catch (error) {
      if (error.message.includes('Schedule conflict detected')) {
        // Parse the error to get conflict details
        try {
          const errorResponse = await classApi.post('/add', classData);
        } catch (conflictError) {
          // Extract conflict details from the 409 response
          if (conflictError.message.includes('conflict')) {
            const confirmed = confirm(
              `⚠️ Schedule conflict detected! There's already a class scheduled at this time. Do you want to add this class anyway?`
            );

            if (confirmed) {
              try {
                const response = await classApi.post('/addWithConflict', classData);
                alert(`✅ Class "${classData.className}" added successfully (conflict override)!`);
                if (response.data.confirmationSent) {
                  alert('📧 Confirmation messages sent to manager and instructor');
                }
                resetForm();
                loadClasses();
              } catch (confirmError) {
                throw confirmError;
              }
            }
          } else {
            throw conflictError;
          }
        }
      } else {
        throw error;
      }
    }
  };

  const handleDelete = async () => {
    if (!selectedClassId) {
      alert('Please select a class to delete');
      return;
    }

    if (confirm(`Are you sure you want to delete class ${selectedClassId}?`)) {
      try {
        await classApi.delete(`/deleteClass?classId=${selectedClassId}`);
        alert(`Class ${selectedClassId} successfully deactivated`);
        resetForm();
        loadClasses();
      } catch (error) {
        alert(`Error deleting class: ${error.message}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      className: '',
      instructorId: '',
      classType: 'General',
      description: '',
      payRate: '',
      daytime: [{ day: 'Mon', time: '09:00:00', duration: 60 }]
    });
    setSelectedClassId('');
  };

  const setSearchMode = () => {
    setMode('search');
    resetForm();
    loadClasses();
  };

  const setAddMode = () => {
    setMode('add');
    resetForm();
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Class Management</h2>

      {mode === 'search' && (
        <label>
          Class ID
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              if (e.target.value) loadClass(e.target.value);
            }}
            className="form-input"
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls.classId} value={cls.classId}>
                {cls.classId}: {cls.className}
              </option>
            ))}
          </select>
        </label>
      )}

      {mode === 'add' && (
        <label>
          Class ID
          <input type="text" value="Auto-generated on save" readOnly />
        </label>
      )}

      <label>
        Class Name
        <input
          type="text"
          name="className"
          value={formData.className}
          onChange={handleInputChange}
          required={mode === 'add'}
        />
      </label>

      <label>
        Instructor
        <select
          name="instructorId"
          value={formData.instructorId}
          onChange={handleInputChange}
          required={mode === 'add'}
        >
          <option value="">-- Select Instructor --</option>
          {instructors.map((instructor) => (
            <option key={instructor.instructorId} value={instructor.instructorId}>
              {instructor.instructorId}: {instructor.firstname} {instructor.lastname}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend>Class Type</legend>
        <div className="radio-row">
          <label>
            <input
              type="radio"
              name="classType"
              value="General"
              checked={formData.classType === 'General'}
              onChange={handleInputChange}
            />
            General
          </label>
          <label>
            <input
              type="radio"
              name="classType"
              value="Special"
              checked={formData.classType === 'Special'}
              onChange={handleInputChange}
            />
            Special
          </label>
        </div>
      </fieldset>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows="2"
        />
      </label>

      <label>
        Pay Rate ($)
        <input
          type="number"
          name="payRate"
          value={formData.payRate}
          onChange={handleInputChange}
          min="0"
          step="0.01"
          required={mode === 'add'}
        />
      </label>

      <fieldset>
        <legend>Schedule</legend>
        {formData.daytime.map((dt, index) => (
          <div key={index} className="grid-4" style={{ marginBottom: '10px' }}>
            <select
              value={dt.day}
              onChange={(e) => handleDaytimeChange(index, 'day', e.target.value)}
            >
              <option value="Mon">Monday</option>
              <option value="Tue">Tuesday</option>
              <option value="Wed">Wednesday</option>
              <option value="Thu">Thursday</option>
              <option value="Fri">Friday</option>
              <option value="Sat">Saturday</option>
              <option value="Sun">Sunday</option>
            </select>
            <input
              type="time"
              value={dt.time.slice(0, 5)}
              onChange={(e) => handleDaytimeChange(index, 'time', e.target.value + ':00')}
            />
            <input
              type="number"
              value={dt.duration}
              onChange={(e) => handleDaytimeChange(index, 'duration', parseInt(e.target.value))}
              min="15"
              max="180"
              placeholder="Duration (min)"
            />
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => removeTimeSlot(index)}
              disabled={formData.daytime.length === 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn" onClick={addTimeSlot}>
          Add Time Slot
        </button>
      </fieldset>

      <div className="btn-row">
        <button type="button" className="btn" onClick={setSearchMode}>
          Search
        </button>
        <button type="button" className="btn btn--primary" onClick={setAddMode}>
          Add New
        </button>
        {mode === 'add' && (
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        )}
        {mode === 'search' && (
          <button type="button" className="btn btn--danger" onClick={handleDelete}>
            Delete
          </button>
        )}
        <button type="button" className="btn" onClick={resetForm}>
          Clear
        </button>
      </div>
    </form>
  );
}

export default ClassPage;