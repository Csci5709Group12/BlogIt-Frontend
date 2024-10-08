import axios from "axios";
import { SERVER_HOST } from "./Config";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const checkUsernameExists = async (username, context, usernameCheckSuccessCb, usernameCheckErrorCb) => {
  const postData = {
    username_exists: username
  };

  axios.post(SERVER_HOST + "/users/check_username", postData)
    .then((response) => {
      usernameCheckSuccessCb(response, context);
    })
    .catch((error) => {
      usernameCheckErrorCb(error);
    });
}

export const createUser = (id, name, username, email, apiSuccessCb, apiFailureCb) => {
  const user = {
    id,
    name,
    username,
    email,
    web_url: "",
    location: "",
    bio: "",
    pronouns: "",
    work_status: "",
    education: "",
    profile_pic: "",
    profile_banner: "",
    join_date: Math.floor((new Date()).getTime() / 1000)
  };

  axios.post(SERVER_HOST + "/users/create", user)
    .then((response) => {
      apiSuccessCb(response);
    })
    .catch((error) => {
      apiFailureCb(error);
    });
}

export const getUserData = (id, apiSuccessCb, apiFailureCb) => {
  axios.get(SERVER_HOST + "/users/" + id)
    .then((response) => {
      apiSuccessCb(response);
    })
    .catch((error) => {
      apiFailureCb(error);
    });
}

export const getUserDataByUsername = (username, apiSuccessCb, apiFailureCb) => {
  axios.get(SERVER_HOST + "/users/uname/" + username)
    .then((response) => {
      apiSuccessCb(response);
    })
    .catch((error) => {
      apiFailureCb(error);
    });
}

export const updateUserData = async (id, values, apiSuccessCb, apiFailureCb) => {
  var formData = new FormData();

  console.log(id, values, apiSuccessCb, apiFailureCb);
  
  formData.append("name", values.name);
  formData.append("username", values.username);
  formData.append("email", values.email);
  formData.append("web_url", values.website);
  formData.append("location", values.location);
  formData.append("pronouns", values.pronouns);
  formData.append("bio", values.bio);
  formData.append("work_status", values.work);

  if (values.profilePicture) {
    const fileExt = values.profilePicture.name.split('.').pop();
    const profilePicturesRef = ref(storage, 'images/profileImages/' + id + "_pp" + fileExt);
    try {
      const snapshot = await uploadBytes(profilePicturesRef, values.profilePicture);
      const url = await getDownloadURL(profilePicturesRef);
      console.log(url);
      formData.append("profile_pic", url);
    } catch (error) {
      apiFailureCb(error);
      return;
    }
  }

  if (values.profileBanner) {
    const fileExt = values.profileBanner.name.split('.').pop();
    const profileBannerRef = ref(storage, 'images/profileBanner/' + id + "_pb" + fileExt);
    
    try {
      const snapshot = await uploadBytes(profileBannerRef, values.profileBanner);
      const url = await getDownloadURL(profileBannerRef);
      console.log(url);
      formData.append("profile_banner", url);
    } catch (error) {
      apiFailureCb(error);
      return;
    }
  }

  axios.post(SERVER_HOST + "/users/update/" + id, formData)
    .then((response) => {
      apiSuccessCb(response);
    })
    .catch((error) => {
      apiFailureCb(error);
    });
}