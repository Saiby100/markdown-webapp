import json
import requests

URL = "http://localhost:3000"

with open('./private.json', 'r') as file:
    token = json.load(file)['token']

def log_message(json_data):
    print('response: ', dict(json_data).get('message'))

def log_error(json_data):
    print('response: ', dict(json_data).get('error'))

def add_user(name='Salahuddin', email='Salahuddin@gmail.com'):
    data = {
        'name': name,
        'email': email,
        'password': 'password123'
    }

    response = requests.post(URL+'/register', json=data)
    return response

def login_user(name='Salahuddin', password='password123'):
    data = {
        'name': name,
        'password': password
    }

    response = requests.post(URL+'/login', json=data)
    return response

def add_note(auth, user_id, title="Note title", text="This is the body of the note"):
    data = {
        'title': title,
        'text': text
    }

    response = requests.post(URL+f'/add-note/{user_id}', json=data, headers=auth)
    return response