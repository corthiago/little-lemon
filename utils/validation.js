export const isValidUSPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    return /^\d{10}$/.test(digits);
};

export const validadeEmail = (email) => {
    return email.match(/.+@.+\./);
};

export const validadeName = (name) => {
    return name.match(/^[A-Za-z\s]+$/)
};