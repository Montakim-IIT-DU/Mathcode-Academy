from pydantic import BaseModel


class LeaderboardBase(BaseModel):
    contest_id: int
    user_id: int
    username: str
    solved: int = 0
    penalty: int = 0
    rank: int = 0


class LeaderboardCreate(LeaderboardBase):
    pass


class LeaderboardResponse(LeaderboardBase):
    id: int

    model_config = {
        "from_attributes": True
    }