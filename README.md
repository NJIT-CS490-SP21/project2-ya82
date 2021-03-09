# Tic Tac Toe

## Local Installation
1. Clone this repository
2. Make sure Python 3.6+ is installed
3. Install the requirements in requirements.txt
4. `npm install`
5. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
6. You will need a database url from heroku:
7.  Add the database to heroku with `heroku addons:create heroku-postgresql:hobby-dev`
8.  Get the database url with `heroku config`
9.  Add it to your .env file: `export DATABASE_URL='PASTE DATABASE URL HERE '
10.  Create the initial database from the python terminal
11.  `>>> from app import db`
12.  `>>> import models`
13.  `>>> db.create_all()`
14. run `python app.py` in the project directory
15. In a new terminal, run `npm run start` in the project directory
16. The app will now be running locally on your machine

## Future features
Some potential features for the future include:
1. A matchmaker/ranking system. Upon logging in, the server would attempt to match you with a player with a similar score. It would need a state value containing the list of currently waiting players, and match the two players with the closest score. It would then give both players a link to a room with a random directory name. Ex: ./aBc35dEf This would require the gameboard state var to contain an array of board states, one for each of the currently played boards.
2. A chat box during the match.  This would require a state variable to track the list of messages being sent, along with emit and emit listeners in App.js and app.py. The two files would communicate the messages back and forth such that App.js would send a message to app.py, which would then broadcast the message back to the other clients running App.js.

## Solved problems
1. One issue encountered was keeping track of which player had which score in a clean manner. Eventually I settled on two arrays being carried by a javascript object. The first array carrying a list of player names, the second array carrying a list of scores. A player would have the same index for both arrays. For example, the player who's username was stored in username[0] had it's score stored in score[0].
2. Another issue encountered was updating the database with a player's new score. I first attempted a process involving deleting the player's old row in the database and replacing it with a new updated one. Unsatisfied with this solution, I researched the flask-sqlalchemy docs and searched the internet for information. I discovered this stackOverflow resource, providing light on a much better method for updating the database values. https://stackoverflow.com/questions/6699360/flask-sqlalchemy-update-a-rows-information
