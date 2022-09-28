import logging
import os

from flask import Flask

base_path = os.path.join(os.path.dirname(__file__), "..")
app = Flask(__name__)
app.config.from_object("config.Config")

# noinspection PyUnresolvedReferences
import main

