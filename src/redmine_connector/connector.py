from redminelib import Redmine


def get_projects(r):
    return r.project.all()


def get_users(r):
    return r.user.all()


def load(r):
    [print(p) for p in get_projects(r)]
    [print(u) for u in get_users(r)]


if __name__ == '__main__':
    redmine = Redmine('https://cdo.telefonica.com/redmine/projects', username="javier.villargil@telefonica.com", password="./92maiLcrTIDmar")
    print(redmine.project.get('LUCA Fleet').created_on)
