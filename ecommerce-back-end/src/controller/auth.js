const User = require("../models/user");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
	return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
};

// Signup
exports.signup = (req, res) => {
	// Check if user's mail exists in database.
	User.findOne({ email: req.body.email }).exec(async (error, user) => {
		if (user) {
			// User exists, already registered
			console.log("error >>> ", error);
			console.log("user >>> ", user);
			return res.status(400).json({
				message: "User already registered"
			});
		}

		const { firstName, lastName, email, password } = req.body;

		const hash_password = await bcrypt.hash(password, 10);

		// console.log('body >>> ', req.body)
		// console.log(firstName, lastName, email, password)

		// User does not exist, save User to database
		const _user = new User({
			firstName, lastName, email, hash_password,
			// userName: Math.random().toString(),
			userName: shortid.generate(), role: "user",
		}); // Save to db

		_user.save((error, user) => {
			console.log("error >>> ", error);
			if (error) {
				console.log("sth went wrong");
				return res.status(400).json({
					message: "Something went wrong",
				});
			}
			if (user) {
				// If data saved to MongoDB, return the object for view in Postman
				const token = generateJwtToken(user._id, user.role);
				const { _id, firstName, lastName, email, role, fullName } = user;

				return res.status(201).json({
                    token,
					user : { _id, firstName, lastName, email, role, fullName },
					message: "User created successfully!"
				});
			}
		});
	});
};

// Sign in
exports.signin = (req, res) => {
	User.findOne({ email: req.body.email }).exec(async (error, user) => {
		// Does email exist?
		if (error) return res.status(400).json({ error });

		if (user) {
            // authenticate() method is from the model
            const isPassword = await user.authenticate(req.body.password);

			if (isPassword && user.role === "user") {
				// Does password exist and is user admin?
				// const token = jwt.sign(
				// 	{ _id: user.id, role: user.role },
				// 	process.env.JWT_SECRET,
				// 	{ expiresIn: "1h" }
                // );
                const token = generateJwtToken(user._id, user.role);

				const { _id, firstName, lastName, email, role, fullName } = user;

				res.status(200).json({
					token,
					user: { _id, firstName, lastName, email, role, fullName }
				});
			} else {
				return res.status(400).json({
					message: "Invalid password"
				});
			}
		} else {
			return res.status(400).json({ message: "Invalid password / username" });
		}
	});
};
