import React from 'react';
import QuestionDisplay from './QuestionDisplay';
import Options from './Options';
import ScoreDisplay from './ScoreDisplay';
import Timer from './Timer';
import ScoreAnimation from './ScoreAnimation';

function GameScreen({ question, onAnswer, score, timeLeft, questionNumber, totalQuestions, showScoreAnimation }) {
    if (!question) return <div className="text-center p-8">Carregando pergunta...</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-4 relative">
            {showScoreAnimation && <ScoreAnimation animationData={showScoreAnimation} />}
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-2xl text-center max-w-xl w-full">
                <div className="flex justify-between items-center mb-4">
                    <ScoreDisplay score={score} />
                    <div className="text-sm text-gray-600">
                        Pergunta: {questionNumber}/{totalQuestions}
                    </div>
                    <Timer timeLeft={timeLeft} />
                </div>

                <QuestionDisplay
                    num1={question.num1}
                    num2={question.num2}
                    operation={question.operation}
                />

                <Options
                    options={question.options}
                    correctAnswer={question.correctAnswer}
                    onSelect={onAnswer}
                />
            </div>
        </div>
    );
}

export default GameScreen;