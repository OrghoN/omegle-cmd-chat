//required modules
var Omegle = require("omegle-node");
const chalk = require("chalk");

var om = new Omegle(); //create an instance of `Omegle`

var interests = ["role play", "role playing", "rp"]

function removePrompt() {
    process.stdout.clearLine(); // clear current text
    process.stdout.cursorTo(0); // move cursor to beginning of line
}

//This will print any errors that might get thrown by functions
om.on("omerror", function(err) {
    removePrompt();
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

    console.log(chalk.blue("You:") + " Hey");
    om.send("Hey");

    process.stdout.write(chalk.blue("You: "));

});

//emitted when you get a message
om.on("gotMessage", function(msg) {
    removePrompt();
    console.log(chalk.red("Stranger: ") + msg);
    if (msg.toLowerCase().includes("asl")) {
        console.log((chalk.blue("You:") + " 18/m/US"));
        om.send("18/m/US");
    }

    process.stdout.write(chalk.blue("You: "));

});

//emitted when the stranger disconnects
om.on("strangerDisconnected", function() {
    removePrompt();
    console.log(chalk.magenta("stranger disconnected."));
});

//emmitted when you disconnected
om.on("disconnected", function() {
    om.connect(interests);
});

//reading and sending chat
process.stdin.setEncoding("utf8");

process.stdin.on("readable", () => {
    if (om.connected()) {
        om.startTyping();
    }
    var chunk = process.stdin.read();
    if (chunk !== null) {
        if (chunk.toLowerCase().includes("/dc")) {
            console.log(chalk.magenta("you disconnected"));
            om.disconnect();
        } else {
            process.stdout.write(chalk.blue("You: "));
            om.send(chunk);
        }

    }
    if (om.connected()) {
        om.stopTyping();
    }
});

om.connect(interests);
