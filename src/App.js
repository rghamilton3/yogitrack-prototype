import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import InstructorPage from './pages/InstructorPage';
import CustomerPage from './pages/CustomerPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/instructors" element={<Layout><InstructorPage /></Layout>} />
      <Route path="/customers" element={<Layout><CustomerPage /></Layout>} />
    </Routes>
  );
}

export default App;