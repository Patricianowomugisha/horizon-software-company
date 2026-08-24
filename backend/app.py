from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail

from config import Config
from extensions import db, jwt, mail

from routes.auth_routes import auth_bp
from routes.content_routes import content_bp
from routes.contact_routes import contact_bp
from routes.quote_routes import quote_bp
from routes.service_routes import service_bp
from routes.portfolio_routes import portfolio_bp
from routes.client_routes import client_bp
from routes.dashboard_routes import dashboard_bp

import models


def create_app():
    app = Flask(__name__)

    # Load application configuration
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    # Allow the React frontend to communicate with Flask
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": "*"
            }
        }
    )

    # Register API routes
    app.register_blueprint(auth_bp)
    app.register_blueprint(content_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(quote_bp)
    app.register_blueprint(service_bp)
    app.register_blueprint(portfolio_bp)
    app.register_blueprint(client_bp)
    app.register_blueprint(dashboard_bp)

    @app.route("/")
    def home():
        return "Horizon Software Company Ltd Backend is Running!"

    @app.route("/api/health")
    def health_check():
        return jsonify({
            "status": "success",
            "message": "Horizon backend is healthy"
        })

    # Create database tables
    with app.app_context():
        db.create_all()

    return app


app = create_app()


if __name__ == "__main__":
    app.run(debug=True)