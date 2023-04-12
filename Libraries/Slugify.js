exports.sulgify = (name) => {
  return name.includes(" ")
    ? name
        .toLowerCase()
        .split(" ")
        .join("-")
    : name.toLowerCase();
};
