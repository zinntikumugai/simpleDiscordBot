module.exports = class {
    constructor() {
        this.name = "version";
        this.ops = {
            description: "version"
        }
    }

    call(message, ops) {
        let fields = [];
        fields.push({
            name: "version",
            value: "1.0.0"
        });
        message.channel.send(
            "<@" + message.author.id + ">", {
                embed: {
                    color: 0x0080ff,
                    author: {
                        name: message.author.username,
                        icon_url: message.author.avatarURL
                    },
                    title: "version",
                    fields: fields
                }
            }
        )
    }
}