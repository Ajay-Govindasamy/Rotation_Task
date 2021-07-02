//Rotator Algorithm
module.exports = class Rotator {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  display() {
    console.log(this.firstName + ' ' + this.lastName);
  }
};
