import socket
import threading

def receive_messages(sock):
    while True:
        try:
            msg = sock.recv(1024).decode()
            print(msg)
        except:
            break

def start_client():
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect(("192.168.0.117", 5555))

    thread = threading.Thread(target=receive_messages, args=(client,))
    thread.start()

    while True:
        msg = input("")
        client.send(msg.encode())

start_client()
