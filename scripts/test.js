const { Pool } = require('undici');
const http = require('http');
const axios = require('axios');

const HIGHLOAD_BASE_URL = new URL('http://localhost:12804/api/users');
// console.log(HIGHLOAD_BASE_URL);
// URL {
//   href: 'http://localhost:12804/api/users',
//   origin: 'http://localhost:12804',
//   protocol: 'http:',
//   username: '',
//   password: '',
//   host: 'localhost:12804',
//   hostname: 'localhost',
//   port: '12804',
//   pathname: '/api/users',
//   search: '',
//   searchParams: URLSearchParams {},
//   hash: ''
// }
//
const USER_ID = 1;
const REQUEST_COUNT = 10000;
// const REQUEST_COUNT = 20;
// const REQUEST_COUNT = 10;
const AMOUNT = -2;

const highloadPool = new Pool(HIGHLOAD_BASE_URL.origin, {
  connections: 10,
});

async function sendUndiciPoolRequest(method, baseUrl, userId, amount) {
  try {
    const { statusCode, body } = await highloadPool.request({
      path: `${baseUrl.pathname}/${userId}/balance`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount })
    });

    if (statusCode !== 200) {
      throw new Error(`sendUndiciPoolRequest() request failed with status ${statusCode}`);
    }

    const responseData = await body.json();

    return { success: true, data: responseData };
  } catch (e) {
    // console.error('test.js', 'sendUndiciPoolRequest()', 'ERROR', e);
    return { success: false, error: e.response?.data?.error || e.response?.data || e.message };
  }
}

class HttpConnectionPool {
  constructor(options, maxConnections) {
    this.options = options;
    this.maxConnections = maxConnections;
    this.activeCount = 0;
    this.queue = [];
  }

  async sendRequest(body) {
    try {
      const responseData = await new Promise((resolve, reject) => {
        const task = () => {
          this.activeCount++;

          const req = http.request(this.options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
              responseData += chunk;
            });
            res.on('end', () => {
              this.activeCount--;
              this.next();

              // console.log('responseData', JSON.parse(responseData));
              if (res.statusCode === 200) {
                resolve(responseData);
                // resolve({ success: true, data: responseData });
              } else {
                reject(new Error(JSON.parse(responseData).error));
              }
            });
          });

          req.on('error', (e) => {
            this.activeCount--;
            this.next();
            reject(e);
            // reject({ success: false, error: e });
          });

          req.write(body);
          req.end();
        };

        if (this.activeCount < this.maxConnections) {
          task();
        } else {
          this.queue.push(task);
        }
      });

      return { success: true, data: responseData };
    } catch (e) {
      // console.error('test.js', 'sendHttpRequest()', 'ERROR', e);
      return { success: false, error: e.response?.data?.error || e.response?.data || e.message };
    }
  }

  next() {
    if (this.queue.length > 0 && this.activeCount < this.maxConnections) {
      const nextTask = this.queue.shift();
      nextTask();
    }
  }
}

async function sendHttpRequest(method, baseUrl, userId, amount) {
  try {
    const body = JSON.stringify({ amount });

    const options = {
      hostname: baseUrl.hostname,
      port: baseUrl.port,
      path: `${baseUrl.pathname}/${userId}/balance`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      }
    };

    const responseData = await new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          resolve(responseData);
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.write(body);
      req.end();
    });

    return { success: true, data: responseData };
  } catch (e) {
    // console.error('test.js', 'sendHttpRequest()', 'ERROR', e);
    return { success: false, error: e.response?.data?.error || e.response?.data || e.message };
  }
}

async function sendAxiosRequest(baseUrl, userId, amount) {
  try {
    const response = await axios.patch(`${baseUrl}/${userId}/balance`, { amount });

    return { success: true, data: response.data };
  } catch (e) {
    return { success: false, error: e.response?.data?.error || e.response?.data || e.message };
  }
}

async function runLoadTest(requestCount) {
  let timer = -performance.now();
  // const startTime = performance.now();

  //

  // * 1. Undici Pool
  // const requests = Array.from({ length: requestCount }, () => sendUndiciPoolRequest('PATCH', HIGHLOAD_BASE_URL, USER_ID, AMOUNT));
  // * Test completed in 2.94 sec.

  //

  // 2. HTTP module
  // ! 2.1 Without pool (not 5000/5000, INCORRECT): Sample Error: { success: false, error: 'read ECONNRESET' }
  // const requests = Array.from({ length: requestCount }, () => sendHttpRequest('PATCH', HIGHLOAD_BASE_URL, USER_ID, AMOUNT));
  //
  // * 2.2 With pool (not 5000/5000, INCORRECT)
  const body = JSON.stringify({ amount: AMOUNT });
  const options = {
    hostname: HIGHLOAD_BASE_URL.hostname,
    port: HIGHLOAD_BASE_URL.port,
    path: `${HIGHLOAD_BASE_URL.pathname}/${USER_ID}/balance`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length
    }
  };
  const pool = new HttpConnectionPool(options, 10);
  const requests = Array.from({ length: requestCount }, () => pool.sendRequest(body));

  //

  // 3. Axios
  // const requests = Array.from({ length: requestCount }, () => sendAxiosRequest(HIGHLOAD_BASE_URL, USER_ID, AMOUNT));

  //

  const results = await Promise.all(requests);

  // ! DEBUG
  // console.log('requests', requests);
  // console.log('results', results);
  // ! DEBUG

  const successCount = results.filter(result => result.success).length;
  const failureCount = results.filter(result => !result.success).length;

  // ! DEBUG
  // const successResults = results.filter(result => result.success);
  // const failureResults = results.filter(result => !result.success);
  // console.log('successResults', successResults);
  // console.log('failureResults', failureResults);
  // ! DEBUG

  console.log(`Total Requests: ${REQUEST_COUNT}`);
  console.log(`Successful Requests: ${successCount}`);
  console.log(`Failed Requests: ${failureCount}`);

  // const endTime = performance.now();
  timer += performance.now();

  // console.log(`Test completed in ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`Test completed in ${(timer / 1000).toFixed(2)} sec.`);

  if (failureCount > 0) {
    console.error('Sample Error:', results.find(result => !result.success));
    // console.error('results', results);
  }
}

runLoadTest(REQUEST_COUNT);
