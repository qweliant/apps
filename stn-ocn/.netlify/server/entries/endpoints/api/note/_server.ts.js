import { p as prisma } from "../../../../chunks/prisma.js";
import { j as json } from "../../../../chunks/index.js";
async function PUT(event) {
  const data = await event.request.json();
  console.log(data);
  try {
    console.log("Updating db..");
    await prisma.noteData.update({
      where: {
        id: data.id
      },
      data: {
        time: String(data.outputData.time),
        blocks: data.outputData.blocks,
        version: data.outputData.version
      }
    });
    console.log("Updated db..");
  } catch (e) {
    console.log(e);
  }
  return json({ success: true });
}
export {
  PUT
};
