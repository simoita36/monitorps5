const puppeteer = require('puppeteer');
const CronJob = require('cron').CronJob;
const $ = require('cheerio');
const readline = require('readline');
const prompt = require('prompt-sync')();
const hookcord = require('hookcord');
const { link } = require('snekfetch');
const Hook = new hookcord.Hook();
const Discord = require('discord.js');
const client = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES']
});

//const ps5_url = "https://www.unieuro.it/online/Console-Playstation-5/PlayStation-5-pidSON9709695";
//const rand = "https://www.unieuro.it/online/Accessori-Playstation-5/PS5-Base-di-Ricarica-DualSense-pidSON9374107";

const ps5 = "https://www.unieuro.it/online/j/d-pidSONPS5DISC";
    let text = ps5;
    let result = text.slice(52);
        console.log(`Start Monitoring... ${result}`);

async function initBrowser(){
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(ps5);
    return page;
}

async function monitor(page){
    await page.reload();
    let content = await page.evaluate(() => document.body.innerHTML);
    var notiAVA = await page.evaluate(() => document.getElementsByClassName('btn btn-blue-normal md-trigger pdp-right__single-btn')[0]);
    var imgs = await page.evaluate(() => document.getElementsByClassName('js--gallery-handler slick-slide slick-current slick-active')[0].src);

    //console.log(notiAVA);
        if(typeof notiAVA !== 'undefined'){
            console.log("Out of Stock");
        } else {
            console.log('InStock');

            Hook.login('851935829411889182', 'lt4QDMSGwIi1nakdZQMek2JahrbCg7_2y64FmhZwP-3E2hSxvN1-kkUU2DKc0Njq6RDh');

        var embed = new Discord.MessageEmbed()
            .setColor("#a7f815")
            .setTitle('Product Available!')
            .setURL(page.url())
            .setThumbnail(imgs) //prendere la foto dall'oggetto
            .addFields(
                { name: 'Store', value: 'Unieuro'},
                //{ name: '\u200B', value: '\u200B' }, //spazio tra fields
                { name: 'Type', value: "Restock"}
            )
            .setFooter('Monitor 0.0.1', 'https://i.imgur.com/AfFp7pu.png');
    
        Hook.setPayload(hookcord.DiscordJS(embed));
        
        Hook.fire()
          .then(response_object => {
            process.exit(0);
          })
          .catch(error => {
            throw error;
            
        })
        
        }
}

async function checkStock(){
    const page = await initBrowser();

    let job = new CronJob("*/5 * * * * *", function() {
        monitor(page);
    }, null, true, null, null, true);
    job.start();
    
}
checkStock();
