$cmd = $env:CLAUDE_TOOL_PARAM_command
if ($cmd -notmatch 'git\s+commit') { exit 0 }

$staged = git -C 'C:\Personal\KearalaPromises' diff --cached --name-only 2>$null
$bad = $staged | Where-Object {
    $_ -match '^\.env' -or
    $_ -match '^\.dev\.vars' -or
    $_ -match '^dist[\\/]' -or
    $_ -match '^\.astro[\\/]' -or
    $_ -match '^\.wrangler[\\/]' -or
    $_ -match '^\.vercel[\\/]' -or
    $_ -match '^\.netlify[\\/]' -or
    $_ -match '^node_modules[\\/]' -or
    $_ -match '^public[\\/]pagefind[\\/]' -or
    $_ -match '\.bak$' -or
    $_ -match '(^|[\\/])\.DS_Store$' -or
    $_ -match '(^|[\\/])Thumbs\.db$'
}

if ($bad) {
    [Console]::Error.WriteLine("COMMIT BLOCKED: Sensitive or build artifact files are staged:")
    [Console]::Error.WriteLine(($bad -join [System.Environment]::NewLine))
    [Console]::Error.WriteLine("Unstage these files before committing.")
    exit 2
}
exit 0
