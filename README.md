![BFH Banner](https://trello-attachments.s3.amazonaws.com/542e9c6316504d5797afbfb9/542e9c6316504d5797afbfc1/39dee8d993841943b5723510ce663233/Frame_19.png)
# VaccineKaro
A Discord bot that asks the user for their location (state name and district name), age and preferred date and shows the vaccine slots available for that particular date.It also checks for slot availability each hour and can notify the user when a slot is available. The bot can be used both in DM and in server.
    The user has to have at least one common server with the bot. For this, users can either [add the bot to their server](https://discord.com/oauth2/authorize?client_id=843357961086435339&scope=bot) or [join our VaccineKaro server](https://discord.gg/5Je5YvkZzy), which has been created exclusively for this purpose. For users with settings that don't allow direct messages from other server members, the bot will create a private channel in the common server and send the notifications there. Thus if you are adding the bot to your server, the bot must be given permissions to create channels in the server.

## Team members
1. Navaneeth Manoj [https://github.com/navaneethmanoj]
2. Akshay Vinod [https://github.com/akshay-vinod]
3. Midhun Chandran [https://github.com/Midhun529]
## Team Id
BFH/recQKRh3Wwz7nWhl4/2021
## Link to product walkthrough
>![video](https://cdn.loom.com/sessions/thumbnails/ec162a48f08144bb9257a4c2e65657d8-with-play.gif)

>[Click here to watch](https://www.loom.com/share/ec162a48f08144bb9257a4c2e65657d8)
## How it Works ?
1. [Add the bot to your server](https://discord.com/oauth2/authorize?client_id=843357961086435339&scope=bot) or [join the VaccineKaro Server](https://discord.gg/5Je5YvkZzy)
2. Start the bot by typing the command  `$start`
## Libraries used

| Library | Version |
|---------|---------|
| axios   | ^0.21.1 |
| dayjs | ^1.10.4 |
| discord.js | ^12.5.3 |
| dotenv | ^9.0.2 |
|mongoose| ^5.12.10 |
| node-cron | ^3.0.0 | 


## How to configure
1. Clone the Repo
2. Run `npm install` inside the repo
3. Create your bot [here](https://discord.com/developers/applications) and copy bot token
4. Copy database connection string
5. Create a .env file and place your bot token and database connection string like this

    `DISCORD_BOT_TOKEN=XXXXXXXXXX`<br />
     `DATABASE=xxxxxxxx`

## How to Run
`npm run dev`
