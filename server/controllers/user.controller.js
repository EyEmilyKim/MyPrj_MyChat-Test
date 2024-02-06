const userService = require('../services/user.Service');
const jwt = require('../utils/jwt');

const userController = {};

// 유저 등록 HTTP
userController.registerUser = async (req, res) => {
  // console.log('userController.registerUser called', req.body);
  try {
    const { email, password, userName } = req.body;
    const user = await userService.registerUser(email, password, userName);
    console.log('userController.registerUser user', user);
    res
      .status(200)
      .json({ message: '등록 성공\n로그인 후 이용해주세요 :)', user: user });
  } catch (error) {
    console.log('userController.registerUser failed', error);
    res.status(500).json({ error: error.message });
  }
};

// 유저 로그인 HTTP
userController.loginUser = async (req, res) => {
  // console.log('userController.loginUser called', req.body);
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.loginUser(
      email,
      password
    );
    res
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
      })
      .status(200)
      .json({
        message: `로그인 성공\n반갑습니다 ${user.name}님~~ :D`,
        user: user,
      });
    // console.log('userController.loginUser success');
  } catch (error) {
    console.log('userController.loginUser failed', error);
    res.status(500).json({ error: error.message });
  }
};

// 유저 소켓 Connected -> sid 저장
userController.updateConnectedUser = async (email, sid) => {
  // console.log('userController.updateConnectedUser called');
  try {
    await userService.updateConnectedUser(email, sid);
  } catch (error) {
    // console.log('userController.updateConnectedUser failed', error);
    throw new Error(error);
  }
};

// 유저 인증 HTTP
userController.authenticateUser = async (req, res) => {
  // console.log('userController.authenticateUser called');
  try {
    const accessToken = req.cookies.accessToken;
    const data = jwt.verifyToken(accessToken, 'AT');
    const user = await userService.checkUser(data.email, 'email');

    res.status(200).json({ message: '인증 성공', user: user });
  } catch (error) {
    // console.log('userController.authenticateUser failed', error);
    res.status(500).json({ error: error.message });
  }
};

// 유저 룸 입장
userController.joinRoom = async (user, room) => {
  // console.log('userController.joinRoom called');
  try {
    const updateUser = await userService.joinRoom(user, room);
    return updateUser;
  } catch (error) {
    console.log('userController.joinRoom failed', error);
    throw new Error(error);
  }
};

// 유저 룸 퇴장
userController.leaveRoom = async (user, room) => {
  // console.log('userController.leaveRoom called');
  try {
    const updateUser = await userService.leaveRoom(user, room);
    return updateUser;
  } catch (error) {
    console.log('userController.leaveRoom failed', error);
    throw new Error(error);
  }
};

// 유저 로그아웃 HTTP
userController.logoutUser = async (req, res) => {
  // console.log('userController.logout called');
  try {
    const accessToken = req.cookies.accessToken;
    const data = jwt.verifyToken(accessToken, 'AT');
    const user = await userService.logoutUser(data.email);
    if (!user.online) {
      res.cookie('accessToken', '');
      res.status(200).json({
        message: `로그아웃 성공\n또 만나요 ${user.name}님~~ :)`,
        user: user,
      });
    }
  } catch (error) {
    console.log('userController.logout failed', error);
    res.status(500).json({ error: error.message });
  }
};

// 유저 소켓 disconnected -> online:false, sid:''
userController.updateDisconnectedUser = async (sid) => {
  // console.log('userController.updateDisconnectedUser called');
  try {
    await userService.updateDisconnectedUser(sid);
  } catch (error) {
    // console.log('userController.updateDisconnectedUser failed', error);
    throw new Error(error);
  }
};

// 특정 유저 조회
userController.checkUser = async (value, key) => {
  try {
    const user = await userService
      .checkUser(value, key)
      .then(userService.extractNameIdOnline)
      .catch((error) => console.log(error));
    // await require('../utils/db').isInstance(
    //   user,
    //   'userCont.checkUser user_extracted'
    // ); // false
    return user;
  } catch (error) {
    console.log('userController.checkUser failed', error);
  }
};

// 모든 유저 조회
userController.listAllUsers = async (reason = 'reason not provided') => {
  // console.log('userController.listAllUsers called');
  try {
    const userList = await userService
      .getAllUsers()
      .then(userService.extractNameIdOnline)
      .catch((error) => console.log(error));
    // console.log(
    //   `listAllUsers [${reason}] `
    //   // : ${JSON.stringify(userList)}`
    // );
    return userList;
  } catch (error) {
    console.log('userController.listAllUsers failed', error);
    throw new Error(error);
  }
};

// 비밀번호 확인 HTTP
userController.confirmPassword = async (req, res) => {
  console.log('userController.confirmPassword called', req.body.email);
  try {
    const { email, password } = req.body;
    const passwordMatch = await userService
      .checkUser(email, 'email')
      .then((user) => userService.confirmPassword(password, user.password));
    if (passwordMatch) {
      res.status(200).json({ message: '비밀번호 확인 성공' });
    } else {
      res.status(500).json({ error: '비밀번호가 일치하지 않습니다' });
    }
  } catch (error) {
    console.log('userController.confirmPassword failed', error);
    res.status(500).json({ error: error.message });
  }
};

// 비밀번호 재설정 HTTP
userController.resetPassword = async (req, res) => {
  console.log('userController.resetPassword called', req.body);
  try {
    const { email, password } = req.body;
    await userService
      .checkUser(email, 'email')
      .then((user) => userService.resetPassword(password, user));

    res.status(200).json({ message: '비밀번호 변경 성공' });
  } catch (error) {
    console.log('userController.resetPassword failed', error);
    res.status(500).json({ error: 'Server side Error' });
  }
};

module.exports = userController;
