import itertools
import operator
import re

from github import Github

from src.github_connector.collaborators import Collaborator
from src.github_connector.repository import Repository


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

    dependencies = get_dependencies(repo)

    return Repository(name, desc, cols, langs, created_at, latest_release_date, readme_title, dependencies)


def get_languages(g, user, repos):
    languages = []

    for repo in repos:
        commits = g.get_repo(repo).get_commits(author=user)
        for commit in commits:
            statuses = commit.get_statuses()
            date = None
            for status in statuses:
                new_date = status.created_at
                date = new_date if not date or new_date > date else date
            date = date.strftime("%Y-%m-%d")
            files = commit.files
            for file in files:
                ext = file.filename.strip(".")[1] if len(file.filename.strip(".")) >= 1 else ""
                languages.append((ext, (date, repo)))

    reduced_dates = [(x[0] + (min(z[1] for z in y),) + (max(z[1] for z in y),) + x[2])
     for (x, y) in itertools.groupby(sorted(languages, key=operator.itemgetter(0, 2)), key=operator.itemgetter(0, 2))]

    print(reduced_dates)

    return languages


def get_collaborator_class(g, user_name):
    user = g.get_user(login=user_name)

    id = user.name
    mail = user.email
    picture = user.avatar_url
    projects = [repo.full_name for repo in user.get_repos()]
    coworkers = user.collaborators
    languages_used = get_languages(g, user_name, projects)

    return Collaborator(id, mail, picture, projects, coworkers, )


def load_repositories(g):

    #collaborators = get_user_collaborators(g)
    #collaborators_repos = [repo for col in collaborators for repo in get_repos_for_user(g, col)]
    #my_repos = get_repos(g)
#
    #[print(r) for r in set(collaborators_repos + my_repos)]

    #return [get_repo_class(g, r) for r in set(collaborators_repos + my_repos)]

    return [get_repo_class(g, "Telefonica/luca-comms")]


def load_collaborators(g):
    return [get_collaborator_class(g, "jvgtid")]
