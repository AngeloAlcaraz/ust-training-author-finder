export default function authHeader() {
  const user = localStorage.getItem("user");

  if (user) {
    const currentUser = JSON.parse(user);
    if (currentUser && currentUser.accessToken) {
      return `Bearer ${currentUser.accessToken}`;
      // return { Authorization: 'Bearer ' + user.accessToken }; // for Spring Boot back-end
      //return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
    } else {
      return "";
    }
  }

  return "";
}
