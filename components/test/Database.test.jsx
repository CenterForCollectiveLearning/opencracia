import fetch from "node-fetch";

function makeRequestAndAlogTime () {
    
  // const data = fetch("http://localhost:3002/api/proposals").then(resp =>  return (new Date().valueOf() - startTime));
  const startTime = new Date().valueOf();
  fetch("http://localhost:3002/api/proposals")
    .then( response => {
      const {time, memory} = response.json();
      const time_ = (new Date().valueOf() - startTime);
      expect(time_).toBeLessThan(2000);
    });
}


test("multiple api calls", () => {
    
  for(let x = 0; x < 800; x++) 
    makeRequestAndAlogTime();
  // console.log(time);
        
    
});


function asyncCallTest () {
    
  const startTime = new Date().valueOf();
  fetch("http://localhost:3002/api/proposals")
    .then(async (response) => {
      const {time, memory} = response.json();
      const time_ = (new Date().valueOf() - startTime);
      expect(time_).toBeLessThan(2000);

    });
}

test("multiple api async calls", () => {

  for(let x = 0; x < 2000; x++) 
    asyncCallTest();
  // console.log(time);
        
    
});
