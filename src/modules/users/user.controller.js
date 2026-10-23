const userService = require('./user.service');

const signup = async (req, res) => {
try {
const user = await userService.signup(req.body);

const { password, ...userWithoutPassword } = user;

return res.status(201).json({
  message: 'User created successfully',
  data: userWithoutPassword,
});

} catch (error) {
const validationErrors = [
'Name, email, and password are required',
'Name must be longer than 2 characters',
'Invalid email format',
'Password must be longer than 6 characters',
];

if (validationErrors.includes(error.message)) {
  return res.status(400).json({
    message: error.message,
  });
}

if (error.message === 'Email is already registered') {
  return res.status(409).json({
    message: error.message,
  });
}

console.error(error);

return res.status(500).json({
  message: 'Internal server error',
});

}
};
const updateUser = async (req, res) => {
try {
const userId = Number(req.params.id);
const user = await userService.updateUser(userId, req.body);

const { password, ...userWithoutPassword } = user;

return res.status(200).json({
  message: 'User updated successfully',
  data: userWithoutPassword,
});

} catch (error) {
if (error.message === 'Invalid user ID') {
return res.status(400).json({ message: error.message });
}

if (error.message === 'Email is already registered') {
  return res.status(409).json({ message: error.message });
}

if (
  error.message === 'Name must be longer than 2 characters' ||
  error.message === 'Invalid email format' ||
  error.message === 'Password must be longer than 6 characters' ||
  error.message === 'No valid fields provided for update'
) {
  return res.status(400).json({ message: error.message });
}

if (
  error.code === 'P2025' ||
  error.code === 'P2003'
) {
  return res.status(404).json({ message: 'User not found' });
}

console.error(error);

return res.status(500).json({
  message: 'Internal server error',
});

}
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.query.email);

    const { password, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: 'User found successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    if (error.message === 'Email is required') {
      return res.status(400).json({ message: error.message });
    }

    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }

    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};


const getUserById = async (req, res) => {
try {
const user = await userService.getUserById(req.params.id);

const { password, role, ...publicUser } = user;

return res.status(200).json({
  message: 'User found successfully',
  data: publicUser,
});

} catch (error) {
if (error.message === 'Invalid user ID') {
return res.status(400).json({ message: error.message });
}

if (error.message === 'User not found') {
  return res.status(404).json({ message: error.message });
}

console.error(error);

return res.status(500).json({
  message: 'Internal server error',
});

}
};
module.exports = {
signup, updateUser, getUserByEmail, getUserById,
};