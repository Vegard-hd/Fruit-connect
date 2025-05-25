$(async function () {
  let username;
  let gameOver = false;
  $("#startGame").on("click", async function (e) {
    username = $("#gameUsername").val();
    sendMessage({ username: username });

    await gsap
      .to(".buttonWrapper", {
        scale: 1.1,
        duration: 0.1,
        ease: "elastic.out(2, 0.3)",
      })
      .then(() => {
        $(".buttonWrapper").remove();
        $("#gameContainer").removeClass("d-none");
        $("#gameScoreDisplay").removeClass("d-none");
        $("#gameScoreDisplay").removeClass("d-none");
        $("#landingPage").addClass("d-none");
      })
      .catch((e) => {
        console.warn("failed to start game");
      });
  });

  //socketio connection
  const socket = io();

  // Listen for initial data
  let init;
  socket.on("initial-data", async (data) => {
    updateMovesLeft(data?.movesLeft);
    updateScore(data.score);
    if (init === true) return;
    initScoreboard(data?.topScores);
    await initGrid(data?.data);

    init = true;
  });

  async function updateBonusFruitProgress(data) {
    const maxTime = 5000; // Maximum time for bonus fruit
    const progressBar = document.getElementById("bonusFruitProgress");
    const convertedData = Number.parseInt(data.bonusfruit.remaining);
    // Calculate percentage
    let percentage = (convertedData / maxTime) * 100;
    if (percentage > 97) {
      let tl = gsap.timeline();

      tl.to(progressBar, {
        opacity: 1,
        width: 100,
        duration: 0.1, // Smooth expansion
      }).to(progressBar, {
        opacity: 0,
        width: 0,
        duration: 0.01, // Fade out quickly
      });

      percentage = 100;

      progressBar.textContent = `${Math.round(percentage)}%`;
    } else {
      gsap.to(progressBar, {
        opacity: 1,
        width: `${percentage}%`,
        duration: 0.01, // Adjust duration for smooth transition
        onUpdate: () => {
          // Update the text inside the progress bar
          progressBar.textContent = `${Math.round(percentage)}%`;
        },
      });
    }
  }

  // Listen for messages
  let tempBonusFruitSrc;
  socket.on("message", async (data) => {
    if (data?.bonusfruit) {
      updateBonusFruitProgress(data);
      // update bonu<sfruit
      console.log(data.bonusfruit.remaining);
      if (!tempBonusFruitSrc || tempBonusFruitSrc !== data.bonusfruit.src) {
        console.log(data.bonusfruit);
        const bonusFruit = $("#bonusFruit");

        $(bonusFruit).attr("src", data.bonusfruit.src);
        tempBonusFruitSrc = data.bonusfruit.src;

        await gsap.fromTo(
          bonusFruit,
          { scale: 2, opacity: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1.5, 0.5)",
          }
        );
      }
    }
    if (data?.topScores) {
      updateScoreboard(data?.topScores);
    }
    if (data?.gameEnded) {
      gameOver = true;
      $("header").prepend(`
        <h1 class="text-center fs-2 text-danger">
          Redirecting <i id="loader">...</i>
        </h1>
      `);

      //redirecs user on game complete
      setTimeout(() => {
        socket.disconnect();
        const gameId = (window.location + "").split("?id=").at(-1);
        window.location.replace(`/completed?game=${gameId}`);
      }, 2000);
    }
    if (data?.movesLeft === 0) {
      gameOver = true;
      updateMovesLeft("Game over");
    }
    if (data?.movesLeft) {
      updateMovesLeft(data.movesLeft);
    }
    if (data?.score && data?.result) {
      updateScore(data.score);
    }
    if (data?.result) {
      await updateGrid(data?.result);
    }
  });

  // Listen for errors
  socket.on("error", (error) => {
    console.error("Something wrong with the connection ....");
  });

  // To send messages to the server
  function sendMessage(data) {
    socket.emit("message", data);
  }

  // $nowTime.textContent = event.data;
  async function updateGrid(newData) {
    const promise = await new Promise((resolve, reject) => {
      const newDataObj = JSON.parse(newData);
      const mappedObj = newDataObj.map((element) => {
        return {
          row: Math.floor(element.index / 10),
          index: element.index,
          col: element.index % 10,
          newFruit: element.newFruit,
        };
      });
      mappedObj.forEach(async (element) => {
        const thisrow = element.row + 1;
        const thisFruit = [...$(`#row${thisrow}`).children()].find(
          (val, index) => index === element.col
        );
        await gsap
          .to(thisFruit, {
            opacity: 0,
            scale: 2.5,
            duration: 0.1,
            ease: "elastic.out(2, 0.3)",
          })
          .then(() => $(thisFruit).remove())
          .then(() => {
            $(`#row${thisrow}`).prepend(
              `<img id="${element.newFruit.id}" src="${element.newFruit.src}" alt="${element.newFruit.fruit}" />`
            );
          });
        var tl = gsap.timeline({});

        const ge = `#${element.newFruit.id}`;
        tl.to(ge, { scale: 1.6, duration: 0.1 });
        tl.to(ge, { scale: 0.8, duration: 0.1 });
        tl.to(ge, { scale: 1, duration: 0.1, ease: "elastic.out(2,0.3)" });
      });
      resolve("success");
    });
    return await promise;
  }

  async function initGrid(data) {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        const backToObj = await JSON.parse(data);
        let count = 0;
        let rowCount = 1;
        backToObj.forEach((element, index) => {
          let fruit = element.fruit;
          let src = element.src;
          let id = element.id;
          count++;
          $(`#row${rowCount}`).append(
            `<img id="${id}" src="${src}" alt="${fruit}" />`
          );
          if (count >= 10) {
            count = 0;
            rowCount++;
          }
        });
        resolve("success");
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
    return await myPromise;
  }

  function updateScore(score = 1) {
    return $("#gameScore").text(score);
  }

  $(document).on("click", async function (e) {
    try {
      if (gameOver === true) return;
      if (e.target.tagName === "IMG") {
        let fruitId = await $(e.target)[0].id;
        if (!fruitId) return;
        const reqBody = JSON.stringify({ fruit: fruitId });
        sendMessage(reqBody);
      }
    } catch (error) {
      console.warn(error);
    }
  });
  function updateScoreboard(topScores) {
    try {
      topScores.forEach((e, i) => {
        const rowSelector = `#row-${i + 1}`;
        const currentScore = parseFloat($(rowSelector).find("td").eq(0).text());
        if (currentScore < e.score) {
          // Animate the replacement
          gsap.to(rowSelector, {
            scale: 0,
            duration: 0.2,
            onComplete: () => {
              $(rowSelector).replaceWith(`
                <tr id="row-${i + 1}">
                  <th scope="row">${i + 1}</th>
                  <td>${e.username}</td>
                  <td>${e.score}</td>
                </tr>
              `);
              gsap.fromTo(
                `#row-${i + 1}`,
                { scale: 0 },
                { scale: 1, duration: 0.5 }
              );
            },
          });
        }
      });
    } catch (error) {
      console.error("Updating scoreboard failed", error);
    }
  }
  function initScoreboard(topScores) {
    try {
      const scoresArr = [...topScores].flat();
      while (scoresArr.length < 10) {
        scoresArr.push({ score: 0, username: "---" });
      }
      scoresArr.forEach((e, i) => {
        $(`#row-${i + 1}`).append(`
          <th scope="row">${i + 1}</th>
          <td>${e.username}</td>
          <td>${e.score}</td>`);
      });
    } catch (error) {
      console.error("updating scoreboard failed", error);
    }
  }
  function updateMovesLeft(movesLeftData) {
    return $("#movesLeft").text(movesLeftData);
  }
});
