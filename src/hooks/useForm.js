import { useState } from 'react';

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [mode, setMode] = useState('search');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const reset = () => {
    setValues(initialValues);
  };

  const setFormMode = (newMode) => {
    setMode(newMode);
  };

  return {
    values,
    mode,
    handleChange,
    reset,
    setValues,
    setFormMode
  };
}

export default useForm;