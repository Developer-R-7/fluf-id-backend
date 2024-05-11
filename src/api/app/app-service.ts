import { uuid } from "uuidv4";
import { prismaClient } from "../../config";
import { generateAppId } from "../../utils/helper";

export const handleAppRegister = async (data: {
  name: string;
  description: string;
}) => {
  await prismaClient.app.create({
    data: {
      id: generateAppId(),
      name: data.name,
      description: data.description,
      apiKey: uuid(),
    },
  });

  return { success: true, message: "App registered successfully" };
};
