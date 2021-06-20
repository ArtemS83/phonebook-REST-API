const express = require('express');
const router = express.Router();

const guard = require('../../../helpers/guard');
const ctrl = require('../../../controllers/contacts');
const {
  validateCreateContact,
  validateUpdateContact,
  validateObjectId,
  validateStatusFavoriteContact,
} = require('./validation');

router.get('/', guard, ctrl.getAll);

router.get('/:contactId', guard, validateObjectId, ctrl.getById);

router.post('/', guard, validateCreateContact, ctrl.create);

router.delete('/:contactId', guard, validateObjectId, ctrl.remove);

router.put(
  '/:contactId',
  guard,
  validateUpdateContact,
  validateObjectId,
  ctrl.update,
);

router.patch(
  '/:contactId/favorite',
  guard,
  validateStatusFavoriteContact,
  validateObjectId,
  ctrl.updateFavorite,
);

module.exports = router;
