from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import Service


service_bp = Blueprint(
    "services",
    __name__,
    url_prefix="/api/services"
)


# =========================================================
# GET ALL SERVICES
# PUBLIC ROUTE
# =========================================================

@service_bp.route("", methods=["GET"])
def get_services():
    services = Service.query.order_by(
        Service.id.asc()
    ).all()

    result = []

    for service in services:
        result.append({
            "id": service.id,
            "name": service.name,
            "description": service.description,
            "image": service.image,
            "is_active": service.is_active,
            "created_at": service.created_at.isoformat()
            if service.created_at else None,
            "updated_at": service.updated_at.isoformat()
            if service.updated_at else None
        })

    return jsonify(result), 200


# =========================================================
# GET ONE SERVICE
# PUBLIC ROUTE
# =========================================================

@service_bp.route("/<int:service_id>", methods=["GET"])
def get_service(service_id):
    service = Service.query.get_or_404(service_id)

    return jsonify({
        "id": service.id,
        "name": service.name,
        "description": service.description,
        "image": service.image,
        "is_active": service.is_active,
        "created_at": service.created_at.isoformat()
        if service.created_at else None,
        "updated_at": service.updated_at.isoformat()
        if service.updated_at else None
    }), 200


# =========================================================
# CREATE SERVICE
# ADMIN ONLY
# =========================================================

@service_bp.route("", methods=["POST"])
@jwt_required()
def create_service():
    data = request.get_json() or {}

    name = data.get("name")

    if not name:
        return jsonify({
            "message": "Service name is required"
        }), 400

    service = Service(
        name=name,
        description=data.get("description"),
        image=data.get("image"),
        is_active=data.get("is_active", True)
    )

    db.session.add(service)
    db.session.commit()

    return jsonify({
        "message": "Service created successfully",
        "id": service.id
    }), 201


# =========================================================
# UPDATE SERVICE
# ADMIN ONLY
# =========================================================

@service_bp.route("/<int:service_id>", methods=["PUT"])
@jwt_required()
def update_service(service_id):
    service = Service.query.get_or_404(service_id)

    data = request.get_json() or {}

    if "name" in data:
        service.name = data["name"]

    if "description" in data:
        service.description = data["description"]

    if "image" in data:
        service.image = data["image"]

    if "is_active" in data:
        service.is_active = data["is_active"]

    db.session.commit()

    return jsonify({
        "message": "Service updated successfully"
    }), 200


# =========================================================
# DELETE SERVICE
# ADMIN ONLY
# =========================================================

@service_bp.route("/<int:service_id>", methods=["DELETE"])
@jwt_required()
def delete_service(service_id):
    service = Service.query.get_or_404(service_id)

    db.session.delete(service)
    db.session.commit()

    return jsonify({
        "message": "Service deleted successfully"
    }), 200