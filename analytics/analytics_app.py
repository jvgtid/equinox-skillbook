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
        dct_user_info = {'user_id':'123456', 
                         'name':'Javi', 
                         'languages_used':{'scala':
                             {'last_commit_date':'2019-04-01'}}}
        return dct_user_info
    
    
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
        data = CheckItem.parser.parse_args()
        print(data['check_item'])
        
        return data
    
# Generic info from all users
class GenericInfo(Resource):
    
    def get(self):
        dct_all_users = {}
        return dct_all_users
    
    

# Añadir el recurso y definir como es el ENDPOINT
api.add_resource(UserInfo, '/user_info')
api.add_resource(UpdateUserInterest, '/update_user_interest/<int:user_id>')
api.add_resource(CheckItem, '/check_item')
api.add_resource(GenericInfo, '/generic_info')

app.run(port = 5000, debug = True)

if __name__ == '__main__':
	app.run(port = 5000, debug = True)
