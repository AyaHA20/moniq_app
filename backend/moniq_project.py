from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
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

# Partie Long Query

# Table pour enregistrer les requêtes lentes
class Longquery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    query = db.Column(db.Text, nullable=False)
    execution_time = db.Column(db.Float, nullable=False)  # Temps en secondes
    timestamp = db.Column(db.String(50), nullable=False)  # Timestamp de la requête

# Seuil de la requête lente en secondes
LONG_QUERY_THRESHOLD = 5.0  # par exemple, 5 secondes

# Route de test pour exécuter une requête lente
@app.route('/test-slow-query/<int:execution_time>', methods=['GET'])
def test_slow_query(execution_time):
    # Exécution d'une requête lente simulée avec une durée d'exécution personnalisée
    try:
        # Par exemple, on crée une requête qui dure longtemps en fonction de l'input
        # Cette requête peut être personnalisée avec des jointures complexes, des sous-requêtes, etc.
        query = f"SELECT SLEEP({execution_time})"  # Utilisation de SLEEP pour tester la lenteur

        start_time = time.time()  # Temps de départ
        db.session.execute(query)  # Exécution de la requête
        execution_time_actual = time.time() - start_time  # Temps d'exécution réel
        print(f"Query executed: {query}")
        print(f"Execution time: {execution_time_actual:.2f} seconds")

        # Si la requête est lente, l'enregistrer
        if execution_time_actual > LONG_QUERY_THRESHOLD:
            print(f"Execution time exceeded threshold: {execution_time_actual:.2f} > {LONG_QUERY_THRESHOLD}")
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            slow_query = Longquery(
                query=query,
                execution_time=execution_time_actual,
                timestamp=timestamp
            )
            print(f"Slow query object created: {slow_query}")
            db.session.add(slow_query)
            db.session.commit()
            print(f"Long query saved to database.")
        else:
            print(f"Query did not meet the long query threshold (execution time: {execution_time_actual:.2f} seconds).")

        return f"Slow query executed. Execution time: {execution_time_actual:.2f} seconds."

    except Exception as e:
        print(f"Error during query execution: {e}")
        return f"Error: {e}"




# Route pour récupérer les requêtes lentes enregistrées
@app.route('/api/long-queries', methods=['GET'])
def get_long_queries():
    print("Fetching long queries from database...")
    queries = Longquery.query.order_by(Longquery.timestamp.desc()).limit(50).all()
    result = [{
        'query': query.query,
        'execution_time': query.execution_time,
        'timestamp': query.timestamp
    } for query in queries]
    print(f"Found {len(result)} long queries in the database.")
    return jsonify(result)


# Partie CPU et MEM

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
                print(f"Logging system usage: {system_usage}")
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

    print(f"Retrieved {len(result)} system usage records.")
    return jsonify(result)


if __name__ == '__main__':
    # Créer toutes les tables dans la base de données
    with app.app_context():
        db.create_all()

    # Démarrer la collecte des données dans un thread
    start_data_collection()  # Lance la collecte des données dans un thread
    app.run(debug=True)  # Démarre le serveur Flask
