import React, { useState } from 'react';

const FilterSidebar = ({ onFilterChange }) => {
    const [statistics, setStatistics] = useState("ASR");
    const [measure, setMeasure] = useState("incidence");
    const [sex, setSex] = useState("both");
    const [cancerType, setCancerType] = useState("all");

    const handleFilterChange = () => {
        onFilterChange({ statistics, measure, sex, cancerType });
    };

    return (
        <div className="filter-sidebar">
            <h3>Filters</h3>

            <div>
                <label>Statistics:</label>
                <select value={statistics} onChange={e => setStatistics(e.target.value)} onBlur={handleFilterChange}>
                    <option value="ASR">Age-Standardized Rate (World)</option>
                    <option value="crude">Crude Rate</option>
                </select>
            </div>

            <div>
                <label>Measures:</label>
                <select value={measure} onChange={e => setMeasure(e.target.value)} onBlur={handleFilterChange}>
                    <option value="incidence">Incidence</option>
                    <option value="mortality">Mortality</option>
                </select>
            </div>

            <div>
                <label>Sexes:</label>
                <select value={sex} onChange={e => setSex(e.target.value)} onBlur={handleFilterChange}>
                    <option value="both">Both sexes</option>
                    <option value="male">Males</option>
                    <option value="female">Females</option>
                </select>
            </div>

            <div>
                <label>Cancer Type(s):</label>
                <select value={cancerType} onChange={e => setCancerType(e.target.value)} onBlur={handleFilterChange}>
                    <option value="all">All cancers</option>
                    <option value="breast">Breast cancer</option>
                    <option value="lung">Lung cancer</option>
                </select>
            </div>
        </div>
    );
};

export default FilterSidebar;
