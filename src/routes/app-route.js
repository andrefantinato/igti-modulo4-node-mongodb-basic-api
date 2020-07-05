'use strict';
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account-controller');

router.post('/deposito', accountController.deposito);
router.post('/saque', accountController.saque);
router.post('/transferencia', accountController.transferencia);
router.post('/saldo', accountController.saldo);

router.get('/media/:agencia', accountController.media);
router.get('/ranking/:order/:limit', accountController.ranking);
router.get('/private', accountController.private);

router.delete('/conta', accountController.deletarConta);

module.exports = router;
