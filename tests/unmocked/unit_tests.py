"""
  This file runs unit tests for check_first_login and update_leaderboard from app.py
  See the function docstrings in app.py for more information about these functions.
"""

import sys
import os
sys.path.append(os.path.abspath('../../'))
import unittest
from app import check_first_login, update_leaderboard

KEY_FIRST_INPUT = "first input"
KEY_SECOND_INPUT = "second input"
KEY_EXPECTED = "expected"


class check_first_login_testCase(unittest.TestCase):
    def setUp(self):
        self.success_test_params = [
            {
                KEY_FIRST_INPUT: 'Guest03',
                KEY_SECOND_INPUT: ['Guest00', 'Guest01', 'Guest02'],
                KEY_EXPECTED: True
            },
            {
                KEY_FIRST_INPUT: 'Guest03',
                KEY_SECOND_INPUT: ['Guest00', 'Guest01', 'Guest02', 'Guest03'],
                KEY_EXPECTED: False
            },
            {
                KEY_FIRST_INPUT: 'Guest03',
                KEY_SECOND_INPUT: ['Guest00, Guest01, Guest02, Guest03'],
                KEY_EXPECTED: True
            },
            {
                KEY_FIRST_INPUT: 'Guest03',
                KEY_SECOND_INPUT: [],
                KEY_EXPECTED: True    
            }
        ]

    def test_success(self):
        for test in self.success_test_params:
            actual_result = check_first_login(
                test[KEY_FIRST_INPUT],
                test[KEY_SECOND_INPUT]
                )
            
            expected_result = test[KEY_EXPECTED]

        self.assertEqual(actual_result, expected_result)
        self.assertEqual(type(actual_result), type(expected_result))


if __name__ == '__main__':
    unittest.main()
