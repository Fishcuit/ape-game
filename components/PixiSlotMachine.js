import React, { useEffect } from "react";
import * as PIXI from "pixi.js";
import { TweenLite } from "gsap";

const symbolSets = [
  ["🍎", "🍇", "🍉", "🍋", "🍒", "🍊", "⭐"],
  ["🍎", "🍒", "🍉", "🍋", "🍇", "🍊", "⭐"],
  ["🍊", "🍇", "🍉", "🍋", "🍒", "🍎", "⭐"],
  ["🍇", "🍒", "🍉", "🍋", "🍎", "🍊", "⭐"],
  ["🍉", "🍇", "🍎", "🍋", "🍒", "🍊", "⭐"],
];

function getRandomSymbol() {
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
}

function createReel(app, symbolSet) {
  const reel = new PIXI.Container();
  const symbolHeight = 100;
  const visibleSymbols = 5;
  const bufferSymbols = 1; // Number of symbols above and below the visible area

  for (let i = 0; i < symbolSet.length + bufferSymbols * 2; i++) {
    const symbolText = new PIXI.Text(
      symbolSet[i % symbolSet.length],
      new PIXI.TextStyle({
        fontSize: 70,
        fontFamily: "Arial",
        fill: "white",
      })
    );
    symbolText.y = i * symbolHeight - bufferSymbols * symbolHeight;
    reel.addChild(symbolText);
  }

  return reel;
}

function spin(reel, onComplete) {
  const spinDuration = 2000;
  const symbolHeight = 100;
  const visibleSymbols = 5;
  const bufferSymbols = 1;

  const startPosition = reel.y;
  const randomSpin = Math.floor(Math.random() * 5 + 4) * 8;
  const spinAmount = randomSpin * symbolHeight;

  const startTime = Date.now();
  const animate = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    const progress = elapsed / spinDuration;
    reel.y = startPosition + spinAmount * progress;

    // Wrap symbols around when they go out of the canvas
    reel.children.forEach((symbolText) => {
      if (
        symbolText.y + reel.y >
        (visibleSymbols + bufferSymbols) * symbolHeight
      ) {
        symbolText.y -= (visibleSymbols + bufferSymbols * 2) * symbolHeight;
      }
    });

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Snap the reel to the nearest symbol position
      reel.y = Math.round(reel.y / symbolHeight) * symbolHeight;
      onComplete();
    }
  };

  requestAnimationFrame(animate);
}

function evaluatePayout(reels) {
  let topCounts = {};
  let middleCounts = {};
  let bottomCounts = {};

  reels.forEach((reel) => {
    const symbolHeight = 100;
    const middleYPosition = -reel.y + 2 * symbolHeight;
    const topYPosition = -reel.y + 1 * symbolHeight;
    const bottomYPosition = -reel.y + 3 * symbolHeight;

    const topSymbol = reel.children.find(
      (symbolText) =>
        symbolText.y >= topYPosition - 5 && symbolText.y <= topYPosition + 5
    ).text;

    const middleSymbol = reel.children.find(
      (symbolText) =>
        symbolText.y >= middleYPosition - 5 &&
        symbolText.y <= middleYPosition + 5
    ).text;

    const bottomSymbol = reel.children.find(
      (symbolText) =>
        symbolText.y >= bottomYPosition - 5 &&
        symbolText.y <= bottomYPosition + 5
    ).text;

    if (bottomSymbol in bottomCounts) {
      bottomCounts[bottomSymbol] += 1;
    } else {
      bottomCounts[bottomSymbol] = 1;
    }

    if (middleSymbol in middleCounts) {
      middleCounts[middleSymbol] += 1;
    } else {
      middleCounts[middleSymbol] = 1;
    }

    if (topSymbol in topCounts) {
      topCounts[topSymbol] += 1;
    } else {
      topCounts[topSymbol] = 1;
    }
  });
  console.log(bottomCounts);
  console.log(middleCounts);
  console.log(topCounts);
}

const PixiSlotMachine = () => {
  let app;

  useEffect(() => {
    app = new PIXI.Application({
      view: document.getElementById("pixi-slot-machine"),
      width: 1000,
      height: 510,
      backgroundColor: 0x1099bb,
    });

    const reelSpacing = 160;
    for (let i = 0; i < 5; i++) {
      const reel = createReel(app, symbolSets[i]);
      reel.x = i * reelSpacing + 120;
      reel.y = 100;
      app.stage.addChild(reel);
    }
  }, []);

  const handleSpinButtonClick = () => {
    const reels = app.stage.children;
    let completedReels = 0;
    reels.forEach((reel, index) => {
      setTimeout(() => {
        spin(reel, () => {
          completedReels++;
          if (completedReels === reels.length) {
            console.log("All reels finished spinning");
            evaluatePayout(reels);
          }
        });
      }, index * 500);
    });
  };

  return (
    <>
      <canvas id="pixi-slot-machine" />
      <button onClick={handleSpinButtonClick}>Spin</button>
    </>
  );
};

export default PixiSlotMachine;
