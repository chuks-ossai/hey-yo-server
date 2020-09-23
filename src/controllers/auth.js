const Joi = require('joi');
const HttpStatusCodes = require('http-status-codes');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'myjwtscrete' } = process.env
const capitalize = require('../helpers/capitalize')

const { validateUserEmailExist, validateUsernameExist, createNewUser, getUserByUsername} = require('../services/user.service');
const AuthController = {
    register: async (req, res, next) => {
        const schema = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(5)
                .max(20)
                .required(),

            password: Joi.string().min(5)
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

            repeatPassword: Joi.ref('password'),

            firstName: Joi.string().min(5).max(20),
            lastName: Joi.string().min(5).max(20),

            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        }).with('password', 'repeatPassword');

        const { error, value } = schema.validate(req.body);
        if (error) {
            const err = new Error(error.message);
            err.status = HttpStatusCodes.OK;
            return next(err)
        };
        const emailExists = await validateUserEmailExist(value.email.toLowerCase()); 
        if (emailExists) {
            const err = new Error(`User with ${value.email} already exist`)
            err.status = HttpStatusCodes.OK
            return next(err);
        }

        const usernameExists = await validateUsernameExist(capitalize(value.username)); 
        if (usernameExists) {
            const err = new Error(`User with ${value.username} already exist`)
            err.status = HttpStatusCodes.OK
            return next(err);
        }
        bcrypt.hash(value.password, 8, async function (err, hash) {
            if (err) {
                const e = new Error(err);
                e.status = HttpStatusCodes.OK;
                return next(e)
            };

            const newUser = await createNewUser(
                {
                    password: hash,
                    username: capitalize(value.username),
                    firstName: capitalize(value.firstName),
                    lastName: capitalize(value.lastName),
                    email: value.email.toLowerCase()
                });

            if (newUser) {
                await res.status(HttpStatusCodes.CREATED).json({
                    Success: true,
                    ErrorMessage: null,
                    Results: [{message: 'User registeration successful', user: newUser}]
                })  
            }
        });

    },
    
    login: async (req, res, next) => {
        const schema = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(5)
                .max(20)
                .required(),

            password: Joi.string().min(5)
                .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
        }).with('username', 'password');

        const { error, value } = schema.validate(req.body);
        if (error) {
            const err = new Error(error.message);
            err.status = HttpStatusCodes.OK;
            return next(err)
        };

        const user = await getUserByUsername(capitalize(value.username));
        if (!user) {
            const err = new Error('User with that username does not exist');
            err.status = HttpStatusCodes.OK;
            return next(err);
        }

        bcrypt.compare(value.password, user.password, async function (err, result) {
            if (err) {
                const e = new Error(err);
                e.status = HttpStatusCodes.OK;
                return next(e)
            };
            
            if (result) {
                jwt.sign(value, JWT_SECRET, async function (err, token) {
                    if (err) {
                        const e = new Error(err);
                        e.status = HttpStatusCodes.OK;
                        return next(e)
                    };
    
                    await res.cookie('auth', token);
                    await res.status(HttpStatusCodes.OK).json({
                        ErrorMessage: null,
                        Success: result,
                        Results: [{ message: 'User logged in successfully', token }]
                    });
                });
            } else {
                const err = new Error('Wrong Password entered');
                err.status = HttpStatusCodes.OK
                return next(err);
            }
        });
    }
}

module.exports = AuthController;