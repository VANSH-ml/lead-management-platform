param([string]$FilePath, [string]$Old, [string]$New)
$c = [System.IO.File]::ReadAllText($FilePath)
$c = $c.Replace($Old, $New)
[System.IO.File]::WriteAllText($FilePath, $c)
Write-Host "Replaced in $FilePath"
