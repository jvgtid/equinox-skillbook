
class Repository:
    def to_string(self):
        return f"{self.id} \n " \
            f"{self.name}" \
            f"{self.description} \n " \
            f"{self.date_creation} \n " \
            f"{self.date_last_release} \n " \
            f"{self.contributors} \n " \
            f"{self.libraries_used} \n " \
            f"{self.tags_languages}"

    def __init__(self, name, description, collaborators, langs, created_at, latest_release_date, readme_title, dependencies):
        self.id = name
        self.name = readme_title
        self.description = description
        self.date_creation = created_at
        self.date_last_release = latest_release_date
        self.contributors = collaborators
        self.libraries_used = dependencies
        self.tags_languages = langs
