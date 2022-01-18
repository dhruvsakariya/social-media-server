const { UserInputError } = require("apollo-server");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const { validateRegisterInput } = require("../../utils/validators");

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { errors, valid } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const userCheck = await User.findOne({ username });
      if (userCheck) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      const emailCheck = await User.findOne({ email });
      if (emailCheck) {
        throw new UserInputError("Email already Exist", {
          errors: {
            email: "This Email is exist",
          },
        });
      }

      password = await bcryptjs.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = jsonwebtoken.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
