import React, { useState, useEffect } from 'react';
import useForm from '../hooks/useForm';

function EntityForm({
  title,
  entityType, // 'instructor' or 'customer'
  apiService,
  fields,
  initialValues,
  onSubmit,
  onDelete
}) {
  const { values, mode, handleChange, reset, setValues, setFormMode } = useForm(initialValues);
  const [entityList, setEntityList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'search') {
      loadEntityList();
    }
  }, [mode]);

  const loadEntityList = async () => {
    try {
      const response = await apiService.get(`/get${entityType.charAt(0).toUpperCase() + entityType.slice(1)}Ids`);
      setEntityList(response.data);
    } catch (error) {
      console.error(`Failed to load ${entityType} list:`, error);
    }
  };

  const handleEntitySelect = async (e) => {
    const entityId = e.target.value.split(':')[0];
    if (!entityId) return;

    try {
      const response = await apiService.get(`/get${entityType.charAt(0).toUpperCase() + entityType.slice(1)}?${entityType}Id=${entityId}`);
      setValues(response.data);
    } catch (error) {
      alert(`Error loading ${entityType}: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode !== 'add') return;

    setLoading(true);
    try {
      // Get next ID
      const idResponse = await apiService.get('/getNextId');
      const entityData = {
        ...values,
        [`${entityType}Id`]: idResponse.data.nextId
      };

      await handleAdd(entityData);
    } catch (error) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (entityData) => {
    try {
      const response = await apiService.post('/add', entityData);

      alert(`✅ ${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${entityData[`${entityType}Id`]} added successfully!`);
      if (response.data.confirmationSent) {
        alert(`📧 Confirmation message sent to ${entityData.email}`);
      }
      reset();
      if (onSubmit) onSubmit(response.data);
    } catch (error) {
      if (error.message.includes('already exists')) {
        const confirmed = confirm(`⚠️ A ${entityType} with this name already exists. Do you want to add another ${entityType} with the same name?`);

        if (confirmed) {
          try {
            const response = await apiService.post('/addConfirmed', entityData);
            alert(`✅ ${entityType.charAt(0).toUpperCase() + entityType.slice(1)} ${entityData[`${entityType}Id`]} added successfully!`);
            if (response.data.confirmationSent) {
              alert(`📧 Confirmation message sent to ${entityData.email}`);
            }
            reset();
            if (onSubmit) onSubmit(response.data);
          } catch (confirmError) {
            throw confirmError;
          }
        }
      } else {
        throw error;
      }
    }
  };

  const handleDelete = async () => {
    const selectedOption = document.querySelector(`#${entityType}Select`).value;
    const entityId = selectedOption.split(':')[0];

    if (!entityId) {
      alert('Please select a ' + entityType + ' to delete');
      return;
    }

    if (confirm(`Are you sure you want to delete ${entityType} ${entityId}?`)) {
      try {
        await apiService.delete(`/delete${entityType.charAt(0).toUpperCase() + entityType.slice(1)}?${entityType}Id=${entityId}`);
        alert(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} with id ${entityId} successfully deleted`);
        reset();
        loadEntityList();
        if (onDelete) onDelete(entityId);
      } catch (error) {
        alert(`Error deleting ${entityType}: ${error.message}`);
      }
    }
  };

  const renderField = (field) => {
    const { name, label, type, options, ...props } = field;

    switch (type) {
      case 'radio':
        return (
          <fieldset key={name}>
            <legend>{label}</legend>
            <div className="radio-row">
              {options.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={values[name] === option.value}
                    onChange={handleChange}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        );

      case 'textarea':
        return (
          <label key={name}>
            {label}
            <textarea
              name={name}
              value={values[name] || ''}
              onChange={handleChange}
              {...props}
            />
          </label>
        );

      case 'checkbox':
        return (
          <label key={name}>
            <input
              type="checkbox"
              name={name}
              checked={values[name] || false}
              onChange={handleChange}
              {...props}
            />
            {label}
          </label>
        );

      default:
        return (
          <label key={name}>
            {label}
            <input
              type={type || 'text'}
              name={name}
              value={values[name] || ''}
              onChange={handleChange}
              {...props}
            />
          </label>
        );
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{title}</h2>

      {mode === 'search' && (
        <label htmlFor={`${entityType}Select`}>
          {entityType.charAt(0).toUpperCase() + entityType.slice(1)} ID
          <select
            id={`${entityType}Select`}
            className="form-input"
            onChange={handleEntitySelect}
            required
          >
            <option value="">-- Select {entityType.charAt(0).toUpperCase() + entityType.slice(1)} Id --</option>
            {entityList.map((entity) => (
              <option key={entity[`${entityType}Id`]} value={entity[`${entityType}Id`]}>
                {entity[`${entityType}Id`]}:{entity.firstName || entity.firstname} {entity.lastName || entity.lastname}
              </option>
            ))}
          </select>
        </label>
      )}

      {mode === 'add' && (
        <label>
          {entityType.charAt(0).toUpperCase() + entityType.slice(1)} ID
          <input type="text" value={`Auto-generated on save`} readOnly />
        </label>
      )}

      {fields.map(renderField)}

      <div className="btn-row">
        <button type="button" className="btn" onClick={() => { reset(); setFormMode('search'); loadEntityList(); }}>
          Search
        </button>
        <button type="button" className="btn btn--primary" onClick={() => { reset(); setFormMode('add'); }}>
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
        <button type="button" className="btn" onClick={reset}>
          Clear
        </button>
      </div>
    </form>
  );
}

export default EntityForm;