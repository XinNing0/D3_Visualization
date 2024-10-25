import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import dataset from '../data/dataset-asr-inc-both-sexes-in-2022-all-cancers.json';
import './MapHeatmap.css';
import FilterSidebar from './FilterSidebar';
import countryNameMap from "../utils/countryNameMap";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";
const MapHeatmap = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [maxAsr, setMaxAsr] = useState(0);

    // Default filter options
    const [filters, setFilters] = useState({
        statistics: 'ASR',
        measure: 'incidence',
        sex: 'both',
        cancerType: 'all',
    });

    // Load dataset
    useEffect(() => {
        console.log("Dataset loaded:", dataset);
        setData(dataset);
    }, []);

    // Apply filters
    useEffect(() => {
        const { cancerType, sex } = filters;

        console.log("Applying filters:");
        console.log("Selected cancerType:", cancerType);
        console.log("Selected sex:", sex);

        const filtered = data.filter(d => {
            const cancerTypeMatch = cancerType === "all" || d.cancer_label.toLowerCase() === cancerType.toLowerCase();
            const sexMatch = sex === "both" || (sex === "male" && d.sex === 0) || (sex === "female" && d.sex === 1);
            return cancerTypeMatch && sexMatch;
        });

        console.log("Filtered Data Length:", filtered.length);
        console.log("Filtered Data:", filtered);

        if (filtered.length > 0) {
            const maxAsrValue = d3.max(filtered, d => d.asr || 0);
            console.log("Max ASR Value after filtering:", maxAsrValue);
            setMaxAsr(maxAsrValue || 1);
        } else {
            setMaxAsr(1);
        }

        setFilteredData(filtered);
    }, [filters, data]);

    useEffect(() => {
        console.log("Filtered Data (after filtering):", filteredData);
        console.log("Max ASR for color scale:", maxAsr);
    }, [filteredData, maxAsr]);

    const colorScale = d3.scaleSequential()
        .domain([0, maxAsr])
        .interpolator(d3.interpolateBlues);

    // Update filters when the sidebar changes
    const handleFilterChange = (newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters
        }));
    };


    return (
        <div className="visualization-container">
            <FilterSidebar onFilterChange={handleFilterChange} />

            <div className="map-container">
                <ComposableMap>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map(geo => {
                                const countryName = geo.properties.name;
                                const mappedCountryName = countryNameMap[countryName] || countryName;

                                console.log("Checking country:", mappedCountryName);

                                const countryData = filteredData.find(d => d.country_label === mappedCountryName);

                                if (!countryData) {
                                    console.warn(`No data for country: ${mappedCountryName}`);
                                }

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={countryData ? colorScale(countryData.asr) : "#EEE"}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ComposableMap>
            </div>
        </div>
    );
};

export default MapHeatmap;
