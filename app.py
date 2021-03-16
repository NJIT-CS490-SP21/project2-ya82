"""Python backend that communicates with javascript frontend and postgresql database"""
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv, find_dotenv
from models import DB, Player

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder='./build/static')
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB.init_app(APP)

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKET_IO = SocketIO(APP,
                     cors_allowed_origins="*",
                     json=json,
                     manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Built-in React function"""
    return send_from_directory('./build', filename)


@SOCKET_IO.on('login')
def on_login(data):
    """If a new user logs in, adds them to the database"""
    all_players = []
    for player in DB.session.query(Player).all():
        all_players.append(player.username)
    if data['currentUser'] not in all_players:
        current_user = Player(username=data['currentUser'], score=100)
        DB.session.add(current_user)
        DB.session.commit()

    leaderboard = {'players': [], 'scores': []}
    for player in DB.session.query(Player).order_by(Player.score.desc()).all():
        leaderboard['players'].append(player.username)
        leaderboard['scores'].append(player.score)

    SOCKET_IO.emit('updateLeaderboard',
                   leaderboard,
                   broadcast=True,
                   include_self=True)
    SOCKET_IO.emit('login', data, broadcast=True, include_self=True)


@SOCKET_IO.on('move')
def on_move(data):
    """Upon receiving an updated board state, emit it to all clients"""
    SOCKET_IO.emit('move', data, broadcast=True, include_self=True)


@SOCKET_IO.on('gameOver')
def on_game_over(data):
    """Upon receiving the gameOver emit, updates the players scores in the database and emits
     the updated leaderboard and gameOver signal to all clients"""
    print('Game over emit received')
    if data['winner'] != 'Draw!':
        winner = DB.session.query(Player).filter_by(
            username=data['winner']).first()
        loser = DB.session.query(Player).filter_by(
            username=data['loser']).first()
        winner.score = winner.score + 1
        loser.score = loser.score - 1
        print(winner.score)
        print(loser.score)
        DB.session.commit()

    leaderboard = {'players': [], 'scores': []}
    for player in DB.session.query(Player).order_by(Player.score.desc()).all():
        leaderboard['players'].append(player.username)
        leaderboard['scores'].append(player.score)

    SOCKET_IO.emit('updateLeaderboard',
                   leaderboard,
                   broadcast=True,
                   include_self=True)
    SOCKET_IO.emit('gameOver', data, broadcast=True, include_self=True)


@SOCKET_IO.on('restart')
def on_restart(data):
    """Upon receiving the restart emit, emits the restart signal to all clients"""
    SOCKET_IO.emit('restart', data, broadcast=True, include_self=True)


if __name__ == "__main__":
    SOCKET_IO.run(
        APP,
        debug=True,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
