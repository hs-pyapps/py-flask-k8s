from flask import Blueprint
from flask_restx import Resource, Api
from trident_models_package.models import Tweet, User, Tag
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
import mysql.connector


search_api_blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
api = Api(search_api_blueprint, version="1.0", title="Search Backend Api", description="Simple search service")

api_namespace = api.namespace("search", description="Search Service")
search_parser = api_namespace.parser()
search_parser.add_argument("tag", type=str, required=False, location='args')
search_parser.add_argument("keyword", type=str, required=False, location='args')


@api_namespace.route("/")
class Search(Resource):
    @api_namespace.doc("list_all_tweets")
    @api_namespace.expect(search_parser)
    def get(self):
        tweet_list = []
        args = search_parser.parse_args()
        if (args['tag'] or args['keyword']):
            try:
                engine = create_engine("mysql+mysqlconnector://root:slalomk@db/trident")
                with Session(engine) as session:
                    if (args['tag'] and args['keyword']):
                        keywords = args['keyword'].split(" ")
                        like_query = '%' + '%'.join(keywords) + '%'
                        q = select(Tweet).join(Tweet.tag).where(Tweet.tag_id == args['tag']).where(Tweet.content.like(like_query))
                    elif (args['tag']):
                        q = select(Tweet).join(Tweet.tag).where(Tweet.tag_id == args['tag'])
                    elif (args['keyword']):
                        keywords = args['keyword'].split(" ")
                        like_query = '%' + '%'.join(keywords) + '%'
                        q = select(Tweet).join(Tweet.tag).where(Tweet.content.like(like_query))
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
            except Exception as a:
                return "Something went wrong: " + str(a)
        else:
            return "Tag or keyword required to search on"
