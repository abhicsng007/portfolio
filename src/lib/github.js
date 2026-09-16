function headers(token) {
  const h = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
  if (token) h.Authorization = `Bearer ${token}`
  return h
}

async function readError(res) {
  if (res.status === 403 || res.status === 429) {
    return "GitHub rate limit reached. Add a personal access token in the Console (read-only is enough)."
  }
  if (res.status === 404) return "No GitHub user by that name."
  if (res.status === 401) return "That token was rejected. Check it and try again."
  return `GitHub responded with ${res.status}.`
}

export async function fetchGithubUser(username, token) {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: headers(token),
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json()
}

export async function fetchGithubRepos(username, token) {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&affiliation=owner`,
    { headers: headers(token) },
  )
  if (!res.ok) throw new Error(await readError(res))
  return res.json()
}

export function repoToProject(repo) {
  const live = (repo.homepage || "").trim()
  return {
    id: `gh-${repo.id}`,
    source: "github",
    name: repo.name.replace(/[-_]/g, " "),
    repoName: repo.name,
    client: repo.full_name,
    year: new Date(repo.updated_at).getFullYear().toString(),
    description: repo.description || "A public repository imported from GitHub.",
    tech: [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 8),
    github: repo.html_url,
    live: live && !live.includes("github.com") ? live : live,
    youtube: "",
    devpost: "",
    image: `https://opengraph.githubassets.com/1/${repo.full_name}`,
    featured: false,
    confidential: false,
    stars: repo.stargazers_count || 0,
    fork: Boolean(repo.fork),
    metrics: [
      { value: String(repo.stargazers_count || 0), label: "stars" },
      { value: repo.language || "—", label: "language" },
    ],
  }
}
