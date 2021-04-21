
const puppeteer = require("puppeteer");
let link = "https://www.leetcode.com"; // Given Link
let { credential } = require("./id&Pass");
let ProblemFn= require("./ListMaker")
let cTab;

const readline = require("readline");



// Inside main function I have only taken the input from user wheather user wants Full List , TopicWise List, 
// or TopicWise and Difficulty Wise List
(async function main()
 {console.log(`
              What type of List do you want through Leetcode ?
              1. Complete Leetcode List
              2. Topic Wise List
              3. Topic Wise & Difficulty Wise 
           `);


  let choice = await getTopic("Enter 1 or 2 or 3  \n");
    
    if(choice==1){
        //full List 
        let topic  ="FullList"
        fullLisT(topic);
    }
    else if(choice==2){
        // topic Wise but difficulty level are Mixed
    const topic = await getTopic("Enter Topic Name: ");
    TopicLisT(topic);
    }
    else if(choice==3){
        // topic Wise -> Easy , Medium, Hard
        
    const topic = await getTopic("Enter Topic Name: ");
    const level = await getTopic("Enter difficulty Level: "); 
    TopicListDifficultWise(topic,level)

    }
    else{
        
        console.log(`
              Enter Correct Choice
              1. Complete Leetcode List
              2. Topic Wise List
              3. Topic Wise & Difficulty Wise 
     `)
        
    }
    // readline.close()
})();

async function fullLisT(topic) {
    try {
        let browserOpenPromise = puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });  
        let browser = await browserOpenPromise;
        let allTabsArr = await browser.pages();
        cTab = allTabsArr[0];
        let fullList = await getFullListingFromLeetcode(link, topic);
        console.table(fullList)
    } 
    catch (err) {

        console.log(err);
    }
}

async function TopicLisT(topic) {
    try {
        let browserOpenPromise = puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
 
        let browser = await browserOpenPromise;
        let allTabsArr = await browser.pages();
        cTab = allTabsArr[0];
        let fullList = await getTopicListingFromLeetcode(link, topic);
        console.table(fullList)


    } catch (err) {

        console.log(err);
    }
}

async function TopicListDifficultWise(topic, level) {
    try {
        let browserOpenPromise = puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
 
        let browser = await browserOpenPromise;
        let allTabsArr = await browser.pages();
        cTab = allTabsArr[0];
        await getTopicDiffListingFromLeetcode(link, topic, level);
      
    } catch (err) {

        console.log(err);
    }
}

// get the topic Wise & Difficulty Levelwise List From Leetcode
async function getTopicDiffListingFromLeetcode(link, topic,level) {
    await cTab.goto(link)
    await cTab.waitForSelector(".nav-right> .nav-menu a", { visible: true });
    let fullLoginLink =await cTab.evaluate( returnRequiredLink,".nav-right> .nav-menu a", 4 )
    await cTab.goto(fullLoginLink)
    await cTab.waitForSelector(".input__2W4f ", { visible: true });
    let ProblemAllLink=await cTab.evaluate( returnRequiredLink,".nav-item-container__16kF> a", 2 )
    await cTab.goto(ProblemAllLink) // problemset  page
    await cTab.waitForSelector(".fa.fa-caret-down", { visible: true }); // click on tag
    // check for level
    await cTab.evaluate(clickonTag,".fa.fa-caret-down" , 1) // click on difficulty tag
    if(level=='Easy'){
        await cTab.evaluate(clickonTag," .fa.fa-check.filter-dropdown-menu-item-checked-icon.text-green " , 5)// click on easy tag
    }
    else if(level== 'Medium')
    {
        await cTab.evaluate(clickonTag," .fa.fa-check.filter-dropdown-menu-item-checked-icon.text-green " , 4)// click on Medium tag
        
    

    }else if(level =='Hard'){
        await cTab.evaluate(clickonTag," .fa.fa-check.filter-dropdown-menu-item-checked-icon.text-green " , 3)// click on Hard tag
      

    }
    
    await cTab.click(".fa.fa-caret-down ",{ visible: true })
    await cTab.waitForSelector(".filterSearch.form-control", { visible: true });// type topic Name specified by user
    await cTab.type(".filterSearch.form-control", topic , { delay: 500 })
    await cTab.waitForSelector(".false.tag-category.filter-dropdown-menu-items .filter-dropdown-menu-item", { visible: true });// click on topic
    await cTab.click(".false.tag-category.filter-dropdown-menu-items .filter-dropdown-menu-item",{ visible: true })
    // get topic list
     ProblemFn.helperFn(cTab, topic, level);

}

// get the topic Wise List From Leetcode
async function getTopicListingFromLeetcode(link, topic) {
    await cTab.goto(link)
    await cTab.waitForSelector(".nav-right> .nav-menu a", { visible: true });
    let fullLoginLink =await cTab.evaluate( returnRequiredLink,".nav-right> .nav-menu a", 4 )
    cTab.goto(fullLoginLink)
    await cTab.waitForSelector(".input__2W4f ", { visible: true });
    await cTab.type("input[class='input__2W4f '] ", credential[0], { delay: 500 }) // username
    await cTab.type("#id_password", credential[1], { delay: 500 })// password
    await cTab.click("#signin_btn");
    
    let ProblemAllLink=await cTab.evaluate( returnRequiredLink,".nav-item-container__16kF> a", 2 )
    cTab.goto(ProblemAllLink)
    await cTab.waitForSelector(".fa.fa-caret-down", { visible: true }); // click on tag
    await cTab.click(".fa.fa-caret-down ",{ visible: true })
    await cTab.waitForSelector(".filterSearch.form-control", { visible: true });// type name
    await cTab.type(".filterSearch.form-control", topic , { delay: 500 })
    await cTab.waitForSelector(".false.tag-category.filter-dropdown-menu-items .filter-dropdown-menu-item", { visible: true });// click on topic
    await cTab.click(".false.tag-category.filter-dropdown-menu-items .filter-dropdown-menu-item",{ visible: true })
    // get topic list
    ProblemFn.helperFn(cTab, topic);
    
    

    

    

    
    


}
         

// get the complete List From Leetcode
async function getFullListingFromLeetcode(link, topic) {
    await cTab.goto(link)
    await cTab.waitForSelector(".nav-right> .nav-menu a", { visible: true });
    let fullLoginLink =await cTab.evaluate( returnRequiredLink,".nav-right> .nav-menu a", 4 )
    cTab.goto(fullLoginLink)
    await cTab.waitForSelector(".input__2W4f ", { visible: true });
    await cTab.type("input[class='input__2W4f '] ", credential[0], { delay: 500 }) // username
    await cTab.type("#id_password", credential[1], { delay: 500 })// password
    await cTab.click("#signin_btn");
    
    let ProblemAllLink=await cTab.evaluate( returnRequiredLink,".nav-item-container__16kF> a", 2 )
    cTab.goto(ProblemAllLink)
     ProblemFn.helperFn(cTab, topic)

}
    
// return the  link which is required
function returnRequiredLink(selector1, idx){
    let login = document.querySelectorAll(selector1)[idx].getAttribute("href");
    let fullLoginLink ="https://leetcode.com"+login;
    return fullLoginLink
}

// get input so that I can change the behaviour of code
function getTopic(query) {
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
    
      return new Promise((resolve) =>
        rl.question(query, (ans) => {
          rl.close();
          resolve(ans);
        })
      );
    }
      
// perform click on certain element
function clickonTag(selector, idx){
  let len=  document.querySelectorAll(selector).length
  let select=  document.querySelectorAll(selector)
  select[len -idx].click();

}
    


   
module.exports= {
    cTab  
}