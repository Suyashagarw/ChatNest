import os

import redis
from werkzeug.utils import import_string
from dotenv import load_dotenv
load_dotenv()

auth0_domain = os.getenv('AUTH0_DOMAIN')


class Config(object):
    # Parse redis environment variables.
    redis_endpoint_url = os.getenv("REDIS_ENDPOINT_URL", "redis-master:6379")
    REDIS_HOST, REDIS_PORT = tuple(redis_endpoint_url.split(":"))
    REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)
    SECRET_KEY = os.getenv("SECRET_KEY", "Optional default value")
    SESSION_TYPE = "redis"
    redis_client = redis.Redis(
        host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD
    )
    SESSION_REDIS = redis_client
    # TODO: Auth...


class ConfigDev(Config):
    DEBUG = True
    pass


class ConfigProd(Config):
    pass


def get_config() -> Config:
    return import_string(os.getenv("CHAT_CONFIG", "chat.config.ConfigDev"))
