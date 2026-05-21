import studentGirlImg from "../assets/images/student_girl_1779270352412.png";
import outdoorPaintingImg from "../assets/images/outdoor_painting_1779250443852.png";
import natureExplorationImg from "../assets/images/nature_exploration_1779250482557.png";
import cozyReadingImg from "../assets/images/cozy_reading_1779250461671.png";

/**
 * Maps a structural asset path string from JSON directly to Vite's resolved asset import.
 * Falls back to returning the URL string unchanged if it is an external link (HTTP/HTTPS/data).
 */
export function resolveAssetUrl(url: string): string {
  if (!url) return url;
  if (url.includes("student_girl")) return studentGirlImg;
  if (url.includes("outdoor_painting")) return outdoorPaintingImg;
  if (url.includes("nature_exploration")) return natureExplorationImg;
  if (url.includes("cozy_reading")) return cozyReadingImg;
  
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  return url;
}
