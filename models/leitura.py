from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import text

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

    @staticmethod
    def listarPorHora(data_inicial, data_final):
        with db.engine.connect() as sessao:
            parametros = {
                'data_inicial': data_inicial,
                'data_final': data_final
            }

            cursor = sessao.execute(text("select extract(hour from data) hora, avg(direcao_vento) direcao_vento, avg(umidade_ar) umidade_ar, avg(temperatura) temperatura, avg(luminosidade) luminosidade from public.leitura where data between :data_inicial and :data_final group by hora order by hora"), parametros)
            lista = list()
            for (hora, direcao_vento, umidade_ar, temperatura, luminosidade) in cursor:
                lista.append({
                    'hora': hora,
                    'direcao_vento': direcao_vento,
                    'umidade_ar': umidade_ar,
                    'temperatura': temperatura,
                    'luminosidade': luminosidade
                })
            return lista

    @staticmethod
    def listarPorDia(ano, mes):
        data_inicial = str(ano) + '-' + str(mes) + '-01'
        if mes >= 12:
            mes = 1
            ano = ano + 1
        else:
            mes = mes + 1
        data_final = str(ano) + '-' + str(mes) + '-01'

        with db.engine.connect() as sessao:
            parametros = {
                'data_inicial': data_inicial,
                'data_final': data_final
            }

            cursor = sessao.execute(text("select extract(day from data) dia, avg(direcao_vento) direcao_vento, avg(umidade_ar) umidade_ar, avg(temperatura) temperatura, avg(luminosidade) luminosidade from public.leitura where data between :data_inicial and :data_final group by dia order by dia"), parametros)
            lista = list()
            for (dia, direcao_vento, umidade_ar, temperatura, luminosidade) in cursor:
                lista.append({
                    'dia': dia,
                    'direcao_vento': direcao_vento,
                    'umidade_ar': umidade_ar,
                    'temperatura': temperatura,
                    'luminosidade': luminosidade
                })
            return lista
