from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import QuoteRequest
from email_service import send_quote_notification


quote_bp = Blueprint(
    "quote",
    __name__,
    url_prefix="/api/quotes"
)


@quote_bp.route("", methods=["POST"])
def create_quote_request():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")

    if not name or not email:
        return jsonify({
            "message": "Name and email are required"
        }), 400

    new_quote = QuoteRequest(
        name=name,
        email=email,
        phone=data.get("phone"),
        service=data.get("service"),
        project_description=data.get("project_description"),
        budget=data.get("budget")
    )

    db.session.add(new_quote)
    db.session.commit()

    send_quote_notification(new_quote)

    return jsonify({
        "message": "Your quote request has been received successfully",
        "id": new_quote.id
    }), 201


@quote_bp.route("", methods=["GET"])
@jwt_required()
def get_quote_requests():
    quotes = QuoteRequest.query.order_by(
        QuoteRequest.created_at.desc()
    ).all()

    result = []

    for quote in quotes:
        result.append({
            "id": quote.id,
            "name": quote.name,
            "email": quote.email,
            "phone": quote.phone,
            "service": quote.service,
            "project_description": quote.project_description,
            "budget": quote.budget,
            "status": quote.status,
            "created_at": quote.created_at.isoformat()
            if quote.created_at else None
        })

    return jsonify(result), 200


@quote_bp.route("/<int:quote_id>", methods=["GET"])
@jwt_required()
def get_quote_request(quote_id):
    quote = QuoteRequest.query.get_or_404(quote_id)

    return jsonify({
        "id": quote.id,
        "name": quote.name,
        "email": quote.email,
        "phone": quote.phone,
        "service": quote.service,
        "project_description": quote.project_description,
        "budget": quote.budget,
        "status": quote.status,
        "created_at": quote.created_at.isoformat()
        if quote.created_at else None
    }), 200


@quote_bp.route("/<int:quote_id>", methods=["PUT"])
@jwt_required()
def update_quote_request(quote_id):
    quote = QuoteRequest.query.get_or_404(quote_id)

    data = request.get_json() or {}

    if "name" in data:
        quote.name = data["name"]

    if "email" in data:
        quote.email = data["email"]

    if "phone" in data:
        quote.phone = data["phone"]

    if "service" in data:
        quote.service = data["service"]

    if "project_description" in data:
        quote.project_description = data["project_description"]

    if "budget" in data:
        quote.budget = data["budget"]

    if "status" in data:
        quote.status = data["status"]

    db.session.commit()

    return jsonify({
        "message": "Quote request updated successfully"
    }), 200


@quote_bp.route("/<int:quote_id>", methods=["DELETE"])
@jwt_required()
def delete_quote_request(quote_id):
    quote = QuoteRequest.query.get_or_404(quote_id)

    db.session.delete(quote)
    db.session.commit()

    return jsonify({
        "message": "Quote request deleted successfully"
    }), 200