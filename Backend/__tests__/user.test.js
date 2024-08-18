const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../Models/userSchema'); // Adjust the path as per your project structure

let mongoServer;

beforeAll(async () => {
  // Start the in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory database
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  // Stop the in-memory MongoDB server and disconnect
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  // Clean up database between tests
  await User.deleteMany({});
});

describe('User Model Test', () => {
  it('should create and save a user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    };

    const validUser = new User(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
  });

  it('should fail if email is invalid', async () => {
    const invalidEmailUser = new User({
      name: 'John Doe',
      email: 'invalidEmail',
      password: 'Password123',
      confirmPassword: 'Password123'
    });

    let err;
    try {
      await invalidEmailUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.email.message).toBe('invalidEmail is not a valid email!');
  });

  it('should hash the password before saving', async () => {
    const userData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    };

    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe(userData.password); // Password should be hashed
  });

  it('should fail if passwords do not match', async () => {
    const mismatchedPasswordsUser = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password123',
      confirmPassword: 'WrongPassword123'
    });

    let err;
    try {
      await mismatchedPasswordsUser.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.confirmPassword).toBeDefined();
    expect(err.errors.confirmPassword.message).toBe('Passwords do not match');
  });

  it('should correctly compare hashed passwords', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'Password123'
    };

    const user = new User(userData);
    await user.save();

    const isMatch = await user.comparePassword('Password123');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('WrongPassword');
    expect(isNotMatch).toBe(false);
  });
});
