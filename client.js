//required modules
var Omegle = require("omegle-node");
const chalk = require("chalk");

var om = new Omegle(); //create an instance of `Omegle`

var interests = ["role play", "role playing", "rp"]

//This will print any errors that might get thrown by functions
om.on("omerror", function(err) {
    console.log(chalk.magenta("error: " + err));
});

//gotID is emitted when you"re connected to Omegle
om.on("gotID", function(id) {
    console.log(chalk.yellow("connected to the server as: " + id));
});

//waiting is emitted when you"re waiting to connect to a stranger
om.on("waiting", function() {
    console.log(chalk.yellow("waiting for a stranger."));
});

//emitted when you"re connected to a stranger
om.on("connected", function() {
    console.log(chalk.green("connected"));
});

//emitted when you get a message
om.on("gotMessage", function(msg) {
    console.log(chalk.red("Stranger: ") + msg);
    // om.send("Hi"); //used to send a message to the stranger
});

//emitted when the stranger disconnects
om.on("strangerDisconnected", function() {
    console.log(chalk.magenta("stranger disconnected."));
    om.connect(interests);
});

//emmitted when you disconnected
om.on("disconnected", function() {
    // console.log("you disconnected");
    // om.connect(interests);
});

//reading and sending chat
process.stdin.setEncoding("utf8");

process.stdin.on("readable", () => {
    if (om.connected()) {
        om.startTyping();
    }
    var chunk = process.stdin.read();
    if (chunk !== null) {
        process.stdout.write(chalk.blue("You: ") + chunk);
        // console.log(chalk.blue("You: ") + chunk);
        om.send(chunk);
    }
    if (om.connected()) {
        om.stopTyping();
    }
});

process.stdin.on("end", () => {
    process.stdout.write("end");
});

//Once you"re subscribed to all the events that you wish to listen to,
//call connect() to connect to Omegle and start looking for a stranger.
om.connect(interests);
