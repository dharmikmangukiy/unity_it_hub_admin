const NewDate = (prop) => {
  const today = new Date(prop.newDate);
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return <>{dd + "/" + mm + "/" + yyyy}</>;
};
export default NewDate;
