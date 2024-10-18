import React, { useState, useEffect } from 'react';
import BubbleChart from "./BubbleChart";

const GeneExpressionData = () => {
    const [expressionData, setExpressionData] = useState([]);

    useEffect(() => {
        const fetchGeneExpressionData = async () => {
            try {
                const response = await fetch(
                    'https://api.gdc.cancer.gov/files?filters={"op":"in","content":{"field":"cases.project.project_id","value":["TCGA-BRCA"]}}&size=100&fields=cases.diagnoses.age_at_diagnosis,cases.diagnoses.days_to_death,cases.diagnoses.days_to_last_follow_up,file_name,data_type'
                );
                const data = await response.json();
                // Adjust data to fit the expected format of BubbleChart
                const processedData = data.data.hits.map(item => ({
                    id: item.file_name,  // Use file_name as ID for the bubble
                    value: Math.random() * 100,  // Placeholder: replace with actual value (e.g., expression value)
                    label: item.data_type  // Display the data type as label
                }));
                setExpressionData(processedData);
                console.log(processedData); // Check the processed data in the console
            } catch (error) {
                console.error('Error fetching gene expression data:', error);
            }
        };

        fetchGeneExpressionData();
    }, []);  // No dependencies are needed here

    return (
        <div>
            <h3>Gene Expression Data Visualization</h3>
            <BubbleChart data={expressionData} />
        </div>
    );
};

export default GeneExpressionData;
