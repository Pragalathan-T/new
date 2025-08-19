import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, Clock, CheckCircle, 
  AlertCircle, Send, BookOpen, User 
} from "lucide-react";
import api from "../utils/api";

export default function ExamInterface(props) {
  const runtimeLocation = useLocation();
  const location = props.location || runtimeLocation;
  const navigate = useNavigate();
  const { questions, studentExamId, examTitle } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour default
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Found</h3>
          <p className="text-gray-600">This exam doesn't have any questions available.</p>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleChange = (e) => {
    setAnswers({ ...answers, [current.questionId]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      for (const q of questions) {
        await api.submitAnswer(studentExamId, {
          questionId: q.questionId,
          selectedOption: answers[q.questionId] || null,
        });
      }
      await api.completeExam(studentExamId);
      navigate(`/exam-results/${studentExamId}`, { replace: true });
    } catch {
      setError("Failed to submit exam. Please try again.");
    }
    setSubmitting(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).filter(key => answers[key]).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {examTitle || 'Online Exam'}
                </h1>
                <p className="text-sm text-gray-600">
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Answered: {getAnsweredCount()}/{questions.length}</span>
              </div>
              
              <div className={`flex items-center space-x-2 text-sm font-medium ${
                timeLeft < 300 ? 'text-red-600' : 'text-gray-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Question {currentIndex + 1}
              </span>
              {answers[current.questionId] && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            
            <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
              {current.questionText}
            </h2>
          </div>

          {/* Options */}
          <form className="space-y-4">
            {["A", "B", "C", "D"].map((opt) => (
              <label 
                key={opt} 
                htmlFor={`${opt}-${current.questionId}`}
                className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                  answers[current.questionId] === opt 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200'
                }`}
              >
                <input
                  id={`${opt}-${current.questionId}`}
                  type="radio"
                  name={`option-${current.questionId}`}
                  value={opt}
                  checked={answers[current.questionId] === opt}
                  onChange={handleChange}
                  aria-label={`Option ${opt}`}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                      answers[current.questionId] === opt 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {opt}
                    </span>
                    <span className="text-gray-900">{current[`option${opt}`]}</span>
                  </div>
                </div>
              </label>
            ))}
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="btn btn-secondary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {/* Question Numbers */}
            <div className="hidden sm:flex items-center space-x-1">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                    idx === currentIndex
                      ? 'bg-blue-600 text-white'
                      : answers[questions[idx].questionId]
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentIndex === questions.length - 1 ? (
              <button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={submitting}
                className="btn btn-success inline-flex items-center"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                {submitting ? "Submitting..." : "Submit Exam"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentIndex === questions.length - 1}
                className="btn btn-primary inline-flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-6 h-6 text-amber-500" />
              <h3 className="text-lg font-medium text-gray-900">Submit Exam</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your exam? You have answered {getAnsweredCount()} out of {questions.length} questions.
              Once submitted, you cannot make any changes.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleSubmit();
                }}
                className="btn btn-success"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}