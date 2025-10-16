from flask import Blueprint, request, jsonify
from ..models import db, Question, Answer, Category, User, UserAttempt, PracticeSession, SessionQuestion
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import random

bp = Blueprint('qbank', __name__)

# Category Management
@bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        'id': cat.id,
        'name': cat.name,
        'description': cat.description,
        'color': cat.color,
        'question_count': len(cat.questions)
    } for cat in categories])

@bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    data = request.get_json()
    category = Category(
        name=data['name'],
        description=data.get('description', ''),
        color=data.get('color', '#6366f1')
    )
    db.session.add(category)
    db.session.commit()
    return jsonify({'id': category.id, 'message': 'Category created successfully'}), 201

# Question Management
@bp.route('/questions', methods=['GET'])
def get_questions():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    category_id = request.args.get('category_id', type=int)
    difficulty = request.args.get('difficulty')
    question_type = request.args.get('type')
    
    query = Question.query
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    if difficulty:
        query = query.filter_by(difficulty=difficulty)
    if question_type:
        query = query.filter_by(question_type=question_type)
    
    questions = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'questions': [{
            'id': q.id,
            'question_text': q.question_text,
            'question_type': q.question_type,
            'difficulty': q.difficulty,
            'points': q.points,
            'category': {
                'id': q.category.id,
                'name': q.category.name
            },
            'tags': q.tags.split(',') if q.tags else [],
            'answer_count': len(q.answers)
        } for q in questions.items],
        'total': questions.total,
        'pages': questions.pages,
        'current_page': page
    })

@bp.route('/questions/<int:question_id>', methods=['GET'])
def get_question(question_id):
    question = Question.query.get_or_404(question_id)
    return jsonify({
        'id': question.id,
        'question_text': question.question_text,
        'question_type': question.question_type,
        'difficulty': question.difficulty,
        'points': question.points,
        'explanation': question.explanation,
        'category': {
            'id': question.category.id,
            'name': question.category.name
        },
        'tags': question.tags.split(',') if question.tags else [],
        'answers': [{
            'id': a.id,
            'answer_text': a.answer_text,
            'is_correct': a.is_correct,
            'explanation': a.explanation,
            'order': a.order
        } for a in question.answers]
    })

@bp.route('/questions', methods=['POST'])
@jwt_required()
def create_question():
    data = request.get_json()
    
    question = Question(
        question_text=data['question_text'],
        question_type=data['question_type'],
        difficulty=data['difficulty'],
        points=data.get('points', 1),
        explanation=data.get('explanation', ''),
        tags=','.join(data.get('tags', [])),
        category_id=data['category_id']
    )
    
    db.session.add(question)
    db.session.flush()  # Get the question ID
    
    # Add answers
    for answer_data in data.get('answers', []):
        answer = Answer(
            answer_text=answer_data['answer_text'],
            is_correct=answer_data.get('is_correct', False),
            explanation=answer_data.get('explanation', ''),
            question_id=question.id,
            order=answer_data.get('order', 0)
        )
        db.session.add(answer)
    
    db.session.commit()
    return jsonify({'id': question.id, 'message': 'Question created successfully'}), 201

@bp.route('/questions/<int:question_id>', methods=['PUT'])
@jwt_required()
def update_question(question_id):
    question = Question.query.get_or_404(question_id)
    data = request.get_json()
    
    question.question_text = data.get('question_text', question.question_text)
    question.question_type = data.get('question_type', question.question_type)
    question.difficulty = data.get('difficulty', question.difficulty)
    question.points = data.get('points', question.points)
    question.explanation = data.get('explanation', question.explanation)
    question.tags = ','.join(data.get('tags', [])) if data.get('tags') else question.tags
    question.category_id = data.get('category_id', question.category_id)
    question.updated_at = datetime.utcnow()
    
    # Update answers
    if 'answers' in data:
        # Delete existing answers
        Answer.query.filter_by(question_id=question_id).delete()
        
        # Add new answers
        for answer_data in data['answers']:
            answer = Answer(
                answer_text=answer_data['answer_text'],
                is_correct=answer_data.get('is_correct', False),
                explanation=answer_data.get('explanation', ''),
                question_id=question.id,
                order=answer_data.get('order', 0)
            )
            db.session.add(answer)
    
    db.session.commit()
    return jsonify({'message': 'Question updated successfully'})

