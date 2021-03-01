# Tic Tac Toe

## Local Installation
1. CLone this repository
2. Make sure Python 3.6+ is installed
3. Install the requirements in requirements.txt
4. `npm install`
5. 1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory
6. run `python app.py` in the project directory
7. In a new terminal, run `npm run start` in the project directory
8. The app will now be running locally on your machine

## Known problems
1. Game over screen sometimes loops.
A proper and detailed analysis of the code is necessary to solve this problem. Initial investigation finds that even though python is sending only one 'move' emit, app.js is reporting that it's receiving it multiple times. This results in more gameOver checks than needed, resulting in the game over screen looping. It was found that removing states from the secondary component of useEffect() solved this issue but introduced a problem where the `username` and `userList` states would not be updated appropriately.

2. Spectator list accumulates empty list elements.
If spectators join after both players are in the lobby, the spectator list will accumulate empty elements. Some error in logic is present with how the list is populated, likely caused by the map method or incorrect state usage.

## Solved problems
1. Keeping the userList current with python server's version was an issue encountered. Initially, it was attempted to simply replace the client's version with the server. This did not work. After consulting with React's docs and a lot of trial and error, it was found that looping through the client's version and setting each value to mirror the server's version to be a solution.
2. Getting the username data from the input field was an issue. Encountered with this problem and unsure how to solve it, I checked the React docs. Unfortunately, the solutions offered there seemed more complicated than needed for my use case when implemented. I began to search through other sources, and after a few attempts I found a satisfactory solution from SlackOverflow. After simplifying the function I now had a simple execution to get the needed data. `onChange={e => setUsername(e.target.value)} `
