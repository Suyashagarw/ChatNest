from chat.app import app, run_app, utils  # noqa
import logging
import eventlet
from flask_session import Session
from chat.config import get_config
from flask_cors import CORS
from flask_socketio import SocketIO
from chat.socketio_signals import io_connect, io_disconnect, io_join_room, io_on_message

utils.init_redis()

if __name__ == "__main__":
    # monkey patch is "required to force the message queue package to use coroutine friendly functions and classes"
    # check flask-socketio docs https://flask-socketio.readthedocs.io/en/latest/
    
    eventlet.monkey_patch()
    run_app()
