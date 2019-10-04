// require("firebase/functions"); Got this idea from SO, but doesn't recognize require

document.addEventListener('DOMContentLoaded', function() {

  try {
    let app = firebase.app();
    let features = ['auth', 'functions'].filter(feature => typeof app[feature] === 'function');
    console.log("Firebase SDK loaded with ${features.join(', ')}");
    // document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
  } catch (e) {
    console.error(e);
    // document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
  }

  const fun = firebase.functions();
  const auth = firebase.auth();
  const loginBtn = document.getElementById('login');
  const logoutBtn = document.getElementById('logout');
  const profile = document.getElementById('profile');

  auth.onAuthStateChanged(user => {
    if (user){
      profile.innerHTML = user.uid;
      loginBtn.style.visibility = 'hidden';
      logoutBtn.style.visibility = 'visbile';
    } else{
      profile.innerHTML = "not logged in";
      loginBtn.style.visibility = 'visible';
      logoutBtn.style.visibility = 'hidden';
    }
  });

  //Event Handlers
  loginBtn.onclick = () => auth.signInAnonymously();
  logoutBtn.onclick = () => auth.signOut();

  //Callable functions
  const testFun = fun.httpsCallable('testFunction');
  const testFunButton = document.getElementById('testFunButton');

  document.getElementById('testFunButton').onclick = async () => {
    const response = await testFun({message: "Howdy!"});
    console.log(response);
  };
});
