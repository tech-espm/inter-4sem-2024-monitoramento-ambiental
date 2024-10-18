from flask import Flask
from config import Config
from models.leitura import db
from imports import register_blueprints
from utils.db_utils import init_db


if __name__ == '__main__':
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    init_db(app)

    # Registra as 'blueprints' usando a função do imports.py
    register_blueprints(app)
    app.run(port=6060, host='0.0.0.0', debug=True)
