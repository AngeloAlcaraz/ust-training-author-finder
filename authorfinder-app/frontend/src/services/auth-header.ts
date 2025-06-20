export default function authHeader() {
  const user = localStorage.getItem("user");

  if (user) {
    const currentUser = JSON.parse(user);
    if (currentUser && currentUser.data.accessToken) {
      return `Bearer ${currentUser.data.accessToken}`;
      // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
      //return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
    } else {
      return "";
    }
  }

  return "";
}
