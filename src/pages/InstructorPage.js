import React from 'react';
import EntityForm from '../components/EntityForm';
import { instructorApi } from '../utils/api';

const instructorFields = [
  { name: 'firstname', label: 'First Name', type: 'text', required: true },
  { name: 'lastname', label: 'Last Name', type: 'text', required: true },
  { name: 'address', label: 'Address', type: 'textarea', rows: 2 },
  { name: 'phone', label: 'Phone', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  {
    name: 'preferredContact',
    label: 'Preferred Contact',
    type: 'radio',
    options: [
      { value: 'phone', label: 'Phone' },
      { value: 'email', label: 'Email' }
    ]
  }
];

const initialValues = {
  firstname: '',
  lastname: '',
  address: '',
  phone: '',
  email: '',
  preferredContact: 'email'
};

function InstructorPage() {
  return (
    <EntityForm
      title="Instructor Details"
      entityType="instructor"
      apiService={instructorApi}
      fields={instructorFields}
      initialValues={initialValues}
    />
  );
}

export default InstructorPage;