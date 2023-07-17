from flask import Flask, redirect, render_template
import firebase_admin
from firebase_admin import db
import os

# gives python file db access
cred_obj = firebase_admin.credentials.Certificate('./ServiceAccountKey.json')
default_app = firebase_admin.initialize_app(cred_obj,  {
	'databaseURL': 'https://url-shortener-80b8d-default-rtdb.firebaseio.com'
	})

# create app from react app (build)
app = Flask(__name__, static_folder='./build/static', template_folder="./build")

@app.route("/")
def hello_world():
    return redirect("/app") # redicts / to /app (specifies which route)

@app.route("/app")
def homepage():
    return render_template('index.html') # user goes to /app -> home page

@app.route('/<path:generatedKey>', methods=['GET'])
def fetch_from_firebase(generatedKey):
    ref = db.reference("/"+ generatedKey)
    data = ref.get() # gets key from db
    if not data:
        return '404 not found' # if they enter a nonexistent url
    else:
        longURL = data['longURL']
        return redirect(longURL) # redirect shortened url to long url