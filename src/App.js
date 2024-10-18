import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NetworkGraph from './components/NetworkGraph';
import TreeDiagram from './components/TreeDiagram';
import ClinicalDataVisualization from './components/ClinicalDataVisualization';
import GeneExpressionData from "./components/GeneExpressionData";
import mutationData from "./components/MutationData";
import MutationData from "./components/MutationData";

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
                </Routes>
            </div>
        </Router>
    );
}

export default App;
