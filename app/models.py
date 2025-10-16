from . import db
from datetime import datetime

class Store(db.Model):
    __tablename__ = 'stores'
    id = db.Column(db.Integer, primary_key=True)
    owner_email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    store_name = db.Column(db.String(150), nullable=False)
    # Subscription fields for future use
    stripe_customer_id = db.Column(db.String(255), nullable=True)
    subscription_status = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Q-Bank Models
class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    color = db.Column(db.String(7), default='#6366f1')  # Hex color for UI
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    questions = db.relationship('Question', backref='category', lazy=True)

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(20), nullable=False)  # 'multiple_choice', 'true_false', 'fill_blank', 'essay'
    difficulty = db.Column(db.String(10), nullable=False)  # 'easy', 'medium', 'hard'
    points = db.Column(db.Integer, default=1)
    explanation = db.Column(db.Text, nullable=True)
    tags = db.Column(db.String(500), nullable=True)  # Comma-separated tags
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    answers = db.relationship('Answer', backref='question', lazy=True, cascade='all, delete-orphan')
    user_attempts = db.relationship('UserAttempt', backref='question', lazy=True)

class Answer(db.Model):
    __tablename__ = 'answers'
    id = db.Column(db.Integer, primary_key=True)
    answer_text = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.Boolean, default=False)
    explanation = db.Column(db.Text, nullable=True)  # Specific explanation for this answer
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    order = db.Column(db.Integer, default=0)  # For ordering multiple choice options

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    attempts = db.relationship('UserAttempt', backref='user', lazy=True)
    practice_sessions = db.relationship('PracticeSession', backref='user', lazy=True)

class UserAttempt(db.Model):
    __tablename__ = 'user_attempts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    selected_answer_id = db.Column(db.Integer, db.ForeignKey('answers.id'), nullable=True)
    user_answer_text = db.Column(db.Text, nullable=True)  # For fill-in-the-blank or essay
    is_correct = db.Column(db.Boolean, nullable=False)
    time_spent = db.Column(db.Integer, default=0)  # Time in seconds
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)

class PracticeSession(db.Model):
    __tablename__ = 'practice_sessions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_type = db.Column(db.String(20), nullable=False)  # 'practice', 'exam', 'review'
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    difficulty = db.Column(db.String(10), nullable=True)
    total_questions = db.Column(db.Integer, nullable=False)
    correct_answers = db.Column(db.Integer, default=0)
    score = db.Column(db.Float, default=0.0)  # Percentage score
    time_spent = db.Column(db.Integer, default=0)  # Total time in seconds
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    is_completed = db.Column(db.Boolean, default=False)
    
    # Relationships
    session_questions = db.relationship('SessionQuestion', backref='practice_session', lazy=True, cascade='all, delete-orphan')

class SessionQuestion(db.Model):
    __tablename__ = 'session_questions'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('practice_sessions.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    order = db.Column(db.Integer, nullable=False)
    is_answered = db.Column(db.Boolean, default=False)
    is_correct = db.Column(db.Boolean, nullable=True)
    time_spent = db.Column(db.Integer, default=0)
    answered_at = db.Column(db.DateTime, nullable=True)
