import PropTypes from 'prop-types'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          value={username}
          onChange={handleUsernameChange}
          data-testId="username"
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          data-testId="password"
        />
      </div>
      <button type="submit">log in</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm