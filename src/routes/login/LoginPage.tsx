import { AutoCenter, Button } from "antd-mobile";
import { UserCircleOutline } from "antd-mobile-icons";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../App";
import "./login.css";
import { auth } from "../../firebase";
import localforage from "localforage";

export function LoginPage() {
  const appAuth = useAuth();
  const navigate = useNavigate();
  const handleBtnLoginViaGoogleClick = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        const userLogin = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };

        const userFirebase = {
          ...user,
        };

        console.log(userFirebase);
        localforage.setItem("user", user.toJSON()).then(() => {
          appAuth.signin(userLogin, () => {
            navigate("/");
          });
        });
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };
  return (
    <div className="login-page">
      <AutoCenter>
        <Button color="success" onClick={handleBtnLoginViaGoogleClick}>
          <UserCircleOutline /> Login with Google
        </Button>
      </AutoCenter>
    </div>
  );
}
