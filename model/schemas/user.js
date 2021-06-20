const mongoose = require('mongoose');
const { Schema } = mongoose;
const { uuid } = require('uuidv4');
const gravatar = require('gravatar');
const { Subscription } = require('../../helpers/constants');
const bcrypt = require('bcryptjs');

const SALT_FACTOR = 6;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 2,
      required: [true, 'Set name for contact'],
      default: 'Guest',
    },
    password: {
      type: String,
      minLength: 7,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/gi;
        return re.test(String(value).toLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: {
        values: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
        message: 'But it not allowed',
      },
      // enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
      default: Subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: function () {
        return gravatar.url(
          this.email,
          {
            s: '250',
          },
          true, // protocol true-https, false-http
        );
      },
    },
    userImgId: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verifyToken: {
      type: String,
      required: [true, 'Verify token is required'],
      default: uuid(),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// static method schema userSchema
userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

const User = mongoose.model('user', userSchema);

module.exports = User;
