import App from "../components/App"
import VILLAGES from "../queries/villages.gql"
import Table from "../components/Table"

export default ({ classes }) => {
  return (
    <App>
      <Table
        query={VILLAGES}
        returnUrl={"/villages"}
        editUrl='/village_edit?id='
        title='Aldeias'
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
