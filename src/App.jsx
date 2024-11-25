// css
import "./App.css";

// React
import { useCallback, useEffect, useState } from "react";

//dados
import { wordsList } from "./data/words";

// components
import StartScreen from "./Components/StartScreen";
import GameOver from "./Components/GameOver";
import Game from "./Components/Game";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesqtd = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetter, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesqtd);
  const [score, setScore] = useState(0);

  //seleciona palavra e categoria

  // pegando categoria aleatoria
  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // pegando palavre aleatoria
    const word =
      words[category][[Math.floor(Math.random() * words[category].length)]];
    return { word, category };
  }, [words]);

  // inicia jogo
  const startGame = useCallback(() => {
    clearLetterStates();
    const { word, category } = pickWordAndCategory();

    // criando array de letras
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((i) => i.toLowerCase());

    //setando states
    setPickedCategory(category);
    setPickedWord(word);
    setLetters(wordLetters);

    console.log(category, word, wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // verificar letras
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    //check se letra foi utilizada
    if (
      guessedLetter.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }
    // add a letras acertadas ou remova uma chance
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //check tentativas
  useEffect(() => {
    if (guesses <= 0) {
      //reset
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //check vitoria
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (guessedLetter.length === uniqueLetters.length) {
      setScore((actualScore) => (actualScore += 100));
      startGame();
    }
  }, [guessedLetter, letters, startGame]);

  // reiniciar
  const retry = () => {
    setScore(0);
    setGuesses(guessesqtd);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetter={guessedLetter}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
