#!/usr/bin/env python3

import socket
import os
import sys


def Main():
    host = "127.0.0.1"
    port = 9000

    s = socket.socket()
    s.connect((host, port))
    try:
        while True:
            data = s.recv(1024).decode("utf-8")
            print(data, end="")
    except KeyboardInterrupt:
        s.close()


if __name__ == "__main__":
    Main()
