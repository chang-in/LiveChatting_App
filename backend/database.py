import redis

redis_client = redis.StrictRedis(host="localhost", port=6379)


Chatroom_lists = []
users = []


def senduser(user_data):
    users.append(user_data)
    if users:
        for i in users:
            redis_client.hmset(users, mapping=i)


if Chatroom_lists:
    for i in Chatroom_lists:
        redis_client.hmset(Chatroom_lists, i)
