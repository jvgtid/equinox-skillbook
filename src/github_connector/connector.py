import re
from collections import defaultdict
import json
import random

from src.github_connector.collaborators import Collaborator
from src.github_connector.language import Language
from src.github_connector.repository import Repository
from src.writer import write_file


def get_repos(g):
    return [rep.full_name for org in g.get_user().get_orgs() for rep in org.get_repos()]


def get_user_collaborators(g):
    colaborators = []

    for rep in g.get_user().get_repos():
        try:
            cols = [c.login for c in rep.get_collaborators()]
        except:
            cols = []
        colaborators += cols

    return set(colaborators)


def get_repos_for_user(g, user):
    try:
        repos = [rep.full_name for rep in g.get_user(user).get_repos()]
    except:
        repos = []

    return repos


def get_title_from_readme(text):
    try:
        m = re.search('#(.+?)\n', text)
        title = m.group(1).strip()
    except:
        title = ""

    return title


def get_dependencies(repo):
    dependencies_files = ["requirements.txt", "pom.xml", "build.sbt"]
    for file in dependencies_files:
        try:
            dependencies = repo.get_file_contents(file).decode("utf-8")
            print(dependencies)
        except:
            pass


def get_repo_class(g, repo_name):
    repo = g.get_repo(repo_name)
    name = repo.full_name
    desc = repo.description
    try:
        cols = [c.login for c in repo.get_collaborators()]
    except:
        cols = []
    langs = repo.get_languages()
    try:
        created_at = repo.created_at.strftime("%Y-%m-%d")
    except:
        created_at = ""
    try:
        latest_release_date = repo.get_latest_release().created_at.strftime("%Y-%m-%d")
    except:
        latest_release_date = None
    try:
        readme_title = get_title_from_readme(repo.get_readme().decoded_content.decode('utf-8'))
    except:
        readme_title = ""

    dependencies = ""

    return Repository(name, desc, cols, langs, created_at, latest_release_date, readme_title, dependencies)


#def get_languages(g, user, repo):
#    languages = []
#
#    pulls = g.get_repo(repo.id).get_pulls()
#    for pull in pulls:
#        if pull.user.login == user:
#            date = pull.created_at.strftime("%Y-%m-%d")
#            files = pull.get_files()
#            for file in files:
#                ext = file.filename.split(".")[1] if len(file.filename.split(".")) == 2 else ""
#                languages.append((ext, date))
#
#    exts = defaultdict(list)
#    for ext, date in languages:
#        exts[ext].append(date)
#
#    result = []
#    for ext, dates in exts.items():
#        sorted_dates = sorted(dates)
#        first = sorted_dates[0]
#        last = before_last = sorted_dates[-1]
#        n_dates = len(dates)
#        if n_dates >= 3:
#            before_last = sorted_dates[-2]
#        result.append(Language(ext, last, first, before_last, [repo.id]))
#
#    return result


def get_languages(g, user, repo):
    languages = []

    commits = g.get_repo(repo.id).get_commits(author=user)

    for commit in list(commits):
        date = commit.commit.author.date.strftime("%Y-%m-%d")
        for file in commit.files:
            ext = file.filename.split(".")[1] if len(file.filename.split(".")) == 2 else ""
            languages.append((ext, date))

    exts = defaultdict(list)
    for ext, date in languages:
        exts[ext].append(date)

    result = []
    for ext, dates in exts.items():
        sorted_dates = sorted(dates)
        first = sorted_dates[0]
        last = before_last = sorted_dates[-1]
        n_dates = len(dates)
        if n_dates >= 3:
            before_last = sorted_dates[-2]
        result.append(Language(ext, last, first, before_last, [repo.id]))

    return result


def load_collaborators_for_repo(g, repo):
    try:
        cols = g.get_repo(repo.id).get_collaborators()

        all_cols = []

        for col in cols:
            user = g.get_user(login=col.login)

            id = user.name
            mail = user.email
            picture = user.avatar_url
            projects = [repo.name]
            coworkers = [col.login for col in cols]
            languages_used = get_languages(g, user.login, repo)
            login = col.login

            all_cols.append(Collaborator(id, mail, picture, projects, coworkers, languages_used, login))
    except:
        all_cols = []

    return all_cols


def load_repositories(g):
    collaborators = get_user_collaborators(g)
    collaborators_repos = [repo for col in collaborators for repo in get_repos_for_user(g, col)]
    my_repos = get_repos(g)

    return [get_repo_class(g, r) for r in set(collaborators_repos + my_repos)]


def load(g):
    repos = load_repositories(g)
    cols = [col for repo in repos for col in load_collaborators_for_repo(g, repo)]

    [write_file(f"projects/{repo.id.replace('/', '')}.json", json.dumps(repo.__dict__)) for repo in repos]

    for coll in cols:
        n = random.random() * 100
        write_file(f"users/{coll.login}_{n}.json", json.dumps(coll.to_object()))

    #collaborators = {}
    #for collaborator in cols:
    #    if collaborator.id in collaborators:
    #        collaborators[collaborator.id] = collaborator + collaborators[collaborator.id]
    #    else:
    #        collaborators[collaborator.id] = collaborator
