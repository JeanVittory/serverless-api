import jwt from "jsonwebtoken";

export const authorization = () => {
  return {
    before: async (handler) => {
      console.log("me ejecute");
      const { event } = handler;
      const authHeader =
        event.headers.authorization || event.headers.Authorization;
      if (!authHeader) {
        throw new Error("Authorization header is missing");
      }
      if (!authHeader.startsWith("Bearer")) {
        throw new Error("Invalid Authorization header format");
      }
      console.log("authHeader", authHeader);
      const token = authHeader.split(" ")[1];
      const decodedToken = jwt.decode(token, { complete: true, json: true });
      console.log("decodedTOken", decodedToken);
    },
  };
};
