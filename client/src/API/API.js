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
 import dayjs from "dayjs";

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
const addClient = async (name, surname, email, wallet, address) => {
  return new Promise((resolve, reject) => {
    fetch('/api/client', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        surname: surname,
        email: email,
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
const getAvailableProducts = async (date) => {
  console.log(dayjs(date))
  return new Promise((resolve, reject) => {
    fetch('/api/products/' + dayjs(date).format('YYYY-MM-DD'), {
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
async function handOutProduct(orderid) {
  const response = await fetch('/api/orders/' + orderid, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'completed'
    })
  });
  if(response.ok) {
      return response.status;
  } else return { message: "Couldn't mark the order as completed." };
};

//this API fetches the orders of a specific client
const getClientOrders = async (clientid) => {
  return new Promise((resolve, reject) => {
    fetch( '/api/completeOrders?clientid='+clientid, {
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

/** STORY 5 **/
async function topUpWallet(clientid, ammount) {
  const response = await fetch('/api/clients/' + clientid + '/?ammount=' + ammount, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'completed'
    })
  });
  if(response.ok) {
      return response.status;
  } else return { message: "Couldn't top up the client's wallet." };
};

/** STORY 6 **/
const addUser = async (username, password, type) => {
  return new Promise((resolve, reject) => {
    fetch('/api/user', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        type: type
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

/*----- USER APIs ---*/
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
    return user;
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





export { addPRequest, getClients, addClient, getAvailableProducts, handOutProduct, getFarmers, login, logout, getUserInfo, getClientOrders, topUpWallet, addUser}