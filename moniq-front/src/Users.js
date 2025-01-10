import React , { useState } from 'react';
import "./index.css";
import NavBar from './Components/NavBar';
import PageHeader from './Components/PageHeader';
import LittleCard from './Components/littelCard';
import UsersManage from '../src/UsersComponents/UsersManage';


function Users() {
 // 1. Ajouter l'état pour la valeur de la barre de recherche
  const [search, setSearch] = useState('');

 // 2. Fonction pour mettre à jour l'état de la recherche
  const handleSearchChange = (e) => {
     setSearch(e.target.value);
  };

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
            <PageHeader pageName="Users" />
          </div>
          
          {/* Conteneur pour les cartes */}
          <div className="flex space-x-6 mt-3">
            <LittleCard title="Data Base" apiEndpoint="https://your-backend-api.com/users-count" />
            <LittleCard title="Errors/Alerts" apiEndpoint="https://your-backend-api.com/orders-count" />
            <LittleCard title="Users" apiEndpoint="https://your-backend-api.com/products-count" />
          </div>
        </div>

          {/*le component usermanage*/}
          <UsersManage/>
          


        
        
        
      </div>
    </div>
  );
}

export default Users;
