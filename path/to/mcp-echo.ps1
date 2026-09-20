$ErrorActionPreference = "Stop"

function Write-JsonResponse {
    param(
        [Parameter(Mandatory = $true)]
        [hashtable]$Response
    )

    $Response | ConvertTo-Json -Compress -Depth 10
}

while ($null -ne ($line = [Console]::In.ReadLine())) {
    if ([string]::IsNullOrWhiteSpace($line)) {
        continue
    }

    try {
        $request = $line | ConvertFrom-Json
        $method = [string]$request.method
        $id = $request.id

        if ($method -eq "notifications/initialized") {
            continue
        }

        if ($method -eq "initialize") {
            $result = @{
                protocolVersion = "2024-11-05"
                capabilities = @{
                    tools = @{}
                }
                serverInfo = @{
                    name = "echo-windows"
                    version = "1.0.0"
                }
            }
            Write-JsonResponse @{ jsonrpc = "2.0"; id = $id; result = $result }
            continue
        }

        if ($method -eq "tools/list") {
            $tool = @{
                name = "echo"
                description = "Echo a message back to the caller."
                inputSchema = @{
                    type = "object"
                    properties = @{
                        message = @{
                            type = "string"
                            description = "Message to echo."
                        }
                    }
                    required = @("message")
                }
            }
            Write-JsonResponse @{ jsonrpc = "2.0"; id = $id; result = @{ tools = @($tool) } }
            continue
        }

        if ($method -eq "tools/call") {
            $toolName = [string]$request.params.name
            if ($toolName -ne "echo") {
                Write-JsonResponse @{ jsonrpc = "2.0"; id = $id; error = @{ code = -32601; message = "Unknown tool: $toolName" } }
                continue
            }

            $message = [string]$request.params.arguments.message
            Write-JsonResponse @{ jsonrpc = "2.0"; id = $id; result = @{ content = @(@{ type = "text"; text = $message }); isError = $false } }
            continue
        }

        Write-JsonResponse @{ jsonrpc = "2.0"; id = $id; error = @{ code = -32601; message = "Unknown method: $method" } }
    }
    catch {
        Write-JsonResponse @{ jsonrpc = "2.0"; id = $null; error = @{ code = -32603; message = $_.Exception.Message } }
    }
}
