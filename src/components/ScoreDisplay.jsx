import React from 'react';

function ScoreDisplay({ score }) {
    return (
        <div className="text-xl sm:text-2xl font-bold text-purple-600">
            Pontos: <span className="text-purple-800">{score}</span>
        </div>
    );
}
export default ScoreDisplay;