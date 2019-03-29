import os
import json

if __name__ == '__main__':

    list_users = {}

    for root, dirs, files in os.walk("."):
        for filename in files:
            if ".json" in filename and filename != "users_all.json":
                with open(f"/Users/jvg/git/Telefonica/equinox-skillbook/reports/database/users/{filename}") as json_file:
                    user = json.load(json_file)
                    print(user)
                    list_users[user["id"]] = user

    with open(f"/Users/jvg/git/Telefonica/equinox-skillbook/reports/database/users/users_all.json", 'w') as outfile:
        json.dump(list_users, outfile)

