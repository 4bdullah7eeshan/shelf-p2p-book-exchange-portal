export default function SignIn() {
    return (
        <div>
            <h1>Sign In</h1>

            <p>Required fields are followed by <strong><span aria-label="required">*</span></strong>.</p>
            
            <form action="" method="post">
                <fieldset>
                    <p>
                        <label htmlFor="user_email">Email: <span aria-label="required">*</span></label>
                        <input type="email" id="user_email" name="user_email" placeholder="johndoe@example.com" required />
                    </p>

                    <p>
                        <label htmlFor="user_password">Password: <span aria-label="required">*</span></label>
                        <input type="password" id="user_password" name="user_password" minLength="6" required />
                    </p>
                </fieldset>
                
                <p>
                    <button type="submit">Sign In</button>
                </p>
            </form>
        </div>
    );
};