import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Navbar';
import Footer from '../Footer';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;