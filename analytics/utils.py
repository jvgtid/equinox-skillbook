#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Mar 28 19:14:22 2019

@author: cx02355
"""
import json
from os import listdir
from collections import defaultdict

import numpy as np


def save_to_json(path, file):
    
    with open(path, 'w') as outfile:
        json.dump(file, outfile)


def process_tags():
    
    list_projects = listdir('../reports/projects')
    inventory = json.loads(open('../reports/inventory/' + "tags_inventory.json").read())
    
    project_all = {}
    # Hardcoded filter
    filter_projects = ['Telefonicaluca-comms.json', 'Telefonicaluca-fleet.json']
    
    # Add tags to projects
    for path_project in list_projects:
        # Load project
        project = json.loads(open('../reports/projects/' + path_project).read())
        project['tags'] = []
        # Obtain tags per project
        # Iterate per language
        for language in project['tags_languages']:
            for library, params in inventory.items():
                if language in params['languages']:
                    project['tags'] += [params['tags']]
         
    project_all[project['id']] = project
    save_to_json(path="../reports/database/projects/projects_all.json", file=project_all)
    

def process_users():
    users = {}

    list_users = listdir('../reports/users')

    for path_user in list_users:
        user = json.loads(open('../reports/users/' + path_user).read())
        login = user['login'].lower()

        if login not in users:
            users[login] = {
                'name': user['id'],
                'mail': user['mail'],
                'picture': user['picture'],
                'coworkers': user['coworkers']
            }
        else:
            users[login]['coworkers'] = list(set(users[login]['coworkers']) | set(user['coworkers']))

    save_to_json('../reports/final_users.json', users)
    print('USERS:', users)


def process_languages():
    users = json.loads(open('../reports/finial_users_2.json').read())
    languages = defaultdict(int)

    for user in users.values():
        for language in user['languages']:
            languages['name'] = max(languages['name'], language['value'])

    save_to_json(path="../reports/languages.json", file=languages)


def process_scores():
    users = json.loads(open('../reports/finial_users_2.json').read())
    languages = json.loads(open('../reports/languages.json').read())

    for user, obj in users.items():
        for language in obj['languages']:
            users[user]['languages'][language] = 1 / users[user]['languages'][language]

def process_scoring():
    
    users_total = {}
    list_users = listdir('../reports/users')
    list_projects = listdir('../reports/projects')
    baseline = (360*2)/15 # 1 year in 2 projects and 15 days since last commit

    # hardcocoded
    filter_users = ['jvgtid.json']
    
    for path_user in list_users:
        # Load user
        user = json.loads(open('../reports/users/' + path_user).read())
        for language in user['languages_used']:
            first_commit_date = language["first_commit_date"]
            first_commit_date = parser.parse(first_commit_date)
            last_commit_date = language["last_commit_date"]
            last_commit_date = parser.parse(last_commit_date)
            diff_days = (last_commit_date - first_commit_date).days
            projects_used = language["projects_used"]
            last_period = language["last_period"]
            reference = (diff_days*len(projects_used))/last_period
            score = np.round((reference*3.33)/baseline)
            
            if score > 10:
                score = 10
            user['languages_used'][language]['score'] = score
            
        
        users_total[user['id']] = user
    
    save_to_json(path="../reports/database/users/users_all.json", file=users_total)

if __name__ == '__main__':
    process_users()
