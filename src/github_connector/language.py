
class Language:

    def to_object(self):
        return {
            "key": self.key,
            "last_commit_date": self.last_commit_date,
            "first_commit_date": self.first_commit_date,
            "last_period": self.last_period,
            "projects_used": self.projects_used
        }

    def __init__(self, key, last_commit_date, first_commit_date, last_period, projects_used):
        self.key = key
        self.last_commit_date = last_commit_date
        self.first_commit_date = first_commit_date
        self.last_period = last_period
        self.projects_used = projects_used

    def __add__(self, other_language):
        return Language(
            self.key,
            max(self.last_commit_date, other_language.last_commit_date),
            min(self.first_commit_date, other_language.first_commit_date),
            max(self.last_period, other_language.last_period),
            self.projects_used + other_language.projects_used
        )
