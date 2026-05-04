from datetime import datetime

from sqlalchemy import Column, ForeignKey, Integer, String, Text

from app.db.session import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    contest_id = Column(Integer, ForeignKey("contests.id"), nullable=True)
    language = Column(String, nullable=False)
    source_code = Column(Text, nullable=False)
    verdict = Column(String, default="Pending")
    created_at = Column(String, default=lambda: datetime.now().isoformat(timespec="seconds"))
