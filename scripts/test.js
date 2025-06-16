const axios = require('axios')
const { performance } = require('perf_hooks')

const BASE_URL = 'http://localhost:12804/api/users'
const USER_ID = 1
const REQUEST_COUNT = 10000
const AMOUNT = -2

async function sendRequest() {
  try {
    const response = await axios.put(`${BASE_URL}/${USER_ID}/balance`, { amount: AMOUNT })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: error.response?.data || error.message }
  }
}

async function runLoadTest() {
  const startTime = performance.now()

  const requests = Array.from({ length: REQUEST_COUNT }, () => sendRequest())
  const results = await Promise.all(requests)

  const successCount = results.filter(result => result.success).length
  const failureCount = results.filter(result => !result.success).length

  console.log(`Total Requests: ${REQUEST_COUNT}`)
  console.log(`Successful Requests: ${successCount}`)
  console.log(`Failed Requests: ${failureCount}`)

  const endTime = performance.now()
  console.log(`Test completed in ${(endTime - startTime).toFixed(2)}ms`)

  if (failureCount > 0) {
    console.log('Sample Error:', results.find(result => !result.success).error)
  }
}

runLoadTest()
