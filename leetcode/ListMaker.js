
const puppeteer = require("puppeteer");
const PDFDocument = require("pdfkit");
let fs = require('fs');

// currently we are at Problem Set 
async function fn1(cTab, topic, level) {
    try {
    await cTab.waitForSelector(".row-selector>.form-control ", { visible: true });
    await cTab.click(".row-selector>.form-control ",{ visible: true })
    // Promblem set Page 
    await cTab.keyboard.press('ArrowDown');
    await cTab.keyboard.press('ArrowDown');
    await cTab.keyboard.press('Enter');
    //select all the questions 
    let fullLs =await cTab.evaluate(consoleFn,".reactable-data tr td[label ='Title'] a[href]" , ".reactable-data tr td[label ='Difficulty'] .label");// data
    // return the data in form of an array 
    pdfMaker(fullLs, topic, level)
    cTab.close();
    

} catch (err) {

    console.log(err);
}
}

// just to call  fn1 function
function helperFn(cTab, topic, level)
{
    fn1(cTab, topic, level);
}


function consoleFn(selector1, selector2) {  // get the question name and question Link in an array 
    let length1 = document.querySelectorAll(selector1).length;
    let names = document.querySelectorAll(selector1);
    let qlInk = document.querySelectorAll(selector1);
    let Qdif = document.querySelectorAll(selector2 )

    let list =[]
    for (let i = 0; i <length1 ; i++) {
        let cName = names[i].innerText;
        let QLink= qlInk[i].getAttribute("href");
        let Qdiff = Qdif[i].innerText;
        let obj ={
            name: cName,
            Qlink: "https://leetcode.com"+ QLink,
            Difficulty : Qdiff
        }
        list.push(obj)
       
    }
    return list
}


// Makes a pdf through given Data
function pdfMaker(listData, topic, level){
    let pdfDoc = new PDFDocument({
        size: "A4",
        margin: 40,
      });
    
      
      // generateTable(pdfDoc, listData);
      generateDoc(pdfDoc, listData);
      
      pdfDoc.end();
      if(level!=undefined){
        topic =topic+level;
      }
      pdfDoc.pipe(fs.createWriteStream(`./${topic}.pdf`));
      function generateDoc(doc, arr) {
        const chunkSize = 24;
        const groups = arr
          .map((e, i) => {
            return i % chunkSize === 0 ? arr.slice(i, i + chunkSize) : null;
          })
          .filter((e) => {
            return e;
          });
        let i = 0;
        for (let group of groups) {
          if (i) {
            doc.addPage();
           
          }
          generateTable(doc, group, i, chunkSize);
          i++;
        }
      }
      
      function generateTable(doc, data, itr, chunkSize) {
        let i = 0;
        var dataTableTop = 30;
      
        generateTableRow(doc, dataTableTop, "Index", "Name", "Link","Difficulty" ,1);
        for (let l of data) {
          const position = dataTableTop + (i + 1) * 30;
          generateTableRow(doc, position, chunkSize * itr + i + 1, l.name, l.Qlink, l.Difficulty);
          i++;
        }
      }
      
      function generateTableRow(doc, y, index, name, Qlink, Difficulty, type) {
        doc
          .fontSize(type ? 14 : 10)
          .fillColor("black")
          .text(index, 50, y, { underline: type ? true : false })
          .fillColor("black")
          .text(name, 160, y, { width: 154, underline: type ? true : false })
          .fillColor(type ? "black" : "blue")
          .text(Qlink, 300, y, {
            link: Qlink,
            underline: true,
          })
          .fillColor("black")
          .text(Difficulty, 100, y, { width: 120, underline: type ? true : false })
          
          ;
      }

    
}

module.exports={
    helperFn
}