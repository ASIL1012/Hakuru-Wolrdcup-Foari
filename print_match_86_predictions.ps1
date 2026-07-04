$headers = @{ 
    'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dXdnZWN3YnR2aW52ZGpxdnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjA0NzcsImV4cCI6MjA5NjgzNjQ3N30.SyY2peC5zE2ZzYAHahOUoKkVhDWkOkUEI5fV2M084OY'; 
    'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dXdnZWN3YnR2aW52ZGpxdnJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNjA0NzcsImV4cCI6MjA5NjgzNjQ3N30.SyY2peC5zE2ZzYAHahOUoKkVhDWkOkUEI5fV2M084OY';
    'Content-Type' = 'application/json'
}

# Fetch predictions for Match 86
$predictions = Invoke-RestMethod -Uri 'https://oxuwgecwbtvinvdjqvrs.supabase.co/rest/v1/predictions?match_id=eq.86' -Headers $headers

# Actual outcome details
# Match 86: Australia vs Egypt (1-1, Egypt win penalties)
# Australia = Home, Egypt = Away
$actualHome = 1
$actualAway = 1
$actualWinner = 'away' # Egypt won penalties

$results = @()

foreach ($p in $predictions) {
    if ($p.username.ToLower() -eq 'admin') { continue }

    $homeRaw = [int]$p.home_score
    $awayRaw = [int]$p.away_score
    
    $homeS = $homeRaw
    $awayS = $awayRaw
    $predWinner = $null
    
    if ($homeRaw -ge 10000) {
        $homeS = $homeRaw - 10000
        $predWinner = 'home'
    } elseif ($awayRaw -ge 10000) {
        $awayS = $awayRaw - 10000
        $predWinner = 'away'
    }

    $pIsDraw = ($homeS -eq $awayS)
    
    # Calculate points under strict prompt rules:
    # 1. if any player predicted draw give them one point.
    # 2. if anyone predicted the exact score they drew and egypt won penalties give them 3 points.
    # 3. if any player predicted that egypt won (eg egypt 2 - 1 australia) give them 1 point.
    # 4. if no one predicted the winning team and no one predicted drew no points are awarded.
    $promptPts = 0
    $promptReason = "No points"

    if ($pIsDraw) {
        $exactScore = ($homeS -eq 1 -and $awayS -eq 1)
        $correctWinner = ($predWinner -eq 'away')
        if ($exactScore -and $correctWinner) {
            $promptPts = 3
            $promptReason = "Exact score (1-1) & Egypt pens (3 pts)"
        } else {
            $promptPts = 1
            $promptReason = "Draw predicted (1 pt)"
        }
    } else {
        # Predicted winner is whoever has more goals
        $pWinner = if ($homeS -gt $awayS) { 'home' } else { 'away' }
        if ($pWinner -eq 'away') {
            $promptPts = 1
            $promptReason = "Egypt win predicted (1 pt)"
        } else {
            $promptPts = 0
            $promptReason = "Incorrect prediction (0 pts)"
        }
    }

    # Calculate points under standard logic:
    $stdPts = 0
    if ($pIsDraw) {
        $exactScore = ($homeS -eq 1 -and $awayS -eq 1)
        $correctWinner = ($predWinner -eq 'away')
        if ($exactScore -and $correctWinner) { $stdPts = 3 }
        elseif ($exactScore -and -not $correctWinner) { $stdPts = 2 }
        elseif (-not $exactScore -and $correctWinner) { $stdPts = 2 }
        else { $stdPts = 1 }
    } else {
        # If they predicted normal win, but actual went to draw:
        $pWinner = if ($homeS -gt $awayS) { 'home' } else { 'away' }
        if ($pWinner -eq 'away') { $stdPts = 1 }
        else { $stdPts = 0 }
    }

    $winnerDisplay = "-"
    if ($pIsDraw) {
        if ($predWinner -eq 'home') { $winnerDisplay = "Australia" }
        elseif ($predWinner -eq 'away') { $winnerDisplay = "Egypt" }
    }

    $results += [PSCustomObject]@{
        Username           = $p.username
        Prediction         = "$homeS - $awayS"
        ShootoutWinner     = $winnerDisplay
        PromptPoints       = $promptPts
        PromptExplanation  = $promptReason
        StandardPoints     = $stdPts
    }
}

Write-Host "Match 86 predictions before update:"
Write-Host "-------------------------------------------------------------------------------------------------------------------"
$results | Sort-Object PromptPoints, Username -Descending | Format-Table -AutoSize
