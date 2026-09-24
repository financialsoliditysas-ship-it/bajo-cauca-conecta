Add-Type -AssemblyName System.Drawing

$src = "public\logo-mercau.png"
$dst = "public\og-mercau.jpg"

$img = [System.Drawing.Image]::FromFile((Resolve-Path $src))
$bmp = New-Object System.Drawing.Bitmap 1200, 630
$graphics = [System.Drawing.Graphics]::FromImage($bmp)

$graphics.SmoothingMode = "HighQuality"
$graphics.InterpolationMode = "HighQualityBicubic"
$graphics.PixelOffsetMode = "HighQuality"
$graphics.Clear([System.Drawing.Color]::FromArgb(228, 20, 16))

$ratio = [Math]::Min(1200 / $img.Width, 630 / $img.Height)
$width = [int]($img.Width * $ratio)
$height = [int]($img.Height * $ratio)
$x = [int]((1200 - $width) / 2)
$y = [int]((630 - $height) / 2)

$graphics.DrawImage($img, $x, $y, $width, $height)

$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter (
  [System.Drawing.Imaging.Encoder]::Quality,
  85L
)

$bmp.Save((Join-Path (Get-Location) $dst), $encoder, $params)

$graphics.Dispose()
$bmp.Dispose()
$img.Dispose()

Get-Item $dst | Select-Object Name, Length
