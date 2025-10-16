# Primary Q-Bank
## The Gold Standard Q-Bank for Exam-Style Practice

Primary Q-Bank is a comprehensive, educational question bank system designed to provide exam-style practice with detailed explanations and progress tracking. Built with Flask and modern web technologies, it offers an intuitive interface for both students and educators.

## 🌟 Features

### Core Functionality
- **Multiple Question Types**: Multiple choice, true/false, and fill-in-the-blank questions
- **Educational Explanations**: Detailed explanations for both correct and incorrect answers
- **Practice Modes**: Flexible practice sessions with customizable settings
- **Exam Simulation**: Timed exam mode that mimics real testing conditions
- **Progress Tracking**: Comprehensive analytics and performance monitoring
- **Category Management**: Organized question categories with color coding
- **User Management**: Secure authentication and user profiles

### Question Management
- **CRUD Operations**: Create, read, update, and delete questions
- **Answer Management**: Multiple answer options with individual explanations
- **Difficulty Levels**: Easy, medium, and hard difficulty classifications
- **Tagging System**: Flexible tagging for question organization
- **Point System**: Configurable point values for questions

### Analytics & Reporting
- **Performance Dashboard**: Real-time statistics and progress tracking
- **Category Performance**: Detailed breakdown by subject area
- **Session History**: Complete history of practice and exam sessions
- **Time Tracking**: Monitor time spent on questions and sessions
- **Score Analytics**: Average scores, accuracy rates, and improvement trends

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- PostgreSQL (or SQLite for development)
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd primary-qbank
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the database**
   ```bash
   # For PostgreSQL
   createdb qbank_db
   
   # Update database configuration in app/__init__.py
   ```

4. **Run the application**
   ```bash
   python run_qbank.py
   ```

5. **Populate with sample data**
   ```bash
   python sample_data.py
   ```

6. **Access the application**
   - Open your browser to `http://localhost:5000`
   - Use the Q-Bank interface at `http://localhost:5000/qbank.html`

## 📚 API Documentation

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Categories
- `GET /qbank/categories` - List all categories
- `POST /qbank/categories` - Create a new category

### Questions
- `GET /qbank/questions` - List questions with filtering
- `GET /qbank/questions/<id>` - Get a specific question
- `POST /qbank/questions` - Create a new question
- `PUT /qbank/questions/<id>` - Update a question
- `DELETE /qbank/questions/<id>` - Delete a question

### Practice Sessions
- `POST /qbank/practice/start` - Start a new practice session
- `POST /qbank/practice/<id>/answer` - Submit an answer
- `POST /qbank/practice/<id>/complete` - Complete a session
- `GET /qbank/practice/<id>` - Get session details

### Analytics
- `GET /qbank/analytics/progress` - Get user progress statistics
- `GET /qbank/analytics/recent-sessions` - Get recent session history

## 🎯 Usage Examples

### Starting a Practice Session
```javascript
const response = await fetch('/qbank/practice/start', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        category_id: 1,
        difficulty: 'medium',
        question_type: 'multiple_choice',
        total_questions: 10,
        session_type: 'practice'
    })
});
```

### Submitting an Answer
```javascript
const response = await fetch('/qbank/practice/123/answer', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        question_id: 456,
        selected_answer_id: 789,
        user_answer: 'My answer',
        time_spent: 30
    })
});
```

## 🏗️ Architecture

### Backend (Flask)
- **Models**: SQLAlchemy ORM models for data persistence
- **Routes**: RESTful API endpoints for all operations
- **Authentication**: JWT-based authentication system
- **Database**: PostgreSQL with SQLAlchemy ORM

### Frontend (Vanilla JavaScript)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive UI**: Dynamic question rendering and answer selection
- **Real-time Updates**: Live progress tracking and score updates
- **Accessibility**: Keyboard navigation and screen reader support

### Database Schema
- **Users**: User accounts and authentication
- **Categories**: Question categories and organization
- **Questions**: Question content and metadata
- **Answers**: Answer options and correctness
- **Sessions**: Practice and exam session tracking
- **Attempts**: Individual answer attempts and scoring

## 🔧 Configuration

### Environment Variables
```bash
# Database
SQLALCHEMY_DATABASE_URI=postgresql://user:password@localhost/qbank_db

# JWT Secret
JWT_SECRET_KEY=your-secret-key-here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

### Database Configuration
Update the database URI in `app/__init__.py`:
```python
app.config.from_mapping(
    SQLALCHEMY_DATABASE_URI='postgresql://user:password@localhost/qbank_db',
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    JWT_SECRET_KEY='your-secret-key',
)
```

## 📊 Sample Data

The system comes with comprehensive sample data including:
- **5 Categories**: Mathematics, Science, English Language, History, Computer Science
- **15+ Questions**: Covering all question types and difficulty levels
- **Educational Explanations**: Detailed explanations for learning
- **Test User**: Ready-to-use test account (test@example.com / password123)

## 🎨 Customization

### Adding New Question Types
1. Update the `question_type` enum in the Question model
2. Add rendering logic in the frontend `renderAnswerOptions()` function
3. Update answer validation in the backend `submit_answer()` function

### Customizing the UI
- Modify CSS classes in the HTML templates
- Update Tailwind CSS configuration
- Customize color schemes and branding

### Extending Analytics
- Add new metrics to the `get_user_progress()` function
- Create additional dashboard widgets
- Implement custom reporting features

## 🚀 Deployment

### Production Setup
1. **Configure Production Database**
   ```bash
   # Set up PostgreSQL production database
   createdb qbank_production
   ```

2. **Set Environment Variables**
   ```bash
   export FLASK_ENV=production
   export SQLALCHEMY_DATABASE_URI=postgresql://user:pass@host/db
   export JWT_SECRET_KEY=your-production-secret
   ```

3. **Run with Production Server**
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 run_qbank:app
   ```

### Docker Deployment
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "run_qbank.py"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the sample data for examples

## 🔮 Roadmap

- [ ] Advanced question types (matching, ordering, etc.)
- [ ] Collaborative question creation
- [ ] Advanced analytics and reporting
- [ ] Mobile app development
- [ ] Integration with LMS systems
- [ ] AI-powered question generation
- [ ] Multi-language support

---

**Primary Q-Bank** - Empowering education through intelligent question practice.
