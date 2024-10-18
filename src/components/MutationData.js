import React, { useState, useEffect } from 'react';
import TimeSeriesChart from './TimeSeriesChart';  // Import your chart component

const MutationData = () => {
    const [mutationData, setMutationData] = useState([]);
    const [processedData, setProcessedData] = useState([]);

    useEffect(() => {
        const fetchMutationData = async () => {
            try {
                const response = await fetch(
                    'https://api.gdc.cancer.gov/cases?filters={"op":"in","content":{"field":"project.project_id","value":["TCGA-BRCA"]}}&size=100&fields=demographic.gender,diagnoses.days_to_last_follow_up'
                );
                const result = await response.json();

                const rawData = result.data.hits;

                // Map the raw data to processed data for the chart
                const mappedData = rawData.map(item => {
                    const caseData = item.diagnoses[0];
                    return {
                        id: item.id,  // Unique ID for the patient
                        gender: item.demographic.gender,  // Gender of the patient
                        days: caseData.days_to_last_follow_up  // Time in days since diagnosis
                    };
                });

                setMutationData(rawData);  // Store raw data for debugging
                setProcessedData(mappedData);  // Store processed data for the chart

                console.log(mappedData);  // Debugging to check processed data
            } catch (error) {
                console.error('Error fetching mutation data:', error);
            }
        };

        fetchMutationData();
    }, []);

    return (
        <div>
            <h1>Time Series Visualization</h1>
            {mutationData.length > 0 ? (
                <div>
                    {/*<pre>{JSON.stringify(mutationData, null, 2)}</pre>*/}

                    {/* Time Series Mutation Chart */}
                    <TimeSeriesChart data={processedData} />  {/* Pass processed data to the chart */}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MutationData;
