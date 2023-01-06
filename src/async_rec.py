import asyncio


async def reader():
    reader, writer = await asyncio.open_connection("127.0.0.1", 9000)

    while True:
        try:
            data = await reader.read(1024)
            print(data.decode())

        except KeyboardInterrupt:
            print("Close the connection")
            writer.close()
            await writer.wait_closed()
            break


asyncio.run(reader())
