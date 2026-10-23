const prisma = require('../../config/db');

const createUser = async (userData) => {
return await prisma.user.create({
data: userData,
});
};

const findUserByEmail = async (email) => {
return await prisma.user.findUnique({
where: { email },
});
};

const findUserById = async (id) => {
return await prisma.user.findUnique({
where: { id },
});
};

const updateUserById = async (id, userData) => {
  return await prisma.user.update({
    where: { id },
    data: userData,
  });
};

module.exports = {
createUser,
findUserByEmail,
findUserById,
updateUserById,
};