module.exports = class {
    constructor() {
        this.name = "ping";
        this.ops = {
            description: "pong"
        }
    }

    call(message, ops) {
       
        message.channel.send(
            "<@" + message.author.id + ">pong!!!"
        )
    }
}