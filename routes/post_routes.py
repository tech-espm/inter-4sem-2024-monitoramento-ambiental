import logging
from flask import Blueprint, request, jsonify
from models.leitura import Leitura, db

post_routes = Blueprint('post_routes', __name__)


@post_routes.route('/insert_data', methods=['POST'])
def add_leitura():
    try:
        data = request.get_json()
        logging.debug(f'Dados recebidos: {data}')
        nova_leitura = Leitura(
            direcao_vento=float(data['direcao_vento']),
            umidade_ar=float(data['umidade_ar']),
            temperatura=float(data['temperatura']),
            luminosidade=float(data['luminosidade'])
        )
        db.session.add(nova_leitura)
        db.session.commit()
        logging.info('Leitura adicionada com sucesso.')
        return jsonify({"message": "Leitura adicionada com sucesso"}), 201
    except Exception as e:
        db.session.rollback()
        logging.error(f'Erro ao adicionar leitura: {e}')
        return jsonify({"error": f"Falha ao adicionar leitura: {str(e)}"}), 400
