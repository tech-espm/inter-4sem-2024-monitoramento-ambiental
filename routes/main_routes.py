from flask import Blueprint, render_template, request, json
from models.leitura import Leitura

main_routes = Blueprint('main_routes', __name__)

@main_routes.route('/')
def index():
    return render_template('index/index.html', title='Home')

@main_routes.route('/sobre')
def sobre():
    return render_template('index/sobre.html', title='Sobre o Projeto')

@main_routes.route('/dadosPorHora')
def dadosPorHora():
    return render_template('index/dadosPorHora.html', title='Dados por Hora')

@main_routes.route('/dadosPorDia')
def dadosPorDia():
    return render_template('index/dadosPorDia.html', title='Dados por Dia')

@main_routes.route('/dadosPorHoraJson')
def dadosPorHoraJson():
    print(request.args.get('data'))

    # leituras = Leitura.query.order_by(Leitura.data.desc()).all()
    leituras = [
        {
            'hora': '10:00',
            'direcao_vento': 80,
            'umidade_ar': 40,
            'temperatura': 35,
            'luminosidade': 50
		},
        {
            'hora': '11:00',
            'direcao_vento': 85,
            'umidade_ar': 45,
            'temperatura': 40,
            'luminosidade': 55
		},
	]

    return json.jsonify(leituras)

@main_routes.route('/dadosPorDiaJson')
def dadosPorDiaJson():
    print(request.args.get('mes'))

    # leituras = Leitura.query.order_by(Leitura.data.desc()).all()
    leituras = [
        {
            'dia': '01/11',
            'direcao_vento': 80,
            'umidade_ar': 40,
            'temperatura': 35,
            'luminosidade': 50
		},
        {
            'dia': '02/11',
            'direcao_vento': 85,
            'umidade_ar': 45,
            'temperatura': 40,
            'luminosidade': 55
		},
	]

    return json.jsonify(leituras)

@main_routes.route('/perfil')
def perfil():
    return render_template('index/perfil.html', title='Perfil')
