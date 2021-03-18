import unittest
import unittest.mock as mock
from unittest.mock import patch
import os
import sys
import random

sys.path.append(os.path.abspath('../../'))
from app import add_player, pull_leaderboard
import models
from models import Player

KEY_INPUT = "input"
KEY_EXPECTED = "expected"
DATABASE = "database"

INITIAL_USERNAME = "Guest00"

class add_user_testCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_INPUT: 'Guest01',
                KEY_EXPECTED: [INITIAL_USERNAME, 'Guest01'] 
            },
            {
                KEY_INPUT: '',
                KEY_EXPECTED: [INITIAL_USERNAME, '']
            },
            {
                KEY_INPUT: INITIAL_USERNAME,
                KEY_EXPECTED: [INITIAL_USERNAME]
            }
        ]
        
    def mocked_db_session_query_all(self):
        return self.initial_db_mock
        
    def mocked_db_session_add(self, username):
        self.initial_db_mock.append(username)
        
    def mocked_db_session_commit(self):
        pass
        
    def test_success(self):
        for test in self.success_test_params:
            initial_person = models.Player(username=INITIAL_USERNAME, score=100)
            self.initial_db_mock = [initial_person]
            
            with patch('app.DB.session.add', self.mocked_db_session_add):
                with patch('app.DB.session.commit', self.mocked_db_session_commit):
                    with patch('app.DB.session.query') as mocked_query:
                        mocked_query(Player).all = self.mocked_db_session_query_all
                        
                        actual_result = add_player(test[KEY_INPUT])
                        expected_result = test[KEY_EXPECTED]
                        
                        self.assertEqual(len(actual_result), len(expected_result))
                        self.assertEqual(actual_result, expected_result)

class pull_leaderboard_testCase(unittest.TestCase):
    def setUp(self):
        self.first_person = models.Player(username=INITIAL_USERNAME, score=100)
        self.second_person = models.Player(username='Guest01', score=0)
        self.third_person = models.Player(username='', score=-3)
        self.success_test_params = [
            {
                DATABASE: [self.first_person],
                KEY_EXPECTED: {'players': [INITIAL_USERNAME], 'scores': [100]}
            },
            {
                DATABASE: [self.first_person, self.second_person, self.third_person],
                KEY_EXPECTED: {'players': [INITIAL_USERNAME, 'Guest01', ''], 'scores': [100, 0, -3]}
            },
            {
                DATABASE: [],
                KEY_EXPECTED: {'players': [], 'scores': []}
            }
        ]
    
    def mocked_db_session_query_all(self):
        return self.initial_db_mock
        
    def test_success(self):
        for test in self.success_test_params:
            self.initial_db_mock = test[DATABASE]
                
            with patch('app.DB.session.query') as mocked_query:
                mocked_query(Player).order_by(Player.score.desc()).all = self.mocked_db_session_query_all
                
                actual_result = pull_leaderboard()
                expected_result = test[KEY_EXPECTED]
                
                self.assertEqual(len(actual_result), len(expected_result))
                self.assertEqual(actual_result, expected_result)

if __name__ == '__main__':
    unittest.main()