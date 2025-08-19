import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, BookOpen, Clock, Calendar, Users, Image, 
  MessageSquare, Plus, Trash2, Check, AlertCircle, Save 
} from "lucide-react";
import api from "../utils/api";
import { validateExamData, validateQuestionData } from "../utils/validation";
import { ERROR_MESSAGES } from "../utils/constants";

export default function ExamCreator() {
  const [examData, setExamData] = useState({ 
    title: "", description: "", duration: "", topic: "", difficulty: "EASY", 
    expiryDate: "", timeLimit: "", maxAttempts: "", feedback: "", imageUrl: "" 
  });
  const [errors, setErrors] = useState({});
  const [examId, setExamId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [questionData, setQuestionData] = useState({
    text: "", optionA: "", optionB: "", optionC: "", optionD: "", 
    correctAnswer: "", marks: ""
  });
  const [questions, setQuestions] = useState([]);

  const extraExamValidation = () => {
    const eerrs = {};
    if (examData.maxAttempts && (isNaN(examData.maxAttempts) || Number(examData.maxAttempts) < 0)) 
      eerrs.maxAttempts = 'Max attempts must be >= 0';
    if (examData.timeLimit && (isNaN(examData.timeLimit) || Number(examData.timeLimit) < 0)) 
      eerrs.timeLimit = 'Time limit must be >= 0';
    return eerrs;
  };

  const handleSaveExam = async () => {
    const examErrors = { ...validateExamData(examData), ...extraExamValidation() };
    if (Object.keys(examErrors).length) { 
      setErrors(examErrors); 
      return; 
    }
    try {
      setSaving(true);
      const payload = {
        title: examData.title, 
        description: examData.description, 
        duration: Number(examData.duration),
        createdBy: examData.createdBy || 'teacher1', 
        isActive: false, 
        topic: examData.topic || null,
        difficulty: examData.difficulty || null, 
        expiryDate: examData.expiryDate || null,
        timeLimit: examData.timeLimit ? Number(examData.timeLimit) : null, 
        maxAttempts: examData.maxAttempts ? Number(examData.maxAttempts) : null,
        feedback: examData.feedback || null, 
        imageUrl: examData.imageUrl || null,
      };
      const res = await api.createExam(payload);
      setExamId(res.data.examId);
      setErrors({});
    } catch { 
      setErrors({ general: ERROR_MESSAGES.CREATE_EXAM_FAILED }); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleAddQuestion = async () => {
    const qErrors = validateQuestionData(questionData);
    if (Object.keys(qErrors).length) { 
      setErrors(qErrors); 
      return; 
    }
    if (!examId) { 
      setErrors({ general: 'Please save the exam first' }); 
      return; 
    }
    try {
      const payload = {
        text: questionData.text,
        optionA: questionData.optionA,
        optionB: questionData.optionB,
        optionC: questionData.optionC,
        optionD: questionData.optionD,
        correctAnswer: questionData.correctAnswer,
        marks: Number(questionData.marks),
        examId
      };
      await api.addQuestionToExam(payload);
      setQuestions([...questions, payload]);
      setQuestionData({ 
        text: "", optionA: "", optionB: "", optionC: "", optionD: "", 
        correctAnswer: "", marks: "" 
      });
      setErrors({});
    } catch { 
      setErrors({ general: 'Failed to add question' }); 
    }
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/teacher/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
                <p className="text-gray-600 mt-1">Design your exam with questions and settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* General Error */}
        {errors.general && (
          <div className="mb-6 flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
            <AlertCircle className="w-5 h-5" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Exam Details Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Exam Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Title <span className="text-red-500">*</span>
              </label>
              <input
                className="input"
                aria-label="title"
                placeholder="Enter exam title"
                value={examData.title}
                onChange={(e) => setExamData({ ...examData, title: e.target.value })}
              />
              {errors.title && <span className="text-red-600 text-sm mt-1 block">{errors.title}</span>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input"
                aria-label="description"
                placeholder="Describe your exam"
                rows="3"
                value={examData.description}
                onChange={(e) => setExamData({ ...examData, description: e.target.value })}
              />
              {errors.description && <span className="text-red-600 text-sm mt-1 block">{errors.description}</span>}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="input pl-10"
                  aria-label="duration"
                  type="number"
                  placeholder="60"
                  value={examData.duration}
                  onChange={(e) => setExamData({ ...examData, duration: e.target.value })}
                />
              </div>
              {errors.duration && <span className="text-red-600 text-sm mt-1 block">{errors.duration}</span>}
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <input
                className="input"
                placeholder="e.g., Mathematics, Science"
                value={examData.topic}
                onChange={(e) => setExamData({ ...examData, topic: e.target.value })}
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select
                className="input"
                value={examData.difficulty}
                onChange={(e) => setExamData({ ...examData, difficulty: e.target.value })}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Max Attempts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="input pl-10"
                  type="number"
                  placeholder="3"
                  value={examData.maxAttempts}
                  onChange={(e) => setExamData({ ...examData, maxAttempts: e.target.value })}
                />
              </div>
              {errors.maxAttempts && <span className="text-red-600 text-sm mt-1 block">{errors.maxAttempts}</span>}
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="input pl-10"
                  type="datetime-local"
                  value={examData.expiryDate}
                  onChange={(e) => setExamData({ ...examData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (seconds)</label>
              <input
                className="input"
                type="number"
                placeholder="3600"
                value={examData.timeLimit}
                onChange={(e) => setExamData({ ...examData, timeLimit: e.target.value })}
              />
              {errors.timeLimit && <span className="text-red-600 text-sm mt-1 block">{errors.timeLimit}</span>}
            </div>

            {/* Feedback */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Feedback Message
              </label>
              <textarea
                className="input"
                rows="3"
                placeholder="Message to show after exam completion"
                value={examData.feedback}
                onChange={(e) => setExamData({ ...examData, feedback: e.target.value })}
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Image className="inline w-4 h-4 mr-1" />
                Image URL
              </label>
              <input
                className="input"
                placeholder="https://example.com/image.jpg"
                value={examData.imageUrl}
                onChange={(e) => setExamData({ ...examData, imageUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              className="btn btn-primary inline-flex items-center"
              onClick={handleSaveExam}
              disabled={saving}
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {saving ? "Saving..." : "Save Exam"}
            </button>
          </div>
        </div>

        {/* Question Form */}
        {(examId || saving) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center space-x-2 mb-6">
              <Plus className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Add Question</h2>
            </div>

            <div className="space-y-6">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input"
                  aria-label="question text"
                  placeholder="Enter your question here"
                  rows="3"
                  value={questionData.text}
                  onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
                />
                {errors.text && <span className="text-red-600 text-sm mt-1 block">{errors.text}</span>}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Option A <span className="text-red-500">*</span></label>
                  <input
                    className="input"
                    aria-label="option a"
                    placeholder="Enter option A"
                    value={questionData.optionA}
                    onChange={(e) => setQuestionData({ ...questionData, optionA: e.target.value })}
                  />
                  {errors.optionA && <span className="text-red-600 text-sm mt-1 block">{errors.optionA}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Option B <span className="text-red-500">*</span></label>
                  <input
                    className="input"
                    aria-label="option b"
                    placeholder="Enter option B"
                    value={questionData.optionB}
                    onChange={(e) => setQuestionData({ ...questionData, optionB: e.target.value })}
                  />
                  {errors.optionB && <span className="text-red-600 text-sm mt-1 block">{errors.optionB}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Option C <span className="text-red-500">*</span></label>
                  <input
                    className="input"
                    aria-label="option c"
                    placeholder="Enter option C"
                    value={questionData.optionC}
                    onChange={(e) => setQuestionData({ ...questionData, optionC: e.target.value })}
                  />
                  {errors.optionC && <span className="text-red-600 text-sm mt-1 block">{errors.optionC}</span>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Option D <span className="text-red-500">*</span></label>
                  <input
                    className="input"
                    aria-label="option d"
                    placeholder="Enter option D"
                    value={questionData.optionD}
                    onChange={(e) => setQuestionData({ ...questionData, optionD: e.target.value })}
                  />
                  {errors.optionD && <span className="text-red-600 text-sm mt-1 block">{errors.optionD}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Correct Answer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="input"
                    aria-label="correct answer"
                    value={questionData.correctAnswer}
                    onChange={(e) => setQuestionData({ ...questionData, correctAnswer: e.target.value })}
                  >
                    <option value="">Select correct answer</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                  {errors.correctAnswer && <span className="text-red-600 text-sm mt-1 block">{errors.correctAnswer}</span>}
                </div>

                {/* Marks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marks <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="input"
                    aria-label="marks"
                    type="number"
                    placeholder="1"
                    min="1"
                    value={questionData.marks}
                    onChange={(e) => setQuestionData({ ...questionData, marks: e.target.value })}
                  />
                  {errors.marks && <span className="text-red-600 text-sm mt-1 block">{errors.marks}</span>}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="btn btn-success inline-flex items-center"
                onClick={handleAddQuestion}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Question
              </button>
            </div>
          </div>
        )}

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Questions Added: {questions.length}
              </h3>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Question {idx + 1}: {q.text}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div>A) {q.optionA}</div>
                        <div>B) {q.optionB}</div>
                        <div>C) {q.optionC}</div>
                        <div>D) {q.optionD}</div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center space-x-1">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>Correct: {q.correctAnswer}</span>
                        </span>
                        <span>Marks: {q.marks}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeQuestion(idx)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}