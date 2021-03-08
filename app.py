import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

app = Flask(__name__, static_folder='./build/static')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
import models

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)
    

@socketio.on('login')
def on_login(data):
    socketio.emit('login', data, broadcast=True, include_self=True)


@socketio.on('move')
def on_move(data):
    socketio.emit('move', data, broadcast=True, include_self=True)
    

@socketio.on('gameOver')
def on_gameOver(data):
    socketio.emit('gameOver', data, broadcast=True, include_self=True)
    

@socketio.on('restart')
def on_restart(data):
    socketio.emit('restart', data, broadcast=True, include_self=True)


if __name__ == "__main__":
    socketio.run(
        app,
        debug=True,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
