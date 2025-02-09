// Description: This file is used to catch errors in async functions and pass them to the error handling middleware.
module.exports = func => {
  return (req, res, next) => {
      func(req, res, next).catch(next)
  }
}