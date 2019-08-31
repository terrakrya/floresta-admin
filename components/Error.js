export default ({ errors }) => (
  <div>
    {errors.message.split(':')[0] === 'Network error' &&
      'Falha na conexão, tente mais tarde.'}
    <style jsx>{`
      color: red;
    `}</style>
  </div>
)
