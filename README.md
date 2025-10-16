# MedPractice Pro - Medical Q-Banks & Clinical Training Platform

A comprehensive React-based medical practice platform designed for medical students, residents, attending physicians, and clinical instructors. Built with modern web technologies and Firebase integration.

## 🏥 Features

### Primary Q-Bank
- **5,000+ USMLE-style questions** with detailed explanations
- **Category filtering** (Cardiology, Neurology, Endocrinology, etc.)
- **Difficulty levels** (Easy, Medium, Hard)
- **Time-limited questions** with countdown timer
- **Performance analytics** and progress tracking
- **Question flagging** and explanation toggle

### Integrated Knowledge Q-Bank
- **Cross-specialty integration** with built-in medical knowledge library
- **2,500+ diseases & conditions** database
- **1,800+ treatment protocols** and guidelines
- **3,200+ drug information** entries
- **Knowledge points integration** showing related concepts
- **Evidence-based medicine** approach

### Clinical Management Simulator (CCS)
- **Computer-Based Case Simulations** for Step 3 preparation
- **Real-time case management** with time constraints
- **Interactive patient scenarios** (STEMI, Pneumonia, Pediatric emergencies)
- **Action-based interface** for ordering tests and treatments
- **Case objectives** and performance tracking

### Role-Based Dashboard
- **Medical Students**: Foundational knowledge building
- **Residents**: Clinical reasoning development
- **Attending Physicians**: Current guidelines and complex cases
- **Clinical Instructors**: Student progress tracking and curriculum management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project (optional, for data persistence)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medpractice-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Firebase configuration (optional for demo mode)

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Firebase Setup (Optional)
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Anonymous sign-in)
3. Enable Firestore Database
4. Copy your Firebase config to `.env` file

### Environment Variables
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 📱 Usage

### For Medical Students
- Start with Primary Q-Bank for foundational knowledge
- Use Integrated Knowledge Q-Bank for cross-specialty learning
- Practice with CCS Simulator for clinical decision making

### For Residents
- Focus on complex cases in Integrated Knowledge Q-Bank
- Use CCS Simulator for time management and clinical reasoning
- Track progress across all platforms

### For Attending Physicians
- Stay current with latest guidelines
- Review complex case management strategies
- Access comprehensive medical knowledge library

### For Clinical Instructors
- Monitor student progress across all platforms
- Create custom curricula and assignments
- Access detailed analytics and reporting

## 🛠️ Technology Stack

- **Frontend**: React 18, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase (Authentication, Firestore)
- **Build Tool**: Create React App
- **State Management**: React Hooks (useState, useEffect)

## 📁 Project Structure

```
src/
├── components/
│   ├── Button.js              # Reusable button component
│   ├── ToolCard.js            # Tool card component
│   ├── PrimaryQBank.js        # Primary Q-Bank implementation
│   ├── IntegratedKnowledgeQBank.js  # Integrated Q-Bank implementation
│   ├── ClinicalSimulator.js   # CCS Simulator implementation
│   ├── Dashboard.js           # Dashboard component
│   └── Sidebar.js             # Navigation sidebar
├── firebase.js                # Firebase configuration
├── App.js                     # Main application component
├── index.js                   # Application entry point
└── index.css                  # Global styles
```

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface

### Real-time Updates
- Live progress tracking
- Instant feedback on answers
- Dynamic content updates

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

### Performance
- Optimized bundle size
- Lazy loading components
- Efficient state management

## 🔒 Security

- Anonymous authentication for demo purposes
- Secure Firebase integration
- No sensitive data stored locally
- HTTPS enforcement in production

## 📊 Analytics

- Progress tracking across all platforms
- Performance metrics by category
- Time-based analytics
- Role-specific insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@medpracticepro.com or create an issue in the repository.

## 🙏 Acknowledgments

- Medical content based on USMLE guidelines
- Icons provided by Lucide React
- UI inspiration from modern medical applications
- Firebase for backend services

---

**MedPractice Pro** - Empowering medical professionals through comprehensive training and assessment tools.