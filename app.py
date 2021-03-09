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
    from models import Player
    if db.session.query(Player).filter_by(username=data['currentUser']).first().username != data['currentUser']:
        currentUser = Player(username=data['currentUser'], score=100)
        db.session.add(currentUser)
        db.session.commit()
        
    leaderboard = {'players': [], 'scores': []}
    for player in db.session.query(Player).all():
        leaderboard['players'].append(player.username)
        leaderboard['scores'].append(player.score)
        
    cleanPass = False
    while cleanPass is False:
        cleanPass = True
        for i in range(len(leaderboard['scores'])):
            if i < (len(leaderboard['scores']) - 1):
                if leaderboard['scores'][i] < leaderboard['scores'][i + 1]:
                    cleanPass = False
                    tempScore = leaderboard['scores'][i]
                    leaderboard['scores'][i] = leaderboard['scores'][i + 1]
                    leaderboard['scores'][i + 1] = tempScore
                    
                    tempPlayer = leaderboard['players'][i]
                    leaderboard['players'][i] = leaderboard['players'][i + 1]
                    leaderboard['players'][i + 1] = tempPlayer

    socketio.emit('updateLeaderboard', leaderboard, broadcast=True, include_self=True)
    socketio.emit('login', data, broadcast=True, include_self=True)


@socketio.on('move')
def on_move(data):
    socketio.emit('move', data, broadcast=True, include_self=True)
    

@socketio.on('gameOver')
def on_gameOver(data):
    from models import Player
    print('Game over emit received')
    if data['winner'] != 'Draw!':
        winner = db.session.query(Player).filter_by(username=data['winner']).first()
        loser = db.session.query(Player).filter_by(username=data['loser']).first()
        winner.score = winner.score + 1
        loser.score = loser.score - 1
        print(winner.score)
        print(loser.score)

    db.session.commit()
    socketio.emit('gameOver', data, broadcast=True, include_self=True)
    

@socketio.on('restart')
def on_restart(data):
    from models import Player
    
    leaderboard = {'players': [], 'scores': []}
    for player in db.session.query(Player).all():
        leaderboard['players'].append(player.username)
        leaderboard['scores'].append(player.score)
        
    cleanPass = False
    while cleanPass is False:
        cleanPass = True
        for i in range(len(leaderboard['scores'])):
            if i < (len(leaderboard['scores']) - 1):
                if leaderboard['scores'][i] < leaderboard['scores'][i + 1]:
                    cleanPass = False
                    tempScore = leaderboard['scores'][i]
                    leaderboard['scores'][i] = leaderboard['scores'][i + 1]
                    leaderboard['scores'][i + 1] = tempScore
                    
                    tempPlayer = leaderboard['players'][i]
                    leaderboard['players'][i] = leaderboard['players'][i + 1]
                    leaderboard['players'][i + 1] = tempPlayer
    
    socketio.emit('restart', data, broadcast=True, include_self=True)
    socketio.emit('updateLeaderboard', leaderboard, broadcast=True, include_self=True)


if __name__ == "__main__":
    socketio.run(
        app,
        debug=True,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
