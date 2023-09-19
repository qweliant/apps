import { p as prisma } from "../../chunks/prisma.js";
const load = async () => {
  const response = await prisma.noteData.findFirst({});
  console.log(response);
  return {
    editorData: {
      time: Number(response?.time),
      blocks: response?.blocks,
      version: response?.version
    },
    id: response?.id
  };
};
export {
  load
};
