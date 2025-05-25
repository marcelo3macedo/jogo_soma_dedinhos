import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css'; // Certifique-se que este arquivo existe ou remova a importação se não usado
import NameInputScreen from './components/NameInputScreen';
import DifficultyScreen from './components/DifficultyScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';

// Configurações do Jogo
const DIFFICULTIES = {
    easy: { name: 'Fácil (Soma)', questions: 10, operation: '+', maxOperand: 5 },
    medium: { name: 'Médio (Subtração)', questions: 15, operation: '-', maxOperand: 5 },
    hard: { name: 'Difícil (Multiplicação)', questions: 20, operation: '*', maxOperand: 5 },
};
const TIME_PER_QUESTION = 10; // segundos
const POINTS_CORRECT = 100;
const POINTS_PER_SECOND = 10;

function App() {
    const [gameState, setGameState] = useState('nameInput');
    const [playerName, setPlayerName] = useState('');
    const [difficulty, setDifficulty] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const timerIdRef = useRef(null);
    const hasAnsweredRef = useRef(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [timerId, setTimerId] = useState(null);
    const [showScoreAnimation, setShowScoreAnimation] = useState(null);
    const [finalScoreData, setFinalScoreData] = useState(null);

    const backgroundAudioRef = useRef(null);
    const correctAudioRef = useRef(null);
    const errorAudioRef = useRef(null);

    useEffect(() => {
        backgroundAudioRef.current = new Audio('/assets/audio/background.mp3');
        backgroundAudioRef.current.loop = true;
        correctAudioRef.current = new Audio('/assets/audio/acerto.mp3');
        errorAudioRef.current = new Audio('/assets/audio/erro.mp3');
    }, []);

    const playSound = useCallback((type) => {
        if (type === 'correct' && correctAudioRef.current) {
            correctAudioRef.current.currentTime = 0;
            correctAudioRef.current.play().catch(e => console.error("Error playing correct sound:", e));
        } else if (type === 'error' && errorAudioRef.current) {
            errorAudioRef.current.currentTime = 0;
            errorAudioRef.current.play().catch(e => console.error("Error playing error sound:", e));
        }
    }, []);


    const stopTimer = useCallback(() => {
        if (timerId) {
            clearInterval(timerId);
            setTimerId(null);
        }
    }, [timerId]);

    const generateOptions = useCallback((correctAnswer, operation) => {
        const options = new Set([correctAnswer]);
        let attempts = 0;

        while (options.size < 4 && attempts < 100) {
            let randomOption;
            const variation = operation === '*' ? Math.floor(Math.random() * 11) - 5 : Math.floor(Math.random() * 7) - 3; // 0 a 10 -> -5 a 5; 0 a 6 -> -3 a 3
            randomOption = correctAnswer + variation;

            if (randomOption !== correctAnswer && randomOption >= 0 && !options.has(randomOption)) {
                 options.add(randomOption);
            }
            attempts++;
        }

        let fillValue = 1;
        const maxFillAttempts = Math.max(20, correctAnswer + 10);
        let fillAttempts = 0;
        while (options.size < 4 && fillAttempts < maxFillAttempts) {
            let potentialOption1 = correctAnswer + fillValue;
            let potentialOption2 = correctAnswer - fillValue;

            if (potentialOption1 >= 0 && !options.has(potentialOption1)) {
                options.add(potentialOption1);
                if (options.size === 4) break;
            }
            if (potentialOption2 >= 0 && !options.has(potentialOption2) && options.size < 4) { // Check size again
                options.add(potentialOption2);
                if (options.size === 4) break;
            }
            fillValue++;
            fillAttempts++;
        }
        // Last resort if still not filled (e.g. correctAnswer is 0 and all small numbers are taken)
        if(options.size < 4) {
            let emergencyOption = 0;
            while(options.size < 4) {
                if(!options.has(emergencyOption)) {
                    options.add(emergencyOption);
                }
                emergencyOption++;
                if (emergencyOption > 100) break; // Absolute safety break
            }
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    }, []);


    const generateQuestions = useCallback((diffKey) => {
        const diffSetting = DIFFICULTIES[diffKey];
        const newQuestions = [];
        for (let i = 0; i < diffSetting.questions; i++) {
            let num1 = Math.floor(Math.random() * diffSetting.maxOperand) + 1;
            let num2 = Math.floor(Math.random() * diffSetting.maxOperand) + 1;
            let correctAnswer;

            switch (diffSetting.operation) {
                case '+':
                    correctAnswer = num1 + num2;
                    break;
                case '-':
                    if (num1 < num2) [num1, num2] = [num2, num1];
                    correctAnswer = num1 - num2;
                    break;
                case '*':
                    correctAnswer = num1 * num2;
                    break;
                default:
                    correctAnswer = 0;
            }
            const options = generateOptions(correctAnswer, diffSetting.operation);
            newQuestions.push({ num1, num2, operation: diffSetting.operation, correctAnswer, options });
        }
        setQuestions(newQuestions);
    }, [generateOptions]); // Added generateOptions as dependency


    const handleAnswer = useCallback((selectedAnswer, isTimeout = false) => {
        stopTimer();
        
        const currentQ = questions[currentQuestionIndex];
        let earnedBase = 0;
        let earnedBonus = 0;
        let wasCorrect = false;
        let currentScore = score; // Capture current score for final calculation

        if (isTimeout) {
            playSound('error');
            setShowScoreAnimation({ base: 0, bonus: 0, total: 0, timeout: true });
        } else if (selectedAnswer === currentQ.correctAnswer) {
            playSound('correct');
            earnedBase = POINTS_CORRECT;
            earnedBonus = Math.floor(timeLeft * POINTS_PER_SECOND);
            const pointsThisRound = earnedBase + earnedBonus;
            setScore(prevScore => prevScore + pointsThisRound);
            currentScore += pointsThisRound; // Update currentScore for final data
            setShowScoreAnimation({ base: earnedBase, bonus: earnedBonus, total: pointsThisRound });
            wasCorrect = true;
        } else {
            playSound('error');
            setShowScoreAnimation({ base: 0, bonus: 0, total: 0, incorrect: true });
        }

        setTimeout(() => {
            setShowScoreAnimation(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
                // startTimer(); // startTimer will be called by an effect watching currentQuestionIndex or gameState
            } else {
                setGameState('gameOver');
                setFinalScoreData({
                    playerName,
                    score: currentScore, // Use the locally updated currentScore
                    difficulty: DIFFICULTIES[difficulty].name
                });
            }
        }, 2000);
    }, [
        stopTimer, questions, currentQuestionIndex, timeLeft, score, playerName,
        difficulty, playSound // Removed startTimer, will be handled by useEffect
    ]);

    const startTimer = useCallback(() => {
        setTimeLeft(TIME_PER_QUESTION);
        hasAnsweredRef.current = false;

        if (timerIdRef.current) clearInterval(timerIdRef.current);

        const newTimerId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 0.1) {
                    clearInterval(newTimerId);
                    if (!hasAnsweredRef.current) {
                        hasAnsweredRef.current = true;
                        handleAnswer(null, true);
                    }
                    return 0;
                }
                return Math.round((prevTime - 0.1) * 10) / 10; // rounding to 1 decimal
            });
        }, 100);

        timerIdRef.current = newTimerId;
    }, [handleAnswer]);

    // Effect to start timer when new question is set or game starts
    useEffect(() => {
        if (gameState === 'game' && questions.length > 0 && !showScoreAnimation) {
             // Ensures timer starts only when on a question screen, not score animation screen
            startTimer();
        }
        // Cleanup timer when component unmounts or dependencies change triggering a new effect run
        return () => {
            if (timerId) {
                clearInterval(timerId);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameState, currentQuestionIndex, questions.length, showScoreAnimation /* startTimer is stable due to useCallback */]);
    // We can disable eslint for startTimer dependency if we ensure it's stable.
    // Or include startTimer, but ensure its dependencies are minimal and stable.
    // Since handleAnswer is a dep of startTimer, and startTimer a dep of this effect,
    // making startTimer stable is important. It seems stable with `handleAnswer` and `timerId`.

    const handleNameSubmit = (name) => {
        setPlayerName(name);
        setGameState('difficulty');
        if (backgroundAudioRef.current && backgroundAudioRef.current.paused) {
            backgroundAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    };

    const handleDifficultySelect = (diffKey) => {
        setDifficulty(diffKey);
        generateQuestions(diffKey); // This will update 'questions' state
        setCurrentQuestionIndex(0);
        setScore(0);
        setFinalScoreData(null); // Clear previous game over data
        setGameState('game');
        // Timer will be started by the useEffect watching gameState and currentQuestionIndex
    };


    const handlePlayAgain = () => {
        setGameState('difficulty');
        // Score and currentQuestionIndex are reset in handleDifficultySelect
        // No need to set questions to [] as they will be regenerated
    };

    // Auto-play background music (moved to after name submission or difficulty selection)
    useEffect(() => {
        const playMusic = () => {
            if (backgroundAudioRef.current && backgroundAudioRef.current.paused && (gameState === 'difficulty' || gameState === 'game')) {
                backgroundAudioRef.current.play().catch(e => console.error("Audio play failed:", e));
            }
        };

        if (gameState === 'difficulty' || gameState === 'game') {
            playMusic();
        }
        // To ensure it plays after any user interaction if initial play fails:
        const ensurePlay = () => playMusic();
        document.addEventListener('click', ensurePlay, { once: true });
        document.addEventListener('touchstart', ensurePlay, { once: true });


        return () => {
            document.removeEventListener('click', ensurePlay);
            document.removeEventListener('touchstart', ensurePlay);
        };
    }, [gameState]);


    if (gameState === 'nameInput') {
        return <NameInputScreen onSubmit={handleNameSubmit} />;
    }
    if (gameState === 'difficulty') {
        return <DifficultyScreen difficulties={DIFFICULTIES} onSelect={handleDifficultySelect} />;
    }
    if (gameState === 'game' && questions.length > 0 && questions[currentQuestionIndex]) { // Ensure currentQuestionIndex is valid
        return (
            <GameScreen
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                score={score}
                timeLeft={timeLeft}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                showScoreAnimation={showScoreAnimation}
            />
        );
    }
    if (gameState === 'gameOver' && finalScoreData) {
        return <GameOverScreen scoreData={finalScoreData} onPlayAgain={handlePlayAgain} />;
    }

    // console.log("Current State for Loading:", gameState, questions.length, finalScoreData); // Debug line
    return <div className="text-center p-8">Carregando Jogo...</div>;
}

export default App;