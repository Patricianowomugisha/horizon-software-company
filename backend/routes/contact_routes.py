from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import ContactMessage
from email_service import send_contact_notification


contact_bp = Blueprint(
    "contact",
    __name__,
    url_prefix="/api/contact"
)


@contact_bp.route("", methods=["POST"])
def create_contact_message():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    message_text = data.get("message")

    if not name or not email or not message_text:
        return jsonify({
            "message": "Name, email and message are required"
        }), 400

    new_message = ContactMessage(
        name=name,
        email=email,
        phone=data.get("phone"),
        subject=data.get("subject"),
        message=message_text
    )

    db.session.add(new_message)
    db.session.commit()

    send_contact_notification(new_message)

    return jsonify({
        "message": "Your message has been received successfully",
        "id": new_message.id
    }), 201


@contact_bp.route("", methods=["GET"])
@jwt_required()
def get_contact_messages():
    messages = ContactMessage.query.order_by(
        ContactMessage.created_at.desc()
    ).all()

    result = []

    for item in messages:
        result.append({
            "id": item.id,
            "name": item.name,
            "email": item.email,
            "phone": item.phone,
            "subject": item.subject,
            "message": item.message,
            "is_read": item.is_read,
            "created_at": item.created_at.isoformat()
            if item.created_at else None
        })

    return jsonify(result), 200


@contact_bp.route("/<int:message_id>", methods=["GET"])
@jwt_required()
def get_contact_message(message_id):
    item = ContactMessage.query.get_or_404(message_id)

    return jsonify({
        "id": item.id,
        "name": item.name,
        "email": item.email,
        "phone": item.phone,
        "subject": item.subject,
        "message": item.message,
        "is_read": item.is_read,
        "created_at": item.created_at.isoformat()
        if item.created_at else None
    }), 200


@contact_bp.route("/<int:message_id>/read", methods=["PUT"])
@jwt_required()
def mark_message_as_read(message_id):
    item = ContactMessage.query.get_or_404(message_id)

    item.is_read = True
    db.session.commit()

    return jsonify({
        "message": "Message marked as read"
    }), 200


@contact_bp.route("/<int:message_id>", methods=["DELETE"])
@jwt_required()
def delete_contact_message(message_id):
    item = ContactMessage.query.get_or_404(message_id)

    db.session.delete(item)
    db.session.commit()

    return jsonify({
        "message": "Contact message deleted successfully"
    }), 200