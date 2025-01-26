import React from 'react';
import ErrorsTable from './ErrorsTable';
import ErrorChartCard from './ErrorChartCard';

function ErrorsManage() {
  return (
    <div className="flex justify-between gap-5">
      <div className="mt-5 bg-white w-4/5 h-full p-6 rounded-lg">
        {/* Tableau des erreurs */}
        <ErrorsTable />
      </div>
      <div className="w-1/5 h-full p-6 rounded-lg flex flex-col items-center">
        {/* Carte des statistiques des erreurs */}
        <ErrorChartCard />
      </div>
    </div>
  );
}

export default ErrorsManage;