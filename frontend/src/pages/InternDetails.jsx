import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from 'react';
import { Calendar, CheckCircle, Clock, User, AlertCircle, XCircle } from 'lucide-react';
export function InternDetails() {
  const { internId } = useParams();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [attendance, setAttendance] = useState([]);
  const [tasks, setTasks] = useState([]);


function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'present':
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'absent':
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    case 'late':
    case 'in progress':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function getStatusIcon(status) {
  switch (status.toLowerCase()) {
    case 'present':
    case 'completed':
      return <CheckCircle className="text-green-600 w-5 h-5" />;
    case 'absent':
    case 'cancelled':
      return <XCircle className="text-red-600 w-5 h-5" />;
    case 'late':
    case 'in progress':
      return <AlertCircle className="text-yellow-600 w-5 h-5" />;
    default:
      return <Clock className="text-gray-600 w-5 h-5" />;
  }
}



  useEffect(() => {
    const getAttendance = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/attendance/${internId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setAttendance(data);
        }
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      }
    };
    getAttendance();
  }, [internId, token]);

  // Fetch tasks
  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/tasks/${internId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTasks(data);
        }
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };
    getTasks();
  }, [internId, token]);

  return ( <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Intern Details</h1>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <p className="text-lg font-medium text-blue-800">Email: {tasks[0]?.intern?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Attendance Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Attendance Record</h2>
            </div>
          </div>
          
          <div className="p-6">
            {attendance.length > 0 ? (
              <div className="space-y-3">
                {attendance.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                      </div>
                      <span className="font-medium text-gray-900">{record.date}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No attendance data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Assigned Tasks</h2>
            </div>
          </div>
          
          <div className="p-6">
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded-full ${getStatusColor(task.status)}`}>
                            {getStatusIcon(task.status)}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No tasks assigned yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Present Days</p>
              <p className="text-2xl font-bold text-green-800">
                {attendance.filter(a => a.status.toLowerCase() === 'present').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Tasks in Progress</p>
              <p className="text-2xl font-bold text-blue-800">
                {tasks.filter(t => t.status.toLowerCase() === 'in progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Completed Tasks</p>
              <p className="text-2xl font-bold text-purple-800">
                {tasks.filter(t => t.status.toLowerCase() === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
