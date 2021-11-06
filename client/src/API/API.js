/** STORY 1 **/
//POST post the requests into the db
const addPRequest = (userid, creationdate, claimdate, confirmationdate, deliveryaddress, deliveryid, status, productid, quantity, price) => {
    return new Promise((resolve, reject) => {
      fetch( '/api/requests', {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
            userId : userid, 
            creationdate : creationdate,
            claimdate : claimdate,
            confirmationdate : confirmationdate, 
            deliveryaddress : deliveryaddress,
            deliveryid : deliveryid, 
            status : status,
            productid : productid,
            quantity : quantity,
            price : price
        })
      })
        .then((res) => {
          if (!res.ok) {
            const error = new Error(`${res.status}: ${res.statusText}`);
            error.response = res;
            throw error;
          }
          resolve(res.json());
        })
        .catch((err) => {
            reject({ message: err.message });
        });
    });
}

//GET all clients
const getClients = () => {
  return new Promise((resolve, reject) => {
    fetch( '/api/get/clients', {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
        if (!res.ok) {
          const error = new Error(`${res.status}: ${res.statusText}`);
          error.response = res;
          throw error;
        }
        resolve(res.json());
      })
      .catch((err) => {
          reject({ message: err.message });
      });
  });
}

/** STORY 2 **/
const addClient = (name, surname, wallet, address) => {
    return new Promise((resolve, reject) => {
      fetch( '/api/client', {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
            name : name, 
            surname: surname,
            wallet: wallet,
            address: address
        })
      })
        .then((res) => {
          if (!res.ok) {
            const error = new Error(`${res.status}: ${res.statusText}`);
            error.response = res;
            throw error;
          }
          resolve(res.json());
        })
        .catch((err) => {
            reject({ message: err.message });
        });
    });
  }

/** STORY 3 **/
const getAvailableProducts = () => {
    return new Promise((resolve, reject) => {
      fetch( '/api/products', {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }).then((res) => {
          if (!res.ok) {
            const error = new Error(`${res.status}: ${res.statusText}`);
            error.response = res;
            throw error;
          }
          resolve(res.json());
        })
        .catch((err) => {
            reject({ message: err.message });
        });
    });
}

/** STORY 4 **/
//In the server function do a query on OrderLine and get productid and quantity,
//Then do an update on Availability and subtract the optained quantity to the availability quantity where 
//productid is equal to the one optained before!
async function handOutProduct(requestid) {
    const response = await fetch('/api/handout/' + requestid, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
    });
    if(response.ok) {
        return null;
    } else return { 'err': 'PUT error' };
};



