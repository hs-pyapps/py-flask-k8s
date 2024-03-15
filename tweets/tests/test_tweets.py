# In order to successfully run tests in development environments,
# devs will need to run the following command in this current
# working directory, using their unique project path on their
# machine/virtual environment:
#
# export PYTHONPATH="${PYTHONPATH}:{your/unique/path}/python-flask-k8s/tweets"
#
# TODO: Move this information to more permanent location and
#       implement solution to project structure issues
# 
# POSSIBLE FIX: Make change to settings.json on main


import pytest
from src.tweets_backend.tweets import Tweet

def test_new_tweet():

    tweet = Tweet('1234', 'test_user', 'This is a test tweet.', '2023-3-1')

    assert tweet.id == '1234'
    assert tweet.username == 'test_user'
    assert tweet.text == 'This is a test tweet.'
    assert tweet.timestamp == '2023-3-1'

def test_new_tweet_no_id():

    tweet = Tweet(None, 'test_user', 'This is a test tweet.', '2023-3-1')

    assert tweet.id == None
    assert tweet.username == 'test_user'
    assert tweet.text == 'This is a test tweet.'
    assert tweet.timestamp == '2023-3-1'

def test_new_tweet_no_username():
    
    tweet = Tweet('1234', None, 'This is a test tweet.', '2023-3-1')

    assert tweet.id == '1234'
    assert tweet.username == None
    assert tweet.text == 'This is a test tweet.'
    assert tweet.timestamp == '2023-3-1'

def test_new_tweet_no_text():
        
    tweet = Tweet('1234', 'test_user', None, '2023-3-1')

    assert tweet.id == '1234'
    assert tweet.username == 'test_user'
    assert tweet.text == None
    assert tweet.timestamp == '2023-3-1'

def test_new_tweet_no_timestamp():
                
    tweet = Tweet('1234', 'test_user', 'This is a test tweet.', None)

    assert tweet.id == '1234'
    assert tweet.username == 'test_user'
    assert tweet.text == 'This is a test tweet.'
    assert tweet.timestamp == None   

def test_new_tweet_no_id_username_text_timestamp():
                    
    tweet = Tweet(None, None, None, None)

    assert tweet.id == None
    assert tweet.username == None
    assert tweet.text == None
    assert tweet.timestamp == None

if __name__ == '__main__':
    pytest.main()
