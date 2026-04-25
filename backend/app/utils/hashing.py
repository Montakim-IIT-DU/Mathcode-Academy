import binascii
import hashlib
import os
import secrets


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100_000,
    )
    return f"{binascii.hexlify(salt).decode()}:{binascii.hexlify(password_hash).decode()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        salt_hex, stored_hash_hex = hashed_password.split(":")
        salt = binascii.unhexlify(salt_hex.encode())
        password_hash = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt,
            100_000,
        )
        computed_hash_hex = binascii.hexlify(password_hash).decode()
        return secrets.compare_digest(computed_hash_hex, stored_hash_hex)
    except ValueError:
        return False