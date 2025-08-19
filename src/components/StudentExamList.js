import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Clock, BookOpen, Play, Calendar, 
  Award, Users, SortAsc, SortDesc, AlertCircle 
} from 'lucide-react';
import api from '../utils/api';

export default function StudentExamList() {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // UI controls
  const [q, setQ] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    api.getAvailableExams()
      .then(res => { 
        setExams(res.data); 
        setError(null);
      })
      .catch(() => { 
        setError('Failed to load exams.'); 
      })
      .finally(() => setLoading(false));
  }, []);

  const processed = useMemo(() => {
    let list = exams || [];
    if (q) {
      const l = q.toLowerCase();
      list = list.filter(e => 
        (e.title || '').toLowerCase().includes(l) || 
        (e.description || '').toLowerCase().includes(l) || 
        (e.topic || '').toLowerCase().includes(l)
      );
    }
    if (difficulty) list = list.filter(e => (e.difficulty || '').toLowerCase() === difficulty.toLowerCase());
    if (status) {
      const now = new Date();
      list = list.filter(e => {
        const exp = e.expiryDate ? new Date(e.expiryDate) : null;
        if (status === 'active') return e.isActive === true;
        if (status === 'upcoming') return e.isActive === true && exp && exp > now;
        if (status === 'expired') return exp && exp < now;
        return true;
      });
    }
    list = [...list].sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      if (sortBy === 'title') return ((a.title || '').localeCompare(b.title || '')) * dir;
      if (sortBy === 'duration') return ((a.duration || 0) - (b.duration || 0)) * dir;
      if (sortBy === 'difficulty') return ((a.difficulty || '').localeCompare(b.difficulty || '')) * dir;
      return 0;
    });
    return list;
  }, [exams, q, difficulty, status, sortBy, sortDir]);

  const paged = useMemo(() => {
    const start = page * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, page]);

  const handleStartExam = (examId) => {
    // Navigate to exam interface
    navigate(`/exam/${examId}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-danger';
      default: return 'badge-gray';
    }
  };

  const getStatusColor = (exam) => {
    const now = new Date();
    const exp = exam.expiryDate ? new Date(exam.expiryDate) : null;
    
    if (!exam.isActive) return 'badge-gray';
    if (exp && exp < now) return 'badge-danger';
    return 'badge-success';
  };

  const getStatusText = (exam) => {
    const now = new Date();
    const exp = exam.expiryDate ? new Date(exam.expiryDate) : null;
    
    if (!exam.isActive) return 'Inactive';
    if (exp && exp < now) return 'Expired';
    return 'Available';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg border border-red-200 max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Exams</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Exams</h1>
              <p className="text-gray-600 mt-2">Choose an exam to start your assessment</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{processed.length} exams available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search exams by title, description, or topic..."
                  value={q}
                  onChange={(e) => { setPage(0); setQ(e.target.value); }}
                />
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer min-w-40"
                value={difficulty}
                onChange={(e) => { setPage(0); setDifficulty(e.target.value); }}
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              value={status}
              onChange={(e) => { setPage(0); setStatus(e.target.value); }}
            >
              <option value="">All Statuses</option>
              <option value="active">Available</option>
              <option value="upcoming">Upcoming</option>
              <option value="expired">Expired</option>
            </select>

            {/* Sort By */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              value={sortBy}
              onChange={(e) => { setPage(0); setSortBy(e.target.value); }}
            >
              <option value="title">Sort: Title</option>
              <option value="duration">Sort: Duration</option>
              <option value="difficulty">Sort: Difficulty</option>
            </select>

            {/* Sort Direction */}
            <button
              className="btn btn-secondary inline-flex items-center"
              onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            >
              {sortDir === 'asc' ? <SortAsc className="w-4 h-4 mr-1" /> : <SortDesc className="w-4 h-4 mr-1" />}
              {sortDir.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Exam Grid */}
        {paged.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
            <p className="text-gray-600">
              {q || difficulty || status ? 'Try adjusting your filters.' : 'No exams are currently available.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paged.map((exam) => (
              <div key={exam.examId} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-2">{exam.title}</h3>
                    <span className={`badge ${getStatusColor(exam)} flex-shrink-0`}>
                      {getStatusText(exam)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{exam.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Duration</span>
                      </div>
                      <span className="font-medium text-gray-900">{exam.duration} minutes</span>
                    </div>
                    
                    {exam.topic && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <BookOpen className="w-4 h-4" />
                          <span>Topic</span>
                        </div>
                        <span className="font-medium text-gray-900">{exam.topic}</span>
                      </div>
                    )}
                    
                    {exam.difficulty && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Award className="w-4 h-4" />
                          <span>Difficulty</span>
                        </div>
                        <span className={`badge ${getDifficultyColor(exam.difficulty)} text-xs`}>
                          {exam.difficulty}
                        </span>
                      </div>
                    )}
                    
                    {exam.maxAttempts && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span>Max Attempts</span>
                        </div>
                        <span className="font-medium text-gray-900">{exam.maxAttempts}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleStartExam(exam.examId)}
                    disabled={!exam.isActive || (exam.expiryDate && new Date(exam.expiryDate) < new Date())}
                    className="w-full btn btn-primary inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Exam
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {paged.length > 0 && (
          <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">{page * pageSize + 1}</span> to{' '}
                <span className="font-medium">{Math.min((page + 1) * pageSize, processed.length)}</span> of{' '}
                <span className="font-medium">{processed.length}</span> results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="btn btn-secondary"
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                Page {page + 1}
              </span>
              <button
                className="btn btn-secondary"
                disabled={(page + 1) * pageSize >= processed.length}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}