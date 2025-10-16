#!/usr/bin/env python3
"""
Sample data script for Primary Q-Bank
Creates sample categories and questions for testing
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import Category, Question, Answer, User
from flask_bcrypt import Bcrypt

def create_sample_data():
    app = create_app()
    bcrypt = Bcrypt()
    
    with app.app_context():
        # Create sample user
        user = User.query.filter_by(email='test@example.com').first()
        if not user:
            user = User(
                email='test@example.com',
                password_hash=bcrypt.generate_password_hash('password123').decode('utf-8'),
                first_name='Test',
                last_name='User'
            )
            db.session.add(user)
            db.session.commit()
            print("Created test user: test@example.com / password123")
        
        # Create sample categories
        categories_data = [
            {
                'name': 'Mathematics',
                'description': 'Algebra, geometry, calculus, and statistics questions',
                'color': '#3b82f6'
            },
            {
                'name': 'Science',
                'description': 'Physics, chemistry, biology, and earth science questions',
                'color': '#10b981'
            },
            {
                'name': 'English Language',
                'description': 'Grammar, vocabulary, reading comprehension, and writing',
                'color': '#f59e0b'
            },
            {
                'name': 'History',
                'description': 'World history, US history, and historical analysis',
                'color': '#8b5cf6'
            },
            {
                'name': 'Computer Science',
                'description': 'Programming, algorithms, data structures, and software engineering',
                'color': '#06b6d4'
            }
        ]
        
        for cat_data in categories_data:
            category = Category.query.filter_by(name=cat_data['name']).first()
            if not category:
                category = Category(**cat_data)
                db.session.add(category)
                db.session.commit()
                print(f"Created category: {cat_data['name']}")
        
        # Create sample questions
        questions_data = [
            # Mathematics Questions
            {
                'question_text': 'What is the derivative of x²?',
                'question_type': 'multiple_choice',
                'difficulty': 'easy',
                'points': 1,
                'explanation': 'The derivative of x² is 2x using the power rule: d/dx(x^n) = nx^(n-1)',
                'tags': 'calculus,derivatives,power rule',
                'category_name': 'Mathematics',
                'answers': [
                    {'answer_text': '2x', 'is_correct': True, 'explanation': 'Correct! Using the power rule: d/dx(x²) = 2x'},
                    {'answer_text': 'x', 'is_correct': False, 'explanation': 'Incorrect. The power rule gives us 2x, not x'},
                    {'answer_text': '2x²', 'is_correct': False, 'explanation': 'Incorrect. The derivative reduces the power by 1'},
                    {'answer_text': 'x²', 'is_correct': False, 'explanation': 'Incorrect. The derivative of x² is not x² itself'}
                ]
            },
            {
                'question_text': 'What is the area of a circle with radius 5?',
                'question_type': 'multiple_choice',
                'difficulty': 'medium',
                'points': 2,
                'explanation': 'The area of a circle is πr². With radius 5, the area is π(5)² = 25π',
                'tags': 'geometry,area,circle',
                'category_name': 'Mathematics',
                'answers': [
                    {'answer_text': '25π', 'is_correct': True, 'explanation': 'Correct! A = πr² = π(5)² = 25π'},
                    {'answer_text': '10π', 'is_correct': False, 'explanation': 'Incorrect. This would be the circumference, not the area'},
                    {'answer_text': '50π', 'is_correct': False, 'explanation': 'Incorrect. You may have used diameter instead of radius'},
                    {'answer_text': '5π', 'is_correct': False, 'explanation': 'Incorrect. The area formula is πr², not πr'}
                ]
            },
            {
                'question_text': 'Solve for x: 2x + 5 = 13',
                'question_type': 'fill_blank',
                'difficulty': 'easy',
                'points': 1,
                'explanation': 'Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4',
                'tags': 'algebra,linear equations',
                'category_name': 'Mathematics',
                'answers': [
                    {'answer_text': '4', 'is_correct': True, 'explanation': 'Correct! 2(4) + 5 = 8 + 5 = 13'}
                ]
            },
            
            # Science Questions
            {
                'question_text': 'What is the chemical symbol for gold?',
                'question_type': 'multiple_choice',
                'difficulty': 'easy',
                'points': 1,
                'explanation': 'Gold has the chemical symbol Au, derived from the Latin word "aurum"',
                'tags': 'chemistry,periodic table,elements',
                'category_name': 'Science',
                'answers': [
                    {'answer_text': 'Au', 'is_correct': True, 'explanation': 'Correct! Au comes from the Latin "aurum"'},
                    {'answer_text': 'Go', 'is_correct': False, 'explanation': 'Incorrect. Gold is not abbreviated as Go'},
                    {'answer_text': 'Gd', 'is_correct': False, 'explanation': 'Incorrect. Gd is the symbol for Gadolinium'},
                    {'answer_text': 'Ag', 'is_correct': False, 'explanation': 'Incorrect. Ag is the symbol for Silver'}
                ]
            },
            {
                'question_text': 'The speed of light in a vacuum is approximately 3 × 10⁸ m/s.',
                'question_type': 'true_false',
                'difficulty': 'easy',
                'points': 1,
                'explanation': 'True. The speed of light in a vacuum is exactly 299,792,458 m/s, which is approximately 3 × 10⁸ m/s',
                'tags': 'physics,light,speed',
                'category_name': 'Science',
                'answers': [
                    {'answer_text': 'True', 'is_correct': True, 'explanation': 'Correct! The speed of light in vacuum is approximately 3 × 10⁸ m/s'},
                    {'answer_text': 'False', 'is_correct': False, 'explanation': 'Incorrect. This is a fundamental constant in physics'}
                ]
            },
            {
                'question_text': 'What is the powerhouse of the cell?',
                'question_type': 'fill_blank',
                'difficulty': 'easy',
                'points': 1,
                'explanation': 'Mitochondria are known as the powerhouse of the cell because they produce ATP, the energy currency of the cell',
                'tags': 'biology,cell biology,mitochondria',
                'category_name': 'Science',
                'answers': [
                    {'answer_text': 'mitochondria', 'is_correct': True, 'explanation': 'Correct! Mitochondria produce ATP through cellular respiration'},
                    {'answer_text': 'mitochondrion', 'is_correct': True, 'explanation': 'Correct! Mitochondrion is the singular form of mitochondria'}
                ]
            },
            
            # English Language Questions
            {
                'question_text': 'Which of the following is a proper noun?',
                'question_type': 'multiple_choice',
                'difficulty': 'easy',
                'points': 1,
                'explanation': 'A proper noun names a specific person, place, or thing and is always capitalized',
                'tags': 'grammar,nouns,proper nouns',
                'category_name': 'English Language',
                'answers': [
                    {'answer_text': 'New York', 'is_correct': True, 'explanation': 'Correct! New York is a specific city name'},
                    {'answer_text': 'city', 'is_correct': False, 'explanation': 'Incorrect. "City" is a common noun'},
                    {'answer_text': 'building', 'is_correct': False, 'explanation': 'Incorrect. "Building" is a common noun'},
                    {'answer_text': 'street', 'is_correct': False, 'explanation': 'Incorrect. "Street" is a common noun'}
                ]
            },
            {
                'question_text': 'The word "run" can function as both a noun and a verb.',
                'question_type': 'true_false',
                'difficulty': 'medium',
                'points': 2,
                'explanation': 'True. "Run" can be a verb (I run every morning) or a noun (I went for a run)',
                'tags': 'grammar,parts of speech,homonyms',
                'category_name': 'English Language',
                'answers': [
                    {'answer_text': 'True', 'is_correct': True, 'explanation': 'Correct! Many English words can function as multiple parts of speech'},
                    {'answer_text': 'False', 'is_correct': False, 'explanation': 'Incorrect. "Run" is indeed both a noun and a verb'}
                ]
            },
            
            # History Questions
            {
                'question_text': 'Who was the first President of the United States?',
                'question_type': 'multiple_choice',
                'difficulty': 'easy',
                'points': 1,
                'explanation': 'George Washington was unanimously elected as the first President of the United States in 1789',
                'tags': 'US history,presidents,revolutionary war',
                'category_name': 'History',
                'answers': [
                    {'answer_text': 'George Washington', 'is_correct': True, 'explanation': 'Correct! Washington served from 1789-1797'},
                    {'answer_text': 'John Adams', 'is_correct': False, 'explanation': 'Incorrect. Adams was the second president'},
                    {'answer_text': 'Thomas Jefferson', 'is_correct': False, 'explanation': 'Incorrect. Jefferson was the third president'},
                    {'answer_text': 'Benjamin Franklin', 'is_correct': False, 'explanation': 'Incorrect. Franklin never served as president'}
                ]
            },
            {
                'question_text': 'The Renaissance began in Italy during the 14th century.',
                'question_type': 'true_false',
                'difficulty': 'medium',
                'points': 2,
                'explanation': 'True. The Renaissance began in Italy around the 14th century and spread throughout Europe',
                'tags': 'world history,renaissance,italy',
                'category_name': 'History',
                'answers': [
                    {'answer_text': 'True', 'is_correct': True, 'explanation': 'Correct! The Renaissance started in Italy in the 14th century'},
                    {'answer_text': 'False', 'is_correct': False, 'explanation': 'Incorrect. The Renaissance did begin in Italy during the 14th century'}
                ]
            },
            
            # Computer Science Questions
            {
                'question_text': 'What does HTML stand for?',
                'question_type': 'multiple_choice',
                'difficulty': 'easy',
                'points': 1,
                'explanation': 'HTML stands for HyperText Markup Language, the standard markup language for web pages',
                'tags': 'web development,html,markup',
                'category_name': 'Computer Science',
                'answers': [
                    {'answer_text': 'HyperText Markup Language', 'is_correct': True, 'explanation': 'Correct! HTML is the standard markup language for web pages'},
                    {'answer_text': 'High Tech Modern Language', 'is_correct': False, 'explanation': 'Incorrect. HTML stands for HyperText Markup Language'},
                    {'answer_text': 'Home Tool Markup Language', 'is_correct': False, 'explanation': 'Incorrect. HTML stands for HyperText Markup Language'},
                    {'answer_text': 'Hyperlink and Text Markup Language', 'is_correct': False, 'explanation': 'Incorrect. HTML stands for HyperText Markup Language'}
                ]
            },
            {
                'question_text': 'In programming, a variable is a storage location with an associated name.',
                'question_type': 'true_false',
                'difficulty': 'easy',
                'points': 1,
                'explanation': 'True. A variable is a storage location paired with an associated symbolic name that contains some known or unknown quantity of information',
                'tags': 'programming,variables,computer science',
                'category_name': 'Computer Science',
                'answers': [
                    {'answer_text': 'True', 'is_correct': True, 'explanation': 'Correct! Variables are named storage locations for data'},
                    {'answer_text': 'False', 'is_correct': False, 'explanation': 'Incorrect. Variables are indeed storage locations with associated names'}
                ]
            },
            {
                'question_text': 'What is the time complexity of binary search?',
                'question_type': 'fill_blank',
                'difficulty': 'hard',
                'points': 3,
                'explanation': 'Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step',
                'tags': 'algorithms,time complexity,binary search',
                'category_name': 'Computer Science',
                'answers': [
                    {'answer_text': 'O(log n)', 'is_correct': True, 'explanation': 'Correct! Binary search eliminates half the elements each iteration'},
                    {'answer_text': 'O(log n)', 'is_correct': True, 'explanation': 'Correct! Binary search has logarithmic time complexity'},
                    {'answer_text': 'logarithmic', 'is_correct': True, 'explanation': 'Correct! Binary search has logarithmic time complexity'},
                    {'answer_text': 'log n', 'is_correct': True, 'explanation': 'Correct! Binary search has O(log n) time complexity'}
                ]
            }
        ]
        
        # Create questions and answers
        for q_data in questions_data:
            # Get category
            category = Category.query.filter_by(name=q_data['category_name']).first()
            if not category:
                print(f"Category {q_data['category_name']} not found, skipping question")
                continue
            
            # Check if question already exists
            existing_question = Question.query.filter_by(question_text=q_data['question_text']).first()
            if existing_question:
                print(f"Question already exists: {q_data['question_text'][:50]}...")
                continue
            
            # Create question
            question = Question(
                question_text=q_data['question_text'],
                question_type=q_data['question_type'],
                difficulty=q_data['difficulty'],
                points=q_data['points'],
                explanation=q_data['explanation'],
                tags=q_data['tags'],
                category_id=category.id
            )
            db.session.add(question)
            db.session.flush()  # Get the question ID
            
            # Create answers
            for i, answer_data in enumerate(q_data['answers']):
                answer = Answer(
                    answer_text=answer_data['answer_text'],
                    is_correct=answer_data['is_correct'],
                    explanation=answer_data.get('explanation', ''),
                    question_id=question.id,
                    order=i
                )
                db.session.add(answer)
            
            print(f"Created question: {q_data['question_text'][:50]}...")
        
        db.session.commit()
        print("\nSample data creation completed!")
        print(f"Created {len(questions_data)} questions across {len(categories_data)} categories")

if __name__ == '__main__':
    create_sample_data()
