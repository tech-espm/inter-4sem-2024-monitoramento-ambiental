from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Leitura(db.Model):
    __tablename__ = 'leitura'

    id_leitura = db.Column(db.Integer, primary_key=True, autoincrement=True)
    data = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    direcao_vento = db.Column(db.Float, nullable=False)
    umidade_ar = db.Column(db.Float, nullable=False)
    temperatura = db.Column(db.Float, nullable=False)
    luminosidade = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<Leitura {self.id_leitura} - {self.data}>'
