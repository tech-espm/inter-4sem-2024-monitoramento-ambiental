from flask import Blueprint, render_template
from models.leitura import Leitura

main_routes = Blueprint('main_routes', __name__)


@main_routes.route('/')
def index():
    leituras = Leitura.query.order_by(Leitura.data.desc()).all()
    return render_template('index/index.html', title='Página Inicial', leituras=leituras)


@main_routes.route('/sobre')
def sobre():
    return render_template('index/sobre.html', title='Sobre o Projeto')
