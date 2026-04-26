from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint

from app.db.session import Base


class ContestParticipant(Base):
    __tablename__ = "contest_participants"
    __table_args__ = (
        UniqueConstraint("contest_id", "user_id", name="uq_contest_participant"),
    )

    id = Column(Integer, primary_key=True, index=True)
    contest_id = Column(Integer, ForeignKey("contests.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
