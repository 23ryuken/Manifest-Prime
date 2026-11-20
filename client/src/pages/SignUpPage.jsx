import { Link } from "react-router-dom";
import { paths } from "../path.js";

function SignUpPage() {
    return (
        <div>
            <h1>sign up</h1>
            <Link to={paths.login}>I already have an account</Link>
        </div>
    )
}
export default SignUpPage