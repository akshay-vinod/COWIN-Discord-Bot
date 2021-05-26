![BFH Banner](https://trello-attachments.s3.amazonaws.com/542e9c6316504d5797afbfb9/542e9c6316504d5797afbfc1/39dee8d993841943b5723510ce663233/Frame_19.png)
# VaccineKaro
A Discord bot that asks the user for their location (state name and district name), age and preferred date and shows the vaccine slots available for that particular date.It also checks for slot availability each hour and can notify the user when a slot is available. The bot can be used both in DM and in server.  
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
1. Add the bot to your server  [https://discord.com/oauth2/authorize?client_id=843357961086435339&scope=bot]
2. Start the bot by typing the command  `$start`
## Libraries used
1. axios: "^0.21.1"
2. dayjs: "^1.10.4"
3. discord.js: "^12.5.3"
4. dotenv: "^9.0.2"
5. mongoose: "^5.12.10"
6. node-cron: "^3.0.0"

| Library | Version |
|---------|---------|
| axios   | ^0.21.1 |
|dayjs|1.10.4|

## How to configure
1. Clone the Repo
2. Run `npm install`
3. Create your bot [here](https://discord.com/developers/applications) and copy bot token
4. Copy database connection string
5. Create a .env file and place your bot token and database connection string like this

    `DISCORD_BOT_TOKEN=XXXXXXXXXX`<br />
     `DATABASE=xxxxxxxx`

## How to Run
`npm run dev`
