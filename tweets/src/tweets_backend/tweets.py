from datetime import datetime
import json



class Tweet:
    def __init__(self, id, username, text, privacy, tag):
        self.id = id
        self.username = username
        self.text = text
        self.privacy = privacy
        self.tag = tag

    def __repr__(self) -> str:
        return str(f"{self.id} {self.username} {self.text} {self.privacy} {self.tag} ")
    
    def toJson(self):
        return {
            'id': self.id,
            'username': self.username,
            'text': self.text,
            'privacy': self.privacy,
            'tag': self.tag
        }


tweet_id = 0
tweets_list: list[Tweet] = []


def add_tweet(username, text):
    global tweet_id
    global tweet_list
    id = len(tweets_list)
    # new_tweet = Tweet(id + 1, username, text, 0 , null, datetime.utcnow())
    # tweets_list.append(new_tweet)
