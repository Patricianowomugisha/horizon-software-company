from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from extensions import db
from models import PortfolioProject


portfolio_bp = Blueprint(
    "portfolio",
    __name__,
    url_prefix="/api/portfolio"
)


@portfolio_bp.route("", methods=["GET"])
def get_projects():
    projects = PortfolioProject.query.order_by(
        PortfolioProject.created_at.desc()
    ).all()

    result = []

    for project in projects:
        result.append({
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "image": project.image,
            "technologies": project.technologies,
            "project_url": project.project_url,
            "category": project.category,
            "created_at": project.created_at.isoformat()
            if project.created_at else None,
            "updated_at": project.updated_at.isoformat()
            if project.updated_at else None
        })

    return jsonify(result), 200


@portfolio_bp.route("/<int:project_id>", methods=["GET"])
def get_project(project_id):
    project = PortfolioProject.query.get_or_404(project_id)

    return jsonify({
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "image": project.image,
        "technologies": project.technologies,
        "project_url": project.project_url,
        "category": project.category,
        "created_at": project.created_at.isoformat()
        if project.created_at else None,
        "updated_at": project.updated_at.isoformat()
        if project.updated_at else None
    }), 200


@portfolio_bp.route("", methods=["POST"])
@jwt_required()
def create_project():
    data = request.get_json() or {}

    title = data.get("title")

    if not title:
        return jsonify({
            "message": "Project title is required"
        }), 400

    project = PortfolioProject(
        title=title,
        description=data.get("description"),
        image=data.get("image"),
        technologies=data.get("technologies"),
        project_url=data.get("project_url"),
        category=data.get("category")
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        "message": "Portfolio project created successfully",
        "id": project.id
    }), 201


@portfolio_bp.route("/<int:project_id>", methods=["PUT"])
@jwt_required()
def update_project(project_id):
    project = PortfolioProject.query.get_or_404(project_id)

    data = request.get_json() or {}

    if "title" in data:
        project.title = data["title"]

    if "description" in data:
        project.description = data["description"]

    if "image" in data:
        project.image = data["image"]

    if "technologies" in data:
        project.technologies = data["technologies"]

    if "project_url" in data:
        project.project_url = data["project_url"]

    if "category" in data:
        project.category = data["category"]

    db.session.commit()

    return jsonify({
        "message": "Portfolio project updated successfully"
    }), 200


@portfolio_bp.route("/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    project = PortfolioProject.query.get_or_404(project_id)

    db.session.delete(project)
    db.session.commit()

    return jsonify({
        "message": "Portfolio project deleted successfully"
    }), 200