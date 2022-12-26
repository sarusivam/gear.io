import asyncio
import websockets

all_clients = []

async def send_message(message : str):
    for client in all_clients:
        await client.send(message)

async def new_client_connected(client_scoket, path):
    print('New client !')
    all_clients.append(client_scoket)

    while True:
        new_message = await client_scoket.recv()
        print('Client sent : ', new_message)
        await send_message(new_message)

async def start_server():
    print('SERVER STARTED')
    await websockets.serve(new_client_connected, 'localhost', 12345)

if __name__ == '__main__':
    event_loop = asyncio.get_event_loop()
    event_loop.run_until_complete(start_server())
    event_loop.run_forever()
