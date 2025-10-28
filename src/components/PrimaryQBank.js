import React, { useState } from 'react';
import { CheckCircle, Lightbulb } from 'lucide-react';
import Button from './Button';

const MOCK_QUESTIONS = [
  {
    id: 1,
    stem: "A 45-year-old male presents to the emergency department with severe, crushing substernal chest pain radiating to his left arm. ECG shows ST-segment elevations in leads II, III, and aVF. Which of the following is the most appropriate initial management step?",
    options: [
      "Administer IV Labetalol",
      "Perform immediate coronary angiography",
      "Administer sublingual Nitroglycerin and Aspirin",
      "Obtain a stat head CT scan",
    ],
    answerIndex: 2,
    explanation: "The patient is presenting with classic symptoms and ECG findings of an Acute Inferior ST-Elevation Myocardial Infarction (STEMI). Initial management should include Aspirin to inhibit platelet aggregation and Nitroglycerin for vasodilation and pain relief, provided the patient is not hypotensive. Immediate coronary angiography (Option B) is the definitive treatment but initial medications are crucial.",
    knowledgeLink: "Acute Coronary Syndromes (ACS) Pathophysiology and Initial Management",
    category: "Cardiology",
    difficulty: "Medium",
    timeLimit: 60
  },
  {
    id: 2,
    stem: "A 30-year-old woman presents with acute onset of severe headache, neck stiffness, and photophobia. Vital signs show temperature 38.5°C, blood pressure 140/90 mmHg, heart rate 110 bpm. Kernig's sign is positive. What is the most likely diagnosis?",
    options: [
      "Migraine headache",
      "Bacterial meningitis",
      "Subarachnoid hemorrhage",
      "Tension headache"
    ],
    answerIndex: 1,
    explanation: "The classic triad of fever, neck stiffness, and altered mental status, along with positive Kernig's sign, strongly suggests bacterial meningitis. This is a medical emergency requiring immediate lumbar puncture and antibiotic therapy.",
    knowledgeLink: "Central Nervous System Infections",
    category: "Neurology",
    difficulty: "Easy",
    timeLimit: 45
  },
  {
    id: 3,
    stem: "A 65-year-old man with a history of diabetes mellitus presents with a non-healing foot ulcer for 3 weeks. The ulcer is 2cm in diameter, has a clean base, and shows no signs of infection. What is the most important initial step in management?",
    options: [
      "Prescribe oral antibiotics",
      "Order MRI of the foot",
      "Obtain wound culture",
      "Refer to vascular surgery for evaluation"
    ],
    answerIndex: 3,
    explanation: "Diabetic foot ulcers require comprehensive evaluation including vascular assessment. Poor circulation is often the underlying cause of non-healing ulcers in diabetic patients. Vascular surgery evaluation is crucial to determine if revascularization is needed.",
    knowledgeLink: "Diabetic Foot Care and Vascular Assessment",
    category: "Endocrinology",
    difficulty: "Medium",
    timeLimit: 60
  }
];

const PrimaryQBank = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState(MOCK_QUESTIONS[0]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(question.timeLimit);
  const [isTimerActive, setIsTimerActive] = useState(true);

  // Timer effect
  React.useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto-submit when time runs out
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Reset timer when question changes
  React.useEffect(() => {
    setTimeLeft(question.timeLimit);
    setIsTimerActive(true);
  }, [question]);

  const handleOptionSelect = (index) => {
    if (!showExplanation) {
      setSelectedOption(index);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    setShowExplanation(true);
    setIsTimerActive(false);
    if (selectedOption === question.answerIndex) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleNext = () => {
    const nextIndex = (currentQuestionIndex + 1) % MOCK_QUESTIONS.length;
    setCurrentQuestionIndex(nextIndex);
    setQuestion(MOCK_QUESTIONS[nextIndex]);
    setSelectedOption(null);
    setShowExplanation(false);
    setFeedback(null);
    setTimeLeft(MOCK_QUESTIONS[nextIndex].timeLimit);
    setIsTimerActive(true);
  };

  const getOptionClasses = (index) => {
    if (!showExplanation) {
      return index === selectedOption
        ? 'bg-blue-100 border-blue-600'
        : 'bg-white hover:bg-gray-50 border-gray-300';
    }

    // After submitting
    if (index === question.answerIndex) {
      return 'bg-green-100 border-green-600 text-green-800 font-bold';
    }
    if (index === selectedOption && index !== question.answerIndex) {
      return 'bg-red-100 border-red-600 text-red-800 font-bold';
    }
    return 'bg-white border-gray-300 text-gray-500';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-xl max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold text-blue-800 border-b pb-2">Primary Q-Bank Practice</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {question.category}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              {question.difficulty}
            </span>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-blue-600'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500">Time Remaining</div>
          </div>
        </div>
      </div>

      <div className="mb-6 text-lg p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
        <p className="text-gray-800">Q {question.id}. {question.stem}</p>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-150 ${getOptionClasses(index)}`}
            onClick={() => handleOptionSelect(index)}
          >
            <span className="font-semibold">{String.fromCharCode(65 + index)}. </span>
            {option}
            {showExplanation && index === question.answerIndex && (
              <CheckCircle className="w-5 h-5 text-green-600 inline ml-3" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        {!showExplanation ? (
          <Button 
            onClick={handleSubmit} 
            primary={true} 
            disabled={selectedOption === null}
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} primary={false}>
            Next Question
          </Button>
        )}
        {feedback && (
          <div className={`font-bold text-xl ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback === 'correct' ? 'Correct!' : 'Incorrect!'}
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-600 shadow-inner">
          <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-blue-600" /> Detailed Explanation
          </h3>
          <p className="text-gray-700">{question.explanation}</p>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Knowledge Link:</strong> {question.knowledgeLink}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrimaryQBank;