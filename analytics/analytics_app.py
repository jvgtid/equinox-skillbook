#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Mar 28 16:32:41 2019

@author: cx02355
"""

# Librerías de Flask
from flask import Flask
from flask_restful import Resource, Api
from flask import request
from flask_cors import CORS
from flask_restful import reqparse 
import json

# Librerías de los modelos
import pickle
import re


# Variables Flask
app = Flask(__name__)
CORS(app)
api = Api(app) 
items = []


# Endpoints for user specific info & generic landing info
class UserInfo(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('user_mail', type = str, 
                        required = False, 
                        help = "None")
    
    def get(self):
        print(request.args.get('user_mail'))
        users_all = json.loads(open('../reports/database/users/users_all.json').read())
        print(users_all)
        
        user_final = {}
        mail = request.args.get('user_mail')
        for user, values in users_all.items():
            if values['mail'] == mail:
                user_final = users_all[user]
        
        return user_final if len(user_final) > 0 else 404
    
    
# Change user current interest
class UpdateUserInterest(Resource):
    
    parser = reqparse.RequestParser()
    parser.add_argument('current_interest', type = str, 
                        required = False, 
                        help = "None")
    def get(self):
        pass
    
    def post(self, user_id):
        print(user_id)
        data = UpdateUserInterest.parser.parse_args()
        print(data)
        dct_user_info = {'user_id':'123456', 
                         'name':'Javi', 
                         'languages_used':{'scala':
                             {'last_commit_date':'2019-04-01',
                              'scoring':11}},
                         'current_interest':'python'}
        
        dct_user_info['current_interest'] = data['current_interest']
        
        return dct_user_info
    

    
# Generic search for users of projects for that query
class CheckItem(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('check_item', type = str, 
                        required = False, 
                        help = "None")
    def get(self):
        print(request.args.get('check_item'))
        
        users_all = json.loads(open('../reports/database/users/users_all.json').read())
        print(users_all)
        users_final = {}
        
        language_query = request.args.get('check_item')
        
        for user, values in users_all.items():
            if language_query in list(values['languages_used'].keys()):
                users_final[user] = values
                
        return users_final if len(users_final) > 0 else 404
    
    
    
# Generic info from all users
class GenericInfo(Resource):
    
    def get(self):
        users_all = json.loads(open('../reports/database/users/users_all.json').read())
        
        return users_all
    

# Generic info from all projects
class GenericInfoProjects(Resource):
    
    def get(self):
        projects_all = json.loads(open('../reports/database/projects/projects_all.json').read())
        return projects_all
    

# Añadir el recurso y definir como es el ENDPOINT
api.add_resource(UserInfo, '/user_info')
api.add_resource(UpdateUserInterest, '/update_user_interest/<int:user_id>')
api.add_resource(CheckItem, '/check_item')
api.add_resource(GenericInfo, '/generic_info')
api.add_resource(GenericInfoProjects, '/generic_info_projects')

app.run(port = 5000, debug = True)

if __name__ == '__main__':
	app.run(port = 5000, debug = True)
