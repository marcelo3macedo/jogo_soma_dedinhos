import React, { useState, useEffect } from 'react';

function GameOverScreen({ scoreData, onPlayAgain }) {
    const [rankingMessage, setRankingMessage] = useState('');
    const [topScores, setTopScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const saveAndFetchScores = async () => {
            setIsLoading(true);
            try {
                // Salvar a pontuação atual
                // window.wpReactPlugin é definido por wp_localize_script no plugin PHP
                if (window.wpReactPlugin && window.wpReactPlugin.ajax_url) {
                    const saveResponse = await fetch(window.wpReactPlugin.ajax_url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            action: 'meu_plugin_save_score', // Ação AJAX no WordPress
                            _ajax_nonce: window.wpReactPlugin.nonce, // Nonce para segurança
                            player_name: scoreData.playerName,
                            score: scoreData.score,
                            difficulty: scoreData.difficulty,
                        }),
                    });
                    const saveData = await saveResponse.json();

                    if (saveData.success && saveData.data && saveData.data.rank) {
                        if (saveData.data.rank <= 10) {
                            setRankingMessage(`Você entrou no Top 10! Posição: ${saveData.data.rank}º`);
                        } else {
                            setRankingMessage('Ótima pontuação!');
                        }
                    } else if (saveData.success) {
                         setRankingMessage('Pontuação salva!');
                    }
                     else {
                        setRankingMessage('Erro ao salvar pontuação. ' + (saveData.data?.message || ''));
                        console.error("Save error data:", saveData);
                    }
                } else {
                    setRankingMessage('Configuração do plugin não encontrada para salvar.');
                    console.warn("wpReactPlugin.ajax_url not defined");
                }

                // Buscar o placar
                if (window.wpReactPlugin && window.wpReactPlugin.ajax_url) {
                   const scoresResponse = await fetch(window.wpReactPlugin.ajax_url, {
                        method: 'POST', // Ou GET, se preferir configurar assim
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            action: 'meu_plugin_get_top_scores',
                            _ajax_nonce: window.wpReactPlugin.nonce_get_scores // Um nonce diferente ou o mesmo se a permissão for a mesma
                        }),
                    });
                    const scoresData = await scoresResponse.json();
                    if (scoresData.success) {
                        setTopScores(scoresData.data);
                    } else {
                        console.error("Error fetching scores:", scoresData.data?.message);
                    }
                } else {
                     console.warn("wpReactPlugin.ajax_url not defined for getting scores");
                }

            } catch (error) {
                console.error('Erro ao comunicar com o servidor:', error);
                setRankingMessage('Erro de comunicação ao salvar/buscar pontuação.');
            } finally {
                setIsLoading(false);
            }
        };

        if (scoreData) {
            saveAndFetchScores();
        }
    }, [scoreData]);


    if (!scoreData) return null;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-purple-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg w-full">
                <h1 className="text-4xl font-bold mb-4 text-purple-600">Parabéns, {scoreData.playerName}!</h1>
                <p className="text-2xl mb-2 text-gray-700">Você completou a atividade de {scoreData.difficulty}.</p>
                <p className="text-3xl font-bold mb-6 text-yellow-500">Sua Pontuação Final: {scoreData.score}</p>

                {isLoading && <p className="text-purple-500 my-4">Carregando ranking...</p>}
                {!isLoading && rankingMessage && <p className="text-xl text-green-600 font-semibold mb-6">{rankingMessage}</p>}

                <button
                    onClick={onPlayAgain}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md text-lg transition duration-150 mb-8"
                >
                    Jogar Novamente
                </button>

                {!isLoading && topScores.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-purple-700">🏆 Placar dos Campeões 🏆</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pontuação</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dificuldade</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {topScores.map((entry, index) => (
                                        <tr key={entry.id} className={entry.player_name === scoreData.playerName && entry.score === scoreData.score ? "bg-yellow-100" : ""}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{entry.player_name}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{entry.score}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{entry.difficulty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                 {!isLoading && topScores.length === 0 && <p>Ainda não há pontuações no ranking. Seja o primeiro!</p>}
            </div>
        </div>
    );
}

export default GameOverScreen;