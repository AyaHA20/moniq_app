from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configurer la base de données MySQL (en utilisant XAMPP)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/moniq_project'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser SQLAlchemy
db = SQLAlchemy(app)

# Définir un modèle (par exemple, un utilisateur)
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

@app.route('/')
def index():
    # Exemple de requête
    user = User.query.first()
    return f"Hello, {user.username}!" if user else "No user found."

if __name__ == '__main__':
    # Créer toutes les tables dans la base de données
    with app.app_context():
        db.create_all()
    app.run(debug=True)
 