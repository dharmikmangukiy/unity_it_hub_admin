export  function GenerateStrongPassword(length) {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numericChars = "0123456789";
  const specialChars = "!@#$%^&*()_+=";

  const allChars =
    lowercaseChars + uppercaseChars + numericChars + specialChars;
  let password = "";

  password += lowercaseChars.charAt(
    Math.floor(Math.random() * lowercaseChars.length)
  );
  password += uppercaseChars.charAt(
    Math.floor(Math.random() * uppercaseChars.length)
  );
  password += numericChars.charAt(
    Math.floor(Math.random() * numericChars.length)
  );
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  for (let i = 4; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars.charAt(randomIndex);
  }

  password = password
    .split("")
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join("");

  return password;
}

   

