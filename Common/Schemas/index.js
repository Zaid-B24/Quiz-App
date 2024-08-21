const { z } = require('zod');

const signinInput = z.object({
    email:z.string().email(),
    password:z.string().min(6),
});

const signupInput = z.object({
    name:z.string().min(1),
    email:z.string().email(),
    password:z.string().min(6),
    confirmPasswword:z.string().min(6),
});


module.exports = {signinInput, signupInput}