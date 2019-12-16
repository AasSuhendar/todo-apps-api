module.exports = {
  getIndex: (req, res) => {
    res.status(200).json({
        status: true,
        code: 'GET-MAIN-ENDPOINT-API',
        message: 'Wellcome to TODO Apps API'
      })
  }
}
