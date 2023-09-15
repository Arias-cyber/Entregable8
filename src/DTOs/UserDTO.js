class UserDTO {
    constructor(name, email, role) {
      this.name = name;
      this.email = email;
      this.role = role;
      console.log("usando el DTO");
    }
  }

export default UserDTO