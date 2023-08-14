//amazon data scrapping using cheerio and axios, here cheerio is a html parser which is very useful in extracting important data from the html it's a parser like beautiful soup in python --> npm i cheerio
//axios is a javaScript library which is used to make http request --> npm i axios
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');
var fs = require('fs');
const { Console } = require('console');
require('dotenv').config();

var prices=[];

var productId = 'B095CXD1TL';
 const productUrl = `https://www.amazon.in/SAVYA-HOME-Ergonomic-Adjustable-Meshback/dp/${productId}/ref=asc_df_B095CXD1TL/?tag=googleshopdes-21&linkCode=df0&hvadid=397010396149&hvpos=&hvnetw=g&hvrand=18240187753669971086&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9062115&hvtargid=pla-1358959115249&psc=1&ext_vrnc=hi`
const offersUrl = `https://www.amazon.in/hctp/vsxoffer?asin=${productId}&deviceType=web&offerType=GCCashback&buyingOptionIndex=0`;
 async function getPrice(){
     //we'll set headers to avoid any blocking 
     const {data} = await axios.get(productUrl,{headers:{
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9',
        'user-agent':' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36',
        'sec-ch-ua-platform': "Windows",
        'authority':'www.amazon.in',
        'method': 'GET'
     }
    
    })

    console.log("Product link: ",`https://www.amazon.in/dp/${productId}`)

     return data;
     
 };

async function getData(){
    var loadedData = await getPrice();
    var parsedData = cheerio.load(loadedData);
    // fs.writeFile('html.txt',parsedData.toString(),'utf-8',function(err)
    // {
    //     if(err) throw err;
    //     console.log("FileSaved!!");


    // })
    var finalData=(parsedData('.a-offscreen').text()).split('₹');
    for(var i =0;i<finalData.length;i++){
      

        if(finalData[i].length==0)
        {
            finalData.splice(i,1);
            
        }
    }

    //taking the first value as displayed price
    var price = finalData[0];
    if(price.length>0)
    {
        
        return price;
    }

    return null;
    
    
}

var start=0;

async function printPrice()
{
    var price  = await getData();

    if(price!=null)
    {
        console.log("Product price: "+price);
        // sendEmail(price).then(()=>{

        // });
        return price;
    }
    return -1;
}

//printPrice();

async function sendEmail(price,time) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
  
    // create reusable transporter object using the default SMTP transport
     // generated ethereal user
     console.log(process.env.EmailUserId, process.env.EmailPassword);
    let transporter = nodemailer.createTransport({
      
      host: "smtp.gmail.com",
      port: 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EmailUserId, // generated ethereal user
        pass: process.env.EmailPassword, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Scrapped result 👻" <foo@example.com>', // sender address
      to: process.env.SendTo, // list of receivers
      subject: "Amazon price scrapper update", // Subject line
      text: "", // plain text body
      html: `<body style="display: flex;align-items: center; justify-content: center;"><div style=""><h1 style="color: cornflowerblue;">Price Update</h1><p style="color: blue;">Price calculated at ${time} is Rs.${price}</p><p style="color: brown;">by <a href="#">EZSoftwareHub.com</a></p></div></body>`, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
  sendEmail(1234,'6:45--Test email');


  function generateRandomNumbers(max,min)
  {
      // const max = Math.pow(10,numberOfDigitsToGenerate)-1;
      // const min = Math.pow(10,numberOfDigitsToGenerate-1);

      // return Math.floor(Math.random()*(max-min-1))+min;

      return Math.floor(Math.random()*(max-min-1))+min;

  }

  var hours = 0;
  var minutes = 0;
  var alreadyPrinted = false;
  async function  getDateTime()
  {
    var date = new Date();
    var maxValueAsPerMinute = 60-parseInt(date.getMinutes());
    var minValueAsPerMinute = maxValueAsPerMinute > 10 ? 10 : 0;
    var randomNumber = generateRandomNumbers(maxValueAsPerMinute,minValueAsPerMinute);
    console.log(`max minute number: ${maxValueAsPerMinute}`);
    console.log(`min minute number: ${minValueAsPerMinute}`);
    console.log(`Random number: ${randomNumber}`);


    if(hours ===0 || minutes ===0)
    {
      console.log("Setting intial hours and minutes");
      hours = date.getHours()+1;
      minutes = date.getMinutes()+randomNumber;
      console.log(`hours set to ${hours} and minutes set to ${minutes}`);

    }

    if(date.getHours()===hours && date.getMinutes()===minutes)
    {
      console.log("Calling get price method and saving it to a file");
      if(!alreadyPrinted)
      {
        let price = await printPrice();
      console.log(`Price value: ${price}`);
      console.log("Saving file");
          fs.appendFile('priceDate.txt',`${price.toString()} at ${date.getHours()}:${date.getMinutes()}`,'utf-8',function(err,res)
        {
            const fileSavedInfo = err ? err : res + "\nFileSaved!!"
            console.log(fileSavedInfo);
        });
      hours = date.getHours()+3 > 23 ? 0 : date.getHours()+3;
      minutes = date.getMinutes()+randomNumber;
      console.log(`Set hours: ${hours}, Set minutes: ${minutes}`);
      try {
        sendEmail(`${date.getHours()}:${date.getMinutes()}`,price.toString());
      } catch (error) {
        console.log("There was an error sending the email!!");
      }
      alreadyPrinted=true;
      }else
      {
        console.log("Price already saved check the file!!");
      }
    }else
    {
      alreadyPrinted = false;
      console.log(`Time didn't matched!!\nTime required: ${hours}:${minutes} method will be called every 5 secs`)
     
    }
    console.log('\x1b[36m%s\x1b[0m',"\n\n******************************************\n\nLogs:");
    return  date.getHours()+3+':'+ (date.getMinutes()+randomNumber);
  }

 var interval = setInterval(getDateTime,5000);

async function appendFileTest()
{
  console.log("Calling get price method and saving it to a file");
  let price = await printPrice();
  console.log(`Price value: ${price.toString()}`);
  console.log("Saving file");
  fs.appendFile('priceDate.txt',price.toString()+"\n",'utf-8',function(err)
{
    const fileSavedInfo = err ? err : "\nFileSaved!!"
    console.log(fileSavedInfo);
});
}





       
