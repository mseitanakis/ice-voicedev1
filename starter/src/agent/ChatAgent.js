
const createChatAgent = () => {

    // you can safely modify these in initialize and recieve
    const CS571_WITAI_ACCESS_TOKEN = "NR3YZRADKSAIXKYOSSK73ZK3FEFR46NM"; // Put your CLIENT access token here.

    let jokeNum = 0;

    const handleInitialize = async () => {
        return "Hello! What would you like to hear?"
    }

    const handleReceive = async (prompt) => {
        // TODO: Replace this with your code to handle a user's message!
        //       https://api.wit.ai/message?q=
        let res = await fetch("https://api.wit.ai/message?q=" + encodeURIComponent(prompt), {
            headers: {
                "Authorization": "Bearer " + CS571_WITAI_ACCESS_TOKEN
            }
        });
        let data = await res.json();
        if(data.intents.length === 0) {
            return "I don't understand";
        } else {
            const intentName = data.intents[0].name
            if (intentName === "why_chicken") {
                return await whyChicken();
            } else if (intentName === "tell_joke") {
                // TODO reach out to the jokes API
                return await tellJoke(data);
            } else {
                return "This should never happen"
            }
        }
        console.log(prompt);
    }

    async function whyChicken() {
        return "To get to the other side!"
    }

    async function tellJoke(witData) {
        let jokeType = "any";
        if(witData.entities["joke_type:joke_type"]){
            jokeType = witData.entities["joke_type:joke_type"][0].value
        }
        // FETCH data from jokes API
        const resp = await fetch(`https://v2.jokeapi.dev/joke/${jokeType}?safe-mode`);
        const data = await resp.json();
        console.log(data);
        if(data.type === "single") {
            return data.joke
        } else {
            return data.setup + " " + data.delivery
        }
        //return "I should tell a joke"
    }

    return {
        handleInitialize,
        handleReceive
    }
}

export default createChatAgent;