"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import os


api = Blueprint('api', __name__)

@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

@api.route('/signup', methods=['POST'])
def create_user():
    request_body = request.get_json()
    unsaltPass = request_body['password'].encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(unsaltPass, salt)
    print(unsaltPass)
    print(hashed.decode("utf-8", "ignore"))
    new_user = User(
        email = request_body['email'],
        password = hashed.decode("utf-8", "ignore"),
        is_active = True
    )

    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=request_body['email'])
    

    return jsonify(access_token=access_token) 

@api.route('/signup', methods=["GET"])
def get_user():
    all_users = User.query.all()
    all_users_list = list(map(lambda x: x.serialize(), all_users))
    return jsonify(all_users_list), 200

@api.route('/private', methods=["POST", "GET"])
@jwt_required()
def hello():
    response_body = "Hello, you are connected to a restricted route"
    return jsonify(response_body), 200