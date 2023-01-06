from aiohttp import web

import socketio
import asyncio

sio = socketio.AsyncServer(async_mode="aiohttp", cors_allowed_origins="*")
app = web.Application()
sio.attach(app)


async def background_task():
    """Example of how to send server generated events to clients."""
    reader, writer = await asyncio.open_connection("127.0.0.1", 9000)
    # config_reader, config_writer = await asyncio.open_connection("127.0.0.1", 9001)
    while True:
        try:
            data = await reader.read(1024)
            # config_data = await config_reader.read(1024)
            await sio.emit("logs", {"data": data.decode("utf-8").rstrip()})
            # await sio.emit("config", {"data": config_data.decode("utf-8").rstrip()})
        except KeyboardInterrupt:
            print("Close the connection")
            writer.close()
            # config_writer.close()
            await writer.wait_closed()
            # await config_writer.wait_closed()
            break


async def index(request):
    with open("app.html") as f:
        return web.Response(text=f.read(), content_type="text/html")


@sio.event
async def my_event(sid, message):
    await sio.emit("my_response", {"data": message["data"]}, room=sid)


@sio.event
async def my_broadcast_event(sid, message):
    await sio.emit("my_response", {"data": message["data"]})


@sio.event
async def join(sid, message):
    sio.enter_room(sid, message["room"])
    await sio.emit(
        "my_response", {"data": "Entered room: " + message["room"]}, room=sid
    )


@sio.event
async def leave(sid, message):
    sio.leave_room(sid, message["room"])
    await sio.emit("my_response", {"data": "Left room: " + message["room"]}, room=sid)


@sio.event
async def close_room(sid, message):
    await sio.emit(
        "my_response",
        {"data": "Room " + message["room"] + " is closing."},
        room=message["room"],
    )
    await sio.close_room(message["room"])


@sio.event
async def my_room_event(sid, message):
    await sio.emit("my_response", {"data": message["data"]}, room=message["room"])


@sio.event
async def disconnect_request(sid):
    await sio.disconnect(sid)


@sio.event
async def connect(sid, environ):
    await sio.emit("my_response", {"data": "Connected", "count": 0}, room=sid)


@sio.event
def disconnect(sid):
    print("Client disconnected")


# app.router.add_static("/static", "static")
app.router.add_get("/", index)


async def init_app():
    sio.start_background_task(background_task)
    return app


if __name__ == "__main__":
    web.run_app(init_app(), port=3030)
