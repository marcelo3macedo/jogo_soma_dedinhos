import React, { useEffect, useState } from 'react';

function ScoreAnimation({ animationData }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (animationData) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 1800); // Duração da animação
            return () => clearTimeout(timer);
        }
    }, [animationData]);

    if (!visible || !animationData) return null;

    const { base, bonus, total, incorrect } = animationData;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className={`p-6 rounded-lg shadow-2xl text-white text-center animate-fadeInOut
                ${incorrect ? 'bg-red-500' : 'bg-green-500'} `}>
                {incorrect ? (
                    <div className="text-3xl font-bold">Ops!</div>
                ) : (
                    <>
                        {base > 0 && <div className="text-2xl font-bold">Resposta Correta: +{base}</div>}
                        {bonus > 0 && <div className="text-xl">Bônus de Tempo: +{bonus}</div>}
                        <div className="text-3xl font-bold mt-2">Total: +{total}</div>
                    </>
                )}
            </div>
        </div>
    );
}
// Adicione a animação em App.css ou index.css
// @keyframes fadeInOut {
//   0%, 100% { opacity: 0; transform: scale(0.8) translateY(20px); }
//   10%, 90% { opacity: 1; transform: scale(1) translateY(0); }
// }
// .animate-fadeInOut {
//   animation: fadeInOut 2s ease-in-out forwards;
// }

export default ScoreAnimation;