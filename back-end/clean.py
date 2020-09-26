import json

credit_transactions = []
with open("Book2.csv", encoding="utf-8") as fp:
    for line in fp:
        arr = line.strip().strip("\ufeff").split(",")
        arr[-1] = float(arr[-1].split("$")[-1])
        credit_transactions.append(arr)

model = {}
for line in credit_transactions:
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


result = {"admin": {"records": credit_transactions, "model": model}}
with open("SuperSecureCreditCardTransactions.json", "w+") as fp:
    json.dump(result, fp, indent=2)
