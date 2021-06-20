const Contacts = require('../model/contacts');
const { HttpCode } = require('../helpers/constants');

const getAll = async (req, res, next) => {
  const userId = req.user.id;
  const query = req.query;
  try {
    const { total, page, limit, offset, contacts, totalPages } =
      await Contacts.listContacts(userId, query);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { total, page, totalPages, limit, offset, contacts },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const userId = req.user.id;
  const contactId = req.params.contactId;
  try {
    const contact = await Contacts.getContactById(userId, contactId);
    // console.log(contact); // toObject
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { contact } }); // toJSON
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  const userId = req.user.id;
  const contactId = req.params.contactId;
  try {
    const contact = await Contacts.removeContact(userId, contactId);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        message: 'contact deleted',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const userId = req.user.id;
  const contactId = req.params.contactId;
  try {
    const contact = await Contacts.updateContact(userId, contactId, req.body);
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { contact } });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  const userId = req.user.id;
  const contactId = req.params.contactId;
  try {
    if (typeof req.body.favorite === 'undefined') {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Missing field favorite!',
      });
    }
    const contact = await Contacts.updateContact(userId, contactId, req.body);
    if (contact) {
      return res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { contact } });
    }

    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  remove,
  update,
  updateFavorite,
};
