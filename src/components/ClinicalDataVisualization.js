import React, { useState, useEffect } from 'react';
import GenderPieChart from './GenderPieChart';
import AgeHistogram from './AgeHistogram';
import Heatmap from './Heatmap';  // Import Kaplan-Meier Plot

const ClinicalDataVisualization = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchClinicalData = async () => {
            try {
                const response = await fetch(
                    'https://api.gdc.cancer.gov/cases?filters={"op":"in","content":{"field":"project.project_id","value":["TCGA-BRCA"]}}&size=100&fields=demographic.gender,diagnoses.age_at_diagnosis,diagnoses.vital_status,diagnoses.days_to_death,diagnoses.days_to_last_follow_up'
                );
                const result = await response.json();
                setData(result.data.hits);
                console.log(result.data.hits); // Logs the data so you can inspect it
            } catch (error) {
                console.error('Error fetching clinical data:', error);
            }
        };


        fetchClinicalData();
    }, []);

    return (
        <div>
            <h2>Clinical Data Visualization</h2>
            {data ? (
                <div>
                    <h3>Gender Distribution</h3>
                    <GenderPieChart data={data} /> {/* Pass the data to the gender pie chart */}

                    <h3>Age at Diagnosis</h3>
                    <AgeHistogram data={data} /> {/* Pass the data to the age histogram */}

                    <h3>Age at Diagnosis vs Survival Heatmap</h3>
                    <Heatmap data={data} /> {/* Kaplan-Meier Plot */}
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default ClinicalDataVisualization;
