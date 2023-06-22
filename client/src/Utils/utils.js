const waitFor = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const isValid = (string) => {
    if (
      string !== "" &&
      string !== null &&
      string !== undefined &&
      string !== "none"
    ) {
      return true;
    } else return false;
  }

export { waitFor, isValid }