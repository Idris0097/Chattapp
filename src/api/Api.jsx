export const checkUsernameExists = async (username) => {
  try {
    const response = await fetch(
      `https://chatify-api.up.railway.app/api-docs/${username}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error checking username:", error);
    return false;
  }
};
