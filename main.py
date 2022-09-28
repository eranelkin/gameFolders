import os

from flask import Response

from api.api_blueprint import api_blueprint
from app import app

BASE_DIR = os.path.dirname(__file__)

app.register_blueprint(api_blueprint, url_prefix='/api')


@app.route("/")
def return_index_html():
    return Response(
        open(
            os.path.join(BASE_DIR, "static", "index.html")
        ).read(),
        mimetype="text/html"
    )