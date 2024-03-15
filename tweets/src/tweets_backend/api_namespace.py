import http.client
from flask_restx import Resource, fields, Api
from flask import Blueprint
import mysql.connector
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from trident_models_package.models import Tweet, User, Tag

tweet_api_blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(tweet_api_blueprint, version="1.0", title="Tweets Backend API", description="A simple CRUD API")

api_namespace = api.namespace("tweets", description="API Operations")
tweet_parser = api_namespace.parser()
tweet_parser.add_argument("user_id", type=str, required=True, help="creator of the tweet")
tweet_parser.add_argument("text", type=str, required=True, help="text of the tweet")
tweet_parser.add_argument("tag_id", type=int, required=True, help="tag of the tweet")
tweet_parser.add_argument("privacy", type=int, required=True, help="privacy of the tweet")

model = {
    "id": fields.Integer(),
    "username": fields.String(),
    "text": fields.String(),
    "private": fields.Boolean(),
    "tag": fields.String()
}
tweet_model = api_namespace.model("Tweet", model)


@api_namespace.route("/")
class TweestListCreate(Resource):
    @api_namespace.doc("list_all_tweets")
    # @api_namespace.marshal_with(tweet_model, as_list=True)
    def get(self):
        """
        Get all tweets from the db
        """
        try:
            tweet_list = []
            engine = create_engine("mysql+mysqlconnector://root:slalomk@db/trident")
            with Session(engine) as session:
                q = select(Tweet).join(Tweet.tag)
                for row in session.scalars(q):
                    t = {
                        "id": row.tweet_id,
                        "username": row.user.username,
                        "text": row.content,
                        "private": row.privacy,
                        "tag": row.tag.name,
                    }
                    tweet_list.append(t)
                return tweet_list
        except Exception as e:
            return "Something went wrong: " + str(e)

    @api_namespace.doc("create_tweet")
    @api_namespace.expect(tweet_parser)
    def post(self):
        """
        Create new tweet for a given user
        """
        try:
            engine = create_engine("mysql+mysqlconnector://root:slalomk@db/trident")
            args = tweet_parser.parse_args()
            with Session(engine) as session:
                new_tweet = Tweet(
                    user_id = args.user_id, 
                    tag_id = args.tag_id, 
                    content = args.text,
                    privacy = args.privacy
                )
                session.add(new_tweet)
                session.commit()

                return http.client.CREATED
        except Exception as e:
            return "Something went wrong: " + str(e)


@api_namespace.route("/<string:tweetid>")
class MeTweetsListCreate(Resource):
    @api_namespace.doc("list_tweets_username")
    @api_namespace.marshal_with(tweet_model, as_list=True)
    def get(self, tweetid):
        """
        Get all the tweets for a given user
        This is outdated here and needs to be moved once we establish the user service
        """
        try:
            userid = tweetid
            tweet_list = []
            engine = create_engine("mysql+mysqlconnector://root:slalomk@db/trident")
            session = Session(engine)
            q = select(Tweet).join(Tweet.tag).where(Tweet.user_id == userid)
            for row in session.scalars(q):
                t = {
                    "id": row.tweet_id,
                    "username": row.user.username,
                    "text": row.content,
                    "private": row.privacy,
                    "tag": row.tag.name
                }
                tweet_list.append(t)
            return tweet_list
        except Exception as e:
            return "Something went wrong: " + str(e)

    @api_namespace.doc("edit_tweet")
    @api_namespace.expect(tweet_parser)
    def put(self, tweetid):
        """
        Change an existing tweet
        """
        try:
            engine = create_engine("mysql+mysqlconnector://root:slalomk@db/trident")
            args = tweet_parser.parse_args()
            with Session(engine) as session:
                q = select(Tweet).join(Tweet.tag).where(Tweet.tweet_id == tweetid)
                e_tweet = session.scalars(q).first()
                e_tweet.content = args.text
                e_tweet.privacy = args.privacy
                e_tweet.tag_id = args.tag_id
                session.commit()
                return http.client.ACCEPTED
        except Exception as e:
            return "Something went wrong: " + str(e)

@api_namespace.route("/tags")
class GetTags(Resource):
    @api_namespace.doc("get tweet tags and their id")
    def get(self):
        """
        Get all available tags from the db
        """
        try:
            tag_list = []
            engine = create_engine("mysql+mysqlconnector://root:slalomk@db/trident")
            with Session(engine) as session:
                q = select(Tag)
                for row in session.scalars(q):
                    t = {
                        "id": row.tag_id,
                        "name": row.name
                    }
                    tag_list.append(t)
                return tag_list
        except Exception as e:
            return "Something went wrong: " + str(e)
