// Import dependencies
const WebSocket = require('ws');
const readline = require('readline');
const Robot = require('./machina.js').Robot;

// Connection parameters
const NAME = "Machina-JS";
const CLIENT = "nodejs";
const AUTH_KEY = 'foobarbaz';

// URL of the Bridge server to connect to
const SERVER_ADDRESS = `ws://127.0.0.1:6999/Bridge?name=${NAME}&client=${CLIENT}&authkey=${AUTH_KEY}`;  // typically if you are connecting to a local Bridge on your machine
// const SERVER_ADDRESS = `wss://machina-server.glitch.me?name=${NAME}&client=${CLIENT}&authkey=${AUTH_KEY}`;  // typically if you are connecting to a remote server

// Connect to Bridge
const ws = new WebSocket(SERVER_ADDRESS, {
    headers: {
        "user-agent": "Machina",
    }
});

// Some handlers
ws.on('open', () => {
    console.log("Connected to " + SERVER_ADDRESS);
});

ws.on('close', (code, reason) => {
    console.log("Connection closed: " + code + " " + reason);
    process.exit();
});

ws.on('message', msg => {
    console.log("Received msg from the server:");
    console.log(JSON.parse(msg));
    // TODO: if you want to respond to machina actions, 
    // this is the place! 
});

ws.on('error', err => {
    console.log("ERROR:");
    console.log(err);
});



// Read input from the terminal and send to the Bridge
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    // terminal: false
});

// 
const requestAction = () => {
    rl.question("", input => { 
        // Decide what to do with the user input:
        parseInput(input);

        // Ask for input recursively
        requestAction();  
    });
}

// Start reading after a few millis, 
// when connections are probably stablished
setTimeout(requestAction, 1000);




// Create a Machina Robot using the WS connection:
let bot = new Robot(ws);

// Some other parameters
let dist = 100; 

// Decide what to do with the user input
function parseInput (input) {
    input = input.toLowerCase();
    
    switch (input) {
        case 'up': 
            bot.Move(0, 0, dist);
            break;

        case 'down':
            bot.Move(0, 0, -dist);
            break;
        
        case 'left':
            bot.Move(0, -dist, 0);
            break;
            
        case 'right':
            bot.Move(0, dist, 0);
            break;
    
        case 'front':
            bot.Move(dist, 0, 0);
            break;

        case 'back':
            bot.Move(-dist, 0, 0);
            break;

        case 'vertical line':
            bot.Message("Tracing a vertical line!");

            bot.SpeedTo(100);
            bot.MotionMode("joint");
            bot.TransformTo(500, 150, 600, 0, 0, -1, 0, 1, 0);
            bot.Wait(2000);

            bot.SpeedTo(20);
            bot.MotionMode("linear");
            bot.Move(0, 0, dist);
            bot.Wait(2000);

            bot.SpeedTo(100);
            bot.MotionMode("joint");
            bot.TransformTo(690, -177, 676, -1, 0, 0, 0, 1, 0);
            break;
    }
     
}







