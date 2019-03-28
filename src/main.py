import json
import sys

from github import Github

from src.github_connector.connector import load
from src.writer import write_file

if __name__ == '__main__':
    github_login = sys.argv[1]
    github_token = sys.argv[2]

    g = Github(github_login, github_token)

    repos, collaborators = load(g)

    [write_file() for repo in repos]

    [write_file(f"projects/{repo.id.replace('/', '')}.json", json.dumps(repo.__dict__)) for repo in repos]
    [write_file(f"users/{coll.login}.json", json.dumps(coll.to_object())) for coll in collaborators]