@bp.route('/questions/<int:question_id>', methods=['DELETE'])
@jwt_required()
def delete_question(question_id):
    question = Question.query.get_or_404(question_id)
    db.session.delete(question)
    db.session.commit()
    return jsonify({'message': 'Question deleted successfully'})

# Practice Session Management
@bp.route('/practice/start', methods=['POST'])
@jwt_required()
def start_practice_session():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Get questions based on criteria
    query = Question.query
    if data.get('category_id'):
        query = query.filter_by(category_id=data['category_id'])
    if data.get('difficulty'):
        query = query.filter_by(difficulty=data['difficulty'])
    if data.get('question_type'):
        query = query.filter_by(question_type=data['question_type'])
    
    # Get random questions
    all_questions = query.all()
    total_questions = min(data.get('total_questions', 10), len(all_questions))
    selected_questions = random.sample(all_questions, total_questions)
    
    # Create practice session
    session = PracticeSession(
        user_id=user_id,
        session_type=data.get('session_type', 'practice'),
        category_id=data.get('category_id'),
        difficulty=data.get('difficulty'),
        total_questions=total_questions
    )
    db.session.add(session)
    db.session.flush()
    
    # Add questions to session
    for i, question in enumerate(selected_questions):
        session_question = SessionQuestion(
            session_id=session.id,
            question_id=question.id,
            order=i + 1
        )
        db.session.add(session_question)
    
    db.session.commit()
    
    return jsonify({
        'session_id': session.id,
        'total_questions': total_questions,
        'questions': [{
            'id': q.id,
            'question_text': q.question_text,
            'question_type': q.question_type,
            'difficulty': q.difficulty,
            'points': q.points,
            'answers': [{
                'id': a.id,
                'answer_text': a.answer_text,
                'order': a.order
            } for a in q.answers] if data.get('session_type') != 'exam' else []
        } for q in selected_questions]
    })

