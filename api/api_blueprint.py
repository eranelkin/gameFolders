from flask import Blueprint

api_blueprint = Blueprint(
    'api',
    __name__,
)

# noinspection PyUnresolvedReferences
import api.health_api
# noinspection PyUnresolvedReferences
import api.game_state_api
