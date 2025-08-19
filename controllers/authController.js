const { check, validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    currentPage: "signup",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: '',
      lastName: '',
      email: '',
      userType: '',
    }
  });
};

exports.postSignup = [  //express validator
  check('firstName')
  .notEmpty()
  .withMessage('First Name is required')
  .trim()
  .isLength({min: 2})
  .withMessage("First Name should be atleast 2 characters long")
  .matches(/^[a-zA-Z]+$/)
  .withMessage("First Name should contain only letters"),

   check('lastName')
  .matches(/^[a-zA-Z]*$/)
  .withMessage("Last Name should contain only letters"),

  check("email")
  .isEmail()
  .withMessage("Please enter a valid email")
  .normalizeEmail(),

  check("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8 })
  .withMessage("Password should be at least 8 characters long")
  .matches(/[A-Z]/)
  .withMessage("Password should contain at least one uppercase letter")
  .matches(/[a-z]/)
  .withMessage("Password should contain at least one lowercase letter")
  .matches(/[0-9]/)
  .withMessage("Password should contain at least one number")
  .matches(/[@$!%*?&]/)
  .withMessage("Password should contain at least one special character")
  .trim(),

  check("confirmPassword")
  .trim()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),

  check("userType")
  .notEmpty()
  .withMessage("User Type is required")
  .isIn(["guest", "host"])
  .withMessage("User Type must be either 'guest' or 'host'"),

  check("terms")
  .notEmpty()
  .withMessage("Please accept terms and conditions")
  .custom((value, { req }) => {
    if (value !== "on") {
      throw new Error("Please accept the terms and conditions");
    }
    return true;
  }),

  (req, res, next) => {
  const { firstName, lastName, email, password, userType } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      currentPage: "signup",
      isLoggedIn: false,
      errors: errors.array().map(err => err.msg),
      oldInput: {
        firstName,
        lastName,
        email,
        password,
        userType
      }
    });
  }
  res.redirect("/login");
}];

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  req.session.isLoggedIn = true;
  // res.cookie("isLoggedIn", true);
  // req.isLoggedIn = true;
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
