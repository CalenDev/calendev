import axios from 'axios';

const postUserSignIn = async (user_email, user_password) => {
    const API_END_POINT = `${process.env.REACT_APP_SERVER_URL}/api/v1/auth/login`;

    try {
        const res = await axios.post(API_END_POINT, {
            user_email,
            user_password,
        });

        return {
            status: res.status,
        };
    } catch (e) {
        return {
            status: e.response.status,
        };
    }
};

export { postUserSignIn };
