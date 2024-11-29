from routes.main_routes import main_routes
from routes.post_routes import post_routes


def register_blueprints(app):
    app.register_blueprint(main_routes)
    app.register_blueprint(post_routes)
