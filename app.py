import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv()) # This is to load your env variables from .env

app = Flask(__name__, static_folder='./build/static')
# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models
db.create_all()

cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

userList = []

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('Connected!')

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')
    

@socketio.on('login')
def on_login(data):
    print("Login detected: " + data)
    duplicate = False
    for name in models.Person.query.all():
        if name.username == data:
            duplicate = True
    
    if duplicate is False:
        new_user = models.Person(username=data, score=100)
        db.session.add(new_user)
        db.session.commit()
        
    all_people = models.Person.query.all()
    print(all_people)
    
    
    users = []
    scores = []
    for person in all_people:
        users.append(person.username)
        scores.append(person.score)
    print(users, scores)
    socketio.emit('leaderboard_list', (users, scores))
    
    if data not in userList:
        userList.append(data)
    for user in userList:
        print(user)
    socketio.emit('userList', userList, broadcast=True, include_self=True)
    

@socketio.on('gameOver')
def gameOver(winner, loser):
    print('Game Over!', winner, loser)
    all_users = db.session.query(models.Person).all()
    for user in all_users:
        if user.username == winner:
            user.score = user.score + 0.5
        if user.username == loser:
            user.score = user.score - 0.5
    db.session.commit()
    userList.clear()
    socketio.emit('userList', userList, broadcast=True, include_self=False)


# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('move')
def on_move(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('move',  data, broadcast=True, include_self=False)
    print('Move sent') #comment
    
    
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True
    )
