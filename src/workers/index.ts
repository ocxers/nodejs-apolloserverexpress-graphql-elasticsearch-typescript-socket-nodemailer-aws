let timer: any
let timeInterval = 0

/**
 * Method: runWorker
 *
 * Type: Async Function
 *
 * Parameters:
 * None
 *
 * Description:
 * This function runs a worker function on a set interval using `setTimeout`. The worker function is executed in a
 * try-catch block and is set to run again after a specified time interval.
 *
 * Operations:
 * 1. Clear the current timeout using the `clearTimeout` method.
 * 2. Set a new timeout using the `setTimeout` method to execute the worker function after a specified time interval.
 * 3. Within the worker function, execute some code that is currently marked with a "TODO" comment.
 * 4. If the worker function throws an error, log the error to the console using the `console.error` method.
 * 5. Call the `runWorker` function again recursively to set a new timeout for the next iteration.
 * 6. Set the `timeInterval` variable to a value of 24 hours (24 * 60 * 60 * 1000 milliseconds).
 *
 * Dependencies:
 * None
 */
const runWorker = async () => {
  clearTimeout(timer)

  timer = setTimeout(async () => {
    try {
      // TODO
    } catch (err) {
      console.error('run worker error', err)
    }

    runWorker()
    timeInterval = 24 * 60 * 60 * 1000
  }, timeInterval)
}

export default runWorker
