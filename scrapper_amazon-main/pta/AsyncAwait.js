const getData=async()=>{
    var data= await "Hello world"
     console.log(data)
    return data;
}

console.log(1);
getData();
console.log(2);

//1
//2
//Hello world


// now here if you see the output the function didn't went synchronously instead it waited for the await response and then logged the value or called the function
//if you remove await it will go in a synchronous way