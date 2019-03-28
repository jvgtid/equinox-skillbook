

def get_projects(r):
    return r.project.all()


def get_users(r):
    return r.user.all()


def load(r):
    print(get_projects(r))
    print(get_users(r))
