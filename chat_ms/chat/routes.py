import json
import os

import bcrypt
from flask import Response, jsonify, request, session

from chat import utils
from chat.app import app
from chat.auth import auth_middleware


@app.route("/stream")
def stream():
    return Response(utils.event_stream(), mimetype="text/event-stream")


# Return our SPA application.
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def catch_all(path):
    return app.send_static_file("index.html")


# This check if the session contains the valid user credentials
@app.route("/me")
def get_me():
    username = request.args.get("username")
    app.logger.debug(username)
    # username = data["username"]

    username_key = utils.make_username_key(username)
    app.logger.debug(username_key)
    user_key = utils.redis_client.get(username_key).decode("utf-8")
    app.logger.debug(user_key)
    if user_key and username_key:
        session["user"] = {"id": user_key.split(':')[1], "username": username_key.split(':')[1]}
    app.logger.debug("session")
    app.logger.debug(session)
    app.logger.debug("session['user']")
    app.logger.debug(session["user"])
    return jsonify({"id": user_key.split(':')[1], "username": username_key.split(':')[1]})


@app.route("/links")
def get_links():
    """Returns JSON with available deploy links"""
    # Return github link to the repo
    repo = open(os.path.join(app.root_path, "../repo.json"))
    data = json.load(repo)
    return jsonify(data)


@app.route("/create_account", methods=["POST"])
def login():
    """For now, just simulate session behavior"""
    # TODO
    data = request.get_json()
    username = data["username"]
    userId = data["userid"]
    # password = data["password"]

    username_key = utils.make_username_key(username)
    user_exists = utils.redis_client.exists(username_key)
    # print(user_exists)
    if not user_exists:
        new_user = utils.create_user(userId, username)
        session["user"] = new_user

        return jsonify({"success": True, "message": "New user created"}), 200
    else:
        user_key = utils.redis_client.get(username_key).decode("utf-8")
        username_key = utils.make_username_key(username)
        print(username_key)
        user_key = utils.redis_client.get(username_key).decode("utf-8")
        print(user_key)

        return jsonify({"id": user_key.split(':')[1], "username": username_key.split(':')[1]}), 200


@app.route("/logout", methods=["POST"])
@auth_middleware
def logout():
    session["user"] = None
    return jsonify({"success": True, "msg": "User logged out"}), 200


@app.route("/users/online")
@auth_middleware
def get_online_users():
    online_ids = map(
        lambda x: x.decode("utf-8"), utils.redis_client.smembers("online_users")
    )
    users = {}
    for online_id in online_ids:
        app.logger.debug("online_id: ")
        app.logger.debug(online_id)
        user = utils.redis_client.hgetall(f"user:{online_id}")
        users[online_id] = {
            "id": online_id,
            "username": user.get(b"username", "").decode("utf-8"),
            "online": True,
        }
    return jsonify(users), 200


@app.route("/rooms/<user_id>")
@auth_middleware
def get_rooms_for_user_id(user_id=0):
    """Get rooms for the selected user."""
    # We got the room ids
    room_ids = list(
        map(
            lambda x: x.decode("utf-8"),
            list(utils.redis_client.smembers(f"user:{user_id}:rooms")),
        )
    )
    print(room_ids)
    rooms = []
    
    for room_id in room_ids:
        name = utils.redis_client.get(f"room:{room_id}:name")
        
        if room_id=='0':
            room_name = name.decode("utf-8")
        else:
            user_ids = room_id.split(":")
            if len(user_ids) != 2:
                return jsonify(None), 400
            
            room_name = utils.hmget(f"user:{user_ids[0]}", "username")[0] if user_id==user_ids[1] else utils.hmget(f"user:{user_ids[1]}", "username")[0]

            # room_name = user1 if session["user"]['username']==user2 else user2
            # room_exists = utils.redis_client.exists(f"room:{room_id}")
            # print(room_exists)
            # if not room_exists:
            #     continue

            

            # rooms.append(
            #     {
            #         "id": room_id,
            #         "names": [
            #             utils.hmget(f"user:{user_ids[0]}", "username"),
            #             utils.hmget(f"user:{user_ids[1]}", "username"),
            #         ],
            #     }
            # )
        rooms.append({"id": room_id, "names": [room_name]})
    return jsonify(rooms), 200


@app.route("/room/<room_id>/messages")
@auth_middleware
def get_messages_for_selected_room(room_id="0"):
    offset = request.args.get("offset")
    size = request.args.get("size")

    try:
        messages = utils.get_messages(room_id, int(offset), int(size))
        return jsonify(messages)
    except:
        return jsonify(None), 400

@app.route("/user/<username>")
@auth_middleware
def get_user_by_username(username):
    app.logger.debug(username)
    try:
        user = utils.get_username(username),
        app.logger.debug(user)
        return jsonify({"userId": user[0]}) if user[0] else jsonify(None)
    except Exception as e:
        app.logger.debug(e)
        return jsonify(None), 400

@app.route("/room/create", methods=["POST"])
@auth_middleware
def create_chat_room():
    utils.init_redis()
    host = request.json["host"]
    guest = request.json["guest"]
    guest_name = request.json["guest_name"]
    host_name = request.json["host_name"]

    try:
        private_room_id = utils.get_private_room_id(
                host, guest
            )
        print(private_room_id)

        if private_room_id:
            res = utils.create_private_room(host, guest, host_name, guest_name)
            room = res[0]

        print(room)
        return jsonify(room)
    except Exception as error:
        print(error)
        return jsonify(None), 400

@app.route("/users")
def get_user_info_from_ids():
    ids = request.args.getlist("ids[]")
    app.logger.debug(ids)
    if ids:
        users = {}
        for id in ids:
            user = utils.redis_client.hgetall(f"user:{id}")
            is_member = utils.redis_client.sismember("online_users", id)
            users[id] = {
                "id": id,
                "username": user[b"username"].decode("utf-8"),
                "online": bool(is_member),
            }
        return jsonify(users)
    return jsonify(None), 404
