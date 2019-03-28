import json
import sys

from github import Github

from src.github_connector.connector import load_collaborators, load_repositories
from src.writer import write_file

if __name__ == '__main__':
    github_login = sys.argv[1]
    github_token = sys.argv[2]

    g = Github(github_login, github_token)

    #repos = load_repositories(g)
    collaborators = load_collaborators(g)

    [print(c.to_string()) for c in collaborators]

    #write_file("repos", json.dumps([repo.__dict__ for repo in repos]))
    write_file("cols", json.dumps([col.__dict__ for col in collaborators]))
