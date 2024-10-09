import axios from 'axios';
axios.defaults.withCredentials = true;

const CHAT_URL = '/v1/chat';
const AUTH_URL = '/v1/auth';
const FILE_URL = '/v1';
const STREAM_URL = '';

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  });

export const MESSAGES_TO_LOAD = 15;

const url = x => `${CHAT_URL}${x}`;
const auth_url = x => `${AUTH_URL}${x}`;
const stream_url = x => `${STREAM_URL}${x}`;
const file_url = x => `${FILE_URL}${x}`;


/** Checks if there's an existing session. */
export const getMe = () => {
  const username = localStorage.getItem('username')?localStorage.getItem('username'):null;
  console.log(username);
  return axios.get(url('/me?username='+username))
    .then(x => x.data)
    .catch(_ => null);
};

/** Handle user log in */
export const login = (username, password) => {
  return axios.post(auth_url('/login'), {
    username,
    password
  }).then(x =>{
      localStorage.setItem('access_token', x.data.id_token)
      localStorage.setItem('username', x.data.email)
      localStorage.setItem('userId', x.data.userId)
      localStorage.setItem('profile_photo', x.data.photo)
    }
  )
    .catch(e => { throw new Error(e.response && e.response.data && e.response.data.message); });
};

/** Handle user signup */
export const signup = (username, password) => {
  return axios.post(auth_url('/signup'), {
    username,
    password
  }).then(x =>{
      localStorage.setItem('access_token', x.data.id_token)
      localStorage.setItem('username', x.data.email)
      localStorage.setItem('userId', x.data.userId)
      localStorage.setItem('profile_photo', x.data.photo)
    }
  )
    .catch(e => { throw(e.response); });
};

/** Handle file upload */
export const fileUpload = (file) => {
  console.log(file)
  const formData = new FormData();
  formData.append('files', file);

  // Set up the request configuration
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  return axios.post(file_url('/upload'), formData, config)
  .then(x =>{
      return x
    }
  )
  .catch(e => { throw new Error(e.response && e.response.data && e.response.data.message); });
};


/** Handle user search */
export const userSearch = (username) => {
  return axios.get(url('/user/' + username))
  .then(x =>{
      return x
    }
  )
  .catch(e => { throw new Error(e.response && e.response.data && e.response.data.message); });
};

/** Handle new room */
// export const addNewRoom = (hostId, guestId, hostEmail, guestEmail) => {
// };

export const logOut = () => {
  return axios.post(auth_url('/logout')).then(x => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('username')
      localStorage.removeItem('userId')
      localStorage.removeItem('profile_photo')
    }
  )
    .catch(e => { throw new Error(e.response && e.response.data && e.response.data.message); });;
};

/** 
 * Function for checking which deployment urls exist.
 * 
 * @returns {Promise<{
 *   heroku?: string;
 *   google_cloud?: string;
 *   vercel?: string;
 *   github?: string;
 * }>} 
 */
export const getButtonLinks = () => {
  return axios.get(url('/links'))
    .then(x => x.data)
    .catch(_ => null);
};

/** This was used to get a random login name (for demo purposes). */
export const getRandomName = () => {
  return axios.get(url('/randomname')).then(x => x.data);
};

/**
 * Load messages
 * 
 * @param {string} id room id
 * @param {number} offset 
 * @param {number} size 
 */
export const getMessages = (id,
  offset = 0,
  size = MESSAGES_TO_LOAD
) => {
  return axios.get(url(`/room/${id}/messages`), {
    params: {
      offset,
      size
    }
  })
    .then(x => x.data.reverse());
};

/**
 * @returns {Promise<{ name: string, id: string, messages: Array<import('./state').Message> }>}
 */
export const getPreloadedRoom = async () => {
  return axios.get(url(`/room/0/preload`)).then(x => x.data);
};

/** 
 * Fetch users by requested ids
 * @param {Array<number | string>} ids
 */
export const getUsers = (ids) => {
  return axios.get(url(`/users`), { params: { ids } }).then(x => x.data);
};

/** Fetch users which are online */
export const getOnlineUsers = () => {
  return axios.get(url(`/users/online`)).then(x => x.data);
};

/** This one is called on a private messages room created. */
export const addRoom = async (hostId, guestId, hostEmail, guestEmail) => {
  return axios.post(url(`/room/create/`), { 
    host: hostId, 
    guest: guestId, 
    host_name: hostEmail, 
    guest_name: guestEmail }).then(x => x.data);
};

/** 
 * @returns {Promise<Array<{ names: string[]; id: string }>>} 
 */
export const getRooms = async (userId) => {
  return axios.get(url(`/rooms/${userId}`)).then(x => x.data);
};

export const getEventSource = () => new EventSource(stream_url('/stream'));
