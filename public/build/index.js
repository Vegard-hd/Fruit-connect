$(async function(){let Z,W=!1;$("#startGame").on("click",async function(z){Z=$("#gameUsername").val(),q({username:Z}),await gsap.to(".buttonWrapper",{scale:1.1,duration:0.1,ease:"elastic.out(2, 0.3)"}).then(()=>{$(".buttonWrapper").remove(),$("#gameContainer").removeClass("d-none"),$("#gameScoreDisplay").removeClass("d-none"),$("#gameScoreDisplay").removeClass("d-none"),$("#landingPage").addClass("d-none")}).catch((E)=>{console.warn("failed to start game")})});let Q=io(),_;Q.on("initial-data",async(z)=>{if(console.log("init data",z),X(z?.movesLeft),y(z.score),_===!0)return;j(z?.topScores),await G(z?.data),_=!0}),Q.on("message",async(z)=>{if(z?.topScores)T(z?.topScores);if(z?.gameEnded)W=!0,$("header").prepend(`
        <h1 class="text-center fs-2 text-danger">
          Redirecting <i id="loader">...</i>
        </h1>
      `),setTimeout(()=>{Q.disconnect();let E=(window.location+"").split("?id=").at(-1);window.location.replace(`/completed?game=${E}`)},3000);if(z?.movesLeft===0)W=!0,X("Game over");if(z?.movesLeft)X(z.movesLeft);if(z?.score&&z?.result)y(z.score);if(z?.result)await F(z?.result)}),Q.on("error",(z)=>{console.error("Socket error:",z)});function q(z){Q.emit("message",z)}async function F(z){return await await new Promise((J,K)=>{JSON.parse(z).map((H)=>{return{row:Math.floor(H.index/10),index:H.index,col:H.index%10,newFruit:H.newFruit}}).forEach(async(H)=>{let P=H.row+1,Y=[...$(`#row${P}`).children()].find((B,x)=>x===H.col);await gsap.to(Y,{opacity:0,scale:2.5,duration:0.1,ease:"elastic.out(2, 0.3)"}).then(()=>$(Y).remove()).then(()=>{$(`#row${P}`).prepend(`<img id="${H.newFruit.id}" src="${H.newFruit.src}" alt="${H.newFruit.fruit}" />`)});var R=gsap.timeline({});let U=`#${H.newFruit.id}`;R.to(U,{scale:1.6,duration:0.1}),R.to(U,{scale:0.8,duration:0.1}),R.to(U,{scale:1,duration:0.1,ease:"elastic.out(2,0.3)"})}),J("success")})}async function G(z){return await new Promise(async(J,K)=>{try{let N=await JSON.parse(z),V=0,H=1;N.forEach((P,Y)=>{let{fruit:R,src:U,id:B}=P;if(V++,$(`#row${H}`).append(`<img id="${B}" src="${U}" alt="${R}" />`),V>=10)V=0,H++}),setTimeout(()=>{J()},1000)}catch(N){console.error(N),K(N)}})}function y(z=1){return $("#gameScore").text(z)}$(document).on("click",async function(z){if(W===!0)return;try{if(z.target.tagName==="IMG"){let E=await $(z.target)[0].id;if(!E)return;let J=JSON.stringify({fruit:E});q(J)}}catch(E){console.warn(E)}});function T(z){try{z.forEach((E,J)=>{let K=`#row-${J+1}`;if(parseFloat($(K).find("td").eq(0).text())<E.score)gsap.to(K,{scale:0,duration:0.5,onComplete:()=>{$(K).replaceWith(`
                <tr id="row-${J+1}">
                  <th scope="row">${J+1}</th>
                  <td>${E.username}</td>
                  <td>${E.score}</td>
                </tr>
              `),gsap.fromTo(`#row-${J+1}`,{scale:0},{scale:1,duration:0.5})}})})}catch(E){console.error("Updating scoreboard failed",E)}}function j(z){try{let E=[...z].flat();while(E.length<10)E.push({score:0,username:"---"});E.forEach((J,K)=>{$(`#row-${K+1}`).append(`
          <th scope="row">${K+1}</th>
          <td>${J.username}</td>
          <td>${J.score}</td>`)})}catch(E){console.error("updating scoreboard failed",E)}}function X(z){return $("#movesLeft").text(z)}});
