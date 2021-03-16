"""Creates the database schema and initializes the database to be imported into app.py"""
from flask_sqlalchemy import SQLAlchemy

DB = SQLAlchemy()


class Player(DB.Model):
    """Database config for the leaderboard"""
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    score = DB.Column(DB.Integer, unique=False, nullable=False)

    def __repr__(self):
        return '<Player %r>' % self.username
