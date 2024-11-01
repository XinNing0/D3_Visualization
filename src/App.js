import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NetworkGraph from './components/NetworkGraph';
import TreeDiagram from './components/TreeDiagram';
import ClinicalDataVisualization from './components/ClinicalDataVisualization';
import GeneExpressionData from "./components/GeneExpressionData";
import MutationData from "./components/MutationData";
import MapHeatmap from "./components/MapHeatmap";
import MutationLolliplot from "./components/MutationLolliplot";
import VariantFrequencyPlot from "./components/VariantFrequencyPlot";
import DNAVisualizer from "./components/DNAVisualizer";

const mutationData = [
    { location: 10, impact: 5 },
    { location: 25, impact: 8 },
    { location: 40, impact: 12 },
    { location: 75, impact: 3 },
];

const variantData = [
    { variantType: "A>C", frequency: 120 },
    { variantType: "C>G", frequency: 80 },
    { variantType: "T>A", frequency: 150 },
    { variantType: "G>T", frequency: 90 },
];

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Bioinformatics Visualization App</h1>
                    <nav>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/networkgraph">Network Graph Visualization</Link></li>
                            <li><Link to="/treediagram">Tree Diagram Visualization</Link></li>
                            <li><Link to="/clincal">Clinical Data Visualization</Link></li>
                            <li><Link to="/gene">Gene Expression Data Visualization</Link></li>
                            <li><Link to="/mutation">Mutation Data Visualization</Link></li>
                            <li><Link to="/geoHeatmap">GeoHeatmap Data Visualization</Link></li>
                            <li><Link to="/MutationLolliplot">Mutation Lolliplot Data Visualization</Link></li>
                            <li><Link to="/Variant">Variant Data Visualization</Link></li>
                            <li><Link to="/dna">3D DNA Visualization</Link></li>


                        </ul>
                    </nav>
                </header>

                <Routes>
                    <Route path="/" element={<div><h2>Welcome to the Bioinformatics Visualization App</h2><p>Choose a visualization from the menu.</p></div>} />
                    <Route path="/networkgraph" element={<NetworkGraph />} />
                    <Route path="/treediagram" element={<TreeDiagram />} />
                    <Route path="/clincal" element={<ClinicalDataVisualization />} />
                    <Route path="/gene" element={<GeneExpressionData />} />
                    <Route path="/mutation" element={<MutationData />} />
                    <Route path="/geoHeatmap" element={<MapHeatmap />} />
                    <Route path="/MutationLolliplot" element={<MutationLolliplot data={mutationData} />} />
                    <Route path="/variant" element={<VariantFrequencyPlot data={variantData} />} />
                    <Route path="/dna" element={<DNAVisualizer />} />


                </Routes>
            </div>
        </Router>
    );
}

export default App;
