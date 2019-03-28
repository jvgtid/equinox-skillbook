#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Mar 28 19:14:22 2019

@author: cx02355
"""
import numpy as np
import pandas as pd
from os import listdir
import json


def save_to_json(path, file):
    
    with open(path, 'w') as outfile:
        json.dump(file, outfile)


def process_tags():
    
    list_projects = listdir('../reports/projects')
    inventory = json.loads(open('../reports/inventory/' + "tags_inventory.json").read())
    
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
                    
        save_to_json(path="../reports/database/projects/" + path_project, file=project)
        

def process_scoring():
    
    list_users = listdir('../reports/users')
    list_projects = listdir('../reports/projects')
    
    for path_user in list_users:
        # Load user
        user = json.loads(open('../reports/users/' + path_user).read())

    