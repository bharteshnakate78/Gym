import CrudAdmin from "./CrudAdmin";
export default function ManageTrainers() {
  return (
    <CrudAdmin
      title="Trainers"
      endpoint="/trainers"
      fields={[
        ["name", "Name"],
        ["specialization", "Specialization"],
        ["experience", "Experience"],
        ["certifications", "Certifications"],
        ["image", "Image URL"],
        ["description", "Description"],
      ]}
    />
  );
}
