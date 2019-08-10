import App from "../components/App"
import CATEGORIES from "../queries/categories.gql"
import Table from "../components/Table"

export default ({ classes }) => {
  return (
    <App>
      <Table
        query={CATEGORIES}
        returnUrl={"/categories"}
        editUrl='/category_edit?id='
        title='Linhas de Acao'
        noCreate
        columns={[
          { title: "ID", field: "id" },
          { title: "Nome", field: "name" },
          { title: "Criado", field: "createdAt" }
        ]}
      />
      <style jsx>{``}</style>
    </App>
  )
}
