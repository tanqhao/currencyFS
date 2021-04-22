const express = require("express");
const currencyController = require("./controllers/currencyController")
const router = express.Router();
const cors = require("cors");


router.use(cors());

router.post('/post', currencyController.default);
router.get('/', currencyController.home);
router.get('/query/list', currencyController.getList);
router.get('/query/currentRates', currencyController.getCurrentRates);
router.get('/query/historicalRates', currencyController.getHistoricalRates);

module.exports = router;
