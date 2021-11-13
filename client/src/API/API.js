/** STORY 1 **/
//POST post the requests into the db


/**
 * 
 * @param {*} userid 
 * @param {*} creationdate 
 * @param {*} claimdate 
 * @param {*} confirmationdate 
 * @param {*} deliveryaddress 
 * @param {*} deliveryid 
 * @param {*} status 
 * @param {*} products : [{ productid: integer, quantity: integer, price: float }]
 * 
 * @returns 
 */
const addPRequest = async (userid, creationdate, claimdate, confirmationdate, deliveryaddress, deliveryid, status, products) => {
  return new Promise((resolve, reject) => {
    fetch('/api/requests', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userid,
        creationdate: creationdate,
        claimdate: claimdate,
        confirmationdate: confirmationdate,
        deliveryaddress: deliveryaddress,
        deliveryid: deliveryid,
        status: status,
        products: products
      })
    })
      .then((res) => {
        if (res.ok)
          resolve(res.json());
        else if (res.status === 406)
          // The request can be not resolve because a few products are not availability
          resolve(res.json());

        else if (!res.ok) {
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
const getClients = async () => {
  return new Promise((resolve, reject) => {
    fetch('/api/clients', {
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
const addClient = async (name, surname, wallet, address) => {
  return new Promise((resolve, reject) => {
    fetch('/api/client', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
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
const getAvailableProducts = async () => {
  return new Promise((resolve, reject) => {
    fetch('/api/products', {
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

const getFarmers = async () => {
  return new Promise((resolve, reject) => {
    fetch('/api/farmers', {
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
  if (response.ok) {
    return null;
  } else return { 'err': 'PUT error' };
};

//this API fetches the orders of a specific client
const getClientOrders = async (clientid) => {
  return new Promise((resolve, reject) => {
    fetch('/api/orders?clientid=' + clientid, {
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


async function login(credentials) {
  let response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user.name;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

async function logout() {
  const response = await fetch('/logout', {
    method: 'DELETE'
  });
  if (response.ok) {
    return null;
  } else return { 'err': 'DELETE error' };
}

async function getUserInfo() {
  const response = await fetch('/api/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;
  }
}



export { addPRequest, getClients, addClient, getAvailableProducts, handOutProduct, getFarmers, login, logout, getUserInfo, getClientOrders }