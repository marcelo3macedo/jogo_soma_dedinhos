import React from 'react';

function QuestionDisplay({ num1, num2, operation }) {
    const getImageUrl = (num) => {
        const imageName = (num >= 0 && num <= 5) ? `${num}.jpg` : 'desconhecido.png'; // Crie um desconhecido.png se precisar
        return `${import.meta.env.BASE_URL}/assets/img/fingers/${imageName}`;
    };

    return (
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 my-6 sm:my-8">
            <img src={getImageUrl(num1)} alt={`Número ${num1}`} className="h-20 w-20 sm:h-28 sm:w-28 object-contain" />
            <span className="text-3xl sm:text-5xl font-bold text-gray-700">{operation}</span>
            <img src={getImageUrl(num2)} alt={`Número ${num2}`} className="h-20 w-20 sm:h-28 sm:w-28 object-contain" />
            <span className="text-3xl sm:text-5xl font-bold text-gray-700">= ?</span>
        </div>
    );
}
export default QuestionDisplay;