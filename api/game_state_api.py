from api.api_blueprint import api_blueprint


@api_blueprint.route("/game-state", methods=["POST"])
def api_save_game_state():
    raise NotImplementedError()


@api_blueprint.route("/game-state", methods=["GET"])
def api_load_game_state():
    raise NotImplementedError()
