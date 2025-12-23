import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCompanyProjects } from '@/services/projects';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import TableFilterBar from '@/shared/components/FilterBar/TableFilterBar';
import Table from '@/shared/components/Table/Table';
import { LoadingSpinner } from '@/shared/components/Loading';
import { Project, ProjectsResponse } from '@/types/types';

type SortKey = keyof Project | '';

const Projects = () => {
  const [projects, setProjects] = useState<ProjectsResponse | null>(null);
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
      const data = await getCompanyProjects();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  if (!projects) {
    return <LoadingSpinner fullScreen text="Loading projects..." />;
  }

  /** Filter projects */
  const filteredProjects = projects.projects
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
    new Set(projects.projects.map((p) => p.status))
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
          value={projects.counts?.total ?? 0}
          subtitle="All company projects"
          trend={(projects.counts?.total ?? 0) > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Planned Projects"
          value={projects.counts?.planned ?? 0}
          subtitle="Not started yet"
          trend={(projects.counts?.planned ?? 0) > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Active Projects"
          value={projects.counts?.active ?? 0}
          subtitle="Currently running"
          trend={(projects.counts?.active ?? 0) > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Completed Projects"
          value={projects.counts?.completed ?? 0}
          subtitle="Finished successfully"
          trend={(projects.counts?.completed ?? 0) > 0 ? 'up' : 'down'}
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

      {/* Projects table */}
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
    </div>
  );
};

export default Projects;
