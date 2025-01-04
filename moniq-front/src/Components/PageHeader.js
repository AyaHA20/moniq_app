// PageHeader.js
import React, { useState, useEffect } from 'react';

function PageHeader({ pageName }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(currentDate.toLocaleTimeString());

  // Mettre à jour l'heure toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      const newDate = new Date();
      setCurrentDate(newDate);
      setCurrentTime(newDate.toLocaleTimeString());
    }, 1000); // Mettre à jour chaque seconde

    return () => clearInterval(interval); // Nettoyer l'intervalle quand le composant est démonté
  }, []);

  // Formater la date
  const formattedDate = currentDate.toLocaleDateString();

  return (
    <div className="page-header   my-2">
      <h1 className="text-3xl font-sans font-bold">{pageName}</h1>
      <p className="text-1xl font-sans text-darkGray">{formattedDate} {currentTime}</p>
       
    </div>
  );
}

export default PageHeader;
