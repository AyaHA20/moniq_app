import React from 'react';
import ErrorsTable from './ErrorsTable';
import ErrorChartCard from './ErrorChartCard';
function ErrorsManage() {
    //essayage du 
    const totalErrors = 20;
    const errorData = [5, 6]; // Exemple : valeurs pour Critical, Error, Warning, Info, Debug
  return (
    <div className=' flex  justify-between gap-5'>
      <div className="mt-5 bg-white w-4/5 h-full p-6 rounded-lg">
           {/*tableau des erreurs*/}
           <ErrorsTable/>
      </div>
      <div className= "w-1/5 h-full p-6 rounded-lg flex flex-col items-center">
           {/*contenu erreur*/}
           <ErrorChartCard totalErrors={totalErrors} errorData={errorData} />
      </div>


      
    </div>




  );
}

export default ErrorsManage;
