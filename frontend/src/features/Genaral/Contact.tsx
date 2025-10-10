import React from "react";

const Contact: React.FC = () => {
  const project = {
    id: "68e73c57631cbc69cdd9957c",
    name: "Webandcrafts",
    key: "WAC",
    description: "Webandcrafts web design",
    startDate: "2025-10-08T18:30:00.000Z",
    endDate: "2025-11-21T18:30:00.000Z",
    status: "Planned",
    backlog: [
      {
        id: "68e745b8631cbc69cdd995b0",
        heading: "Implement Employee Login Feature",
        description:
          "Create a secure login system for employees using email and password authentication.",
        acceptanceCriteria:
          "Users should be able to log in with valid credentials and receive a JWT token.",
        size: 5,
        estimatedHours: 12,
        type: "User Story",
        status: "In Progress",
        priority: "High",
        subTasks: [
          { id: "1", title: "Design Login UI", status: "Completed" },
          { id: "2", title: "Implement JWT Authentication", status: "In Progress" },
          { id: "3", title: "Setup Login API Endpoint", status: "Pending" },
        ],
      },
    ],
    activeSprints: [
      {
        id: "68f20043327a59e1480362bb",
        name: "Sprint 2 - Dashboard & Reports",
        goal: "Develop admin dashboard and integrate payroll reports.",
        status: "Active",
        issues: [
          {
            id: "1",
            heading: "Create Admin Dashboard UI",
            description:
              "Develop a responsive dashboard showing company KPIs and employee summaries.",
            priority: "High",
            status: "In Progress",
          },
          {
            id: "2",
            heading: "Integrate Payroll Reports",
            description:
              "Connect payroll report module to database and show downloadable reports.",
            priority: "Medium",
            status: "Planned",
          },
        ],
      },
    ],
    completedSprints: [
      {
        id: "68f30043327a59e1480362cc",
        name: "Sprint 0 - Setup & Planning",
        goal: "Set up project structure, CI/CD pipeline, and basic components.",
        status: "Completed",
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-1">{project.name}</h1>
        <p className="text-gray-600 text-sm">{project.description}</p>
      </div>

      {/* Project Info */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="p-4 bg-white rounded-2xl shadow-sm border">
          <h3 className="text-sm text-gray-500">Status</h3>
          <p className="text-lg font-medium">{project.status}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm border">
          <h3 className="text-sm text-gray-500">Start Date</h3>
          <p className="text-lg font-medium">
            {new Date(project.startDate).toLocaleDateString()}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-sm border">
          <h3 className="text-sm text-gray-500">End Date</h3>
          <p className="text-lg font-medium">
            {new Date(project.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Active Sprints */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Active Sprints</h2>
        <div className="space-y-4">
          {project.activeSprints.map((sprint) => (
            <div
              key={sprint.id}
              className="bg-white rounded-2xl shadow-sm border p-6"
            >
              <div className="flex justify-between mb-3">
                <h3 className="text-xl font-medium">{sprint.name}</h3>
                <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                  {sprint.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{sprint.goal}</p>

              <div>
                <h4 className="text-md font-semibold mb-2 text-gray-800">Issues</h4>
                <div className="space-y-2">
                  {sprint.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="border rounded-xl p-3 flex justify-between items-center bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{issue.heading}</p>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          issue.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : issue.status === "Planned"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Backlog */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Backlog</h2>
        <div className="space-y-4">
          {project.backlog.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-semibold">{task.heading}</h3>
                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    task.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <div className="text-sm text-gray-500 mb-3">
                Priority: <b>{task.priority}</b> | Type: <b>{task.type}</b> | Size:{" "}
                <b>{task.size}</b>
              </div>

              <h4 className="text-md font-semibold mb-2 text-gray-800">Subtasks</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {task.subTasks.map((sub) => (
                  <li key={sub.id}>
                    {sub.title}{" "}
                    <span
                      className={`ml-2 text-xs px-2 py-0.5 rounded ${
                        sub.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : sub.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Completed Sprints */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Completed Sprints
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {project.completedSprints.map((sprint) => (
            <div
              key={sprint.id}
              className="bg-white rounded-2xl shadow-sm border p-5"
            >
              <h3 className="text-lg font-semibold">{sprint.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{sprint.goal}</p>
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                {sprint.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
