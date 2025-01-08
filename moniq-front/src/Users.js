import React from 'react';
import "./index.css";
import NavBar from './Components/NavBar';
import PageHeader from './Components/PageHeader';
import LittleCard from './Components/littelCard';
import UsersManage from './UsersManage';

function Users() {
  return (
    <div className="Dashboard bg-lightGray h-screen w-full flex">
      {/* NavBar à gauche */}
      <NavBar />
      
      {/* Contenu principal à droite */}
      <div className="bg-gray-200 w-5/6 h-full flex flex-col px-6 py-2">
     
        {/* Conteneur pour le PageHeader et les LittleCards */}
        <div className="flex justify-between items-start w-full">
          {/* PageHeader */}
          <div className="page-header-container mt-0">
            <PageHeader pageName="Dashboard" />
          </div>
          
          {/* Conteneur pour les cartes */}
          <div className="flex space-x-6 mt-3">
            <LittleCard title="Data Base" apiEndpoint="https://your-backend-api.com/users-count" />
            <LittleCard title="Errors/Alerts" apiEndpoint="https://your-backend-api.com/orders-count" />
            <LittleCard title="Users" apiEndpoint="https://your-backend-api.com/products-count" />
          </div>
        </div>

        {/* Conteneur pour UsersManage */}
        <div className="w-full h-full flex-grow flex flex-col">
          <UsersManage />
        </div>
      </div>
    </div>
  );
}

export default Users;

