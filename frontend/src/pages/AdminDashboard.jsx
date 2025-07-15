

import { useState,useEffect } from "react";
export function AdminDashboard() {
const token = localStorage.getItem('token') ||sessionStorage.getItem('token')
 const [stats,setStats] =useState({})

 const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'pending',
    assignedTo: '', 
    assignedBy: 'adminId', 
    file:null
  });
const [interns, setInterns] = useState([]);
const handleLogout =()=>{
  localStorage.clear()
  sessionStorage.clear()
  window.location.href="/signin"
}
  useEffect(()=>{
    const getStats = async ()=>{
      try{
        const res = await fetch('http://localhost:3000/api/tasks/admin/stats',{
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

  }
  
  ,[])
useEffect(() => {
  fetch('http://localhost:3000/api/interns',{
      headers: {
    'Authorization': `Bearer ${token}`
  }
  }
    
  )
    .then(res => res.json())
    .then(data => setInterns(data))
    .catch(err => console.error('Failed to load interns:', err));
}, []);
 const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

const onSubmit = async (task) => {
  const formData = new FormData();
  formData.append('title', task.title);
  formData.append('description', task.description);
  formData.append('priority', task.priority);
  formData.append('assignedDate', task.assignedDate);
  formData.append('dueDate', task.dueDate);
  formData.append('status', task.status);
  formData.append('assignedTo', task.assignedTo);
  formData.append('assignedBy', localStorage.getItem('id') || sessionStorage.getItem('id'));

 
if(task.file){
formData.append('file',task.file)}
  try {
    const res = await fetch('http://localhost:3000/api/tasks', {
      method: 'POST',
      body: formData,
      headers: {
    'Authorization': `Bearer ${token}`
  }
    });

    if (!res.ok) throw new Error('Failed to create task');



    const result = await res.json();
    console.log('Task created:', result);
    setShowModal(false);
    // Optionally reset form
  } catch (err) {
    console.error('Submit error:', err);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task); // send task to backend or parent
  };
    const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative" >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage interns and track their progress</p>
          </div>
          <div className="flex justify-end">
                      <button onClick={()=> setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded shadow cursor-pointer hover:bg-blue-400 mr-6">Add Task</button>

             <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm"
    >
      Logout
    </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            ['Total Interns', stats.totalInterns,`+${stats.internsGained} from last month` ],
            ['Present Today', stats.presentToday, `${stats.attendancePercent}% attendance`],
            ['Active Tasks', stats.activeTasks, 'Across all interns'],
            ['Completed Projects', stats.completedProjects, 'This month']
          ].map(([title, value, subtext], idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow">
              <h2 className="text-sm text-gray-500">{title}</h2>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-gray-400">{subtext}</p>
            </div>
          ))}
        </div>

        {/* Intern Table */}
        <div className="bg-white p-6 rounded shadow overflow-x-auto ">
          <h2 className="text-xl font-semibold mb-4 overflow-x-auto ">All Interns</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600 text-sm">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Department</th>
                <th className="p-2">Start Date</th>
                
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interns.map((intern, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 font-medium">{intern.username}</td>
                  <td className="p-2">{intern.email}</td>
                  <td className="p-2">'dept'</td>
                   <td className="p-2">{new Date(intern.createdAt).toISOString().split('T')[0]}</td>
                  
                  <td className="p-2">
                    <button onClick={()=>window.location.href=`/admin/${intern.id}`} className="text-blue-600 text-sm hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 <div className={`absolute bg-sky-50 rounded-2xl shadow-cyan-800 shadow-2xl md:w-1/4 h-auto top-20 md:right-42 p-6 z-50 ${showModal ? '' : 'hidden'}`}>
  <h2 className="text-xl font-semibold mb-4 text-center">Add New Task</h2>
  <form onSubmit={handleSubmit} className="space-y-4">
    <input
      type="text"
      name="title"
      placeholder="Title"
      value={task.title}
      onChange={handleChange}
      required
      className="w-full p-2 rounded border border-gray-300"
    />

    <textarea
      name="description"
      placeholder="Description"
      value={task.description}
      onChange={handleChange}
      className="w-full p-2 rounded border border-gray-300"
    />

    <select
      name="priority"
      value={task.priority}
      onChange={handleChange}
      className="w-full p-2 rounded border border-gray-300"
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>

    <div>
      <label htmlFor="assignedDate" className="text-sm text-gray-600 mb-1 block">Assigned Date</label>
      <input
        type="date"
        id="assignedDate"
        name="assignedDate"
        value={task.assignedDate}
        onChange={handleChange}
        className="w-full p-2 rounded border border-gray-300"
      />
    </div>

    <div>
      <label htmlFor="dueDate" className="text-sm text-gray-600 mb-1 block">Due Date</label>
      <input
        type="date"
        id="dueDate"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
        className="w-full p-2 rounded border border-gray-300"
      />
    </div>

    <select
      name="status"
      value={task.status}
      onChange={handleChange}
      className="w-full p-2 rounded border border-gray-300"
    >
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>

    <select
      name="assignedTo"
      value={task.assignedTo}
      onChange={handleChange}
      required
      className="w-full p-2 rounded border border-gray-300"
    >
      <option value="">Assign to Intern</option>
      {interns.map((intern) => (
        <option key={intern.id} value={intern.id}>
          {intern.username}
        </option>
      ))}
    </select>

    <div>
      <label htmlFor="file" className="text-sm text-gray-600 mb-1 block">Attach File</label>
      <input
        type="file"
        name="file"
        id="file"
        onChange={(e) => setTask({ ...task, file: e.target.files[0] })}
        accept=".pdf,.docx,.jpg,.png"
        className="w-full"
      />
              
    </div>

    <div className="flex justify-between mt-6">
      <button
        type="button"
        onClick={() => setShowModal(false)}
        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
      >
        Cancel
      </button>
      <button
      
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Task
      </button>
    </div>
  </form>
</div>

    </div>
  );
}