@bp.route('/practice/<int:session_id>/answer', methods=['POST'])
@jwt_required()
def submit_answer(session_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    session = PracticeSession.query.get_or_404(session_id)
    if session.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    question = Question.query.get_or_404(data['question_id'])
    session_question = SessionQuestion.query.filter_by(
        session_id=session_id, 
        question_id=data['question_id']
    ).first()
    
    if not session_question:
        return jsonify({'error': 'Question not in session'}), 400
    
    # Determine if answer is correct
    is_correct = False
    if question.question_type == 'multiple_choice':
        selected_answer = Answer.query.get(data.get('selected_answer_id'))
        is_correct = selected_answer and selected_answer.is_correct
    elif question.question_type == 'true_false':
        correct_answer = Answer.query.filter_by(question_id=question.id, is_correct=True).first()
        is_correct = correct_answer and str(correct_answer.answer_text).lower() == str(data.get('user_answer')).lower()
    elif question.question_type == 'fill_blank':
        correct_answer = Answer.query.filter_by(question_id=question.id, is_correct=True).first()
        is_correct = correct_answer and correct_answer.answer_text.lower().strip() == data.get('user_answer', '').lower().strip()
    
    # Record attempt
    attempt = UserAttempt(
        user_id=user_id,
        question_id=question.id,
        selected_answer_id=data.get('selected_answer_id'),
        user_answer_text=data.get('user_answer'),
        is_correct=is_correct,
        time_spent=data.get('time_spent', 0)
    )
    db.session.add(attempt)
    
    # Update session question
    session_question.is_answered = True
    session_question.is_correct = is_correct
    session_question.time_spent = data.get('time_spent', 0)
    session_question.answered_at = datetime.utcnow()
    
    # Update session score
    if is_correct:
        session.correct_answers += 1
    session.score = (session.correct_answers / session.total_questions) * 100
    
    db.session.commit()
    
    return jsonify({
        'is_correct': is_correct,
        'explanation': question.explanation,
        'correct_answer': {
            'id': correct_answer.id,
            'answer_text': correct_answer.answer_text,
            'explanation': correct_answer.explanation
        } if question.question_type in ['multiple_choice', 'true_false'] and correct_answer else None
    })

@bp.route('/practice/<int:session_id>/complete', methods=['POST'])
@jwt_required()
def complete_practice_session(session_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    session = PracticeSession.query.get_or_404(session_id)
    if session.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    session.is_completed = True
    session.completed_at = datetime.utcnow()
    session.time_spent = data.get('total_time_spent', 0)
    
    db.session.commit()
    
    return jsonify({
        'session_id': session.id,
        'score': session.score,
        'correct_answers': session.correct_answers,
        'total_questions': session.total_questions,
        'time_spent': session.time_spent
    })

@bp.route('/practice/<int:session_id>', methods=['GET'])
@jwt_required()
def get_practice_session(session_id):
    user_id = get_jwt_identity()
    session = PracticeSession.query.get_or_404(session_id)
    
    if session.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify({
        'id': session.id,
        'session_type': session.session_type,
        'total_questions': session.total_questions,
        'correct_answers': session.correct_answers,
        'score': session.score,
        'time_spent': session.time_spent,
        'is_completed': session.is_completed,
        'started_at': session.started_at.isoformat(),
        'completed_at': session.completed_at.isoformat() if session.completed_at else None
    })

# Analytics and Progress
@bp.route('/analytics/progress', methods=['GET'])
@jwt_required()
def get_user_progress():
    user_id = get_jwt_identity()
    
    # Get completed sessions
    sessions = PracticeSession.query.filter_by(user_id=user_id, is_completed=True).all()
    
    # Calculate statistics
    total_sessions = len(sessions)
    average_score = sum(s.score for s in sessions) / total_sessions if total_sessions > 0 else 0
    total_questions = sum(s.total_questions for s in sessions)
    total_correct = sum(s.correct_answers for s in sessions)
    
    # Get category performance
    category_stats = {}
    for session in sessions:
        if session.category_id:
            cat = Category.query.get(session.category_id)
            if cat:
                if cat.name not in category_stats:
                    category_stats[cat.name] = {'sessions': 0, 'total_score': 0}
                category_stats[cat.name]['sessions'] += 1
                category_stats[cat.name]['total_score'] += session.score
    
    for cat_name in category_stats:
        category_stats[cat_name]['average_score'] = category_stats[cat_name]['total_score'] / category_stats[cat_name]['sessions']
    
    return jsonify({
        'total_sessions': total_sessions,
        'average_score': round(average_score, 2),
        'total_questions': total_questions,
        'total_correct': total_correct,
        'accuracy': round((total_correct / total_questions) * 100, 2) if total_questions > 0 else 0,
        'category_performance': category_stats
    })

@bp.route('/analytics/recent-sessions', methods=['GET'])
@jwt_required()
def get_recent_sessions():
    user_id = get_jwt_identity()
    limit = request.args.get('limit', 10, type=int)
    
    sessions = PracticeSession.query.filter_by(user_id=user_id, is_completed=True)\
        .order_by(PracticeSession.completed_at.desc())\
        .limit(limit).all()
    
    return jsonify([{
        'id': s.id,
        'session_type': s.session_type,
        'score': s.score,
        'total_questions': s.total_questions,
        'correct_answers': s.correct_answers,
        'time_spent': s.time_spent,
        'completed_at': s.completed_at.isoformat(),
        'category': s.category.name if s.category else None
    } for s in sessions])
