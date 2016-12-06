//required modules
var Omegle = require("omegle-node");
const chalk = require("chalk");

var om = new Omegle(); //create an instance of `Omegle`

var interests = null;
var asl = null;

function intializeVariables() {

    if (process.argv.length > 2) {
        asl = [];
    }

    switch (process.argv.length) {
        case 6:
            asl[2] = process.argv[5];

        case 5:
            asl[1] = process.argv[4];

        case 4:
            asl[0] = process.argv[3];

        case 3:
            interests = process.argv[2].split(",");
    }

}

function removePrompt() {
    process.stdout.clearLine(); // clear current text
    process.stdout.cursorTo(0); // move cursor to beginning of line
}

function sendMessage(msg) {
    console.log(chalk.blue("You: ") + msg);
    om.send(msg);
}

function connect(interest) {
    if (interest === null) {
        om.connect();
    } else {
        om.connect(interest);
    }
}

//This will print any errors that might get thrown by functions
om.on("omerror", function(err) {
    removePrompt();
    console.log(chalk.magenta("error: " + err));
});

om.on("omegleError", function(err) {
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

    if (interests === null) {
        sendMessage("Hey");
        process.stdout.write(chalk.blue("You: "));
    }

});

om.on("commonLikes", function(likes) {
    console.log(chalk.green("You both like " + likes.join(", ")));

    if (interests !== null) {
        sendMessage("Hey");
        process.stdout.write(chalk.blue("You: "));
    }
})

//emitted when you get a message
om.on("gotMessage", function(msg) {
    removePrompt();
    console.log(chalk.red("Stranger: ") + msg);
    if (msg.toLowerCase().includes("asl") && asl !== null) {
        sendMessage(asl.join("/") + ". You?");
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
    connect(interests);
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

intializeVariables()

connect(interests);
