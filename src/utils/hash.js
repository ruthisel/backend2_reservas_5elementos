import bcrypt from 'bcrypt';

// Genera el hash de la contraseña usando un salt de 10 rondas
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Compara la contraseña en texto plano con el hash guardado (útil para la siguiente entrega)
export const isValidPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};