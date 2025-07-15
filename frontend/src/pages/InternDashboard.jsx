import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

export function InternDashboard() {
  const navigate = useNavigate(); 
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const internId = localStorage.getItem("id")||  sessionStorage.getItem("id");
  const username = localStorage.getItem('username') || sessionStorage.getItem('username')
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false); 
  const [attendance, setAttendance] = useState([]); 
 const [stats,setStats] =useState({})
  const [tasks, setTasks] = useState([
  ]);
  useEffect(()=>{
    const getStats = async ()=>{
      
      try{
        const res = await fetch(`http://localhost:3000/api/tasks/intern/stats/${internId}`,{
          method: "GET",
           headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          const data = await res.json()

        if (res.ok) {
          console.log(data);
          
          setStats(data)
        }

      }
      catch(error){
console.log(error);

      }
    }
                  getStats()

  },[])

  useEffect(()=>{
const getTasks = async()=>{
  try{
const res = await fetch(`http://localhost:3000/api/tasks/${internId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
const data = await res.json()
if (res.ok){
setTasks(data)
}
  }
  catch(error){
console.error(error)
  }
}
getTasks()

  },[])

 const updateStatus = async (id, newStatus) => {
  try {
    // Optimistically update UI
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );

    // Send status update to backend
    const res = await fetch(`http://localhost:3000/api/tasks/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!res.ok) {
      throw new Error('Failed to update task status');
    }

    // Optionally refresh the task from response:
    const updatedTask = await res.json();
    // Optional: Re-sync tasks with backend if needed
  } catch (error) {
    console.error(error);
    alert('Error updating status');
  }
};


  const checkIn = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/attendance/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ internId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsCheckedIn(true);
        setCheckInTime(data.checkInTime || null);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Check-in failed", err);
    }
  };

  const checkOut = async () => {
    try {
      const now = new Date().toTimeString().split(" ")[0];
      const res = await fetch(`http://localhost:3000/api/attendance/checkout`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "internId": internId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsCheckedOut(true);
        setCheckOutTime(now);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Check-out failed", err);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/attendance/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ internId }),
        });
        const data = await res.json();

        if (res.ok) {
          setIsCheckedIn(data.checkedIn);
          setIsCheckedOut(data.checkedOut);
          setCheckInTime(data.record?.checkInTime || null);
          setCheckOutTime(data.record?.checkOutTime || null);
        }
      } catch (err) {
        console.error("Failed to check attendance status", err);
      }
    };

    checkStatus();
  }, []);

  const [isShown, setIsShow] = useState({
    progress: false,
    attendance: true,
  });
useEffect(()=>{
  const getAttendance =  async ()=>{
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
          setAttendance(data)
        }
      } catch (err) {
        console.error("Failed to check attendance status", err);
      }
  }
  getAttendance()
},



[])
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
      <div className="flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Intern Dashboard</h1>
    <p className="text-gray-600">Track your progress and manage your tasks</p>
  </div>

  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <span className="text-gray-700">👤</span>
      <span className="font-medium">{username}</span>
    </div>

    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
    >
      Logout
    </button>
  </div>
</div>


        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Attendance Rate", value: stats.attendanceRate, desc: `${stats.presentDays}/${stats.totalDays} days this month` },
            { title: "Tasks Completed", value: stats.completedTasks, desc: `+${stats.completedTasksThisWeek} this week` },
            { title: "Hours Logged", value: stats.totalHours, desc: "" },
            { title: "Projects", value: stats.totalProjects, desc: `${stats.activeProjects} active, ${stats.completedProjects} completed` },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow">
              <div className="text-sm font-medium text-gray-700">{item.title}</div>
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div>
          {["Attendance", "Progress"].map(tab => (
            <button
              key={tab}
              onClick={() =>
                setIsShow({
                  attendance: tab === "Attendance",
                  progress: tab === "Progress",
                })
              }
              className={`py-2 px-4 font-medium border-b-2 ${
                (tab === "Attendance" && isShown.attendance) ||
                (tab === "Progress" && isShown.progress)
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}

          {/* Attendance Tab */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 ${isShown.attendance ? "" : "hidden"}`}>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Today's Attendance</h3>
              <div
                className={`flex justify-between items-center p-4 rounded ${
                  isCheckedIn ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <div>
                  <p className={`font-medium ${isCheckedIn ? "text-green-800" : "text-red-800"}`}>
                    {isCheckedIn ? "Checked In" : "Not Checked In"}
                  </p>
                  <p className={`text-sm ${isCheckedIn ? "text-green-600" : "text-red-600"}`}>
                    {checkInTime
                      ? new Date(`1970-01-01T${checkInTime}`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "--:--"}
                  </p>
                  {isCheckedOut && (
                    <p className="text-sm text-gray-600">
                      Checked out at:{" "}
                      {checkOutTime
                        ? new Date(`1970-01-01T${checkOutTime}`).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </p>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    isCheckedIn ? "bg-green-600 text-white" : "bg-red-600 text-white"
                  }`}
                >
                  {isCheckedIn ? "Present" : "Absent"}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
                  onClick={checkIn}
                  disabled={isCheckedIn}
                >
                  {isCheckedIn ? "Already Checked In" : "Check In"}
                </button>

                <button
                  className="w-full border px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
                  onClick={checkOut}
                  disabled={!isCheckedIn || isCheckedOut}
                >
                  {isCheckedOut ? "Already Checked Out" : "Check Out"}
                </button>
              </div>
            </div>

            {/* Placeholder: Static Attendance Table */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Recent Attendance</h3>
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 py-2">Date</th>
                    <th className="px-2 py-2">Check In</th>
                    <th className="px-2 py-2">Check Out</th>
                    <th className="px-2 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-2 py-2">{item.date}</td>
                      <td className="px-2 py-2">{item.checkInTime}</td>
                      <td className="px-2 py-2">{item.checkOutTime}</td>
                      <td className="px-2 py-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            item.status === "present" ? "bg-green-600 text-white" : "bg-red-500 text-white"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Tab */}
          <div className={`mt-4 overflow-x-auto ${isShown.progress ? "" : "hidden"}`}>
            <h2 className="text-xl font-semibold mb-4">Your Tasks Progress</h2>
           <table className="min-w-full border text-sm">
  <thead>
    <tr className="bg-gray-100 text-left font-medium">
      <th className="p-2">Task</th>
      <th className="p-2">Description</th>
      <th className="p-2">Priority</th>
      <th className="p-2">Status</th>
      <th className="p-2">Assigned Date</th>
      <th className="p-2">Due Date</th>
      <th className="p-2">File</th>
      <th className="p-2">Assigned By</th>
      
    </tr>
  </thead>
  <tbody>
    {tasks.map(task => (
      <tr key={task.id} className="border-t">
        <td className="p-2">{task.title}</td>
        <td className="p-2">{task.description}</td>
        <td className="p-2 capitalize">{task.priority}</td>
        <td className="p-2">
          <select
            value={task.status}
            onChange={e => updateStatus(task.id, e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </td>
        <td className="p-2">{task.assignedDate}</td>
        <td className="p-2">{task.dueDate}</td>
        <td className="p-2">
          {task.file && (
            <a
              href={`http://localhost:3000/uploads/${task.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Click
            </a>
          )}
        </td>
       
        <td className="p-2">
          <div>{task.admin?.username}</div>
          <div className="text-gray-500 text-xs">{task.admin?.email}</div>
        </td>
        
      </tr>
    ))}
  </tbody>
</table>

          </div>
        </div>
      </div>
    </div>
  );
}
