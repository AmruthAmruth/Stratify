import React, { useState } from 'react';
import Table from '../../shared/components/Table/Table';

const columns = [
  { key: 'name', label: 'Company Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
   { key: 'createdAt', label: 'Created At' },
];
const sampleData = [
  { id: 1, name: 'NovaTech', email: 'contact@novatech.com', status: 'Active', createdAt: '2023-07-15' },
  { id: 2, name: 'BitLogic', email: 'info@bitlogic.io', status: 'Inactive', createdAt: '2022-12-10' },
  { id: 3, name: 'CoreAxis', email: 'hello@coreaxis.org', status: 'Active', createdAt: '2023-01-21' },
  { id: 4, name: 'DataBridge', email: 'team@databridge.net', status: 'Active', createdAt: '2024-02-14' },
  { id: 5, name: 'NextStep', email: 'support@nextstep.dev', status: 'Inactive', createdAt: '2023-03-19' },
  { id: 6, name: 'ByteSpace', email: 'admin@bytespace.com', status: 'Active', createdAt: '2023-04-04' },
  { id: 7, name: 'CloudNest', email: 'cloud@cloudnest.io', status: 'Inactive', createdAt: '2024-01-08' },
  { id: 8, name: 'AppForge', email: 'apps@appforge.ai', status: 'Active', createdAt: '2023-06-27' },
  { id: 9, name: 'LogiWeb', email: 'info@logiweb.co', status: 'Active', createdAt: '2022-11-30' },
  { id: 10, name: 'VividTech', email: 'contact@vividtech.com', status: 'Inactive', createdAt: '2024-04-18' },
  { id: 11, name: 'SmartEdge', email: 'hello@smartedge.io', status: 'Active', createdAt: '2023-05-23' },
  { id: 12, name: 'AIWorks', email: 'support@aiworks.org', status: 'Inactive', createdAt: '2022-09-12' },
  { id: 13, name: 'LinkPulse', email: 'team@linkpulse.net', status: 'Active', createdAt: '2023-10-01' },
  { id: 14, name: 'SkyLabs', email: 'admin@skylabs.dev', status: 'Active', createdAt: '2023-08-07' },
  { id: 15, name: 'EchoByte', email: 'contact@echobyte.io', status: 'Inactive', createdAt: '2024-05-05' },
  { id: 16, name: 'NetTide', email: 'info@nettide.com', status: 'Active', createdAt: '2023-02-13' },
  { id: 17, name: 'BrightNest', email: 'hello@brightnest.ai', status: 'Active', createdAt: '2023-09-17' },
  { id: 18, name: 'AlphaEdge', email: 'support@alphaedge.org', status: 'Inactive', createdAt: '2024-03-22' },
  { id: 19, name: 'ZenPixel', email: 'team@zenpixel.dev', status: 'Active', createdAt: '2022-10-11' },
  { id: 20, name: 'LogicVerse', email: 'admin@logicverse.io', status: 'Inactive', createdAt: '2023-12-29' }
];



const AllCompanies = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const paginatedData = sampleData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(sampleData.length / pageSize);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Companies</h2>
      <Table
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default AllCompanies;
