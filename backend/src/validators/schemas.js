const Joi = require('joi');

exports.login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

exports.createUser = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin','manager','staff').default('staff'),
});

exports.updateUser = Joi.object({
  name: Joi.string().min(2).max(120),
  role: Joi.string().valid('admin','manager','staff'),
  is_active: Joi.boolean(),
  password: Joi.string().min(6),
});

exports.product = Joi.object({
  sku: Joi.string().max(64).required(),
  barcode: Joi.string().max(64).allow(null, ''),
  name: Joi.string().max(200).required(),
  description: Joi.string().allow(null, ''),
  category_id: Joi.number().integer().allow(null),
  supplier_id: Joi.number().integer().allow(null),
  cost_price: Joi.number().precision(2).min(0).default(0),
  sell_price: Joi.number().precision(2).min(0).default(0),
  stock_qty: Joi.number().integer().min(0).default(0),
  reorder_level: Joi.number().integer().min(0).default(5),
});

exports.stockAdjust = Joi.object({
  change_qty: Joi.number().integer().required(),
  reason: Joi.string().max(255).allow(null, ''),
});

exports.category = Joi.object({
  name: Joi.string().max(120).required(),
  description: Joi.string().max(500).allow(null, ''),
});

exports.supplier = Joi.object({
  name: Joi.string().max(160).required(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().max(40).allow(null, ''),
  address: Joi.string().max(500).allow(null, ''),
});

exports.order = Joi.object({
  type: Joi.string().valid('purchase','sales').required(),
  supplier_id: Joi.number().integer().allow(null),
  customer_name: Joi.string().max(160).allow(null, ''),
  items: Joi.array().items(Joi.object({
    product_id: Joi.number().integer().required(),
    quantity: Joi.number().integer().min(1).required(),
    unit_price: Joi.number().precision(2).min(0).required(),
  })).min(1).required(),
});

exports.orderStatus = Joi.object({
  status: Joi.string().valid('pending','approved','completed','cancelled').required(),
});
