from sqlalchemy import Column, Integer, String, Text

from app.db.session import Base


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    statement = Column(Text, nullable=False)
    difficulty = Column(String, default="Easy")
    topic = Column(String, default="General", nullable=False)
    time_limit = Column(Integer, default=1)
    memory_limit = Column(Integer, default=256)
    tags = Column(String, nullable=True)
