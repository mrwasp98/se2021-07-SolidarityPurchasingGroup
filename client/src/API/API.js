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
        creationdate: dayjs(creationdate).format("YYYY-MM-DD HH:mm"),
        claimdate: claimdate,
        confirmationdate: confirmationdate,
        deliveryaddress: deliveryaddress,
        deliveryid: deliveryid,
        status: status,
        products: products,
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

//GET all orders of that status
const getOrdersByStatus = async (status) => {
  return new Promise((resolve, reject) => {
    fetch('/api/orders/status/' + status, {
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


const getClientById = async (clientid) => {
  return new Promise((resolve, reject) => {
    fetch('/api/client/' + clientid, {
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
const addClient = async (name, surname, email, wallet, address, password, type) => {
  return new Promise((resolve, reject) => {
    fetch('/api/client', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        surname: surname,
        username: email,
        wallet: wallet,
        address: address,
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

/** STORY 3 **/
const getAvailableProducts = async (date) => {
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
  if (response.ok) {
    return response.status;
  } else return { message: "Couldn't mark the order as completed." };
}

//this API fetches the orders of a specific client
const getClientOrders = async (clientid) => {
  return new Promise((resolve, reject) => {
    fetch('/api/completeOrders?clientid=' + clientid, {
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
  if (response.ok) {
    return response.status;
  } else return { message: "Couldn't top up the client's wallet." };
}

/** STORY 6 **/
const addShopEmployee = async (username, password) => {
  return new Promise((resolve, reject) => {
    fetch('/api/shopemployee', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        type: "shopemployee"
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

const addFarmer = async (username, password, name, surname, place, address) => {
  return new Promise((resolve, reject) => {
    fetch('/api/farmer', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        name: name,
        surname: surname,
        place: place,
        address: address,
        type: "farmer"
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

const updatePassword = async (password, id) => {
  return new Promise((resolve, reject) => {
    fetch('/api/password', {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        id: id
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

//this API fetches all the usernames available
const getUsernames = async () => {
  return new Promise((resolve, reject) => {
    fetch('/api/usernames', {
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

/* --- Story 9 --- */
async function insertProduct(product) {
  return new Promise((resolve, reject) => {
    fetch('/api/product', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      }, 
      body: JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        farmerid: product.farmerid,
        price: product.price,
        measure: product.measure,
        category: product.category,
        typeofproduction: product.typeofproduction,
        picture: product.picture
      })}).then((res) => {
            if (!res.ok) {
              const error = new Error(`${res.status}: ${res.statusText}`);
              error.response = res;
              throw error;
            }
            resolve(res.json())
          })
          .catch((err) => {
            reject({ message: err.message })
          })
    })
}

async function updateProduct(product) {
  return new Promise((resolve, reject) => {
    fetch('/api/product', {
      method: "PUT",
      headers: {
        "content-type": "application/json"
      }, 
      body: JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        farmerid: product.farmerid,
        price: product.price,
        measure: product.measure,
        category: product.category,
        typeofproduction: product.typeofproduction,
        picture: product.picture
      })}).then((res) => {
            if (!res.ok) {
              const error = new Error(`${res.status}: ${res.statusText}`);
              error.response = res;
              throw error;
            }
            resolve(res.json())
          })
          .catch((err) => {
            reject({ message: err.message })
          })
    })
}

async function deleteProduct(productid) {
  return new Promise((resolve, reject) => {
    fetch('/api/product/' + productid, {
      method: "DELETE"
    }).then((res) => {
            if (!res.ok) {
              const error = new Error(`${res.status}: ${res.statusText}`);
              error.response = res;
              throw error;
            }
            resolve(null)
          })
          .catch((err) => {
            reject({ message: err.message })
          })
    })
}

async function insertAvailability(availability) {
  return new Promise((resolve, reject) => {
    fetch('/api/availability', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      }, 
      body: JSON.stringify(availability)
      }).then((res) => {
            if (!res.ok) {
              const error = new Error(`${res.status}: ${res.statusText}`);
              error.response = res;
              throw error;
            }
            resolve(res.text())
          })
          .catch((err) => {
            reject({ message: err.message })
          })
    })
}

const getProductsByFarmer = async (farmerid) => {
  return new Promise((resolve, reject) => {
    fetch('/api/productsByFarmer/' + farmerid, {
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

//this API fetches all the orders refered to a farmer
const getFarmersOrders = async (farmerid, date, status) => {
  return new Promise((resolve, reject) => {
    fetch("/api/orders/farmers?farmerid=" + farmerid + "&date=" + date + "&status=" + status, {
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

//this API updates the status of an orderlines
async function updateOrderStatus(orderid, productid, status) {
  const response = await fetch('/api/orderlines', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderid: orderid,
      productid: productid,
      status: status
    })
  });
  if (response.ok) {
    return response.status;
  } else return { message: "Couldn't update the order status." };
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
    return response.json();
  } else {
    throw await response.text();
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

//this API fetches the weekly report data
const getReport = (date, mod) => {
  return new Promise((resolve, reject) => {
    fetch(`/api/manager/${mod}Report/` + date, {
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

//this API fetches the weekly report data
const getSuspendedDate = (username) => {
  return new Promise((resolve, reject) => {
    fetch('/api/suspended/' + username, {
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
      resolve(res.text());
    })
      .catch((err) => {
        reject({ message: err.message });
      });
  });
}


const confirmAvailabilities = (confirmedAvailabilities) => {
  return new Promise((resolve, reject) => {
    fetch('/api/availabilities', {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(confirmedAvailabilities)
    })
      .then((res) => {
        if (res.ok)
          resolve(res.status);
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

//this API gets the products availability for a cetein farme
const getProductAvailability = (farmerid, date) => {
  return new Promise((resolve, reject) => {
    fetch(`/api/availability/`+ farmerid + '?date=' + date, {
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


export {confirmAvailabilities, getReport, getOrdersByStatus, addPRequest, getClients, addClient, getClientById, getAvailableProducts, handOutProduct, getFarmers, login, logout, getUserInfo, getClientOrders, topUpWallet, addShopEmployee, getUsernames, addFarmer, updatePassword, getFarmersOrders, updateOrderStatus, insertProduct, insertAvailability, getProductsByFarmer, updateProduct, deleteProduct, getSuspendedDate, getProductAvailability}