import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {getStudentQuizByMaterialId} from '../services/apiService';
import DashboardLayout from '../components/DashboardLayout';

const StudentQuiz = () => {
  const navigate = useNavigate();
  const {materialId} = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        const data = await getStudentQuizByMaterialId(materialId);
        setQuestions(data);
      } catch (error) {
        console.error('Failed to fetch quiz questions:', error);
      }
    };
    fetchQuizQuestions();
  }, [materialId]);

  const parseOptions = raw => {
    if (Array.isArray(raw)) return raw;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {
      if (typeof raw === 'string' && raw.includes(',')) {
        return raw.split(',').map(opt => opt.trim());
      }
    }
    return [];
  };

  const handleOptionClick = option => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
    const optionsArray = parseOptions(currentQuestion.options);
    const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(
      currentQuestion.correct_answer?.toUpperCase(),
    );
    const correctAnswerValue = optionsArray[correctAnswerIndex];

    if (selectedOption === correctAnswerValue) {
      setScore(prev => prev + 1);
    }

    setSelectedOption(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
          Quiz
        </h2>

        {questions.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            No quiz available for this category.
          </p>
        ) : completed ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl text-center space-y-4">
            <h3 className="text-2xl font-semibold text-green-600">
              Quiz Completed!
            </h3>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Your Score: <span className="font-bold">{score}</span> /{' '}
              {questions.length}
            </p>
            <button
              onClick={() => navigate('/online-resources')}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all">
              Return to Resources
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-6">
            <p className="text-lg text-gray-800 dark:text-white font-medium">
              Question {currentIndex + 1} of {questions.length}
            </p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              {questions[currentIndex].question_text}
            </p>
            <ul className="space-y-3">
              {parseOptions(questions[currentIndex].options).map(
                (option, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => handleOptionClick(option)}
                      className={`w-full px-5 py-3 text-left rounded-xl transition-all duration-200 border font-medium text-sm shadow-sm ${
                        selectedOption === option
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
                      }`}>
                      {option}
                    </button>
                  </li>
                ),
              )}
            </ul>
            <div className="text-right">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl disabled:opacity-50 transition-all">
                {currentIndex + 1 < questions.length ? 'Next' : 'Finish'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentQuiz;
