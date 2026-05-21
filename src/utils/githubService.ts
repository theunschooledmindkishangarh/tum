/**
 * Helper to extract YouTube video ID from various YouTube URLs
 */
export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // If it's already a clean 11-char YouTube ID, return it directly
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  // Try various regex patterns
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*&v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/
  ];
  
  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // Fallback to broader match for any 11-char sequence after key markers
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }
  
  return null;
}

export interface GithubConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

/**
 * Commits the updated site dynamic content back to the GitHub repository.
 * 
 * Flow:
 * 1. Fetches current content from GitHub to get latest data & 'sha' hash
 * 2. Appends/inserts the new item locally
 * 3. Commits back to GitHub in /src/data/siteDynamicContent.json
 */
export async function pushContentToGithub(
  config: GithubConfig,
  type: "photo" | "video" | "blog",
  newItem: any
): Promise<{ success: boolean; message: string }> {
  const { owner, repo, branch, token } = config;
  const filePath = "src/data/siteDynamicContent.json";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

  try {
    // Stage 1: Get the current file contents and its SHA key
    const getRes = await fetch(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    let currentData = { photos: [], videos: [], blogs: [] };
    let sha = "";

    if (getRes.status === 200) {
      const fileMetaData = await getRes.json();
      sha = fileMetaData.sha;
      
      // Decode base64 contents
      // Use decodeURIComponent(escape(atob(str))) for safe unicode support
      const decodedContent = decodeURIComponent(
        escape(window.atob(fileMetaData.content.replace(/\s/g, "")))
      );
      currentData = JSON.parse(decodedContent);
    } else if (getRes.status === 404) {
      // If file doesn't exist, start with empty arrays (no sha needed)
      console.warn("siteDynamicContent.json not found on GitHub repository. It will be created.");
    } else {
      const errData = await getRes.json().catch(() => ({}));
      throw new Error(errData.message || `GitHub returned status ${getRes.status} on file lookup.`);
    }

    // Merge or init arrays if missing
    if (!currentData.photos) currentData.photos = [];
    if (!currentData.videos) currentData.videos = [];
    if (!currentData.blogs) currentData.blogs = [];

    // Stage 2: Append the item to correct section
    if (type === "photo") {
      currentData.photos.push({
        url: newItem.url,
        title: newItem.title,
        desc: newItem.desc || "Added via Control Panel",
        category: newItem.category || "Activity"
      } as never);
    } else if (type === "video") {
      const vId = extractYoutubeId(newItem.url) || newItem.url;
      currentData.videos.push({
        id: `v_${Date.now()}`,
        youtubeId: vId,
        thumbnailUrl: `https://img.youtube.com/vi/${vId}/hqdefault.jpg`,
        title: newItem.title,
        description: newItem.description || "Video diary added via Control Panel",
        duration: newItem.duration || "5:00",
        category: newItem.category || "Sovereign Mind",
        views: "Just Added"
      } as never);
    } else if (type === "blog") {
      currentData.blogs.unshift({
        id: `blog_${Date.now()}`,
        title: newItem.title,
        category: newItem.category || "Philosophy",
        snippet: newItem.content.substring(0, 150) + "...",
        readTime: `${Math.ceil(newItem.content.split(/\s+/).length / 200)} min read`,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        }),
        author: newItem.author || "Admin Guide",
        image: newItem.image,
        content: newItem.content
      } as never);
    }

    // Stage 3: Base64 encode contents with safe unicode characters
    const updatedRawJSON = JSON.stringify(currentData, null, 2);
    const encodedContent = window.btoa(
      unescape(encodeURIComponent(updatedRawJSON))
    );

    // Stage 4: Commit the updated JSON file back to GitHub
    const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Add new ${type}: ${newItem.title || "unnamed"} via Control Panel`,
        content: encodedContent,
        sha: sha || undefined,
        branch,
      }),
    });

    if (putRes.status === 200 || putRes.status === 201) {
      // Return updated state also to update UI state instantly!
      return {
        success: true,
        message: `Your new ${type} was posted successfully! GitHub is now rebuilding the site (takes 1-2 minutes).`,
      };
    } else {
      const errData = await putRes.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to commit to GitHub (Status ${putRes.status}).`);
    }
  } catch (error: any) {
    console.error("Github request failed: ", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred while posting to GitHub.",
    };
  }
}
