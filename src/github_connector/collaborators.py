class Collaborator:

    def to_string(self):
        return f"{self.id} - {self.mail} - {self.picture} - {self.projects} - {self.coworkers} - {self.languages_used}"

    def __init__(self, id, mail, picture, projects, coworkers, languages_used):
        self.id = id
        self.mail = mail
        self.picture = picture
        self.projects = projects
        self.coworkers = coworkers
        self.languages_used = languages_used
