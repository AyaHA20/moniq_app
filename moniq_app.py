from flask import Flask
from mysql.connector import connect

app = Flask(__name__)

# Configuration de la base de données
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',  # Nom d'utilisateur par défaut
    'password': '',  # Laisser vide si aucun mot de passe
    'database': 'moniq_project'
}

try:
    connection = connect(**DB_CONFIG)
    if connection.is_connected():
        print("Connexion réussie à la base de données MySQL !")
except Exception as e:
    print(f"Erreur : {e}")

