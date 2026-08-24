from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from models import (
    ContactMessage,
    QuoteRequest,
    Service,
    PortfolioProject,
    Client
)


dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


@dashboard_bp.route("/summary", methods=["GET"])
@jwt_required()
def dashboard_summary():
    total_messages = ContactMessage.query.count()

    unread_messages = ContactMessage.query.filter_by(
        is_read=False
    ).count()

    total_quotes = QuoteRequest.query.count()

    pending_quotes = QuoteRequest.query.filter_by(
        status="Pending"
    ).count()

    total_services = Service.query.count()

    active_services = Service.query.filter_by(
        is_active=True
    ).count()

    total_projects = PortfolioProject.query.count()

    total_clients = Client.query.count()

    return jsonify({
        "messages": {
            "total": total_messages,
            "unread": unread_messages
        },
        "quotes": {
            "total": total_quotes,
            "pending": pending_quotes
        },
        "services": {
            "total": total_services,
            "active": active_services
        },
        "portfolio": {
            "total": total_projects
        },
        "clients": {
            "total": total_clients
        }
    }), 200