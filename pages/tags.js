import App from "../components/App"
import TAGS from "../queries/tags.gql"
import Table from "../components/Table"

export default ({ classes }) => {
  return (
    <App>
      <Table
        query={TAGS}
        returnUrl={"/tags"}
        editUrl='/tag_edit?id='
        title='Tags'
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
