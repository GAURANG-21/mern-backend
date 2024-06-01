import UserRepository from "../repository/userRepository.js";

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async register(req, res) {
    try {
      const { name, password, email } = req.body;
      const user = await this.userRepository.register(
        { name, email, password },
        res
      );
      return user;
    } catch (error) {
      if (error.message == "Repository Error") throw error;
      throw new ServiceError("Service Error", "Failed to register user", 500);
    }
  }
}

export default UserService;
