import { redirect } from "next/navigation";

// The garden was merged into the home page. Keep this route as a redirect
// so old links (and the /garden bookmark) still land on the garden section.
export default function GardenPage() {
  redirect("/#garden");
}
