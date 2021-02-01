const url = 'https://api.npoint.io/e8cd5a9bbd1331de326a';   //Location of fetching data.
const fetch = require("node-fetch"); //package to run js code in terminal
let TOTAL_AMT, refOfTotalAmt;   //variables to store total amount of ingredients held by machine
let obj;    //OBJECT FOR RETRIEVING JSON DATA FROM URL  
 let beverages = [];    //DATA STRUCTURE TO STORE DATA OF BEVERAGES


class ingredients{  //CLASS DEFINITION FOR INGREDIENTS
 constructor(hm,hw,ss,gs,tls, gm){
     this.hm = hm;
     this.hw = hw;
     this.ss = ss;
     this.gs = gs;
     this.tls = tls;
     this.gm = gm;
 } 
}


class beverage extends ingredients{             //CLASS DEFINITION OF BEVERAGE OBJECT
    constructor(ingObj, name){
        let a = ingObj.hm;
        let b = ingObj.hw; 
        let c = ingObj.ss; 
        let d = ingObj.gs; 
        let e = ingObj.tls; 
        let f = ingObj.gm; 
        super(a,b,c,d,e,f);
        this.name = name;
    }

    dispense(){                                 //METHOD TO COMPARE AND DISPENSE BEVERAGE IF CONDITIONS MET..
        let a = TOTAL_AMT.hm - this.hm;
        let b=  TOTAL_AMT.hw - this.hw;
        let c = TOTAL_AMT.ss - this.ss;
        let d = TOTAL_AMT.gs - this.gs;
        let e = TOTAL_AMT.tls - this.tls;
        let f = TOTAL_AMT.gm - this.gm;
        if(
            a>=0 &&
            b>=0 &&
            c>=0 &&
            d>=0 &&
            e>=0 &&
            f >= 0
        ){
            console.log(`${this.name} is prepared`);
            TOTAL_AMT = {
                hm: a,
                hw: b,
                ss: c,
                gs: d,
                tls: e,
                gm: f
            }   
        }
        else{
            if(f<0)
            console.log(`${this.name} cannot be prepared because green mixture insufficient`);
            else if(a<0)
            console.log(`${this.name} cannot be prepared because hot milk insufficient`);
            else if(b<0)
            console.log(`${this.name} cannot be prepared because hot water insufficient`);
            else if(c<0)
            console.log(`${this.name} cannot be prepared because sugar syrup insufficient`);
            else if(d<0)
            console.log(`${this.name} cannot be prepared because ginger syrup insufficient`);
            else if(e<0)
            console.log(`${this.name} cannot be prepared because tea leaves syrup insufficient`);
            
        }
    }
}

function refill(){                                  //FUNCTION TO REFILL THE MACHINE
    TOTAL_AMT = refOfTotalAmt;
    console.log(TOTAL_AMT);
    return;
}

function queries(n){                                //FUNCTION FOR GENERATING RANDOM QUERIES OF DRINKS TO BE DISPENSED
    let i;
    let indices = [];
    while(indices.length < n ){
    
        l = (Math.floor((Math.random() * 100)))%beverages.length;
        if(!indices.includes(l)) {
            indices.push(l);
        }
    }
    for(i = 0; i<indices.length; i++){
        beverages[indices[i]].dispense();
    }
}


async function setup(){                             //BASIC SETUP FUNCTION FOR RETRIEVING DATA, INITIALISING DS, AND CALLING QUERIES FUNCTION
   
    obj = await (await fetch(url)).json();
    const {hot_milk, hot_water, sugar_syrup, ginger_syrup, tea_leaves_syrup} = obj.machine.total_items_quantity;
    green_mixture = obj.machine.total_items_quantity.green_mixture?obj.machine.total_items_quantity.green_mixture:0;
    TOTAL_AMT = new ingredients(
        hot_milk, hot_water, sugar_syrup, ginger_syrup, tea_leaves_syrup, green_mixture
    );
    refOfTotalAmt = TOTAL_AMT;
    for (const property in obj.machine.beverages) {             //ASSIGNING INGREDIENT QUANTITIES TO SPECIFIC BEVERAGES AND PUSHING INTO ARRAY
        ingredients = obj.machine.beverages[property]
        let hm = ingredients.hot_milk?ingredients.hot_milk:0;
        let hw = ingredients.hot_water?ingredients.hot_water:0;
        let ss = ingredients.sugar_syrup?ingredients.sugar_syrup:0;
        let gs = ingredients.ginger_syrup?ingredients.ginger_syrup:0;
        let tls = ingredients.tea_leaves_syrup?ingredients.tea_leaves_syrup:0;
        let gm = ingredients.green_mixture?ingredients.green_mixture:0;         //COMPARISON TO CHECK IF INGREDIENT PRESENT FOR BEVERAGE AND IF NOT ASSIGN 0 AS QTY
        const k = new beverage({
            hm:hm,
            hw:hw,
            ss:ss,
            gs:gs,
            tls:tls,
            gm:gm
        },property);
        beverages.push(k);
      }
      
      noOfOutlets = obj.machine.outlets.count_n;            //RETRIEVING NO OF OUTLETS FROM JSON
      queries(noOfOutlets);                                 //FUNCTION CALL TO QUERIES
}

setup();                                                      //BASIC FUNCTION CALL