const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { broadcastMessage } = require("../sockets/socketServer");

const createUser = async (req, reply) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return reply.status(400).send({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    broadcastMessage(JSON.stringify({ event: "user_created", data: user }));

    reply.code(201).send({ message: "User created successfully" });
  } catch (error) {
    reply.status(500).send({ message: "Server error", error: error.message });
  }
};

const getUserById = async (req, reply) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    reply.send(user);
  } catch (error) {
    reply.status(500).send({ message: "Server error", error: error.message });
  }
};

const updateUser = async (req, reply) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const user = await User.findByIdAndUpdate(id);
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    await user.save();
    broadcastMessage(JSON.stringify({ event: "user_updated", data: user }));
    reply.send({ message: "User updated successfully" });
  } catch (error) {
    reply.status(500).send({ message: "Server error", error: error.message });
  }
};

const deleteUser = async (req, reply) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }
    broadcastMessage(JSON.stringify({ event: "user_deleted", data: { id } }));

    reply.send({ message: "User deleted successfully" });
  } catch (error) {
    reply.status(500).send({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
