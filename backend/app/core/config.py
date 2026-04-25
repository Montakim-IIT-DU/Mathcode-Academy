from pydantic import BaseModel


class Settings(BaseModel):
    PROJECT_NAME: str = "Mathcode Academy API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    SECRET_KEY: str = "mathcode-academy-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    BACKEND_HOST: str = "127.0.0.1"
    BACKEND_PORT: int = 8000


settings = Settings()