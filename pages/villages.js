import App from "../components/App"
import VILLAGES from "../queries/villages.gql"
import Table from "../components/Table"
import Form from "../components/forms/contentForm"

export default ({ classes }) => {
  return (
    <App>
      <Form
        title='Texto sobre a página'
        field='villageHtml'
        style={{ paddingBottom: 80 }}
      />
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
