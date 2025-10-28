import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lightbulb } from 'lucide-react';
import Button from './Button';

const MOCK_QUESTIONS = [
  {
    id: 1,
    stem: "A 55-year-old patient with chronic kidney disease (CKD) stage 4 presents with bone pain and elevated parathyroid hormone levels. Laboratory values show: Ca 8.5 mg/dL, P 5.2 mg/dL, PTH 450 pg/mL. What is the most appropriate treatment?",
    options: [
      "Calcium carbonate supplementation",
      "Calcitriol (1,25-dihydroxyvitamin D)",
      "Cinacalcet (calcimimetic)",
      "Phosphate binders only"
    ],
    answerIndex: 2,
    explanation: "This patient has secondary hyperparathyroidism due to CKD. The elevated PTH with normal calcium and elevated phosphate indicates the need for calcimimetic therapy (cinacalcet) to reduce PTH secretion. This is the preferred treatment for secondary hyperparathyroidism in CKD patients.",
    knowledgeLink: "CKD-MBD Management",
    category: "Nephrology",
    difficulty: "Hard",
    timeLimit: 90,
    knowledgePoints: ["CKD-MBD", "Secondary hyperparathyroidism", "Calcimimetics", "Bone mineral metabolism"]
  },
  {
    id: 2,
    stem: "A 28-year-old woman presents with fatigue, weight gain, and cold intolerance. Physical exam reveals bradycardia, dry skin, and delayed deep tendon reflexes. Laboratory results show TSH 25 mIU/L and free T4 0.5 ng/dL. What is the most appropriate initial treatment?",
    options: [
      "Methimazole",
      "Levothyroxine",
      "Propylthiouracil",
      "Radioactive iodine"
    ],
    answerIndex: 1,
    explanation: "The patient has primary hypothyroidism based on elevated TSH and low free T4. Levothyroxine is the treatment of choice for hypothyroidism. The other options are treatments for hyperthyroidism.",
    knowledgeLink: "Thyroid Function and Hypothyroidism",
    category: "Endocrinology",
    difficulty: "Medium",
    timeLimit: 60,
    knowledgePoints: ["Thyroid function tests", "Hypothyroidism", "Levothyroxine", "TSH feedback loop"]
  }
];

const MOCK_KNOWLEDGE_ENTRIES = {
  "CKD-MBD Management": {
    title: "Chronic Kidney Disease - Mineral and Bone Disorder (CKD-MBD)",
    content: "CKD-MBD is a systemic disorder of mineral and bone metabolism due to CKD. It includes abnormalities of calcium, phosphorus, PTH, vitamin D metabolism, bone turnover, and vascular calcification. Management involves phosphate binders, calcimimetics, and vitamin D analogues.",
    related: ["Secondary hyperparathyroidism", "Phosphate metabolism", "Vascular calcification", "Bone disease in CKD"]
  },
  "Thyroid Function and Hypothyroidism": {
    title: "Thyroid Function and Hypothyroidism",
    content: "Hypothyroidism results from insufficient thyroid hormone production. Primary hypothyroidism is most common, caused by autoimmune thyroiditis (Hashimoto's), iodine deficiency, or iatrogenic causes. Treatment with levothyroxine normalizes TSH and resolves symptoms.",
    related: ["TSH feedback loop", "Autoimmune thyroiditis", "Thyroid function tests", "Levothyroxine dosing"]
  }
};

const IntegratedKnowledgeQBank = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [question, setQuestion] = useState(MOCK_QUESTIONS[0]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showKnowledgeDrawer, setShowKnowledgeDrawer] = useState(false);
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
    setShowKnowledgeDrawer(false);
    setFeedback(null);
    setTimeLeft(MOCK_QUESTIONS[nextIndex].timeLimit);
    setIsTimerActive(true);
  };

  const getOptionClasses = (index) => {
    if (!showExplanation) {
      return index === selectedOption
        ? 'bg-teal-100 border-teal-600'
        : 'bg-white hover:bg-gray-50 border-gray-300';
    }
    if (index === question.answerIndex) return 'bg-green-100 border-green-600 text-green-800 font-bold';
    if (index === selectedOption && index !== question.answerIndex) return 'bg-red-100 border-red-600 text-red-800 font-bold';
    return 'bg-white border-gray-300 text-gray-500';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentKnowledgeEntry = MOCK_KNOWLEDGE_ENTRIES[question.knowledgeLink] || MOCK_KNOWLEDGE_ENTRIES["CKD-MBD Management"];

  return (
    <div className="flex max-w-6xl mx-auto">
      <div className="p-8 bg-white rounded-xl shadow-xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-teal-800 border-b pb-2">Integrated Knowledge Q-Bank</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                {question.category}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {question.difficulty}
              </span>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-teal-600'}`}>
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-500">Time Remaining</div>
            </div>
          </div>
        </div>

        <div className="mb-6 text-lg p-4 bg-teal-50 border-l-4 border-teal-400 rounded-lg">
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

        {/* Knowledge Points Integration */}
        {question.knowledgePoints && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-800 mb-2">Related Knowledge Points:</h4>
            <div className="flex flex-wrap gap-2">
              {question.knowledgePoints.map((point, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {point}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-t pt-4">
          <div className="flex space-x-4">
            {!showExplanation ? (
              <Button 
                onClick={handleSubmit} 
                className="bg-teal-600 hover:bg-teal-700 focus:ring-teal-300" 
                disabled={selectedOption === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} primary={false}>
                Next Question
              </Button>
            )}
            <Button
              onClick={() => setShowKnowledgeDrawer(!showKnowledgeDrawer)}
              primary={!showKnowledgeDrawer}
              icon={BookOpen}
              className={`${showKnowledgeDrawer ? 'bg-gray-300 hover:bg-gray-400' : 'bg-teal-100 text-teal-700 hover:bg-teal-200 border border-teal-300'}`}
            >
              {showKnowledgeDrawer ? 'Hide Knowledge Library' : 'Open Knowledge Library'}
            </Button>
          </div>

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
            <p className="text-gray-700 mb-4">{question.explanation}</p>
            
            <h5 className="font-semibold text-blue-800 mb-2">Key Learning Points:</h5>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>This question integrates knowledge from multiple medical disciplines</li>
              <li>Understanding pathophysiology is crucial for clinical decision making</li>
              <li>Evidence-based guidelines should guide treatment selection</li>
            </ul>
          </div>
        )}
      </div>

      {/* Knowledge Drawer */}
      <div className={`transition-all duration-300 ease-in-out ${showKnowledgeDrawer ? 'w-96 ml-6' : 'w-0'}`}>
        <div className={`${showKnowledgeDrawer ? 'block p-6 bg-white rounded-xl shadow-xl h-full overflow-y-auto border-l border-gray-200' : 'hidden'}`}>
          <h3 className="text-2xl font-bold text-teal-700 mb-4 border-b pb-2">Knowledge Library</h3>
          <div className="p-4 bg-teal-50 rounded-lg">
            <h4 className="font-semibold text-lg text-teal-800 mb-2">{currentKnowledgeEntry.title}</h4>
            <p className="text-sm text-gray-700">{currentKnowledgeEntry.content}</p>
            <div className="mt-3">
              <span className="text-xs font-medium text-gray-600 block mb-1">Related Topics:</span>
              <div className="flex flex-wrap gap-2">
                {currentKnowledgeEntry.related.map((topic, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-teal-200 text-teal-800 rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            *This entry is linked to concepts tested in the current question.
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedKnowledgeQBank;