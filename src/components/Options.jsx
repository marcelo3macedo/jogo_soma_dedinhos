import React, { useState, useEffect } from 'react';

function Options({ options, correctAnswer, onSelect }) {
    const [selected, setSelected] = useState(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        // Reset state when options change (new question)
        setSelected(null);
        setDisabled(false);
    }, [options]);

    const handleClick = (option) => {
        if (disabled) return;
        setSelected(option);
        setDisabled(true);
        onSelect(option);
    };

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
            {options.map((option, index) => (
                <button
                    key={index}
                    onClick={() => handleClick(option)}
                    disabled={disabled}
                    className={`p-4 sm:p-5 text-xl sm:text-2xl font-semibold rounded-lg border-2
                        ${selected === option
                            ? (option === correctAnswer ? 'bg-green-500 border-green-700 text-white' : 'bg-red-500 border-red-700 text-white')
                            : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-800'
                        }
                        ${disabled && selected !== option ? 'opacity-50 cursor-not-allowed' : 'transition duration-150'}
                    `}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

export default Options;