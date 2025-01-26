import React, { useState, useEffect } from "react";

function LittleCard({ title, apiEndpoint }) {
  const [count, setCount] = useState(null);

  // Fonction pour récupérer le nombre depuis l'API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        // Adapter en fonction de la route appelée
        switch (title) {
          case "Data Base":
            setCount(data.databaseCount); // Utilise databaseCount
            break;
          case "Errors/Alerts":
            setCount(data.errorCount + data.warningCount); // Utilise errorCount et warningCount
            break;
          case "Users":
            setCount(data.userCount); // Utilise userCount
            break;
          default:
            console.error("Titre de carte non reconnu :", title);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    }

    // Récupérer les données immédiatement et ensuite toutes les 5 secondes
    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Met à jour toutes les 5 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, [apiEndpoint, title]);

  return (
    <div
      style={{
        width: "120px", // Largeur encore plus petite
        height: "60px", // Hauteur encore plus petite
        backgroundColor: "white", // Fond blanc
        borderRadius: "6px", // Coins arrondis légèrement réduits
        padding: "8px", // Espace interne réduit
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Espacement entre le titre et le compteur
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Ombre légère
      }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: "600", fontFamily: "sans-serif", margin: "0 0 2px 0" }}>
        {title}
      </h3>
      <p style={{ fontSize: "18px", color: "#1a365d", fontWeight: "700", fontFamily: "sans-serif", margin: 0 }}>
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
}

export default LittleCard;