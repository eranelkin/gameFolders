from api.api_blueprint import api_blueprint


@api_blueprint.route("/health/ping", methods=["GET"])
def api_health_ping():
    return "pong"
