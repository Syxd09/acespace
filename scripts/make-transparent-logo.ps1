Add-Type -AssemblyName System.Drawing

function Convert-ToTransparent {
    param(
        [string]$inputPath,
        [string]$outputPath,
        [int]$threshold = 240,
        [bool]$makeWhiteText = $false
    )

    $src = [System.Drawing.Bitmap]::FromFile($inputPath)
    $w = $src.Width
    $h = $src.Height
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($src, 0, 0, $w, $h)
    $g.Dispose()
    $src.Dispose()

    # Lock bits for high-speed pixel manipulation
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $totalBytes = [Math]::Abs($bmpData.Stride) * $h
    $bytes = New-Object byte[] $totalBytes
    [System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $bytes, 0, $totalBytes)

    for ($i = 0; $i -lt $totalBytes; $i += 4) {
        $b = $bytes[$i]
        $gVal = $bytes[$i + 1]
        $r = $bytes[$i + 2]

        # Check if near white
        if ($r -ge $threshold -and $gVal -ge $threshold -and $b -ge $threshold) {
            # 100% transparent
            $bytes[$i + 3] = 0
        } else {
            if ($makeWhiteText) {
                # If dark/black pixel, turn to white
                if ($r -lt 120 -and $gVal -lt 120 -and $b -lt 120) {
                    $bytes[$i] = 255
                    $bytes[$i + 1] = 255
                    $bytes[$i + 2] = 255
                }
            }
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bmpData.Scan0, $totalBytes)
    $bmp.UnlockBits($bmpData)

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Created transparent image: $outputPath"
}

# 1. Full logo on light backgrounds (pure transparent background, dark text)
Convert-ToTransparent -inputPath "e:\acespaces\public\logo\full logo.jpg" -outputPath "e:\acespaces\public\logo\full-logo-transparent.png" -threshold 235 -makeWhiteText $false

# 2. Full logo for dark backgrounds (pure transparent background, white text + original colored elements)
Convert-ToTransparent -inputPath "e:\acespaces\public\logo\full logo.jpg" -outputPath "e:\acespaces\public\logo\full-logo-white-transparent.png" -threshold 235 -makeWhiteText $true

# 3. Icon logo on light backgrounds (pure transparent background)
Convert-ToTransparent -inputPath "e:\acespaces\public\logo\icon logo.jpg" -outputPath "e:\acespaces\public\logo\icon-logo-transparent.png" -threshold 235 -makeWhiteText $false

# 4. Icon logo for dark backgrounds (pure transparent background, white mark)
Convert-ToTransparent -inputPath "e:\acespaces\public\logo\icon logo.jpg" -outputPath "e:\acespaces\public\logo\icon-logo-white-transparent.png" -threshold 235 -makeWhiteText $true
