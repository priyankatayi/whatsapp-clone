const { formSchema } = require("@whatsapp-clone/common");

const validateForm = async (req, res, next) => {
  try {
    const formData = req.body;
    const valid = await formSchema.validate(formData);
    if (valid) {
      next();
    } else {
      res.status(422).send();
    }
  } catch (error) {
    res.status(422).send();
  }
};

module.exports = validateForm;
