//import './styles/AuthForm.css';

function AuthForm({ onSubmit, isLogin }:any) {
    return (
        <form onSubmit={onSubmit}>
            {!isLogin && (
                <>
                    <input type="text" name="first" placeholder="First Name" required />
                    <br />
                    <input type="text" name="last" placeholder="Last Name" required />
                </>
            )}
            <br />
            <input type="email" name="email" placeholder="Email" required />
            <br />
            <input
                type="password"
                name="password"
                placeholder="Password"
                required
            />
            <br />
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
    );
}
export default AuthForm;
