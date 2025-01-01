from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.event import listen
import psutil 
import time
import threading
from datetime import datetime


app = Flask(__name__)
# Configurer la base de données MySQL (en utilisant XAMPP)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/moniq_project'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser SQLAlchemy
db = SQLAlchemy(app)

#partie long query

# Table pour enregistrer les requêtes lentes
class Longquery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    query = db.Column(db.Text, nullable=False)
    execution_time = db.Column(db.Float, nullable=False)  # Temps en secondes
    timestamp = db.Column(db.String(50), nullable=False)  # Timestamp de la requête


# Seuil de la requête lente en secondes
LONG_QUERY_THRESHOLD = 5.0  # par exemple, 1 seconde

# Route de test pour exécuter une requête lente
@app.route('/test-slow-query')
def test_slow_query():
    # Exécution d'une requête lente (simulée)
    query = "SELECT SLEEP(6)"  # MySQL Sleep pour simuler une requête lente
    start_time = time.time()  # Temps de départ
    db.session.execute(query)  # Exécution de la requête
    execution_time = time.time() - start_time  # Temps d'exécution
    print(f"Query executed: {query}")
    print(f"Execution time: {execution_time:.2f} seconds")

    # Si la requête est lente, l'enregistrer
    if execution_time > LONG_QUERY_THRESHOLD:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        slow_query = Longquery(
            query=query,
            execution_time=execution_time,
            timestamp=timestamp
        )
        db.session.add(slow_query)
        db.session.commit()

    return f"Slow query executed. Execution time: {execution_time:.2f} seconds."

# Route pour récupérer les requêtes lentes enregistrées
@app.route('/api/long-queries', methods=['GET'])
def get_long_queries():
    queries = Longquery.query.order_by(Longquery.timestamp.desc()).limit(50).all()
    result = [{
        'query': query.query,
        'execution_time': query.execution_time,
        'timestamp': query.timestamp
    } for query in queries]
    return jsonify(result)

#partie CPU et MEM:
# Définir le modèle pour stocker les données de CPU et de mémoire
class SystemUsage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.String(50), nullable=False)  # Timestamp en format string
    cpu_usage = db.Column(db.Float, nullable=False)  # Utilisation du CPU en pourcentage
    memory_usage = db.Column(db.Float, nullable=False)  # Utilisation de la mémoire en pourcentage

    def repr(self):
        return f'<SystemUsage {self.timestamp} CPU: {self.cpu_usage}% Memory: {self.memory_usage}%>'

@app.route('/')
def index():
    # Exemple de requête pour obtenir le premier enregistrement
    usage = SystemUsage.query.first()
    return f"Last recorded usage: {usage}" if usage else "No data found."



# Fonction pour collecter les données du système et les insérer dans la base de données
def log_system_usage():
    with app.app_context():  # Crée un contexte Flask pour le thread
        while True:
            try:
                # Récupérer l'utilisation du CPU et de la mémoire
                cpu_usage = psutil.cpu_percent(interval=1)
                memory_info = psutil.virtual_memory()
                memory_usage = memory_info.percent
                timestamp = time.strftime('%Y-%m-%d %H:%M:%S')

                # Créer un enregistrement dans la base de données
                system_usage = SystemUsage(
                    timestamp=timestamp,
                    cpu_usage=cpu_usage,
                    memory_usage=memory_usage
                )
                # Ajouter et valider l'enregistrement
                db.session.add(system_usage)
                db.session.commit()
                print(f"Data logged: {timestamp} | CPU: {cpu_usage}% | Memory: {memory_usage}%")
            except Exception as e:
                print(f"Erreur lors de la collecte ou de l'insertion : {e}")
            time.sleep(5)

# Démarrer la collecte des données dans un thread séparé
def start_data_collection():
    thread = threading.Thread(target=log_system_usage)
    thread.daemon = True  # Le thread s'arrêtera lorsque le programme principal se termine
    thread.start()


# Ajouter un point d'API pour récupérer les données
@app.route('/api/system-usage', methods=['GET'])
def get_system_usage():
    # Récupérer les 50 dernières lignes (ou ajustez selon vos besoins)
    data = SystemUsage.query.order_by(SystemUsage.timestamp.desc()).limit(50).all()
    
    # Transformer les données en un format JSON
    result = [{
        'timestamp': row.timestamp,
        'cpu_usage': row.cpu_usage,
        'memory_usage': row.memory_usage
    } for row in data]
    
    return jsonify(result)    
    

if __name__ == '__main__':
    # Créer toutes les tables dans la base de données
    with app.app_context():
        db.create_all()
        
        
    # Lancer la collecte des données dans un autre processus ou dans une boucle (ici, décommenter pour l'exécuter)
    #log_system_usage()  # Décommentez pour commencer à collecter en continu
    # Démarrer la collecte des données dans un thread
    start_data_collection()  # Lance la collecte des données dans un thread
    app.run(debug=True)  # Démarre le serveur Flask

