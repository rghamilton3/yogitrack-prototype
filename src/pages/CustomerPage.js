import React from 'react';
import EntityForm from '../components/EntityForm';
import { customerApi } from '../utils/api';

const customerFields = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'address', label: 'Address', type: 'textarea', rows: 2 },
  { name: 'phone', label: 'Phone', type: 'tel', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  {
    name: 'senior',
    label: 'Senior (62 & older)',
    type: 'checkbox'
  },
  {
    name: 'preferredContact',
    label: 'Preferred Contact',
    type: 'radio',
    options: [
      { value: 'phone', label: 'Phone' },
      { value: 'email', label: 'Email' }
    ]
  },
  { name: 'classBalance', label: 'Class Balance', type: 'number', readOnly: true }
];

const initialValues = {
  firstName: '',
  lastName: '',
  address: '',
  phone: '',
  email: '',
  senior: false,
  preferredContact: 'email',
  classBalance: 0
};

function CustomerPage() {
  return (
    <EntityForm
      title="Customer Details"
      entityType="customer"
      apiService={customerApi}
      fields={customerFields}
      initialValues={initialValues}
    />
  );
}

export default CustomerPage;