import React from 'react';

function DifficultyScreen({ difficulties, onSelect }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-green-600">Escolha a Dificuldade</h1>
                <div className="space-y-4">
                    {Object.entries(difficulties).map(([key, { name }]) => (
                        <button
                            key={key}
                            onClick={() => onSelect(key)}
                            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-150 text-lg"
                        >
                            {name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DifficultyScreen;