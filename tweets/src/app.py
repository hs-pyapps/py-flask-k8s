from flask import Flask, render_template, jsonify
from flask_cors import CORS
from tweets_backend.api_namespace import tweet_api_blueprint
from tweets_backend.tweets import add_tweet
import mysql.connector


def create_app(config=None):

    application = Flask(__name__)
    application.register_blueprint(tweet_api_blueprint)
    CORS(application)

    @application.route("/")
    def index():
        return render_template("index.html")

    @application.route("/health")
    def health():
        return jsonify(status="Tweets Backend is UP")

    return application


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=8000, debug=True)
