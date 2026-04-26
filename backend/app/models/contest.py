from sqlalchemy import Column, Integer, String, Text

from app.db.session import Base


class Contest(Base):
    __tablename__ = "contests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    contest_type = Column(String, default="Online", nullable=False)
    venue = Column(String, nullable=True)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    status = Column(String, default="Upcoming")
