import CrudAdmin from "./CrudAdmin";
export default function ManageMemberships() {
  return (
    <CrudAdmin
      title="Membership Plans"
      endpoint="/memberships"
      fields={[
        ["name", "Name"],
        ["price", "Price"],
        ["durationMonths", "Duration Months"],
        ["benefits", "Benefits"],
        ["description", "Description"],
      ]}
    />
  );
}
