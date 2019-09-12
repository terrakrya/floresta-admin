export default ({ errors, message }) => (
  <div>
    {errors &&
      errors.message.split(':')[0] === 'Network error' &&
      'Falha na conexão, tente mais tarde.'}
    {message || <h3>Erro</h3>}
    <style jsx>{`
      color: red;
    `}</style>
  </div>
)
