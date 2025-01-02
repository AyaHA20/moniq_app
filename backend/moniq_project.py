from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_socketio import SocketIO, emit
import psutil
import threading
import time

app = Flask(__name__)

# Configurer la base de données MySQL (en utilisant XAMPP)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/moniq_project'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser SQLAlchemy
db = SQLAlchemy(app)

# Modèle pour system_metrics
class SystemMetric(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cpu_usage = db.Column(db.Float, nullable=False)
    memory_usage = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Route pour récupérer les métriques système
@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    # Récupérer les 10 dernières entrées de la table system_metrics
    metrics = SystemMetric.query.order_by(SystemMetric.timestamp.desc()).limit(10).all()
    data = [
        {
            'cpu': m.cpu_usage,
            'memory': m.memory_usage,
            'timestamp': m.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
        for m in metrics
    ]
    return jsonify(data)

# Initialiser SocketIO avant de démarrer l'application
socketio = SocketIO(app)

@socketio.on('connect')
def handle_connect():
    emit('message', {'data': 'Connected to the server!'})

@socketio.on('request_update')
def handle_request_update():
    # Récupérer la dernière métrique du système
    latest_metric = SystemMetric.query.order_by(SystemMetric.timestamp.desc()).first()
    if latest_metric:
        emit('update', {'cpu': latest_metric.cpu_usage, 'memory': latest_metric.memory_usage, 'timestamp': latest_metric.timestamp.strftime('%Y-%m-%d %H:%M:%S')})
    else:
        emit('update', {'cpu': 0, 'memory': 0, 'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')})

# Fonction pour récupérer les vraies métriques CPU et mémoire et envoyer des mises à jour en temps réel
def get_system_metrics():
    while True:
        # Récupérer l'utilisation réelle du CPU et de la mémoire
        cpu_usage = psutil.cpu_percent(interval=1)  # Pourcentage d'utilisation du CPU
        memory_usage = psutil.virtual_memory().percent  # Pourcentage d'utilisation de la mémoire

        # Ajouter les métriques dans la base de données
        metric = SystemMetric(cpu_usage=cpu_usage, memory_usage=memory_usage)
        db.session.add(metric)
        db.session.commit()

        # Envoyer les nouvelles métriques via SocketIO
        socketio.emit('update', {'cpu': cpu_usage, 'memory': memory_usage, 'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')})

        # Attendre une seconde avant de simuler la prochaine métrique
        time.sleep(1)

# Lancer un thread pour récupérer les métriques du système
thread = threading.Thread(target=get_system_metrics)
thread.daemon = True
thread.start()

# Créer toutes les tables dans la base de données avant de démarrer l'application
with app.app_context():
    db.create_all()

# Démarrer l'application avec SocketIO
if __name__ == '__main__':
    socketio.run(app, debug=True)
