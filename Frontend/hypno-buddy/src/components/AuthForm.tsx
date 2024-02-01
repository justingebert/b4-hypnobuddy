import '../styles/LoginSignin.scss';

function AuthForm({ onSubmit, isLogin }:any) {
    return (
        <form onSubmit={onSubmit} className="auth-form">
            {!isLogin && (
                <>
                    <input type="text" name="first" placeholder="Vorname" required />
                    <br />
                    <input type="text" name="last" placeholder="Nachname" required />
                </>
            )}
            <br />
            <input type="email" name="email" placeholder="Email" required />
            <br />
            <input
                type="password"
                name="password"
                placeholder="Passwort"
                required
            />
            <br />
            <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
    );
}
export default AuthForm;
