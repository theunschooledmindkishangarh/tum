export interface DriveGalleryItem {
  id: string;
  name: string;
  url: string;
  category: "Activity" | "Celebrations";
  desc?: string;
}

export const PUBLIC_FOLDER_ID = "1WZpGfKgxZLpnK9IDywayKRWqgXiXwqJo";

export const formatTitle = (filename: string): string => {
  const base = filename.substring(0, filename.lastIndexOf(".")) || filename;
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const fetchDriveImages = async (): Promise<DriveGalleryItem[]> => {
  const folderUrl = `https://drive.google.com/drive/folders/${PUBLIC_FOLDER_ID}`;
  const configs = [
    {
      url: `https://corsproxy.io/?${encodeURIComponent(folderUrl)}`,
      type: "raw" as const
    },
    {
      url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(folderUrl)}`,
      type: "raw" as const
    },
    {
      url: `https://api.allorigins.win/get?url=${encodeURIComponent(folderUrl)}`,
      type: "json" as const
    },
    {
      url: folderUrl,
      type: "raw" as const
    }
  ];

  let html = "";
  
  // High-performance race logic across all proxies in parallel:
  const promises = configs.map(async (cfg) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout per attempt
      
      const res = await fetch(cfg.url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Status " + res.status);
      
      let text = "";
      if (cfg.type === "json") {
        const json = await res.json();
        text = typeof json === "string" ? json : (json.contents || json.data || "");
      } else {
        text = await res.text();
      }
      
      if (text && (text.includes("_DRIVE_ivd") || text.includes("lh3.googleusercontent.com") || text.includes(PUBLIC_FOLDER_ID))) {
        return text;
      }
      throw new Error("No Drive markers found");
    } catch (err: any) {
      throw new Error(err?.message || "Error");
    }
  });

  try {
    // Custom robust Promise.any implementation for maximum environment compatibility
    html = await new Promise<string>((resolve, reject) => {
      let resolved = false;
      let completedCount = 0;
      const errors: string[] = [];
      
      promises.forEach((p, idx) => {
        p.then((text) => {
          if (!resolved) {
            resolved = true;
            resolve(text);
          }
        }).catch((err) => {
          errors.push(`Proxy ${idx} failed: ${err.message || err}`);
          completedCount++;
          if (completedCount === promises.length && !resolved) {
            reject(new Error("All sources failed. " + errors.join("; ")));
          }
        });
      });
    });
  } catch (err) {
    console.error("All sync sources failed:", err);
  }

  const fetchedItems: DriveGalleryItem[] = [];
  const seenIds = new Set<string>();

  if (html) {
    // Parse using window['_DRIVE_ivd'] structure
    const driveIvdMatch = html.match(/window\['_DRIVE_ivd'\]\s*=\s*'([^']+)'/);
    if (driveIvdMatch) {
      try {
        const serialized = driveIvdMatch[1];
        let unescaped = serialized.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => 
          String.fromCharCode(parseInt(hex, 16))
        );
        unescaped = unescaped.replace(/\\([\\"/bfnrt])/g, "$1");
        unescaped = unescaped.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => 
          String.fromCharCode(parseInt(code, 16))
        );
        unescaped = unescaped.replace(/\\([\[\]\(\)\-\w])/g, "$1");

        const entryRegex = /"([a-zA-Z0-9_-]{33})",\["([a-zA-Z0-9_-]{33})"\],"([^"]+)"/g;
        let entryM;
        while ((entryM = entryRegex.exec(unescaped)) !== null) {
          const id = entryM[1];
          const name = entryM[3];
          const isImage = /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(name);
          if (id && name && isImage && !seenIds.has(id)) {
            seenIds.add(id);
            fetchedItems.push({
              id,
              name,
              url: `https://lh3.googleusercontent.com/d/${id}`,
              category: "Activity",
              desc: `Synced portrait titled "${formatTitle(name)}", live from Google Drive shared folder.`
            });
          }
        }
      } catch (e) {
        console.error("Error decoding serialized Drive content structure:", e);
      }
    }

    // Backup heuristic matching raw Google Drive strings
    if (fetchedItems.length === 0) {
      const idRegex = /1[a-zA-Z0-9_-]{32}/g;
      const matches = Array.from(html.matchAll(idRegex)).map(m => m[0]);
      const uniqueIds = Array.from(new Set(matches)).filter(id => id !== PUBLIC_FOLDER_ID);
      const nameRx = /[a-zA-Z0-9_\-\s\(\)]+\.(jpe?g|jpeg|png|webp|gif|svg)/gi;

      for (const id of uniqueIds) {
        if (seenIds.has(id)) continue;
        const idx = html.indexOf(id);
        if (idx !== -1) {
          const section = html.slice(idx, idx + 1000);
          const nameMatches = Array.from(section.matchAll(nameRx));
          if (nameMatches.length > 0) {
            const name = nameMatches[0][0];
            const isUIAsset = name.includes("logo_drive") || name.includes("broken_image") || name.includes("al-icon");
            if (!isUIAsset) {
              seenIds.add(id);
              fetchedItems.push({
                id,
                name,
                url: `https://lh3.googleusercontent.com/d/${id}`,
                category: "Activity",
                desc: `Synced portrait titled "${formatTitle(name)}", live from Google Drive shared folder.`
              });
            }
          }
        }
      }
    }
  }

  return fetchedItems;
};
