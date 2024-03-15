from flask import Flask, jsonify
from flask_cors import CORS


def create_app(config=None):
    application = Flask(__name__)
    CORS(application)

    @application.route("/health")
    def health():
        return jsonify(status="Users Backend is UP")

    return application


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=4200, debug=True)
