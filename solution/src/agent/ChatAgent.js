
const createChatAgent = () => {

    const CS571_WITAI_ACCESS_TOKEN = ""; // Put your CLIENT access token here.

    let jokeNum = 0;

    const handleInitialize = async () => {
        return "Welcome! I tell funny jokes."
    }

    const handleReceive = async (prompt) => {
        const resp = await fetch("https://api.wit.ai/message?q=" + encodeURIComponent(prompt), {
            headers: {
                "Authorization": "Bearer " + CS571_WITAI_ACCESS_TOKEN
            }
        })
        const data = await resp.json();
        
        console.log(data)
        if (data.intents.length > 0) {
            switch(data.intents[0].name) {
                case "tell_joke": return tellJoke(data);
                case "why_chicken": return whyChicken();
            }
        }

        return "I'm sorry, I don't understand!"
   }

    const tellJoke = async (promptData) => {
        const hasSpecifiedType = promptData.entities["joke_type:joke_type"] ? true : false;
        const hasSpecifiedNumber = promptData.entities["wit$number:number"] ? true : false;

        const jokeType = hasSpecifiedType ? promptData.entities["joke_type:joke_type"][0].value : "any";

        // Note! A number could be a decimal number, or it could be negative.
        //       We should probably check for this...
        const numJokes = hasSpecifiedNumber ? promptData.entities["wit$number:number"][0].value : 1;

        const res = await fetch(`https://v2.jokeapi.dev/joke/${jokeType}?safe-mode&amount=${numJokes}`)
        const data = await res.json();

        // Special Case: If you only ask for 1 joke, the API returns just
        //               an object rather than a list
        const listOfJokes = numJokes === 1 ? [data] : data.jokes;

        let agentResponse = "";
        for(let iJoke of listOfJokes) {
            jokeNum += 1;
            if (iJoke.type === 'single') {
                agentResponse += `Joke #${jokeNum}: ${iJoke.joke} `;
            } else {
                agentResponse += `Joke #${jokeNum}: ${iJoke.setup} ${iJoke.delivery} `;
            }
        }

        return agentResponse;
    }

   const whyChicken = async() => {
        return "To get to the other side!";
   }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;