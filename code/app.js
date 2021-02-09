const url = 'https://api.npoint.io/e8cd5a9bbd1331de326a';   //Location of fetching data.
const fetch = require("node-fetch"); //package to run js code in terminal
let totalQty, refOfTotalAmt;   //variables to store total amount of ingredients held by machine
let obj;    //OBJECT FOR RETRIEVING JSON DATA FROM URL  
 let beverages = [];    //DATA STRUCTURE TO STORE DATA OF BEVERAGES


const dispense = (beverage) => {                //FUNCTION TO PROCESS THE DISPENSING OF THE BEVERAGES
    ing = beverage.ingredients;
    return new Promise((resolve,reject) => {
        for (const property in ing){
            if (property in totalQty){
                continue;
            }
            else{
                resolve(`${beverage.name} cannot be prepared because ${property} insufficient`);
            }
        }

            for (const property in ing){
            if(totalQty[property] >= ing[property]){
                totalQty[property] = totalQty[property] - ing[property];
                console.log(totalQty);
            }
            else{
                resolve(`${beverage.name} cannot be prepared because ${property} insufficient`);
            }  
        }
        resolve(`${beverage.name} is prepared`);  
    })
    
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
    requests = [];
    for(i = 0; i<indices.length; i++){
    requests.push(dispense(beverages[indices[i]]))
    }

    Promise.all(requests)
    .then(responses => {
        for (const response in responses){
            console.log(responses[response]);
        }
    })
    .catch(errors => {
        for (const err in errors){
            console.log(err);
        }
    })
}


async function setup(){                             //BASIC SETUP FUNCTION FOR RETRIEVING DATA, INITIALISING DS, AND CALLING QUERIES FUNCTION
   
    obj = await (await fetch(url)).json();
    totalQty = obj.machine.total_items_quantity;

    refOfTotalAmt = totalQty;
    
    for (const property in obj.machine.beverages) {             //ASSIGNING INGREDIENT QUANTITIES TO SPECIFIC BEVERAGES AND PUSHING INTO ARRAY
        beverages.push({
            name:property,
            ingredients: obj.machine.beverages[property]
        });
      }
    noOfOutlets = obj.machine.outlets.count_n;            //RETRIEVING NO OF OUTLETS FROM JSON
    queries(noOfOutlets);                                 //FUNCTION CALL TO QUERIES
}

setup();                                                      //BASIC FUNCTION CALL