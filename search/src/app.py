from flask import Flask, jsonify
from flask_cors import CORS
from search_backend.api_namespace import search_api_blueprint
from users.src.users_backend.auth_decorator import token_required


def create_app(config=None):

    application = Flask(__name__)
    application.register_blueprint(search_api_blueprint)
    CORS(application)

    @application.route("/health")
    @token_required
    def health():
        return jsonify(status="Search Backend is UP")

    return application


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=8000, debug=True)
