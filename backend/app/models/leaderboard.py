from sqlalchemy import Column, ForeignKey, Integer, String

from app.db.session import Base


class Leaderboard(Base):
    __tablename__ = "leaderboards"

    id = Column(Integer, primary_key=True, index=True)
    contest_id = Column(Integer, ForeignKey("contests.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    username = Column(String, nullable=False)
    solved = Column(Integer, default=0)
    penalty = Column(Integer, default=0)
    rank = Column(Integer, default=0)