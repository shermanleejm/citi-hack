from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)


@app.route("/getNonce", methods=["GET"])
def getNonce():
    return jsonify("SuperSecureHash")


@app.route("/login", methods=["POST"])
def login():
    username = request.args.get("username", None)
    password = request.args.get("password", None)

    if username != None and username == "admin":
        if (
            password
            == "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"
        ):
            return jsonify({"body": "success"}, 200)
        else:
            return jsonify({"body": "incorrect password"}, 201)
    return ({"body": "server error"}, 500)


@app.route("/register", methods=["POST"])
def register():
    username = request.args.get("username", None)
    password = request.args.get("password", None)

    db = json.load(open("SuperSecureDatabase.json", "r"))

    if username != None and password != None and db.get(username, None) != None:
        db[username] = password
        with open("SuperSecureDatabase.json", "w+") as fp:
            json.dump(db, fp, indent=2)

        return jsonify("Success", 200)

    return "Failure", 500


@app.route("/refresh", methods=["POST"])
def refresh():

    data = {"admin": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}

    json.dump(data, open("./SuperSecureDatabase.json", "w+"), indent=2)

    return ("Success", 200)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
