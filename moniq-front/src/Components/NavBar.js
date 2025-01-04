import React, { useState } from 'react';
import { NavBarData } from '../Data/Data'; // Importer les données
import momotoring from '../img/momotoring.png';
import logo from '../img/logo.png';

function NavBar() {
  const [selected, setselected] = useState(0);

  return (
    <div className="bg-white h-full w-1/6 flex flex-col items-center px-6 justify-center">
      
      {/* Titre MoniQ */} 
      <a className='flex items-center cursor-pointer mb-4'>
         <img src={logo} alt="thelogo" className=' w-14 h-14'/>
         <h1 className="text-black text-3xl font-sans font-bold ">MoniQ</h1> 
      </a>
      
      {/* Conteneur des éléments du menu */}
      <div className='flex flex-col items-center font-bold gap-2 mt-10 w-full'>
        {/* Parcours des éléments de la navbar */}
        {NavBarData.map((item, index) => (
          <div
            key={index}
            className={`MenuItem flex items-center justify-start w-full p-4 rounded-lg cursor-pointer 
              ${selected === index ? 'bg-gray-300 text-black font-sans' : 'bg-white text-black'}`}
            onClick={() => setselected(index)}
          >
            {/* Icône devant le titre */}
            <img src={item.icon} alt={item.heading} className="mr-2 w-6 h-6" />
            <span>{item.heading}</span>
          </div>
        ))}
      </div>
       {/*the last picture (monitoring) */}
      <div className='mt-14'>
        <img src={momotoring} alt="last picture"/>
      </div>



    </div>



  );
}

export default NavBar;
