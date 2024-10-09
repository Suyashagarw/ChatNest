# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from flask import render_template, redirect, request, url_for, Response
from apps.services.authentication import blueprint
import logging, requests, json, os
from auth0.authentication import GetToken, Database, Users
from auth0.management import UsersByEmail
from dotenv import load_dotenv
load_dotenv()

auth0_domain = os.getenv('AUTH0_DOMAIN')
auth0_client = os.getenv('AUTH0_CLIENT_ID')
auth0_secret = os.getenv('AUTH0_SECRET')
auth0_mgnt_client_id = os.getenv('AUTH0_MGNT_CLIENT_ID')
auth0_mgnt_secret = os.getenv('AUTH0_MGNT_SECRET')
chat_service_endpoint = os.getenv("CHAT_ENDPOINT_URL", "http://192.168.144.18:5000")

@blueprint.route('/')
def route_default():
    logging.info('We are here')
    # return redirect(url_for('authentication_blueprint.login'))
    return redirect(url_for('home_blueprint.index'))

# Login & Registration

@blueprint.route('/login', methods=['POST'])
def login(user=None, passw=None):
    # read form data
    # print(request.json)
    if 'username' in request.json:
        username = request.json['username']
    else:
        username = user

    if 'password' in request.json:
        password = request.json['password']
    else:
        password = passw 

    token = GetToken(auth0_domain, auth0_client, client_secret=auth0_secret)

    response = token.login(username=username, password=password, realm='Username-Password-Authentication')
    userData = userInfo(response['access_token'])
    response["userData"]=userData
    response["email"]=userData['email']
    response["photo"]=userData['picture']
    response["userId"]=userData['sub'].split("|")[1]

    account_response = requests.post(chat_service_endpoint + '/create_account',json={"username": response['email'], "userid":response['userId']})
    response["new_account"]=json.loads(account_response.text)
    
    return response


@blueprint.route('/me', methods=['POST'])
def userInfo(token=None):
    # read form data
    print(request.json)
    if 'access_token' in request.json:
        access_token = request.json['access_token']
    elif token is not None:
        access_token = token 
    else:
        return {"success": False, "msg": "Token mismtach"}
   

    users = Users(auth0_domain, auth0_client)

    response = users.userinfo(access_token=access_token)

    return response

@blueprint.route('/logout', methods=['POST'])
def logout():


    response = requests.post(chat_service_endpoint + '/logout')
    print(response)
    
    return json.loads(response.text)

# @blueprint.route('/checkUser', methods=['POST'])
def isUserExists(emailAddr=None):
    if 'email' in request.json:
        email = request.json['email']
    elif emailAddr is not None:
        email = emailAddr 

    get_token = GetToken(auth0_domain, auth0_mgnt_client_id, client_secret=auth0_mgnt_secret)
    token = get_token.client_credentials('https://{}/api/v2/'.format(auth0_domain))
    mgmt_api_token = token['access_token']
    searchEmail = UsersByEmail(auth0_domain, mgmt_api_token)
    data = searchEmail.search_users_by_email(email)

    if len(data)>0:
        response = {"UserExists": True}
    else:
        response = {"UserExists": False}

    return response

@blueprint.route('/signup', methods=['POST'])
def register():
    try:
        username = request.json['username']
        password = request.json['password']

        UserExists = isUserExists(username)

        if UserExists['UserExists']==True:
            return "User already exists", 400 
        
        database = Database(auth0_domain, auth0_client)

        signup = database.signup(email=username, password=password, connection='Username-Password-Authentication')
        response = login(user=username, passw=password)
        # print(response)
        
    except (ValueError, KeyError, TypeError) as error:
        print(error)
        resp = Response({"JSON Format Error."}, status=400, mimetype='application/json')
        return resp


    return response

# Errors

# @login_manager.unauthorized_handler
# def unauthorized_handler():
#     return redirect(url_for('authentication_blueprint.login'))


@blueprint.errorhandler(403)
def access_forbidden(error):
    return redirect(url_for('authentication_blueprint.login'))


@blueprint.errorhandler(404)
def not_found_error(error):
    return render_template('home/page-404.html'), 404


@blueprint.errorhandler(500)
def internal_error(error):
    return render_template('home/page-500.html'), 500
