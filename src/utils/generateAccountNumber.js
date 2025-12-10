const generateAccountNumber = () => {
    return "ACC-" + Math.floor(100000 + Math.random() * 900000);
};

module.exports = generateAccountNumber;
