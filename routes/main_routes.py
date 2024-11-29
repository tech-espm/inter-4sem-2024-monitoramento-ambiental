from flask import Blueprint, render_template
from models.leitura import Leitura

main_routes = Blueprint('main_routes', __name__)


@main_routes.route('/')
def home():
    return render_template('home/home.html', title='Home')

@main_routes.route('/sobre')
def sobre():
    return render_template('index/sobre.html', title='Sobre o Projeto')


@main_routes.route('/dados')
def index():
    # leituras = Leitura.query.order_by(Leitura.data.desc()).all()
    return render_template('arduino/arduino.html', title='Dados')


@main_routes.route('/perfil')
def perfil():
    return render_template('perfil/perfil.html', title='Perfil')
