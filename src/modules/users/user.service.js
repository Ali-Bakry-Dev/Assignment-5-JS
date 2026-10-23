const bcrypt = require('bcrypt');
const userRepository = require('./user.repository');

const signup = async (userData) => {
const { name, email, password } = userData;

// 1. Validate required fields
if (!name || !email || !password) {
throw new Error('Name, email, and password are required');
}

// 2. Validate name length
if (typeof name !== 'string' || name.trim().length <= 2) {
throw new Error('Name must be longer than 2 characters');
}

// 3. Validate email format
if (typeof email !== 'string') {
throw new Error('Invalid email format');
}

const normalizedEmail = email.trim().toLowerCase();
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

if (!emailRegex.test(normalizedEmail)) {
throw new Error('Invalid email format');
}

// 4. Validate password
if (typeof password !== 'string' || password.length <= 6) {
throw new Error('Password must be longer than 6 characters');
}

// 5. Check if email already exists
const existingUser = await userRepository.findUserByEmail(normalizedEmail);

if (existingUser) {
throw new Error('Email is already registered');
}

// 6. Hash the password
const hashedPassword = await bcrypt.hash(password, 10);

// 7. Create the user
return await userRepository.createUser({
name: name.trim(),
email: normalizedEmail,
password: hashedPassword,
});
};
const updateUser = async (id, userData) => {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error('Invalid user ID');
  }

  const allowedFields = ['name', 'email', 'password', 'role'];

  const updateData = {};

  for (const field of allowedFields) {
    if (userData[field] !== undefined) {
      updateData[field] = userData[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error('No valid fields provided for update');
  }

  if (updateData.name !== undefined) {
    if (
      typeof updateData.name !== 'string' ||
      updateData.name.trim().length <= 2
    ) {
      throw new Error('Name must be longer than 2 characters');
    }

    updateData.name = updateData.name.trim();
  }

  if (updateData.email !== undefined) {
    if (typeof updateData.email !== 'string') {
      throw new Error('Invalid email format');
    }

    updateData.email = updateData.email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(updateData.email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await userRepository.findUserByEmail(
      updateData.email
    );

    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email is already registered');
    }
  }

  if (updateData.password !== undefined) {
    if (
      typeof updateData.password !== 'string' ||
      updateData.password.length <= 6
    ) {
      throw new Error('Password must be longer than 6 characters');
    }

    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  return await userRepository.updateUserById(userId, updateData);
};
const getUserByEmail = async (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Email is required');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await userRepository.findUserByEmail(normalizedEmail);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const getUserById = async (id) => {
const userId = Number(id);

if (!Number.isInteger(userId) || userId <= 0) {
throw new Error('Invalid user ID');
}

const user = await userRepository.findUserById(userId);

if (!user) {
throw new Error('User not found');
}

return user;
};
module.exports = {
signup,
updateUser, 
getUserByEmail,
getUserById,
};