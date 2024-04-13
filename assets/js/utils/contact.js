const contactDialogFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    fullWidth: true,
    rules: { required: true },
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    fullWidth: true,
    rules: { required: true },
  },
  {
    name: "subject",
    label: "Subject",
    type: "text",
    fullWidth: true,
    rules: { required: true },
  },
  {
    name: "comment",
    label: "Comment",
    type: "text",
    fullWidth: true,
    multiline: true,
    rules: { required: true },
    rows: 6,
  },
];
export const useContactDialogProps = (props) => ({
  title: "Conctact Us",
  fields: contactDialogFields,
  mutationApi: "processContactForm",
  btnText: "Send",
  ...props,
});
