'use strict';
const accountModel = require('../models/account');

exports.deposito = async (req, res, next) => {
  const { agencia, conta, valor } = req.body;
  const account = await accountModel.findOneAndUpdate(
    {
      agencia: agencia,
      conta: conta,
    },
    {
      $inc: { balance: valor },
    },
    { new: true }
  );

  if (!account) {
    res.status(200).send({
      response: false,
      message: 'Não foi possível encontrar conta.',
    });
    return;
  }

  res.status(200).send({
    response: true,
    message: account,
  });
};

exports.saque = async (req, res, next) => {
  const { agencia, conta, valor } = req.body;

  const saque = valor + 1;
  const account = await accountModel.findOne({
    agencia: agencia,
    conta: conta,
  });

  if (!account) {
    res.status(200).send({
      response: false,
      message: 'Não foi possível encontrar conta.',
    });
    return;
  }
  account.balance = account.balance - saque;

  try {
    await accountModel.updateOne(
      {
        agencia: agencia,
        conta: conta,
      },
      {
        balance: account.balance,
      },
      { runValidators: true, new: true }
    );
  } catch (error) {
    res.status(500).send({
      response: false,
      message: error,
    });
    return;
  }

  res.status(200).send({
    response: true,
    message: account,
  });
};

exports.saldo = async (req, res, next) => {
  const { agencia, conta } = req.body;
  const account = await accountModel.findOne({
    agencia: agencia,
    conta: conta,
  });

  if (!account) {
    res.status(200).send({
      response: false,
      message: 'Não foi possível encontrar conta.',
    });
    return;
  }

  res.status(200).send({
    response: true,
    message: `Saldo atual: R$ ${account.balance}`,
  });
};

exports.deletarConta = async (req, res, next) => {
  const { agencia, conta } = req.body;
  const account = await accountModel.deleteOne({
    agencia: agencia,
    conta: conta,
  });

  const total = await accountModel.countDocuments({
    agencia: agencia,
  });

  res.status(200).send({
    response: true,
    message: `Total de contas na agência ${agencia}: ${total}`,
  });
};

exports.transferencia = async (req, res, next) => {
  const { conta1, conta2, valor } = req.body;
  const contaOrigem = await accountModel.findOne({
    conta: conta1,
  });
  const contaDestino = await accountModel.findOne({
    conta: conta2,
  });

  let tarifa = 0;
  if (contaOrigem.agencia != contaDestino.agencia) tarifa += 8;

  const accout1Updated = await accountModel.findOneAndUpdate(
    { conta: conta1 },
    { $inc: { balance: -(valor + tarifa) } },
    { new: true }
  );
  await accountModel.findOneAndUpdate(
    { conta: conta2 },
    { $inc: { balance: valor + tarifa } },
    { new: true }
  );

  res.status(200).send({
    response: true,
    message: accout1Updated,
  });
};

exports.media = async (req, res, next) => {
  const { agencia } = req.params;
  const accounts = await accountModel.find({
    agencia: agencia,
  });

  const total = accounts.reduce((acc, curr) => {
    return (acc += curr.balance);
  }, 0);
  const media = total / accounts.length;

  res.status(200).send({
    response: true,
    message: `Média de saldo para agência ${agencia}: R$ ${media}`,
  });
};

exports.ranking = async (req, res, next) => {
  const { limit, order } = req.params;
  console.log(limit);
  console.log(order);
  const accounts = await accountModel
    .find()
    .sort({ balance: parseFloat(order) })
    .limit(parseFloat(limit));

  res.status(200).send({
    response: true,
    message: accounts,
  });
};

exports.private = async (req, res, next) => {
  const accounts = await accountModel.aggregate([
    {
      $group: {
        _id: '$agencia',
        maxBalance: { $max: '$balance' },
      },
    },
  ]);

  res.status(200).send({
    response: true,
    message: accounts,
  });
};
