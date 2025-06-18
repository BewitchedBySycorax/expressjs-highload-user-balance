const { User } = require('../db/models');

const getOneUserById = async (userId) => {
  try {
    return await User.findByPk(userId);
  } catch (e) {
    // console.error(e);
    throw e;
  }
};

const updateOneUserById = async (userId) => {
  try {
    // TODO:
    // return await User.findByPk(userId);
  } catch (e) {
    // console.error(e);
    throw e;
  }
};

module.exports = {
  getOneUserById,
  updateOneUserById
}
