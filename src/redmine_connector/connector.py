from redminelib import Redmine


def get_projects(r):
    return r.project.all()


def get_users(r):
    return r.user.all()


def load(r):
    [print(p) for p in get_projects(r)]
    [print(u) for u in get_users(r)]


if __name__ == '__main__':
    redmine = Redmine('https://cdo.telefonica.com/redmine/projects', key="39517b01a9af39247fad8d1d46f04df20c1538b1")
    print(redmine.project.get(1))
