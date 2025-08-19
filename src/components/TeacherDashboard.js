import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, SortAsc, SortDesc, Plus, BookOpen, Users, 
  Clock, Calendar, Eye, EyeOff, Edit3, Trash2, MoreVertical 
} from 'lucide-react';
import api from '../utils/api';
import Sidebar from './Sidebar';

export default function TeacherDashboard({ teacherUsername }) {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState(''); 
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    if (!teacherUsername) return;
    setLoading(true);
    api.getExamsByTeacher(teacherUsername, { page, size, sortBy, sortDir, status: status || undefined })
      .then(res => {
        setExams(res.data || []);
        setError(null);
      })
      .catch(() => {
        setError('Unexpected error');
      })
      .finally(() => setLoading(false));
  }, [teacherUsername, page, size, sortBy, sortDir, status]);

  const filtered = useMemo(() => {
    if (!q) return exams;
    const lower = q.toLowerCase();
    return (exams || []).filter(e =>
      (e.title || '').toLowerCase().includes(lower) ||
      (e.description || '').toLowerCase().includes(lower) ||
      (e.topic || '').toLowerCase().includes(lower)
    );
  }, [exams, q]);

  const toggleActive = async (examId, isActive) => {
    try {
      const updatedExam = await api.updateExamStatus(examId, { isActive: !isActive });
      setExams(prev =>
        prev.map(exam =>
          exam.examId === examId ? { ...exam, isActive: updatedExam.data.isActive } : exam
        )
      );
    } catch {
      setError('Unexpected error');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar role={localStorage.getItem('role') || 'TEACHER'} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar role={localStorage.getItem('role') || 'TEACHER'} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg border border-red-200">
            <p className="text-lg font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={localStorage.getItem('role') || 'TEACHER'} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your exams and track student progress</p>
            </div>
            <Link 
              to="/create-exam"
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Exam
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search title, description, or topic..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer min-w-32"
                value={status}
                onChange={(e) => { setPage(0); setStatus(e.target.value); }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Sort By */}
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              value={sortBy}
              onChange={(e) => { setPage(0); setSortBy(e.target.value); }}
            >
              <option value="createdAt">Sort: Created</option>
              <option value="title">Sort: Title</option>
              <option value="duration">Sort: Duration</option>
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

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
              <p className="text-gray-600 mb-6">
                {q ? 'Try adjusting your search criteria.' : 'Get started by creating your first exam.'}
              </p>
              {!q && (
                <Link to="/create-exam" className="btn btn-primary inline-flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Exam
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {filtered.map(exam => (
                <div key={exam.examId} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{exam.title}</h3>
                        <span className={`badge ${exam.isActive ? 'badge-success' : 'badge-gray'}`}>
                          {exam.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{exam.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {exam.duration} minutes</span>
                        </div>
                        {exam.topic && (
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4" />
                            <span>Topic: {exam.topic}</span>
                          </div>
                        )}
                        {exam.createdAt && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(exam.createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>Students: 0</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => toggleActive(exam.examId, exam.isActive)}
                        className={`btn ${exam.isActive ? 'btn-secondary' : 'btn-success'} inline-flex items-center`}
                      >
                        {exam.isActive ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            Activate
                          </>
                        )}
                      </button>
                      
                      <div className="relative group">
                        <button className="btn btn-secondary p-2">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-1">
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Edit Exam
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              <Users className="w-4 h-4 mr-2" />
                              View Students
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Exam
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Showing <span className="font-medium">{page * size + 1}</span> to{' '}
                  <span className="font-medium">{Math.min((page + 1) * size, filtered.length)}</span> of{' '}
                  <span className="font-medium">{filtered.length}</span> results
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
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}