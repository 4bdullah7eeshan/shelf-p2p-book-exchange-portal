export default function SignUp() {
    return (
        <div>
            <h1>Sign Up</h1>

            <p>Required fields are followed by <strong><span aria-label="required">*</span></strong>.</p>
            
            <form action="" method="post">
                <fieldset>
                    <p>
                        <label htmlFor="user_full_name">Full Name: <span aria-label="required">*</span></label>
                        <input type="text" id="user_full_name" name="user_full_name" placeholder="John Doe" required />
                    </p>

                    <p>
                        <label htmlFor="user_phone_number">Phone Number (+91):</label>
                        <input type="tel" id="user_phone_number" name="user_phone_number" minLength="10" maxLength="10" placeholder="9999999999" />
                    </p>

                    <p>
                        <label htmlFor="user_email">Email: <span aria-label="required">*</span></label>
                        <input type="email" id="user_email" name="user_email" placeholder="johndoe@example.com" required />
                    </p>

                    <p>
                        <label htmlFor="user_password">Password: <span aria-label="required">*</span></label>
                        <input type="password" id="user_password" name="user_password" minLength="6" required />
                    </p>

                    <p>
                        <label htmlFor="user_role">Select a role: <span aria-label="required">*</span></label>
                        <select name="user_role" required>
                            <option value="seeker">Seeker</option>
                            <option value="owner">Owner</option>
                        </select>
                    </p>
                </fieldset>
                
                <p>
                    <button type="submit">Sign Up</button>
                </p>
            </form>
        </div>
    );
};