import React, { useEffect, useRef, useState } from "react";

const BubbleBackground = () => {
  let numbers: Array<number> = [5, 25, 45, 65, 85];
  const numbersBackup: Array<number> = [5, 25, 45, 65, 85];
  const bubbleBackgroundRef = useRef<HTMLInputElement>(null);
  const [bubblesInitialized, setBubblesInitialized] = useState<boolean>(false);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const getRandomNumberStartPoint = () => {
    if (numbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const startPoint = numbers[randomIndex];
      numbers.splice(randomIndex, 1);
      return startPoint;
    } else {
      numbers = [...numbersBackup];
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const startPoint = numbers[randomIndex];
      numbers.splice(randomIndex, 1);
      return startPoint;
    }
  };

  const getRandomNumberWith = () => {
    if (screenWidth < 769) {
      let min: number = 0;
      let max: number = 15;
      let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomNumber;
    } else {
      let min: number = 0;
      let max: number = 20;
      let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      return randomNumber;
    }
  };

  const addBubble = () => {
    //genera la bolla
    if (bubbleBackgroundRef.current) {
      let div = document.createElement("div"); //crea il div della bolla
      div.className = "bubble"; //si aggiunge la classe per dare lo stile
      div.style.left = `${getRandomNumberStartPoint()}vw`; //si imposta randomicamente left della bolla
      div.style.width = `${getRandomNumberWith()}vw`; //si imposta randomicamente la width della bolla
      bubbleBackgroundRef.current.appendChild(div); //si appende il div della bolla dentro il contenitore tramite il .current del suo ref

      setTimeout(() => {
        //dopo la creazione della bolla il suo div viene rimosso dopo 10 secondi
        div.remove();
      }, 12000);
    }
  };

  const initBubbles = () => {
    setTimeout(() => {
      addBubble();
    }, 0); //creata una bolla dopo 2 secondi

    setTimeout(() => {
      addBubble();
    }, 2000); //creata una bolla dopo 4 secondi

    setTimeout(() => {
      addBubble();
    }, 4000); //creata una bolla dopo 6 secondi

    setTimeout(() => {
      addBubble();
    }, 6000); //creata una bolla dopo 6 secondi

    setTimeout(() => {
      addBubble();
    }, 7000); //creata una bolla dopo 6 secondi

    setInterval(() => {
      //ogni 7 secondi viene :

      setTimeout(() => {
        addBubble();
      }, 0); //creata una bolla dopo 2 secondi

      setTimeout(() => {
        addBubble();
      }, 2000); //creata una bolla dopo 4 secondi

      setTimeout(() => {
        addBubble();
      }, 4000); //creata una bolla dopo 6 secondi

      setTimeout(() => {
        addBubble();
      }, 6000); //creata una bolla dopo 6 secondi

      setTimeout(() => {
        addBubble();
      }, 7000); //creata una bolla dopo 6 secondi
    }, 7000);
  };

  useEffect(() => {
    console.log("BUBBLES STATE:", bubblesInitialized);
    if (bubblesInitialized) {
      initBubbles();
    }
  }, [bubblesInitialized]);

  useEffect(() => {
    console.log("Numbers:", numbers, bubbleBackgroundRef.current);
    if (!bubblesInitialized) {
      setBubblesInitialized(true);
    }
  }, [numbers, bubbleBackgroundRef.current, bubblesInitialized]);

  return <div className="bubble-background" ref={bubbleBackgroundRef}></div>;
};

export default React.memo(BubbleBackground);
