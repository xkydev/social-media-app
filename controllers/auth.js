const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				ok: false,
				msg: 'User already exists',
			});
		}

		user = new User(req.body);

		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		const token = await generateJWT(user.id, user.name);

		res.status(201).json({
			ok: true,
			uid: user.id,
			name: user.name,
			token,
		});

	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Error creating user',
			error,
		});
	}
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'User does not exist',
            });
        };

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Invalid password',
            });
        };

        const token = await generateJWT(user.id, user.name);

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error logging in user',
            error,
        });
    }
};

const renewToken = async (req, res) => {
    const { uid, name } = req

    const token = await generateJWT(uid, name);

    res.status(200).json({
        ok: true,
        uid,
        name,
        token,
    });
};

module.exports = {
	createUser,
	loginUser,
    renewToken,
};
