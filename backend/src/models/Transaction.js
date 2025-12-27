const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        account: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
            required: true
        },
        type: {
            type: String,
            enum: ["DEPOSIT", "WITHDRAW", "TRANSFER"],
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        fromAccount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        },
        toAccount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Account",
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
