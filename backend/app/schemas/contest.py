from pydantic import BaseModel


class ContestBase(BaseModel):
    title: str
    description: str | None = None
    start_time: str
    end_time: str
    status: str = "Upcoming"


class ContestCreate(ContestBase):
    pass


class ContestUpdate(ContestBase):
    pass


class ContestResponse(ContestBase):
    id: int

    model_config = {
        "from_attributes": True
    }