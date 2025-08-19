import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, Filter, SortAsc, SortDesc, Eye, Calendar, 
  Clock, Award, BookOpen, ArrowLeft, AlertCircle 
} from 'lucide-react';
import api from '../utils/api';

export default function AttemptHistory({ studentId = 1 }) {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('startTime');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    setLoading(true);
    api.getStudentExamHistory(studentId, { page, size, sortBy, sortDir })
      .then(res => {
        setData(res.data);
        setError(null);
      })
      .catch(() => setError('Failed to load history'))
      .finally(() => setLoading(false));
  }, [studentId, page, size, sortBy, sortDir]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'badge-success';
      case 'in_progress': return 'badge-warning';
      case 'abandoned': return 'badge-danger';
      default: return 'badge-gray';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg border border-red-200">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading History</h3>
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
            <div className="flex items-center space-x-4">
              <Link to="/student/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <History className="w-6 h-6 mr-2 text-blue-600" />
                  Attempt History
                </h1>
                <p className="text-gray-600 mt-1">View your past exam attempts and results</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => { setPage(0); setSortBy(e.target.value); }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
            >
              <option value="startTime">Date Started</option>
              <option value="endTime">Date Ended</option>
              <option value="score">Score</option>
            </select>

            <button
              onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
              className="btn btn-secondary inline-flex items-center"
            >
              {sortDir === 'asc' ? <SortAsc className="w-4 h-4 mr-1" /> : <SortDesc className="w-4 h-4 mr-1" />}
              {sortDir.toUpperCase()}
            </button>

            <div className="ml-auto text-sm text-gray-600">
              {data.content.length} of {data.totalElements || data.content.length} results
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading history...</p>
          </div>
        ) : data.content.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Exam History</h3>
            <p className="text-gray-600 mb-6">You haven't taken any exams yet.</p>
            <Link to="/student-exams" className="btn btn-primary inline-flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Available Exams
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.content.map((row) => (
                    <tr key={row.studentExamId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {row.exam?.title || 'Unknown Exam'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {row.studentExamId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {row.score !== null && row.score !== undefined ? (
                          <div className="flex items-center">
                            <Award className="w-4 h-4 text-gray-400 mr-2" />
                            <span className={`font-medium ${getScoreColor(row.score)}`}>
                              {row.score}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getStatusColor(row.status)}`}>
                          {row.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(row.startTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(row.endTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {row.status === 'completed' && (
                          <Link
                            to={`/exam-results/${row.studentExamId}`}
                            className="btn btn-secondary btn-sm inline-flex items-center"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Results
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {data.content.map((row) => (
                <div key={row.studentExamId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {row.exam?.title || 'Unknown Exam'}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {row.studentExamId}</p>
                    </div>
                    <span className={`badge ${getStatusColor(row.status)}`}>
                      {row.status || 'Unknown'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <Award className="w-4 h-4 mr-1" />
                        Score
                      </div>
                      {row.score !== null && row.score !== undefined ? (
                        <div className={`font-medium ${getScoreColor(row.score)}`}>
                          {row.score}%
                        </div>
                      ) : (
                        <div className="text-gray-500">-</div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        Started
                      </div>
                      <div className="text-gray-900">{formatDate(row.startTime)}</div>
                    </div>
                  </div>

                  <div className="text-sm mb-4">
                    <div className="flex items-center text-gray-500 mb-1">
                      <Clock className="w-4 h-4 mr-1" />
                      Completed
                    </div>
                    <div className="text-gray-900">{formatDate(row.endTime)}</div>
                  </div>

                  {row.status === 'completed' && (
                    <Link
                      to={`/exam-results/${row.studentExamId}`}
                      className="btn btn-secondary w-full inline-flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Results
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Showing <span className="font-medium">{page * size + 1}</span> to{' '}
                    <span className="font-medium">{Math.min((page + 1) * size, data.totalElements || data.content.length)}</span> of{' '}
                    <span className="font-medium">{data.totalElements || data.content.length}</span> results
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm font-medium text-gray-700">
                    Page {page + 1} of {data.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(data.totalPages - 1, page + 1))}
                    disabled={page + 1 >= data.totalPages}
                    className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}