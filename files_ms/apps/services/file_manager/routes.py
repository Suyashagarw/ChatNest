
from flask import render_template, redirect, request, url_for, Response
from apps.services.file_manager import blueprint
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

import os, logging, requests, mimetypes, base64
from flask import Flask, request, jsonify
from urllib.parse import quote  # Import the quote function from urllib.parse
app = Flask(__name__)

app.logger.setLevel(logging.DEBUG)
api_url = os.getenv('AWS_API_GATEWAY', 'https://g3b0zrn210.execute-api.us-east-1.amazonaws.com/dev/ece1724/')

def file_put(file, file_name, bucket_file):
    print(file_name, bucket_file)

    url=api_url+bucket_file
    mime_type, _ = mimetypes.guess_type(file_name)
    app.logger.debug(mime_type)

    print(url)
    # return mime_type
    if mime_type in ('text/plain', 'application/pdf', 'image/png', 'image/jpeg', 'image/jpg'):
        response = requests.put(url, headers={'Content-Type': mime_type}, data=file['files'])
    else:
        return {"msg": "file type is not supported"}
    
    print(response.text)
    
    return url if response.status_code==200 else {"msg": "upload failed", "api_response": response.text}

def file_get(file_name, bucket_file):
    print(file_name, bucket_file)
    url=api_url+bucket_file
    file_type = bucket_file.split(".")[1]
    app.logger.debug(file_type)
    result = requests.get(url)

    if file_type=='text/plain':
        response = result.content.deode('utf8')
    app.logger.debug(result)
    app.logger.debug(result.content)
    return response

@blueprint.route('/upload', methods=['POST','PUT'])
def upload_file():
    app.logger.debug(api_url)
    app.logger.debug(request.files)
    app.logger.debug(request.files)
    if 'files' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['files']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_name = file.filename
    bucket_file =  file_name

    response = file_put(request.files, file_name=file_name, bucket_file=bucket_file)

    return jsonify({'response': response}), 200

@blueprint.route('/download/<file_name>', methods=['GET'])
def download_file(file_name):
    bucket_file = file_name
    response = file_get(file_name=file_name, bucket_file=bucket_file)

    return jsonify({'url': api_url+bucket_file}), 200



@blueprint.errorhandler(403)
def access_forbidden(error):
    return redirect(url_for('authentication_blueprint.login'))


@blueprint.errorhandler(404)
def not_found_error(error):
    return render_template('home/page-404.html'), 404


@blueprint.errorhandler(500)
def internal_error(error):
    return render_template('home/page-500.html'), 500
