const db = require('../models');
const {validationResult} = require('express-validator');
const requestHelper = require('../helpers/request.helper');
const userHelper = require('../helpers/user.helper');

exports.get = async (req, res) => {
  try {
    const errors = validationResult(req).formatWith(({msg}) => msg);

    if (!errors.isEmpty()) {
      return requestHelper.response(res, false, errors.array());
    }

    const user = await db.user.findByPk(req.params.id);
    return requestHelper.response(
        res,
        true,
        null,
        userHelper.generateProfile(user),
    );
  } catch (exception) {
    return requestHelper.response(res, false, exception.message);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req).formatWith(({msg}) => msg);

    if (!errors.isEmpty()) {
      return requestHelper.response(
          res,
          false,
          errors.array({onlyFirstError: true}),
      );
    }

    await db.user.update(req.params.id, req.body);
    return requestHelper.response(res, true, 'Profile updated successfully');
  } catch (exception) {
    return requestHelper.response(res, false, exception.message);
  }
};