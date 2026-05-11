$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Host "Listening on port 8080..."
while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    $filePath = "C:\Users\22aim\OneDrive\Escritorio\ordenanzas-app" + $request.Url.LocalPath.Replace("/", "\")
    if ($filePath.EndsWith("\")) { $filePath += "index.html" }
    
    if (Test-Path $filePath) {
        $buffer = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $buffer.Length
        if ($filePath.EndsWith(".css")) { $response.ContentType = "text/css" }
        elseif ($filePath.EndsWith(".js")) { $response.ContentType = "application/javascript" }
        elseif ($filePath.EndsWith(".html")) { $response.ContentType = "text/html" }
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    } else {
        $response.StatusCode = 404
    }
    $response.Close()
}
