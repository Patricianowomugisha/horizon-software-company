from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import Client


client_bp = Blueprint(
    "clients",
    __name__,
    url_prefix="/api/clients"
)


@client_bp.route("", methods=["GET"])
@jwt_required()
def get_clients():
    clients = Client.query.order_by(
        Client.created_at.desc()
    ).all()

    result = []

    for client in clients:
        result.append({
            "id": client.id,
            "name": client.name,
            "email": client.email,
            "phone": client.phone,
            "company": client.company,
            "notes": client.notes,
            "created_at": client.created_at.isoformat()
            if client.created_at else None,
            "updated_at": client.updated_at.isoformat()
            if client.updated_at else None
        })

    return jsonify(result), 200


@client_bp.route("/<int:client_id>", methods=["GET"])
@jwt_required()
def get_client(client_id):
    client = Client.query.get_or_404(client_id)

    return jsonify({
        "id": client.id,
        "name": client.name,
        "email": client.email,
        "phone": client.phone,
        "company": client.company,
        "notes": client.notes,
        "created_at": client.created_at.isoformat()
        if client.created_at else None,
        "updated_at": client.updated_at.isoformat()
        if client.updated_at else None
    }), 200


@client_bp.route("", methods=["POST"])
@jwt_required()
def create_client():
    data = request.get_json() or {}

    name = data.get("name")

    if not name:
        return jsonify({
            "message": "Client name is required"
        }), 400

    client = Client(
        name=name,
        email=data.get("email"),
        phone=data.get("phone"),
        company=data.get("company"),
        notes=data.get("notes")
    )

    db.session.add(client)
    db.session.commit()

    return jsonify({
        "message": "Client created successfully",
        "id": client.id
    }), 201


@client_bp.route("/<int:client_id>", methods=["PUT"])
@jwt_required()
def update_client(client_id):
    client = Client.query.get_or_404(client_id)

    data = request.get_json() or {}

    if "name" in data:
        client.name = data["name"]

    if "email" in data:
        client.email = data["email"]

    if "phone" in data:
        client.phone = data["phone"]

    if "company" in data:
        client.company = data["company"]

    if "notes" in data:
        client.notes = data["notes"]

    db.session.commit()

    return jsonify({
        "message": "Client updated successfully"
    }), 200


@client_bp.route("/<int:client_id>", methods=["DELETE"])
@jwt_required()
def delete_client(client_id):
    client = Client.query.get_or_404(client_id)

    db.session.delete(client)
    db.session.commit()

    return jsonify({
        "message": "Client deleted successfully"
    }), 200