export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage interns and track their progress</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">Add Intern</button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            ['Total Interns', '12', '+2 from last month'],
            ['Present Today', '10', '83% attendance'],
            ['Active Tasks', '28', 'Across all interns'],
            ['Completed Projects', '45', 'This month']
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
          <h2 className="text-xl font-semibold mb-4 ">All Interns</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600 text-sm">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Department</th>
                <th className="p-2">Start Date</th>
                <th className="p-2">Mentor</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['John Doe', 'john.doe@company.com', 'Engineering', '2024-01-15', 'Sarah Wilson', 'Active'],
                ['Jane Smith', 'jane.smith@company.com', 'Design', '2024-01-20', 'Mike Johnson', 'Active'],
                ['Alex Chen', 'alex.chen@company.com', 'Marketing', '2024-02-01', 'Lisa Brown', 'On Leave'],
              ].map(([name, email, dept, date, mentor, status], idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 font-medium">{name}</td>
                  <td className="p-2">{email}</td>
                  <td className="p-2">{dept}</td>
                  <td className="p-2">{date}</td>
                  <td className="p-2">{mentor}</td>
                  <td className="p-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                      status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {status}
                    </span>
                  </td>
                  <td className="p-2">
                    <button className="text-blue-600 text-sm hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
