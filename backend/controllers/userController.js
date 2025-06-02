// Ensure password is updated in the database
const bcrypt = require('bcrypt');

exports.resetEmployeePassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'employee') {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting employee password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};