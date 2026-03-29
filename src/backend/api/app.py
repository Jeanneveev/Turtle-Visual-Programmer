import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from src.core.api.routes import api

def create_app():
    # absolute folder path to frontend folder
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
    frontend_dir = os.path.join(base_dir, "src", "frontend")
    builder_dir = os.path.join(frontend_dir, "builder")

    app = Flask(
        __name__,
        static_folder=frontend_dir,
        static_url_path=""
    )

    CORS(app)
    app.register_blueprint(api)

    @app.route("/")
    def index():
        return app.send_static_file("index.html")

    @app.route("/<path:filepath>")
    def static_files(filepath):
        return send_from_directory(frontend_dir, filepath)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)