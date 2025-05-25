import React, { useState } from 'react';

function NameInputScreen({ onSubmit }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full">
                <h1 className="text-3xl font-bold mb-6 text-blue-600">Soma dos Dedinhos!</h1>
                <p className="mb-6 text-gray-700">Qual é o seu nome, pequeno gênio?</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite seu nome"
                        className="w-full p-3 border border-gray-300 rounded-md mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-150"
                    >
                        Começar!
                    </button>
                </form>
            </div>
        </div>
    );
}

export default NameInputScreen;