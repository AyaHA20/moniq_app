import React from 'react';
import "./index.css";
import NavBar from './Components/NavBar';
import PageHeader from './Components/PageHeader';
import LittleCard from './Components/littelCard';
import MediumCard from './DashboardComponent/MediumCard';
import LongQuery from './DashboardComponent/LongQuery';
import UserCard from './DashboardComponent/UserCard';
import CpuMemUsage from './Components/CpuMemUsage';

function Dashboard() {
  return (
    <div className="Dashboard bg-lightGray h-screen w-full flex">
      {/* NavBar à gauche */}
      <NavBar />
      
      {/* Contenu principal à droite */}
      <div className="bg-gray-100 w-5/6 h-full flex flex-col px-6 py-2">
     
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

        {/* Section principale avec MediumCards et nouveaux composants */}
        <div className="flex flex-row mt-6 h-[275px]">
          {/* Colonne gauche avec les MediumCards */}
          <div className="flex flex-col w-1/4 space-y-4">
            <MediumCard type="CPU" />
            <MediumCard type="Mem" />
          </div>

          {/* Colonne droite avec les nouveaux composants */}
          <div className="flex flex-row w-3/4 space-x-4 pl-4">
            <div className="flex-1 bg-white rounded-lg h-full">
              <LongQuery />
            </div>
            <div className="flex-1 bg-white rounded-lg h-full">
              <UserCard />
            </div>
          </div>
        </div>

        {/* Nouveau composant CpuMemUsage */}
        <div className="flex-1 mt-6 h-[200px]">
          <CpuMemUsage />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
