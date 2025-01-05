import React, { useState, useEffect } from "react";

function LittleCard({ title, apiEndpoint }) {
  const [count, setCount] = useState(null);

  // Fonction pour récupérer le nombre depuis l'API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(apiEndpoint); // Remplacez par votre API
        const data = await response.json();
        setCount(data.count); // Assurez-vous que le backend retourne un objet avec la clé 'count'
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    }

    // Récupérer les données immédiatement et ensuite toutes les 5 secondes
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Met à jour toutes les 5 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, [apiEndpoint]);

  return (
    <div className="bg-white rounded-lg p-1 w-30 h-15 flex flex-col justify-between">
      <h3 className="text-xl font-sans font-semibold">{title}</h3>
      <p className="text-3xl text-blue-950 font-sans font-bold">
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
}

export default LittleCard;
