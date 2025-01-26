import React from 'react';
import "./index.css";
import NavBar from './Components/NavBar';
import PageHeader from './Components/PageHeader';
import LittleCard from './Components/littelCard';
import ErrorsManage from './ErrorsComponents/ErrorsManage';
 
  

function Errors() {
  return (
    <div className="Dashboard bg-lightGray h-screen w-full flex">
      {/* NavBar à gauche */}
      <NavBar />
      
      {/* Contenu principal à droite */}
      <div className="bg-gray-200 font-sans w-5/6 h-full flex flex-col px-6 py-2">
     
        {/* Conteneur pour le PageHeader et les LittleCards */}
        <div className="flex justify-between items-start w-full">
          {/* PageHeader */}
          <div className="page-header-container font-sans mt-0">
            <PageHeader pageName="Errors" />
          </div>
          
        {/* Conteneur pour les cartes */}
        <div className="flex space-x-6 mt-3">
            <LittleCard title="Data Base" apiEndpoint="http://localhost:3000/api/system-state" />
            <LittleCard title="Errors/Alerts" apiEndpoint="http://localhost:3000/api/system-state" />
            <LittleCard title="Users" apiEndpoint="http://localhost:3000/api/system-state" />
          </div>
        </div>


        <ErrorsManage/>

        
        
      </div>
    </div>
  );
}

export default Errors;
