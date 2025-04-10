import { db } from "~/server/db";
import userRepository from "./user.repository";

export const repository = {
  userRepository: new userRepository(db),
};
