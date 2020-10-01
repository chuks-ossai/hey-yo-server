const Joi = require('joi');
const HttpStatusCodes = require('http-status-codes');
const bcrypt = require('bcrypt');
const capitalize = require('../helpers/capitalize')

const { validateUserEmailExist, validateUsernameExist, createNewUser, getUserByUsername} = require('../services/user.service');
const issueToken = require('../helpers/issue-token');
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
            if (error.details[0].path[0] == 'repeatPassword') {
                const err = new Error(`Passwords don't match`);
                err.status = HttpStatusCodes.OK;
                return next(err)
            };
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
                    Results: [{message: 'User registeration successful'}]
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
        if (!user || user.error) {
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
            delete user.password;
            if (result) {
                const tokenObj = await issueToken(user);
                if (tokenObj.error) {
                    const err = new Error('Somthing went wrong while trying to issue token'  );
                    return next(err);
                }
                
                await res.status(HttpStatusCodes.OK).json({
                    ErrorMessage: null,
                    Success: result,
                    Results: [{ message: 'User logged in successfully', auth: tokenObj }]
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