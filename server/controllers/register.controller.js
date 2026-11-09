const bcrypt = require("bcrypt");
const db = require("../services/db");
const { REGISTERSCHEMA } = require("../schemas/loginregister.schema");

const registerUser = async (req, res, next) => {
  try {
    const { error, value } = REGISTERSCHEMA.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const email = value.email.trim().toLowerCase();
    const password = value.password;

    // Έλεγχος αν υπάρχει ήδη το email
    const {
      rows: existingUsers,
    } = await db.query(`SELECT id FROM song_users WHERE email = $1`, [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Το email υπάρχει ήδη. Επιλέξτε άλλο.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // Δημιουργία χρήστη
    const { rows } = await db.query(
      `
        INSERT INTO song_users (email, password)
        VALUES ($1, $2)
        RETURNING id, email
      `,
      [email, hashPassword],
    );

    return res.status(201).json({
      message: "Η εγγραφή ολοκληρώθηκε επιτυχώς!",
      user: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser };
