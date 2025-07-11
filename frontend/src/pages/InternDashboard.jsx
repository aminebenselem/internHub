import { useState } from "react"

export function InternDashboard() {
    const [tasks, setTasks] = useState([
    { id: 1, title: "React Component Development", status: "in-progress", priority: "high", dueDate: "2024-07-15" },
    { id: 2, title: "API Integration", status: "pending", priority: "medium", dueDate: "2024-07-18" },
    { id: 3, title: "Documentation", status: "completed", priority: "low", dueDate: "2024-07-10" },
  ])

  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium",
    dueDate: "",
  })
  const [isShown, setIsShow] = useState({
    progress: false,
    addTask: false,
    attendance: true,
  })

  const updateStatus = (id, status) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, status } : task
      )
    )
  }

  const addTask = () => {
    const newId = tasks.length + 1
    setTasks([
      ...tasks,
      { id: newId, ...newTask, status: "pending" },
    ])
    setNewTask({ title: "", priority: "medium", dueDate: "" })
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Intern Dashboard</h1>
            <p className="text-gray-600">Track your progress and manage your tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-700">👤</span>
            <span className="font-medium">John Doe</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Attendance Rate", value: "95.6%", desc: "22/23 days this month" },
            { title: "Tasks Completed", value: "18", desc: "+3 this week" },
            { title: "Hours Logged", value: "156", desc: "This month" },
            { title: "Projects", value: "5", desc: "2 active, 3 completed" },
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
         {['Attendance', 'Progress', 'Tasks'].map(tab => (
  <button
    key={tab}
    onClick={() => {
      setIsShow({
        attendance: tab === 'Attendance',
        progress: tab === 'Progress',
        addTask: tab === 'Tasks',
      })
    }}
    className={`py-2 px-4 font-medium border-b-2 ${
      (tab === 'Attendance' && isShown.attendance) ||
      (tab === 'Progress' && isShown.progress) ||
      (tab === 'Tasks' && isShown.addTask)
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-700 hover:text-blue-600 hover:border-blue-600'
    }`}
  >
    {tab}
  </button>
))}


          {/* Attendance */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 ${isShown.attendance ? '' :'hidden'}`}>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Today's Attendance</h3>
              <div className="flex justify-between items-center p-4 bg-green-100 rounded">
                <div>
                  <p className="text-green-800 font-medium">Checked In</p>
                  <p className="text-sm text-green-600">09:15 AM</p>
                </div>
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Present</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled>Check In</button>
                <button className="w-full border px-4 py-2 rounded">Check Out</button>
              </div>
            </div>

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
                  {[
                    ['Today', '09:15 AM', '-', 'Present'],
                    ['Yesterday', '09:00 AM', '06:30 PM', 'Present'],
                    ['Jan 10', '08:45 AM', '06:15 PM', 'Present'],
                    ['Jan 09', '09:30 AM', '06:45 PM', 'Present'],
                    ['Jan 08', '-', '-', 'Absent'],
                  ].map(([date, inTime, outTime, status], i) => (
                    <tr key={i} className="border-b">
                      <td className="px-2 py-2">{date}</td>
                      <td className="px-2 py-2">{inTime}</td>
                      <td className="px-2 py-2">{outTime}</td>
                      <td className="px-2 py-2">
                        <span className={`text-xs px-2 py-1 rounded ${status === 'Present' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}`}>{status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

    <div className="p-6">
       

        {/* Progress Tab */}
        <div className={` mt-4 ${isShown.progress ? '': 'hidden'}`}>
          <h2 className="text-xl font-semibold mb-4">Your Tasks Progress</h2>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-medium">
                <th className="p-2">Task</th>
                <th className="p-2">Status</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="border-t">
                  <td className="p-2">{task.title}</td>
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
                  <td className="p-2 capitalize">{task.priority}</td>
                  <td className="p-2">{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tasks Tab */}
        <div className={`mt-4 ${isShown.addTask ? '': 'hidden'} `}>
          <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
          <div className="grid gap-4 max-w-lg">
            <input
              className="border p-2 rounded"
              placeholder="Task Title"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
            />
            <select
              className="border p-2 rounded"
              value={newTask.priority}
              onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              className="border p-2 rounded"
              value={newTask.dueDate}
              onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={addTask}
            >
              Add Task
            </button>
          </div>
        </div>
    </div>
        </div>
      </div>
    </div>
  );
}

