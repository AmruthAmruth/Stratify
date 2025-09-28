import React from "react";

const CollapsibleSection = ({ 
  title, 
  icon, 
  iconBgColor, 
  iconColor, 
  data, 
  type, 
  expandedItem, 
  setExpandedItem, 
  expandedStory, 
  setExpandedStory, 
  getStatusColor, 
  getPriorityColor 
}) => {
  return (
     <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <div className={`w-8 h-8 ${iconBgColor} rounded-lg flex items-center justify-center mr-3`}>
            {icon}
          </div>
          {title}
        </h3>
      </div>
      <div className="p-8 space-y-6">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <div
              className={`bg-gradient-to-r ${
                type === 'sprint' 
                  ? 'from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100' 
                  : 'from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100'
              } p-6 cursor-pointer transition-all duration-300`}
              onClick={() =>
                setExpandedItem(expandedItem === item.name ? null : item.name)
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 ${
                      type === 'sprint' ? 'bg-teal-600' : 'bg-indigo-600'
                    } text-white text-sm font-bold rounded-lg`}>
                      {item.name}
                    </span>
                    <h4 className="text-xl font-bold text-gray-900">{item.description}</h4>
                  </div>
                  
                  {type === 'sprint' && (
                    <>
                      <p className="text-gray-600 text-base leading-relaxed mb-4">
                        {new Date(item.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(item.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        <span className="font-semibold">Description:</span> {item.description}
                      </p>
                      {item.teamCapacity && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-2">
                          <span className="font-semibold">Team Capacity:</span> {item.teamCapacity}
                        </p>
                      )}
                      {item.totalStoryPoints !== undefined && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          <span className="font-semibold">Total Story Points:</span> {item.totalStoryPoints}
                        </p>
                      )}
                    </>
                  )}
                  
                  <div className="flex items-center space-x-6">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    <span className={`text-sm font-semibold ${
                      type === 'sprint' ? 'text-teal-600' : 'text-indigo-600'
                    }`}>
                      {item.userStories.length} User{" "}
                      {item.userStories.length === 1 ? "Story" : "Stories"}
                    </span>
                    {type === 'backlog' && (
                      <span className="text-sm font-semibold text-purple-600">
                        {item.numberOfEmployees} Employees
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      expandedItem === item.name
                        ? `${type === 'sprint' ? 'bg-teal-600' : 'bg-indigo-600'} text-white transform rotate-180`
                        : `bg-white text-gray-400 hover:${type === 'sprint' ? 'bg-teal-100 hover:text-teal-600' : 'bg-indigo-100 hover:text-indigo-600'}`
                    }`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {expandedItem === item.name && (
              <div className="p-6 space-y-6 bg-white border-t border-gray-200">
                {item.userStories.length > 0 ? (
                  item.userStories.map((us) => (
                    <div
                      key={us.name}
                      className="border border-gray-300 rounded-xl overflow-hidden shadow-md"
                    >
                      <div
                        className="bg-gray-50 p-5 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                        onClick={() =>
                          setExpandedStory(expandedStory === us.name ? null : us.name)
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">
                                {us.name}
                              </span>
                              <h5 className="text-lg font-bold text-gray-900">{us.description}</h5>
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(
                                  us.priority
                                )}`}
                              >
                                {us.priority}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              <span
                                className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                                  us.status
                                )}`}
                              >
                                {us.status}
                              </span>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  />
                                </svg>
                                <span className="font-semibold">{us.storyPoints} Points</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  />
                                </svg>
                                <span className="font-semibold">
                                  {us.assignedTo || "Unassigned"}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                  />
                                </svg>
                                <span className="font-semibold">{us.tasks.length} Tasks</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                expandedStory === us.name
                                  ? "bg-purple-600 text-white transform rotate-180"
                                  : "bg-white text-gray-400 hover:bg-purple-100 hover:text-purple-600"
                              }`}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      {expandedStory === us.name && (
                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
                          <h6 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                            <svg
                              className="w-5 h-5 text-indigo-600 mr-2"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              />
                            </svg>
                            Tasks
                          </h6>
                          <div className="grid gap-4">
                            {us.tasks.length > 0 ? (
                              us.tasks.map((task) => (
                                <div
                                  key={task.name}
                                  className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded">
                                        {task.name}
                                      </span>
                                      <h6 className="text-lg font-bold text-gray-900">
                                        {task.description}
                                      </h6>
                                    </div>
                                    <span
                                      className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(
                                        task.status
                                      )}`}
                                    >
                                      {task.status}
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <p className="text-lg font-semibold">No tasks available</p>
                                <p className="text-sm">Tasks will appear here when they are added to this user story.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h2a1 1 0 100-2H7z"
                        />
                      </svg>
                    </div>
                    <p className="text-xl font-semibold mb-2">
                      No user stories in this {type === 'sprint' ? 'sprint' : 'backlog'}
                    </p>
                    <p className="text-sm">
                      User stories will appear here when they are added to this {type === 'sprint' ? 'sprint' : 'backlog'}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>  
  );
};

export default CollapsibleSection;