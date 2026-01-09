import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCompanyProjects } from '@/services/projects';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import TableFilterBar from '@/shared/components/FilterBar/TableFilterBar';
import Table from '@/shared/components/Table/Table';
import { Project, ProjectsResponse } from '@/types/types';

type SortKey = keyof Project | '';

const Projects = () => {
  const [projects, setProjects] = useState<ProjectsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 5;
  const navigate = useNavigate();

  /**
   * Fetch projects
   * (defined inside useEffect to satisfy exhaustive-deps rule)
   */
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      const data = await getCompanyProjects();
      setProjects(data);
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  // Get project counts (default to 0 if loading or no data)
  const counts = projects?.counts ?? { total: 0, planned: 0, active: 0, completed: 0 };

  // Get projects array (default to empty array if loading or no data)
  const projectsList = projects?.projects ?? [];

  /** Filter projects */
  const filteredProjects = projectsList
    .filter((p) =>
      (p.projectName || p.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((p) => (filterStatus ? p.status === filterStatus : true));

  /** Sort projects */
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortBy) return 0;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  /** Pagination */
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  /** Status filter options */
  const uniqueStatus = Array.from(
    new Set(projectsList.map((p) => p.status))
  );

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setSortBy('');
    setSortOrder('asc');
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="text-text space-y-6">
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Projects"
          value={counts.total}
          subtitle="All company projects"
          trend={counts.total > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Planned Projects"
          value={counts.planned}
          subtitle="Not started yet"
          trend={counts.planned > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Active Projects"
          value={counts.active}
          subtitle="Currently running"
          trend={counts.active > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Completed Projects"
          value={counts.completed}
          subtitle="Finished successfully"
          trend={counts.completed > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Filter bar */}
      <TableFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOptions={uniqueStatus}
        filterValue={filterStatus}
        setFilterValue={setFilterStatus}
        sortOptions={[
          { key: 'projectName', label: 'Project Name' },
          { key: 'projectLead', label: 'Project Lead' },
          { key: 'departmentName', label: 'Department' },
          { key: 'remainingTimeInDays', label: 'Remaining Days' },
        ]}
        sortBy={sortBy ? String(sortBy) : null}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onClearFilters={clearFilters}
      />

      {/* Empty state or table */}
      {projectsList.length === 0 ? (
        <div className="bg-surface rounded-lg shadow-sm border border-borderColor p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <svg
              className="w-16 h-16 text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <p className="text-muted text-lg">No projects found.</p>
              <p className="text-muted/70 text-sm mt-1">Projects will appear here once they are created.</p>
            </div>
          </div>
        </div>
      ) : (
        /* Projects table */
        <Table
          columns={[
            { key: 'projectName', label: 'Project Name' },
            { key: 'projectDescription', label: 'Project Description' },
            { key: 'departmentName', label: 'Department Name' },
            { key: 'projectLead', label: 'Project Lead' },
            { key: 'status', label: 'Status' },
            { key: 'remainingTimeInDays', label: 'Remaining Days' },
          ]}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          actions={[
            {
              label: 'View More',
              type: 'custom',
              onClick: (row: Project) => handleViewProject(row.id),
            },
            {
              label: 'Edit',
              type: 'edit',
              onClick: (row: Project) =>
                alert(`Editing ${row.projectName}`),
            },
            {
              label: 'Archive',
              type: 'delete',
              onClick: (row: Project) =>
                alert(`Archiving ${row.projectName}`),
            },
          ]}
        />
      )}
    </div>
  );
};

export default Projects;
