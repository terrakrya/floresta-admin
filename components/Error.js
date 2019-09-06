export default ({ errors }) => (
  <div>
    {errors &&
      errors.message.split(':')[0] === 'Network error' &&
      'Falha na conexão, tente mais tarde.'}
    {!errors && <h3>Erro</h3>}
    <style jsx>{`
      color: red;
    `}</style>
  </div>
)
