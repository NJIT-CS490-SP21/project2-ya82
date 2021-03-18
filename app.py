"""Python backend that communicates with javascript frontend and postgresql database"""
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv, find_dotenv
from models import DB, Player

load_dotenv(find_dotenv())


def create_app():
    app = Flask(__name__, static_folder='./build/static')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    DB.init_app(app)
    with app.app_context():
        DB.create_all()
    return app


APP = create_app()

CORS = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKET_IO = SocketIO(APP,
                     cors_allowed_origins="*",
                     json=json,
                     manage_session=False)


def check_first_login(current_user, all_players):
    """Returns true if the current user is not already in the all_players list"""
    if current_user not in all_players:
        return True
    return False


def update_leaderboard(players, scores):
    """Returns a leaderboard dictionary containing the lists of player names
    and player scores"""
    leaderboard = {'players': [], 'scores': []}
    for player in players:
        leaderboard['players'].append(player)
    for score in scores:
        leaderboard['scores'].append(score)
    return leaderboard


def add_player(current_user):
    all_players = []
    for player in DB.session.query(Player).all():
        all_players.append(player.username)

    first_login = check_first_login(current_user, all_players)
    if first_login is True:
        current_user_entry = Player(username=current_user, score=100)
        DB.session.add(current_user_entry)
        DB.session.commit()

    players = []
    for player in DB.session.query(Player).all():
        players.append(player.username)
    return players


def pull_leaderboard():
    players = []
    scores = []
    for player in DB.session.query(Player).order_by(Player.score.desc()).all():
        players.append(player.username)
        scores.append(player.score)

    leaderboard = update_leaderboard(players, scores)
    return leaderboard


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Built-in React function"""
    return send_from_directory('./build', filename)


@SOCKET_IO.on('login')
def on_login(data):
    """If a new user logs in, adds them to the database"""
    current_user = data['currentUser']
    add_player(current_user)
    leaderboard = pull_leaderboard()

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
    if data['winner'] != 'Draw!':
        winner = DB.session.query(Player).filter_by(
            username=data['winner']).first()
        loser = DB.session.query(Player).filter_by(
            username=data['loser']).first()
        winner.score = winner.score + 1
        loser.score = loser.score - 1
        DB.session.commit()

    leaderboard = pull_leaderboard()

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
