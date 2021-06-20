const Contact = require('./schemas/contact');

const listContacts = async (userId, query) => {
  const {
    page = 1,
    limit = 5,
    offset = 0,
    sortBy, // sort >>
    sortByDesc, // sort <<
    filter, // name|email|phone
    favorite = null,
  } = query;

  const options = {
    owner: userId,
  };

  if (favorite !== null) {
    options.favorite = favorite;
  }

  const results = await Contact.paginate(options, {
    page,
    limit,
    offset,
    select: filter ? filter.split('|').join(' ') : '', // name email phone
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}), // sort >>
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}), // sort <<
    },
    populate: { path: 'owner', select: 'name email subscription -_id' },
  });
  const { docs: contacts, totalDocs: total, totalPages } = results;
  return { contacts, total, page, limit, offset, totalPages };
  // const results = await Contact.find({ owner: userId }).populate({
  //   path: 'owner',
  //   select: 'name email subscription -_id',
  // });
  // return results
};

const getContactById = async (userId, contactId) => {
  // const result = await Contact.findById({
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({ path: 'owner', select: 'name email subscription -_id' }); // .populate({}) позволяет показывать не просто id пользователя, а ту информацию,кот.указываем в select, "-"-убирает ненужные поля
  return result;
};

const removeContact = async (userId, contactId) => {
  // const result = await Contact.findByIdAndRemove({
  const result = await Contact.findOneAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
};

const addContact = async body => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (userId, contactId, body) => {
  // const result = await Contact.findByIdAndUpdate(
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  ).populate({
    path: 'owner',
    select: 'name email subscription -_id',
  });

  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
