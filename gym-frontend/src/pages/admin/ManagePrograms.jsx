import CrudAdmin from "./CrudAdmin";
export default function ManagePrograms() {
  return (
    <CrudAdmin
      title="Programs"
      endpoint="/programs"
      fields={[
        ["name", "Name"],
        ["description", "Description"],
        ["duration", "Duration"],
        ["difficulty", "Difficulty"],
        ["image", "Image URL"],
      ]}
    />
  );
}
