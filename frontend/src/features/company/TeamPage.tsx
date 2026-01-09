import React, { useEffect, useState } from 'react';
import { getTeamMember } from '@/services/company';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import TableFilterBar from '@/shared/components/FilterBar/TableFilterBar';
import Table from '@/shared/components/Table/Table';
import { TeamMember } from '@/types/types';

type SortKey = keyof TeamMember | '';

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 7;

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setIsLoading(true);
      try {
        const data = await getTeamMember();
        setTeamMembers(data || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setTeamMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Calculate statistics
  const totalMembers = teamMembers.length;
  const managersCount = teamMembers.filter((m) => m.role?.toLowerCase() === 'manager').length;
  const employeesCount = teamMembers.filter((m) => m.role?.toLowerCase() !== 'manager').length;
  const activeMembers = teamMembers.filter((m) => m.status?.toLowerCase() === 'active').length;

  // Filter team members
  const filteredMembers = teamMembers
    .filter((member) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        (member.position && member.position.toLowerCase().includes(searchLower));

      const matchesRole = !filterRole || member.role === filterRole;
      const matchesStatus = !filterStatus || member.status === filterStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });

  // Sort team members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
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

  // Pagination
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedMembers.slice(startIndex, startIndex + itemsPerPage);

  // Get unique roles and statuses for filters
  const uniqueRoles = Array.from(new Set(teamMembers.map((m) => m.role).filter(Boolean)));
  const uniqueStatuses = Array.from(new Set(teamMembers.map((m) => m.status).filter(Boolean)));

  const clearFilters = () => {
    setSearchTerm('');
    setFilterRole('');
    setFilterStatus('');
    setSortBy('');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  return (
    <div className="text-text space-y-6">
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Members"
          value={totalMembers}
          subtitle="All team members"
          trend={totalMembers > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Managers"
          value={managersCount}
          subtitle="Leadership roles"
          trend={managersCount > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Employees"
          value={employeesCount}
          subtitle="Team contributors"
          trend={employeesCount > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Active Members"
          value={activeMembers}
          subtitle="Currently active"
          trend={activeMembers > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Filter bar */}
      <TableFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOptions={uniqueRoles}
        filterValue={filterRole}
        setFilterValue={setFilterRole}
        filterLabel="Role"
        sortOptions={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'role', label: 'Role' },
          { key: 'position', label: 'Position' },
          { key: 'departmentName', label: 'Department' },
        ]}
        sortBy={sortBy ? String(sortBy) : null}
        setSortBy={(val: string) => setSortBy(val as SortKey)}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onClearFilters={clearFilters}
      />

      {/* Results info */}
      {(searchTerm || filterRole || filterStatus) && (
        <div className="text-sm text-muted">
          Showing {sortedMembers.length} of {teamMembers.length} team members
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="bg-surface rounded-lg shadow-sm border border-borderColor p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted">Loading team members...</p>
          </div>
        </div>
      ) : teamMembers.length === 0 ? (
        /* Empty state - no team members at all */
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <div>
              <p className="text-muted text-lg">No team members found.</p>
              <p className="text-muted/70 text-sm mt-1">Team members will appear here once they are added.</p>
            </div>
          </div>
        </div>
      ) : sortedMembers.length === 0 ? (
        /* Empty state - no results after filtering */
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <div>
              <p className="text-muted text-lg">No team members match your search criteria.</p>
              <p className="text-muted/70 text-sm mt-1">Try adjusting your filters or search terms.</p>
            </div>
            <button
              onClick={clearFilters}
              className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryHover transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        /* Team members table */
        <Table
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'position', label: 'Position' },
            { key: 'departmentName', label: 'Department' },
            { key: 'phone', label: 'Phone' },
            { key: 'status', label: 'Status' },
          ]}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          actions={[
            {
              label: 'View Details',
              type: 'custom',
              onClick: (row: TeamMember) => console.log(`Viewing ${row.name}`),
            },
            {
              label: 'Edit',
              type: 'edit',
              onClick: (row: TeamMember) => console.log(`Editing ${row.name}`),
            },
            {
              label: 'Message',
              type: 'approve',
              onClick: (row: TeamMember) => console.log(`Messaging ${row.name}`),
            },
          ]}
        />
      )}
    </div>
  );
};

export default TeamPage;