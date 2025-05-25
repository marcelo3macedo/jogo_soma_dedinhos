import React from 'react';

function Timer({ timeLeft }) {
    const displayTime = Math.max(0, timeLeft).toFixed(1);
    const progress = (timeLeft / 10) * 100; // Assuming 10 seconds max

    return (
        <div className="text-right">
            <div className="text-lg sm:text-xl font-mono text-orange-600">
                {displayTime}s
            </div>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                    className="h-full bg-orange-500 transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
export default Timer;