class Collaborator:

    def to_object(self):
        return {
            "id": self.id,
            "mail": self.mail,
            "picture": self.picture,
            "projects": self.projects,
            "coworkers": self.coworkers,
            "languages_used": [lang.to_object() for lang in self.languages_used],
            "login": self.login
        }

    def to_string(self):
        return f"{self.id} - {self.mail} - {self.picture} - {self.projects} - {self.coworkers} - {self.languages_used}"

    def __init__(self, id, mail, picture, projects, coworkers, languages_used, login):
        self.id = id
        self.mail = mail
        self.picture = picture
        self.projects = projects
        self.coworkers = coworkers
        self.languages_used = languages_used
        self.login = login

    def __sum__(self, other_collaborator):
        language_idxs = map(lambda x: x.key, self.languages_used)
        languages = []

        for language in other_collaborator.languages_used:
            idx = language_idxs.index(language.key)
            new_language = language

            if idx >= 0:
                new_language += self.languages_used[idx]

            languages.append(new_language)

        return Collaborator(
            self.id,
            self.mail,
            self.picture,
            self.projects + other_collaborator.projects,
            self.coworkers + other_collaborator.coworkers,
            languages,
            self.login
        )
