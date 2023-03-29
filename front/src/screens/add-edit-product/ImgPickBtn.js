export default function ImgPickBtn({ value }) {
  return (
    <input
      type="file"
      className="filePicker"
      id="imgPickBtn" // Connectar label till knapp
      name="imgPickBtn"
      value={value}
    />
  );
}
