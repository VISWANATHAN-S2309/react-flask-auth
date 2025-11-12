import os
import re
from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta
from flask_jwt_extended import (
    JWTManager, create_access_token, unset_jwt_cookies,
    set_access_cookies, get_jwt_identity, jwt_required
)
from flask_pymongo import PyMongo
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from flask_cors import CORS
from bson import ObjectId

load_dotenv()

app = Flask(__name__)
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/mydb")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "supersecretkey")
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_ACCESS_COOKIE_PATH"] = "/"
app.config["JWT_COOKIE_SAMESITE"] = "Lax"
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
CORS(app, origins=["http://localhost:5173"], supports_credentials=True, methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type", "Authorization"] )
mongo = PyMongo(app)
jwt = JWTManager(app)
limiter = Limiter(key_func=get_remote_address, app=app, default_limits=["200 per day", "50 per hour"])

EMAIL_RE = re.compile(r"^[\w\.-]+@[\w\.-]+\.\w+$")

def validated(data):
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    phno = data.get("phno", "").strip()
    password = data.get("password", "").strip()

    if not (3 <= len(name) <= 50):
        return False, "Name length must be between 3–50 characters"
    if not EMAIL_RE.match(email):
        return False, "Invalid email format"
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    return True, ""


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json or {}
    ok, msg = validated(data)
    if not ok:
        return jsonify({"msg": msg}), 400

    users = mongo.db.users
    email = data["email"].lower().strip()
    name = data["name"].strip()
    phno = data["phno"].strip()

    if users.find_one({"email": email}):
        return jsonify({"msg": "Email already exists"}), 400
    if users.find_one({"name": name}):
        return jsonify({"msg": "Username already exists"}), 400

    hashed = generate_password_hash(data["password"])
    user_doc = {
        "name": name,
        "email": email,
        "phno": phno,
        "password": hashed,
        "created_at": __import__("datetime").datetime.utcnow()
    }
    users.insert_one(user_doc)
    return jsonify({"msg": "Account created successfully"}), 201


@app.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    data = request.json or {}
    email = (data.get("email") or "").lower().strip()
    password = (data.get("password") or "").strip()

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    users = mongo.db.users
    user = users.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user["_id"]))
    resp = jsonify({"msg": "Login successful", "name": user["name"]})
    set_access_cookies(resp, access_token)
    return resp, 200


@app.route("/logout", methods=["POST"])
def logout():
    resp = jsonify({"msg": "Logged out"})
    unset_jwt_cookies(resp)
    return resp, 200


@app.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    users = mongo.db.users
    user = users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
    if not user:
        return jsonify({"msg": "User not found"}), 404
    user["_id"] = str(user["_id"])
    return jsonify({"user": user})


if __name__ == '__main__':
    app.run(debug=True)
