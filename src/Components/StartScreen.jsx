import Styles from "./StartScreen.module.css";

const StartScreen = ({ startGame }) => {
  return (
    <div className={Styles.start}>
      <h1>Secret Word</h1>
      <p>Clique abaixo para começar jogar</p>
      <button onClick={startGame}>Inicio</button>
    </div>
  );
};

export default StartScreen;
