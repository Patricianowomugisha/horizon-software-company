from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import WebsiteContent


content_bp = Blueprint(
    "content",
    __name__,
    url_prefix="/api/content"
)


# =====================================================
# GET ALL WEBSITE CONTENT
# =====================================================

@content_bp.route("", methods=["GET"])
def get_all_content():

    content = WebsiteContent.query.order_by(
        WebsiteContent.id.asc()
    ).all()

    result = []

    for item in content:
        result.append({
            "id": item.id,
            "section": item.section,
            "title": item.title,
            "content": item.content,
            "image": item.image,
            "created_at": (
                item.created_at.isoformat()
                if item.created_at
                else None
            ),
            "updated_at": (
                item.updated_at.isoformat()
                if item.updated_at
                else None
            )
        })

    return jsonify(result), 200


# =====================================================
# GET SINGLE CONTENT
# =====================================================

@content_bp.route(
    "/<int:content_id>",
    methods=["GET"]
)
def get_content(content_id):

    item = WebsiteContent.query.get_or_404(
        content_id
    )

    return jsonify({
        "id": item.id,
        "section": item.section,
        "title": item.title,
        "content": item.content,
        "image": item.image,
        "created_at": (
            item.created_at.isoformat()
            if item.created_at
            else None
        ),
        "updated_at": (
            item.updated_at.isoformat()
            if item.updated_at
            else None
        )
    }), 200


# =====================================================
# CREATE CONTENT
# =====================================================

@content_bp.route("", methods=["POST"])
@jwt_required()
def create_content():

    data = request.get_json() or {}

    section = data.get("section")

    if not section:
        return jsonify({
            "message": "Section is required."
        }), 400

    new_content = WebsiteContent(
        section=section,
        title=data.get("title"),
        content=data.get("content"),
        image=data.get("image")
    )

    db.session.add(new_content)
    db.session.commit()

    return jsonify({
        "message":
            "Website content created successfully.",
        "id": new_content.id
    }), 201


# =====================================================
# UPDATE SINGLE CONTENT
# =====================================================

@content_bp.route(
    "/<int:content_id>",
    methods=["PUT"]
)
@jwt_required()
def update_content(content_id):

    item = WebsiteContent.query.get_or_404(
        content_id
    )

    data = request.get_json() or {}

    if "section" in data:
        item.section = data["section"]

    if "title" in data:
        item.title = data["title"]

    if "content" in data:
        item.content = data["content"]

    if "image" in data:
        item.image = data["image"]

    db.session.commit()

    return jsonify({
        "message":
            "Website content updated successfully.",
        "id": item.id
    }), 200


# =====================================================
# DELETE CONTENT
# =====================================================

@content_bp.route(
    "/<int:content_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_content(content_id):

    item = WebsiteContent.query.get_or_404(
        content_id
    )

    db.session.delete(item)
    db.session.commit()

    return jsonify({
        "message":
            "Website content deleted successfully."
    }), 200


# =====================================================
# SAVE FULL WEBSITE CONTENT
#
# This endpoint is used by the original
# AdminContent.jsx.
# =====================================================

@content_bp.route(
    "/full",
    methods=["PUT"]
)
@jwt_required()
def save_full_content():

    data = request.get_json() or {}

    fields = [
        "hero_title",
        "hero_subtitle",
        "hero_description",
        "about_title",
        "about_description",
        "mission",
        "vision",
        "footer_text",
        "contact_email",
        "contact_phone",
        "address",
        "about_image"
    ]

    for field in fields:

        if field not in data:
            continue

        value = data.get(field)

        item = WebsiteContent.query.filter_by(
            section=field
        ).first()

        if item:

            item.title = field
            item.content = value

        else:

            new_content = WebsiteContent(
                section=field,
                title=field,
                content=value
            )

            db.session.add(new_content)

    db.session.commit()

    return jsonify({
        "message":
            "Website content saved successfully."
    }), 200