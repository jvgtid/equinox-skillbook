import os


def write_file(file_name, json):
    path = os.path.dirname(__file__)

    file = open(f"{path}/../reports/{file_name}.json", "w")
    file.write(json)
    file.close()
