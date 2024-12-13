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
    data = request.args.get('data')
    data_inicial = data + ' 00:00:00'
    data_final = data + ' 23:59:59'

    leituras = Leitura.listarPorHora(data_inicial, data_final)

    return json.jsonify(leituras)


@main_routes.route('/dadosPorDiaJson')
def dadosPorDiaJson():
    leituras = Leitura.listarPorDia(int(request.args.get('ano')), int(request.args.get('mes')))

    return json.jsonify(leituras)


@main_routes.route('/perfil')
def perfil():
    return render_template('index/perfil.html', title='Perfil')
