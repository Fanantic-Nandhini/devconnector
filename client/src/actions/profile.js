import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE, GET_PROFILES, GET_REPOS } from './types';
import { setAlert } from './alert';
import axios from 'axios';

export const getCurrentProfile = () => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const response = await axios.get('/api/profile/me', config);
    dispatch({
      type: GET_PROFILE,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};

// Get all user profiles
export const getProfiles = () => async dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    try {
      const response = await axios.get('/api/profile');
      dispatch({
        type: GET_PROFILES,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: error.response.statusText, status: error.response.status }
      });
    }
  };

// Get all userbyId profiles
export const getProfileById = (user_id) => async dispatch => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const response = await axios.get(`/api/profile/user/${user_id}`, config);
      dispatch({
        type: GET_PROFILE,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: error.response.statusText, status: error.response.status }
      });
    }
  };

// Get github profiles
export const getGithubRepos = (username) => async dispatch => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const response = await axios.get(`/api/profile/github/${username}`, config);
      dispatch({
        type: GET_REPOS,
        payload: response.data
      });
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: error.response.statusText, status: error.response.status }
      });
    }
  };

// Create or update profile
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const response = await axios.post('/api/profile', formData)
    dispatch({
      type: GET_PROFILE,
      payload: response.data
    });

    dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'));

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        const response = await axios.put('/api/profile/experience', formData)
        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data
        });
    
        dispatch(setAlert('Experience added', 'success'));
        history.push('/dashboard');
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
      }
}

// Add Education
export const addEducation = (formData, history) => async dispatch => {
    try {
        const response = await axios.put('/api/profile/education', formData)
        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data
        });
        dispatch(setAlert('Education added', 'success'));
        history.push('/dashboard');
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: { msg: err.response.statusText, status: err.response.status }
        });
      }
}

// Delete Experience
export const deleteExperience = (exp_id) => async dispatch => {
    try {
        const response = await axios.delete(`/api/profile/experience/${exp_id}`)
        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data
        });
        dispatch(setAlert('Experience removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
          });
    }
}

// Delete Education
export const deleteEducation = (edu_id) => async dispatch => {
    try {
        const response = await axios.delete(`/api/profile/education/${edu_id}`)
        dispatch({
          type: UPDATE_PROFILE,
          payload: response.data
        });
        dispatch(setAlert('Education removed', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
          });
    }
}

// Delete Account
export const deleteAccount = () => async dispatch => {
    if(window.confirm('Are you sure? This can NOT be undone')) {
        try {
            await axios.delete('/api/profile')
            dispatch({
              type: CLEAR_PROFILE,
            });
            dispatch({
                type: ACCOUNT_DELETED,
              });
            dispatch(setAlert('Your Account has been premanantly deleted'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
              });
        }
    }
}

