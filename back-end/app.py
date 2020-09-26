from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import datetime
import requests
import random

app = Flask(__name__)
CORS(app)


@app.route("/getNonce", methods=["GET"])
def getNonce():
    return jsonify("SuperSecureSalt")


@app.route("/login", methods=["GET"])
def login():
    username = request.args.get("username", None)
    password = request.args.get("password", None)
    db = json.load(open("SuperSecureDatabase.json", "r"))

    if username != None:
        if db.get(username, None) == password:
            return jsonify("Success", 200)
        return jsonify("Incorrect password", 201)

    return jsonify("Server error", 500)


@app.route("/register", methods=["GET"])
def register():
    username = request.args.get("username", None)
    password = request.args.get("password", None)
    location = request.args.get("location", "1.348429,103.772371")

    db = json.load(open("SuperSecureDatabase.json", "r"))
    userData = json.load(open("SuperSecureUserData.json"))

    if username != None and password != None and db.get(username, None) == None:
        db[username] = password
        with open("SuperSecureDatabase.json", "w+") as fp:
            json.dump(db, fp, indent=2)

        userData[username] = {
            "accounts": [
                {"id": random.randint(0, 99999999), "name": "SuperSaver", "amount": 50}
            ],
            "stocks": {"AAPL": 0, "TSLA": 0, "AMZN": 0},
            "averageTransfer": 0,
            "numOfTransfers": 0,
            "previousLocations": [
                {"compound_code": getCountry(location)[1], "latlng": location}
            ],
            "contacts": [],
        }

        with open("SuperSecureUserData.json", "w+") as fp:
            json.dump(userData, fp, indent=2)

        return jsonify("Success", 200)

    return jsonify("Failure", 500)


@app.route("/refresh", methods=["POST"])
def refresh():

    data = {"admin": "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"}

    json.dump(data, open("./SuperSecureDatabase.json", "w+"), indent=2)

    return jsonify("Success", 200)


@app.route("/getUserData", methods=["GET"])
def getUserData():
    username = request.args.get("username", None)

    data = json.load(open("SuperSecureUserData.json"))

    return json.dumps(data.get(username, "Error"))


@app.route("/transfer", methods=["GET"])
def transfer():
    username = request.args.get("username", None)
    password = request.args.get("password", None)
    accountID = request.args.get("accountid", None)
    payee = request.args.get("payee", None)
    amount = request.args.get("amount", None)
    latlng = request.args.get("latlng", None)
    print(latlng)
    if latlng == None or latlng.strip() == ",":
        return "invalid location"

    db = json.load(open("SuperSecureDatabase.json", "r"))
    userData = json.load(open("SuperSecureUserData.json"))

    if db.get(username, None) == password:
        for account in userData[username]["accounts"]:
            if account["id"] == accountID:
                lat = float(latlng.split(",")[0].strip())
                lng = float(latlng.split(",")[1].strip())

                previousLocations = userData[username]["previousLocations"][0]["latlng"]
                prevLat = float(previousLocations.split(",")[0].strip())
                prevLng = float(previousLocations.split(",")[1].strip())

                if (
                    lat + 2 > prevLat + 2
                    or lat - 2 < prevLat - 2
                    or lng + 2 > prevLng + 2
                    or lng - 2 < prevLng - 2
                ):
                    return "invalid location"

                if account["amount"] < int(amount):
                    return "insufficient cash"
                account["amount"] -= int(amount)

                newAverage = (
                    userData[username]["averageTransfer"]
                    * userData[username]["numOfTransfers"]
                    + int(amount)
                ) / (userData[username]["numOfTransfers"] + 1)

                userData[username]["averageTransfer"] = newAverage
                userData[username]["numOfTransfers"] += 1

                with open("SuperSecureUserData.json", "w+") as fp:
                    json.dump(userData, fp, indent=2)

                return "Success"
    else:
        return "error"


