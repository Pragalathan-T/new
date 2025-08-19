import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Trophy, CheckCircle, XCircle, Clock, BookOpen, 
  ArrowLeft, Award, Target, BarChart3, Download 
} from "lucide-react";
import api from "../utils/api";

export default function ExamResults() {
  const { studentExamId } = useParams();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getExamResults(studentExamId)
      .then((res) => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load exam results.");
        setLoading(false);
      });
  }, [studentExamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg border border-red-200">
          <XCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Results</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const correctAnswers = results.questions.filter(q => q.isCorrect).length;
  const totalQuestions = results.questions.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const totalMarks = results.questions.reduce((sum, q) => sum + (q.isCorrect ? q.marks : 0), 0);
  const maxMarks = results.questions.reduce((sum, q) => sum + q.marks, 0);

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-blue-50 border-blue-200';
    if (percentage >= 40) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/student/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{results.exam.title}</h1>
                <p className="text-gray-600 mt-1">{results.exam.description}</p>
              </div>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Overview */}
        <div className={`rounded-lg border p-8 mb-8 ${getScoreBgColor(percentage)}`}>
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Total Score: {results.score || totalMarks}
            </h3>
            <p className="text-gray-600 mb-6">
              You scored {totalMarks} out of {maxMarks} marks
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mx-auto mb-3">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect Answers</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">{totalQuestions}</div>
                <div className="text-sm text-gray-600">Total Questions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="btn btn-secondary inline-flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Download Results
          </button>
          <Link to="/history" className="btn btn-secondary inline-flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            View All Results
          </Link>
          <Link to="/student-exams" className="btn btn-primary inline-flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Take Another Exam
          </Link>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Detailed Results
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {results.questions.map((q, idx) => (
              <div key={idx} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 flex-1 mr-4">
                    Question {idx + 1}: {q.questionText}
                  </h4>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {q.isCorrect ? (
                      <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Correct</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Incorrect</span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-600">
                      {q.isCorrect ? q.marks : 0}/{q.marks} marks
                    </span>
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {["A", "B", "C", "D"].map((option) => {
                    const isStudentAnswer = q.studentAnswer === option;
                    const isCorrectAnswer = q.correctOption === option;
                    
                    let optionClass = "border-2 rounded-lg p-3 ";
                    if (isCorrectAnswer) {
                      optionClass += "border-green-500 bg-green-50";
                    } else if (isStudentAnswer && !isCorrectAnswer) {
                      optionClass += "border-red-500 bg-red-50";
                    } else {
                      optionClass += "border-gray-200 bg-gray-50";
                    }

                    return (
                      <div key={option} className={optionClass}>
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                            isCorrectAnswer 
                              ? 'bg-green-600 text-white' 
                              : isStudentAnswer 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-400 text-white'
                          }`}>
                            {option}
                          </span>
                          <span className="text-gray-900">{q[`option${option}`]}</span>
                          {isStudentAnswer && (
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              Your Answer
                            </span>
                          )}
                          {isCorrectAnswer && (
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                              Correct
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Answer Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Your Answer: </span>
                      <span className={q.studentAnswer ? 'text-gray-900' : 'text-gray-500'}>
                        {q.studentAnswer || "Not answered"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Correct Answer: </span>
                      <span className="text-green-600 font-medium">{q.correctOption}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Marks: </span>
                      <span className="text-gray-900">{q.marks}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}