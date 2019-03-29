import json
import sys

from github import Github
from redminelib import Redmine

from src.github_connector.connector import load
from src.writer import write_file

if __name__ == '__main__':
    github_login = sys.argv[1]
    github_token = sys.argv[2]


    ###### GITHUB
    load(Github(github_login, github_token))


