import os

from app import app

PORT = int(os.environ.get('PORT', 5100))

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=PORT, debug=app.debug, use_reloader=True, use_debugger=True)