@app.route("/easytransfer", methods=["GET"])
def easttransfer():
    username = request.args.get("username", None)
    accountID = request.args.get("accountid", None)
    payee = request.args.get("payee", None)
    amount = request.args.get("amount", None)
    latlng = request.args.get("latlng", None)

    if latlng == None or latlng.strip() == ",":
        return "invalid location"

    db = json.load(open("SuperSecureDatabase.json", "r"))
    userData = json.load(open("SuperSecureUserData.json"))

    for account in userData[username]["accounts"]:
        if account["id"] == accountID:
            lat = float(latlng.split(",")[0].strip())
            lng = float(latlng.split(",")[1].strip())

            previousLocations = userData[username]["previousLocations"][0]["latlng"]
            prevLat = float(previousLocations.split(",")[0].strip())
            prevLng = float(previousLocations.split(",")[1].strip())
            print(lat + 2)
            print(prevLat)
            if (
                lat + 2 > prevLat + 2
                or lat - 2 < prevLat - 2
                or lng + 2 > prevLng + 2
                or lng - 2 < prevLng - 2
            ):
                return "invalid location"

            if account["amount"] < int(amount):
                return "insufficient cash"
            account["amount"] -= int(amount)

            newAverage = (
                userData[username]["averageTransfer"]
                * userData[username]["numOfTransfers"]
                + int(amount)
            ) / (userData[username]["numOfTransfers"] + 1)

            userData[username]["averageTransfer"] = newAverage
            userData[username]["numOfTransfers"] += 1

            with open("SuperSecureUserData.json", "w+") as fp:
                json.dump(userData, fp, indent=2)

            return "Success"


@app.route("/createModel", methods=["GET"])
def createModel():
    name = request.args.get("username", None)
    if name == None:
        return -1
    data = json.load(open("SuperSecureCreditCardTransactions.json"))
    records = data[name].get("records", [])
    if records == []:
        return -1

    model = {}
    totalRecords = 0
    totalAmount = 0
    for line in records:
        if "*" in line[1]:
            name = line[1].split("*")[0]
        elif " " in line[1]:
            name = line[1].split(" ")[0]
        else:
            name = line[1]

        if model.get(name, None) == None:
            model[name] = {"totalAmount": 0, "totalTransactions": 0}

        model[name]["totalAmount"] += line[2]
        model[name]["totalTransactions"] += 1

        totalRecords += 1
        totalAmount += line[2]

    model["total"] = {"totalAmount": totalAmount, "totalTransactions": totalRecords}

    result = {"admin": {"records": records, "model": model}}
    with open("SuperSecureCreditCardTransactions.json", "w+") as fp:
        json.dump(result, fp, indent=2)

    return ("Success")

@app.route("/findSussRecords", methods=["GET"])
def findSuspiciousRecords():
    name = request.args.get("username", None)

    if name == None:
        return jsonify([])

    data = json.load(open("SuperSecureCreditCardTransactions.json"))
    if data.get(name, None) == None:
        return jsonify([])
    records = data[name].get("records", [])
    model = data[name].get("model", [])

    if records == [] or model == []:
        return jsonify([])

    global_average = (
        model.get("total", {"totalAmount": 0})["totalAmount"]
        / model.get("total", {"totalTransactions": 1})["totalTransactions"]
    )

    suspicious = []
    for record in records:
        if "*" in record[1]:
            name = record[1].split("*")[0]
        elif " " in record[1]:
            name = record[1].split(" ")[0]
        else:
            name = record[1]

        local_average = (
            model.get(name, {"totalAmount": 0})["totalAmount"]
            / model.get(name, {"totalTransactions": 1})["totalTransactions"]
        )

        if record[2] > local_average * 1.5 or record[2] > global_average * 10:
            suspicious.append(record)

    return jsonify(suspicious)

@app.route("/getCreditCardRecords", methods=["GET"])
def getCreditCardRecords():
    username = request.args.get("username", None)
    if username == None:
        return "invlaid username"
    
    data = json.load(open("SuperSecureCreditCardTransactions.json"))
    if data.get(username, None) == None:
        return jsonify([])
    records = data[username].get("records", [])

    return jsonify(records)


def getCountry(latlng=""):
    url = "https://maps.googleapis.com/maps/api/geocode/json"
    API_KEY = "AIzaSyARTVRWSi8RAlWPH5KvpfbEWo6oHY2ixIc"
    PARAMS = {"latlng": latlng, "key": API_KEY}

    r = requests.get(url=url, params=PARAMS)

    data = r.json()

    compound_code = data["plus_code"]["compound_code"]
    country = compound_code.split(" ")[-1]

    return [country, compound_code]


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
